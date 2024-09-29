import { useEffect, useRef, useState } from "react";
import {setNewOffset, setZIndex} from '../utils.js'

const NoteCard = ({ note }) => {
    const [position, setPosition] = useState(JSON.parse(note.position));
    const colors = JSON.parse(note.colors);
    const body = JSON.parse(note.body);
    const textAreaRef = useRef(null);

    let mouseStartPos = { x: 0, y: 0 };
 
    const cardRef = useRef(null);


    useEffect(() => {
        autoGrow(textAreaRef);
    }, []);
     
    function autoGrow(textAreaRef) {
        const { current } = textAreaRef;
        current.style.height = "auto"; // Reset the height
        current.style.height = current.scrollHeight + "px"; // Set the new height
    }

    const mouseDown = (e) => {
        setZIndex(cardRef.current);
        mouseStartPos.x = e.clientX;
        mouseStartPos.y = e.clientY;
     
        document.addEventListener("mousemove", mouseMove);
        document.addEventListener("mouseup", mouseUp);
    };

    const mouseUp = () => {
        document.removeEventListener("mousemove", mouseMove);
        document.removeEventListener("mouseup", mouseUp);
    };



    const mouseMove = (e) => {
        let mouseMoveDir = {
            x: mouseStartPos.x - e.clientX,
            y: mouseStartPos.y - e.clientY,
        };
     
        mouseStartPos.x = e.clientX;
        mouseStartPos.y = e.clientY;
     
        const newPosition = setNewOffset(cardRef.current, mouseMoveDir);
        setPosition(newPosition);
     
    };


    return (
        <div
        className="card"
        style={{
            backgroundColor: colors.colorBody,
            left: `${position.x}px`,
            top: `${position.y}px`,
        }}
    >
        <div
        className="card-header"
        style={{ backgroundColor: colors.colorHeader }}
        onMouseDown = { mouseDown }
    ></div>

        
             <div className="card-body">
             <textarea
            onFocus={() => {
                setZIndex(cardRef.current);
}}

    ref={textAreaRef}
            style={{ color: colors.colorText }}
            defaultValue={body}
            onInput={() => {
                autoGrow(textAreaRef);
           }}

        ></textarea>
        </div>
        </div>
    );
};

export default NoteCard