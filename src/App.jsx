import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { ChevronRight, Users, Droplet, Layout } from 'react-feather';
import Room from './room/Room';
import { motion } from 'framer-motion';
import createRoom from './room/CreateRoom';
const Button = ({ children, className, ...props }) => (
  <button
    className={`px-6 py-2 rounded-full transition-colors ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Input = ({ className, ...props }) => (
  <input
    className={`w-full px-4 py-2 rounded-full bg-white bg-opacity-50 border border-gray-200 focus:outline-none focus:border-blue-300 transition-colors ${className}`}
    {...props}
  />
);

const FeatureCard = ({ Icon, title, description }) => (
  <motion.div
    className="bg-white bg-opacity-50 p-6 rounded-2xl backdrop-blur-sm"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: 'easeOut' }}
  >
    <Icon className="w-8 h-8 mb-4 text-blue-400" />
    <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

function HomePage() {
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();

  const handleJoinRoom = () => {
    if (roomCode) {
      navigate(`/room/${roomCode}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-100 to-purple-100 text-gray-800 font-sans">
      <header className="bg-white bg-opacity-30 backdrop-blur-md p-4 flex justify-between items-center sticky top-0 z-10">
        <div className='flex items-center space-x-2'>
          <img src='/motion.png' alt="Motion Logo" className='h-8 w-8' />
          <span className="text-xl font-semibold bg-clip-text text-black">
            Motion
          </span>
        </div>
      </header>

        <section className="text-center m-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Elevate Your Ideas
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Capture, collaborate, and create with Motion. 
            Your thoughts, beautifully organized and infinitely powerful.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Input
              type="text"
              placeholder="Enter Room Code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              className="sm:w-64"
            />
            <Button 
              onClick={handleJoinRoom}
              className="bg-blue-400 hover:bg-blue-500 text-white"
            >
              Join Room <ChevronRight className="inline ml-2" size={18} />
            </Button>
          </div>
          
          <Button
            onClick={createRoom}
            className="mt-4 bg-purple-400 hover:bg-purple-500 text-white"
          >
            Create New Room
          </Button>
        </section>

        <section className="grid md:grid-cols-3 gap-8 m-12">
          <FeatureCard 
            Icon={Users}
            title="Real-Time Collaboration"
            description="Collaborate in real-time and sync seamlessly across all your devices."
          />
          <FeatureCard 
            Icon={Droplet}
            title="Beautiful Color Themes"
            description="Customize your workspace with beautiful and inspiring color themes."
          />
          <FeatureCard 
            Icon={Layout}
            title="Minimal & Modern Aesthetic"
            description="A clean, minimal, and modern design to enhance your productivity."
          />
        </section>

      <footer className="bg-white bg-opacity-30 backdrop-blur-md py-6 text-center text-gray-600">
        <p>&copy; 2024 Motion. Elevate your ideas.</p>
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
