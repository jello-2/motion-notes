import { getDocs, collection } from 'firebase/firestore';
import { db } from '../Firebase'; // Ensure Firebase is set up correctly

const fetchRoomData = async (roomCode) => {
    try {
        const roomSnapshot = await getDocs(collection(db, roomCode));
        const roomData = [];
        roomSnapshot.forEach((doc) => {
            const data = doc.data();
            // Parse JSON strings back into objects
            const parsedData = {
            ...data,
            body: JSON.parse(data.body),
            colors: JSON.parse(data.colors),
            position: JSON.parse(data.position),
            id: doc.id,
            };
            roomData.push(parsedData);
        });
        console.log(roomData);
        return roomData; //array of notes
    } catch (e) {
        console.error("Error fetching room data: ", e);
        return [];
    }
}

export default fetchRoomData;


