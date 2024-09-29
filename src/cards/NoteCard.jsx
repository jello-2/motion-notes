import { autoGrow } from '../utils.js';
import { useRef, useEffect } from "react";
import updateWidget from '../room/UpdateWidget.jsx';
import { useParams } from 'react-router-dom';
import ask from '../Gemini.js';

const NoteCard = ({ note, prompt }) => {
    const { roomId } = useParams();

    const textAreaRef = useRef(null);
    const keyUpTimer = useRef(null);

    const colors = note.colors;
    const body = note.body;

    useEffect(() => {
        autoGrow(textAreaRef);
    }, []);

    const handleKeyUp = async () => {
        if (keyUpTimer.current) {
            clearTimeout(keyUpTimer.current);
        }
        keyUpTimer.current = setTimeout(() => {
            saveData("body", textAreaRef.current.value);
        }, 1000);
    };

    const saveData = async (key, value) => {
        const payload = { [key]: JSON.stringify(value) };
        try {
            await updateWidget(roomId, note.id, payload);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSummarize = async () => {
        console.log(`Summarize and format this text for me: ${textAreaRef.current.value}`);
        const formattedText = await ask(`Answer this prompt for me professional and concisely, briefly like a master in whatever field i may have a question in, no whitespace at the end, dont include any text formatting. Start your reply with: Here's what I think: ${textAreaRef.current.value}`);
        textAreaRef.current.value = formattedText;
        saveData("body", formattedText);
        autoGrow(textAreaRef); // Add this line to trigger autogrow after updating content
    };

    return (
        <div className="card-body flex flex-col items-center">
            <textarea
                onKeyUp={handleKeyUp}
                ref={textAreaRef}
                style={{ color: colors.colorText, width: '100%' }}
                defaultValue={body}
                onInput={() => autoGrow(textAreaRef)}
                className="w-full mb-4 p-2 border rounded-md"
            />
            <button 
                onClick={handleSummarize} 
                className="motion-ask-button flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition-colors duration-300"
            >
                <span className="mr-2">Motion Ask</span>
                <img src='/motion.png' alt="Motion icon" className='w-5 h-5' />
            </button>
        </div>
    );
};

export default NoteCard;