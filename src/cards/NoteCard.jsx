import { useState, useRef, useEffect } from "react";
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import updateWidget from '../room/UpdateWidget.jsx';

const gridsnap = (value, gridSize) => Math.ceil(value / gridSize) * gridSize;

const autoGrow = (element) => {
    if (element && element.style) {
        element.style.height = 'auto';
        element.style.height = gridsnap(element.scrollHeight, 20) + 'px';
    }
};

// Custom component to preserve all newlines, including empty ones
const PreserveWhitespace = ({ children }) => {
    return children.split('\n').map((line, index, array) => (
        <span key={index}>
            {line}
            {index < array.length - 1 && <br />}
        </span>
    ));
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

    // Custom renderer for ReactMarkdown
    const renderers = {
        paragraph: ({ children }) => <PreserveWhitespace>{children}</PreserveWhitespace>,
        // This ensures that single newlines within a paragraph are preserved
        softbreak: () => <br />,
        // This handles empty newlines between paragraphs
        break: () => <br />,
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
                    style={{ minHeight: '100px', overflow: 'hidden', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                >
                    <ReactMarkdown components={renderers}>
                        {content}
                    </ReactMarkdown>
                </div>
            )}
        </div>
    );
};

export default NoteCard;
