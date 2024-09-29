import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'react-feather';
import Room from './room/Room';
import createRoom from "./room/CreateRoom";

function HomePage() {
    const [roomCode, setRoomCode] = useState('');
    const navigate = useNavigate();

    const handleJoinRoom = () => {
        if (roomCode) {
            navigate(`/room/${roomCode}`);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
            <header className="container mx-auto px-4 py-6 flex justify-start items-center">
                <img src='/motion.png' className='h-10 w-10'></img>
                <div className="text-2xl font-bold">Notes Pro Max+</div>
                <nav className="space-x-4">
                    <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
                    <a href="#about" className="hover:text-blue-400 transition-colors">About</a>
                </nav>
            </header>

            <main className="container mx-auto px-4 py-12">
                <section className="text-center mb-16">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                        Elevate Your Notes
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-8">
                        Collaborate, organize, and boost productivity like never before.
                    </p>
                    
                    <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
                        <input
                            type="text"
                            placeholder="Enter Room Code"
                            value={roomCode}
                            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                            className="w-full md:w-64 px-4 py-2 rounded-full bg-white/10 border border-white/20 focus:outline-none focus:border-blue-400"
                        />
                        <button
                            onClick={handleJoinRoom}
                            className="w-full md:w-auto px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center"
                        >
                            Join Room <ChevronRight className="ml-2" size={20} />
                        </button>
                    </div>
                    
                    <button
                        onClick={createRoom}
                        className="mt-4 px-6 py-2 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors"
                    >
                        Create New Room
                    </button>
                </section>

                <section id="features" className="grid md:grid-cols-3 gap-8 mb-16">
                    {['Real-Time Collaboration', 'Smart Organization', 'Productivity Boost'].map((feature, index) => (
                        <motion.div
                            key={index}
                            className="p-6 rounded-lg bg-white/5 backdrop-blur-lg"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                        >
                            <h3 className="text-xl font-semibold mb-2">{feature}</h3>
                            <p className="text-gray-400">Experience the power of seamless teamwork and efficiency.</p>
                        </motion.div>
                    ))}
                </section>

                <section id="about" className="text-center">
                    <h2 className="text-3xl font-bold mb-4">About Notes Pro Max+</h2>
                    <p className="text-gray-300 max-w-2xl mx-auto">
                        We're revolutionizing the way you take and manage notes. With cutting-edge features and a sleek interface, Notes Pro Max+ is your ultimate productivity companion.
                    </p>
                </section>
            </main>

            <footer className="container mx-auto px-4 py-6 text-center text-gray-500">
                <p>&copy; 2024 Notes Pro Max+. All rights reserved.</p>
            </footer>
        </div>
    );
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/room/:roomId" element={<Room />} />
            </Routes>
        </Router>
    );
}

export default App;