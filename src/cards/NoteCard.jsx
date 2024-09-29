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
        const formattedText = await ask(`Summarize and format this text for me: ${textAreaRef.current.value}`);
        textAreaRef.current.value = formattedText; // Update the text area with the summarized text
        saveData("body", formattedText); // Save the formatted text to the backend
    };

    return (
        <div className="card-body">
            <textarea
                onKeyUp={handleKeyUp}
                ref={textAreaRef}
                style={{ color: colors.colorText }}
                defaultValue={body}
                onInput={() => autoGrow(textAreaRef)}
            />
            <button onClick={handleSummarize} className="summarize-button flex flex-row">
                Motion Ask |
                <img src='/motion.png' className='w-5 h-5'></img>
            </button>
        </div>
    );
};

export default NoteCard;
