import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Room from './room/Room';
import createRoom from "./room/CreateRoom";

function Home() {
    const [roomCode, setRoomCode] = useState('');
    const navigate = useNavigate();

    const handleJoinRoom = () => {
        if (roomCode) {
            navigate(`/room/${roomCode}`);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white p-40 relative overflow-hidden">
            {/* Floating blurred background decoration */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-blue-400 to-blue-600 opacity-40 blur-3xl rounded-full"></div>
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-l from-indigo-400 to-purple-600 opacity-40 blur-3xl rounded-full"></div>
            
            <h1 className="text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-400 to-purple-400">
                Notes Pro Max+
            </h1>

            <p className="text-lg mb-8 text-center max-w-lg text-gray-200">
                Organize your thoughts, collaborate seamlessly, and take productivity to the next level.
            </p>

            <div className="flex flex-col items-center mb-8">
                <button 
                    onClick={createRoom}
                    className="bg-blue-500/60 text-white font-semibold py-3 px-8 rounded-full backdrop-blur-md hover:bg-blue-500/80 transition duration-200 shadow-lg"
                >
                    Create Room
                </button>

                <div className="flex items-center mt-4">
                    <input 
                        type="text" 
                        placeholder="Enter Room Code.." 
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                        className="border border-gray-300/30 rounded-l-lg px-4 py-2 w-64 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/60 backdrop-blur-md"
                    />

                    <button 
                        onClick={handleJoinRoom}
                        className="bg-green-500/60 text-white font-semibold py-2 px-4 rounded-r-lg hover:bg-green-500/80 transition duration-200 backdrop-blur-md shadow-lg"
                    >
                        Join Room
                    </button>
                </div>
            </div>

            {/* Glassmorphism Cards for Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 text-center max-w-4xl">
                <div className="glass-card">
                    <p>🌐 Real-Time Collaboration: Work together seamlessly.</p>
                </div>
                <div className="glass-card">
                    <p>📝 Notes Management: Organize and share notes efficiently.</p>
                </div>
                <div className="glass-card">
                    <p>⏰ Timer Functionality: Keep track of your time while studying.</p>
                </div>
                <div className="glass-card">
                    <p>📅 Schedule Sessions: Plan your study sessions with ease.</p>
                </div>
                <div className="glass-card">
                    <p>🔔 Notifications: Stay updated with reminders and alerts.</p>
                </div>
            </div>

            <div className="mt-10 text-center">
                <p className="text-sm text-gray-300">Organize your thoughts with Notes Pro Max+</p>
            </div>
        </div>
    );
}

function App() {
    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/room/:roomId" element={<Room />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
