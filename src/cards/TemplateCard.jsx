import React, { useRef, useState } from "react";
import { Sliders, Trash2 } from 'react-feather';
import { useParams } from 'react-router-dom';
import updateWidget from '../room/UpdateWidget.jsx';
import deleteNote from '../room/DeleteWidget.jsx';
import { setNewOffset, setZIndex, gridsnap } from '../utils.js';

const colorPresets = [
    // Pastel Colors
    { name: 'Soft Peach', header: '#FFDAB9', body: '#FFF0E6', text: '#8B4513' },
    { name: 'Mint Dream', header: '#c9e7d2', body: '#F0FFF0', text: '#006400' },
    { name: 'Lavender Mist', header: '#E6E6FA', body: '#F8F8FF', text: '#4B0082' },
    { name: 'Lemon Chiffon', header: '#f9ebbe', body: '#FAFAD2', text: '#8B8B00' },
    { name: 'Baby Blue', header: '#ADD8E6', body: '#F0F8FF', text: '#00008B' },
    { name: 'Blush Pink', header: '#FFB6C1', body: '#FFF0F5', text: '#8B008B' },

// Earthy/Neutral Colors
    { name: 'Nature', header: '#8b9a71', body: '#ced2ba', text: '#4a6f28' },
    { name: 'Cloudy', header: '#A2A2A2', body: '#dcdcdc', text: '#000000' },
    { name: 'Slate Gray', header: '#6D7F9A', body: '#B7C9D8', text: '#2F4F66' },
    { name: 'Soft Lavender', header: '#8B7FB0', body: '#D3C9E7', text: '#4E3D66' },

// Bold Colors
    { name: 'Mustard Yellow', header: '#BFAF3A', body: '#E5D66D', text: '#7A6B00' },
    { name: 'Retro Aqua', header: '#009B77', body: '#66C8B8', text: '#006B4E' },
    { name: 'Coral Red', header: '#D7534E', body: '#F2A1A0', text: '#9B3B3B' },
    { name: 'Olive Green', header: '#5B6E41', body: '#A8B84D', text: '#3B4E2C' },
    { name: 'Peach', header: '#FF6F61', body: '#FFB7A0', text: '#C54E43' },
    { name: 'Slate', header: '#6A6A6A', body: '#C7C7C7', text: '#3C3C3C' },

];

const Card = ({ widget, BodyComponent, onDelete, min_width }) => {
    const [width, setWidth] = useState(widget.width);
    const [position, setPosition] = useState(widget.position);
    const [colors, setColors] = useState(widget.colors);
    const [showColorPicker, setShowColorPicker] = useState(false);

    const { roomId } = useParams();

    const cardRef = useRef(null);
    const isResizing = useRef(false);

    let dragStartPosX = 0;
    let mouseStartPos = { x: 0, y: 0 };

    const handleDelete = async () => {
        onDelete(widget.id);
        await deleteNote(roomId, widget.id);
    };

    const toggleColorPicker = () => {
        setShowColorPicker(!showColorPicker);
    };

    const handleColorChange = (preset) => {
        setColors(preset);
        saveData("colors", preset);
        setShowColorPicker(false);
    };

    const mouseDown = (e) =>{
        setZIndex(cardRef.current);
        
        mouseStartPos.x = e.clientX
        mouseStartPos.y = e.clientY

        document.addEventListener("mousemove", mouseMove)
        document.addEventListener("mouseup", mouseUp)
    }

    const mouseMove = (e)=>{
        let mouseMoveDir = {
            x: mouseStartPos.x - e.clientX,
            y: mouseStartPos.y - e.clientY
        };

        mouseStartPos.x = gridsnap(e.clientX,20)
        mouseStartPos.y = gridsnap(e.clientY,20)


        let newPosition = setNewOffset(cardRef.current, mouseMoveDir);

        newPosition.x = gridsnap(newPosition.x,20)
        newPosition.y = gridsnap(newPosition.y,20)
        setPosition(newPosition);
        
    };

    const mouseUp = () => {
        document.removeEventListener("mousemove",mouseMove);
        document.removeEventListener("mousedown", mouseDown);

        const newPosition = setNewOffset(cardRef.current); //{x,y}
        saveData("position", newPosition);  
    }
    
    //<----- for resizing window ---->

    const resizeMouseDown = (e) =>{
        e.preventDefault();
        isResizing.current = true;
        dragStartPosX = e.clientX
    };

    const resizeMouseMove = (e) => {
        if (!isResizing.current) return;

        const cardLeft = cardRef.current.getBoundingClientRect().left;
        let newWidth = e.clientX - cardLeft +25; // should be same size as gridsnap

        newWidth = gridsnap(newWidth,20)

        newWidth = Math.min(Math.max(newWidth,min_width),600) - 5
        setWidth(Math.min(Math.max(newWidth,min_width),600) - 5)

        if (Math.abs(newWidth-width) > 10){
            saveData("width", newWidth);
        }
    };

    const resizeMouseUp = () => {
        isResizing.current = false;
    };

    const saveData = async (key, value) => {
        const payload = { [key]: JSON.stringify(value) };
        try {
            await updateWidget(roomId, widget.id, payload);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div ref={cardRef}
            onMouseMove={resizeMouseMove}
            onMouseUp={resizeMouseUp}
            onMouseLeave={resizeMouseUp}
            className="card relative" 
            style={{
                backgroundColor: colors.body, 
                color: colors.text,
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: `${width}px`
            }}
        >
            <div
                onMouseDown={mouseDown}
                className="card-header" 
                style={{ backgroundColor: colors.header }}
            >
                <div className='flex flex-row'>
                    <Sliders size={16} color={colors.text} className='m-1 cursor-pointer' onClick={toggleColorPicker} />
                    <Trash2 size={16} color={colors.text} className='m-1 cursor-pointer' onClick={handleDelete} />
                </div>
            </div>
            
            {showColorPicker && (
                <div className="absolute top-full left-0 mt-2 p-2 bg-white border rounded shadow-lg z-10">
                    <div className="grid grid-cols-2 gap-2">
                        {colorPresets.map((preset, index) => (
                            <button
                                key={index}
                                onClick={() => handleColorChange(preset)}
                                className="flex flex-col items-center p-2 rounded transition-transform hover:scale-105"
                                style={{ backgroundColor: preset.body, color: preset.text }}
                            >
                                <div className="w-full h-6 mb-1 rounded" style={{ backgroundColor: preset.header }}></div>
                                <span className="text-xs">{preset.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
            
            <BodyComponent />

            <div className="resize-handle top-8" onMouseDown={resizeMouseDown}/>
        </div>
    );
};

export default Card;