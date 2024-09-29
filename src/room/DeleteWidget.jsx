import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../Firebase';

const deleteWidget = async (roomId, noteId) => {
  try {
    const noteDocRef = doc(db, roomId, noteId);
    await deleteDoc(noteDocRef);

    console.log("Widget deleted successfully!");

  } catch (error) {
    console.error("Error deleting widget: ", error);
  }
};

export default deleteWidget;
