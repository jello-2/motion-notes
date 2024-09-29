import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../Firebase";

function generateRoomCode() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let roomCode = "";
    for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * letters.length);
        roomCode += letters[randomIndex];
    }
    return roomCode;
}

const createRoom = async () => {
    const roomCode = generateRoomCode();
    try {
        const roomRef = doc(collection(db, roomCode));

        // Add the data to the new collection
        await setDoc(roomRef, {
                type: 'note',
                body: JSON.stringify(
                  'New note...'
                ),
                colors: JSON.stringify({
                  id: "color-purple",
                  colorHeader: "#FED0FD",
                  colorBody: "#FEE5FD",
                  colorText: "#18181A",
                }),
                position: JSON.stringify({ x: 505, y: 10 }),
                width: "400",
        });

        console.log(`Room created with collection: ${roomCode}`);

        window.location.href = `/room/${roomCode}`;
    } catch (e) {
        console.error("Error creating room: ", e);
    }
};

export default createRoom;
