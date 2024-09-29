import {autoGrow} from '../utils.js'
import {useRef, useEffect} from "react";
import updateWidget from '../room/UpdateWidget.jsx';
import { useParams } from 'react-router-dom';


const NoteCard = ({ note }) => {
    const {roomId} = useParams();

    const textAreaRef = useRef(null)
    const keyUpTimer = useRef(null);

    const colors = note.colors
    const body = note.body

    useEffect(() =>{
        autoGrow(textAreaRef)
    })

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


    return (
        <div className = "card-body">
            <textarea
                onKeyUp={handleKeyUp}
                ref = {textAreaRef}
                style={{ color: colors.colorText }}
                defaultValue={body}
                onInput = {() => autoGrow(textAreaRef)}
            />
        </div>
    )
};

export default NoteCard;