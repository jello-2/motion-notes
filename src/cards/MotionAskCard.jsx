import { useState, useRef, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Loader } from "react-feather";
import ReactMarkdown from 'react-markdown';
import updateWidget from '../room/UpdateWidget.jsx';
import ask from '../Gemini.js';

const gridsnap = (value, gridSize) => Math.ceil(value / gridSize) * gridSize;

const autoGrow = (element) => {
    if (element && element.style) {
        element.style.height = 'auto';
        element.style.height = gridsnap(element.scrollHeight, 20) + 'px';
    }
};

const MotionAskCard = ({ note, prompt }) => {
    const { roomId } = useParams();
    const [isLoading, setIsLoading] = useState(false);
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

    const saveData = async (key, value) => {
        const payload = { [key]: JSON.stringify(value) };
        try {
            await updateWidget(roomId, note.id, payload, true);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSummarize = async () => {
        setIsLoading(true);
        try {
            const response = await ask(content);
            setContent(response);
            saveData("body", response);
        } catch (error) {
            console.error("Error in summarization:", error);
        } finally {
            setIsLoading(false);
        }
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
                    style={{ minHeight: '100px', overflow: 'hidden' }}
                >
                    <ReactMarkdown>
                        {content}
                    </ReactMarkdown>
                </div>
            )}


            <div className="flex justify-center w-full mt-4">
                <button 
                    onClick={handleSummarize} 
                    disabled={isLoading}
                    className={`flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md shadow-md transition-colors duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                >
                    {isLoading ? (
                        <>
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <span className="mr-2">Motion Ask</span>
                            <img src='/motion.png' alt="Motion icon" className='w-5 h-5' />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default MotionAskCard;