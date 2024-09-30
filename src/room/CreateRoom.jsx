import addWidget from "./AddWidget";

function generateRoomCode() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let roomCode = "";
    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * letters.length);
        roomCode += letters[randomIndex];
    }
    return roomCode;
}

const createRoom = async () => {
    const roomCode = generateRoomCode();
    try {
        addWidget(roomCode, 'note');
        console.log(`Room created with collection: ${roomCode}`);
        window.location.href = `/room/${roomCode}`;
        
    } catch (e) {
        console.error("Error creating room: ", e);
    }
};

export default createRoom;
