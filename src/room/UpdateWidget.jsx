import { doc, updateDoc, collection } from 'firebase/firestore';
import { db } from '../Firebase';


const updateWidget = async (roomCode, noteId, updatedNote) => {
  try {
    const noteRef = doc(collection(db, roomCode), noteId);
    await updateDoc(noteRef, updatedNote);

    console.log(`Note ${noteId} updated successfully!`);
  } catch (error) {
    console.error("Error updating note: ", error);
  }
};

export default updateWidget;