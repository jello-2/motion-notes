import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../Firebase';

const deleteNote = async (roomId, noteId) => {
  try {
    const noteDocRef = doc(db, roomId, noteId);
    await deleteDoc(noteDocRef);

    console.log("Note deleted successfully!");

  } catch (error) {
    console.error("Error deleting note: ", error);
  }
};

export default deleteNote;
