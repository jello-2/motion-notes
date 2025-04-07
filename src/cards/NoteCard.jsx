import { autoGrow } from '../utils.js';
import { useRef, useEffect, useState } from "react";
import updateWidget from '../room/UpdateWidget.jsx';
import { useParams } from 'react-router-dom';

const NoteCard = ({ note }) => {
  const { roomId } = useParams();
  const textAreaRef = useRef(null);
  const keyUpTimer = useRef(null);
  
  // Use local state to control the text area’s value.
  const [text, setText] = useState(note.body);
  const colors = note.colors;

  useEffect(() => {
    autoGrow(textAreaRef);
  }, []);

  // Optional: if the note prop changes externally, update local state.
  useEffect(() => {
    setText(note.body);
  }, [note.body]);

  // Save function uses the current state value.
  const saveData = async () => {
    try {
      const payload = { body: JSON.stringify(text) }; // Check if JSON.stringify is required
      await updateWidget(roomId, note.id, payload);
    } catch (error) {
      console.error("Save data error:", error);
    }
  };

  const handleKeyUp = () => {
    // Clear any existing timer
    if (keyUpTimer.current) {
      clearTimeout(keyUpTimer.current);
    }
    // Start a new 5-second timer
    keyUpTimer.current = setTimeout(() => {
      saveData();
      keyUpTimer.current = null;
    }, 5000);
  };

  const handleBlur = () => {
    // Clear any pending timer
    if (keyUpTimer.current) {
      clearTimeout(keyUpTimer.current);
      keyUpTimer.current = null;
    }
    // Force an immediate save on blur
    saveData();
  };

  const handleChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div className="card-body flex flex-col items-center">
      <textarea
        ref={textAreaRef}
        value={text}
        onChange={handleChange}
        onKeyUp={handleKeyUp}
        onBlur={handleBlur}
        style={{ color: colors.colorText, width: '100%' }}
        onInput={() => autoGrow(textAreaRef)}
        className="w-full mb-4 p-2 border rounded-md"
      />
    </div>
  );
};

export default NoteCard;
