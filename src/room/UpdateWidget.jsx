import { doc, writeBatch, collection, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import debounce from 'lodash/debounce';

const DEBOUNCE_DELAY = 1500; // 500ms delay
const BATCH_INTERVAL = 0; // 1 seconds

let updateQueue = {};
let batchUpdateTimeout = null;

const processBatchUpdate = async () => {
  const batch = writeBatch(db);
  const currentQueue = { ...updateQueue };
  updateQueue = {};

  Object.entries(currentQueue).forEach(([roomCode, notes]) => {
    Object.entries(notes).forEach(([noteId, data]) => {
      const noteRef = doc(collection(db, roomCode), noteId);
      batch.update(noteRef, data);
    });
  });

  try {
    await batch.commit();
    console.log("Batch update successful!");
  } catch (error) {
    console.error("Error in batch update: ", error);
    // Requeue failed updates
    Object.assign(updateQueue, currentQueue);
  }
};

const scheduleBatchUpdate = debounce(() => {
  if (batchUpdateTimeout) clearTimeout(batchUpdateTimeout);
  batchUpdateTimeout = setTimeout(processBatchUpdate, BATCH_INTERVAL);
}, DEBOUNCE_DELAY);

const updateWidget = (roomCode, noteId, updatedNote, bypass=false) => {
  if (bypass) { //if you need without delay
    instantUpdateWidget(roomCode, noteId, updatedNote);
  }
  else {
    if (!updateQueue[roomCode]) {
      updateQueue[roomCode] = {};
    }
    if (!updateQueue[roomCode][noteId]) {
      updateQueue[roomCode][noteId] = {};
    }
    Object.assign(updateQueue[roomCode][noteId], updatedNote);
    scheduleBatchUpdate();
  }
};

const instantUpdateWidget = async (roomCode, noteId, updatedNote) => {
  try {
    const noteRef = doc(collection(db, roomCode), noteId);
    await updateDoc(noteRef, updatedNote);
    console.log("Instant updated note");
  } catch (error) {
    console.error("Error updating note: ", error);
  }
}

export default updateWidget;