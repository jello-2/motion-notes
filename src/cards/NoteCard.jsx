import { useState, useRef, useEffect } from "react";
import { useParams } from 'react-router-dom';
import updateWidget from '../room/UpdateWidget.jsx';

const gridsnap = (value, gridSize) => Math.ceil(value / gridSize) * gridSize;

const autoGrow = (element) => {
    if (element && element.style) {
        element.style.height = 'auto';
        element.style.height = gridsnap(element.scrollHeight, 20) + 'px';
    }
};

const NoteCard = ({ note }) => {
    const { roomId } = useParams();
    const [content, setContent] = useState(note.body || '');
    const [isEditing, setIsEditing] = useState(false);

    const editorRef = useRef(null);
    const formattedViewRef = useRef(null);
    const keyUpTimer = useRef(null);

    const colors = note.colors;

    useEffect(() => {
        if (isEditing && editorRef.current) {
            autoGrow(editorRef.current);
        } else if (!isEditing && formattedViewRef.current) {
            autoGrow(formattedViewRef.current);
        }
    }, [content, isEditing]);

    const handleChange = (e) => {
        setContent(e.target.value);
        if (keyUpTimer.current) {
            clearTimeout(keyUpTimer.current);
        }
        keyUpTimer.current = setTimeout(() => {
            saveData("body", e.target.value);
        }, 1000);
    };

    const startEditing = () => {
        setIsEditing(true);
        setTimeout(() => {
            if (editorRef.current) {
                editorRef.current.focus();
                editorRef.current.setSelectionRange(editorRef.current.value.length, editorRef.current.value.length);
            }
        }, 0);
    };

    const stopEditing = () => {
        setIsEditing(false);
    };

    const saveData = async (key, value) => {
        const payload = { [key]: JSON.stringify(value) };
        try {
            await updateWidget(roomId, note.id, payload);
        } catch (error) {
            console.error(error);
        }
    };

    // Function to preserve exact formatting, including newlines and spaces
    const formatContent = (text) => {
        return text.split('\n').map((line, index) => (
            <span key={index}>
                {line}
                {index < text.split('\n').length - 1 && <br />}
            </span>
        ));
    };

    return (
        <div className="card-body flex flex-col items-center p-4 bg-white rounded-lg shadow-md">
            {isEditing ? (
                <textarea
                    ref={editorRef}
                    value={content}
                    onChange={handleChange}
                    onBlur={stopEditing}
                    style={{ color: colors.colorText, width: '100%', minHeight: '100px', overflow: 'hidden' }}
                    className="w-full p-2 rounded-md"
                />
            ) : (
                <div 
                    ref={formattedViewRef}
                    className="w-full p-2 rounded-md cursor-text"
                    onClick={startEditing}
                    style={{ 
                        minHeight: '100px', 
                        overflow: 'hidden', 
                        whiteSpace: 'pre-wrap', 
                        wordWrap: 'break-word',
                    }}
                >
                    {formatContent(content)}
                </div>
            )}
        </div>
    );
};

export default NoteCard;

