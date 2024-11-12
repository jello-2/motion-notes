import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ChevronRight, Users, Droplet, Layout, Check, X, Plus } from 'react-feather';
import Room from './room/Room';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './Firebase';

import { motion, AnimatePresence } from 'framer-motion';
import createRoom from './room/CreateRoom';

const Button = ({ children, className, ...props }) => (
  <motion.button
    className={`px-6 py-2 rounded-full transition-colors ${className}`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    {...props}
  >
    {children}
  </motion.button>
);

const Input = ({ className, ...props }) => (
  <motion.input
    className={`w-full px-4 py-2 rounded-full bg-white bg-opacity-50 border border-gray-200 focus:outline-none focus:border-blue-300 transition-colors ${className}`}
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    {...props}
  />
);

const FeatureCard = ({ Icon, title, description }) => (
  <motion.div
    className="bg-white bg-opacity-50 p-6 rounded-2xl backdrop-blur-sm shadow-lg"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: 'easeOut' }}
    whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
  >
    <Icon className="w-8 h-8 mb-4 text-blue-400" />
    <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

const PlanFeature = ({ feature, isIncluded, isPro = false }) => (
  <motion.div 
    className="flex items-center space-x-2 mb-2"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
  >
    {isIncluded ? (
      <Check className={`w-5 h-5 ${isPro ? 'text-green-500 w-6 h-6' : 'text-blue-500'}`} />
    ) : (
      <X className="w-5 h-5 text-red-500" />
    )}
    <span className={isPro ? 'font-medium' : ''}>{feature}</span>
  </motion.div>
);

const PlanComparison = () => (
  <motion.div 
    className="grid md:grid-cols-2 gap-8 bg-white bg-opacity-70 p-8 rounded-2xl backdrop-blur-sm shadow-lg mx-4"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: 'easeOut' }}
  >
    <div>
      <h3 className="text-2xl font-semibold mb-4">Free Plan</h3>
      <PlanFeature feature="Up to 3 collaborators" isIncluded={true} />
      <PlanFeature feature="Basic color themes" isIncluded={true} />
      <PlanFeature feature="Standard templates" isIncluded={true} />
      <PlanFeature feature="Motion Ask" isIncluded={true} />
      <PlanFeature feature="Advanced color themes" isIncluded={false} />
      <PlanFeature feature="Custom templates" isIncluded={false} />
      <PlanFeature feature="Private rooms" isIncluded={false} />
      <PlanFeature feature="Priority support" isIncluded={false} />
    </div>
    <div>
      <h3 className="text-2xl font-semibold mb-4">Pro Plan</h3>
      <PlanFeature feature="Unlimited collaborators" isIncluded={true} isPro={true} />
      <PlanFeature feature="Basic color themes" isIncluded={true} isPro={true} />
      <PlanFeature feature="Standard templates" isIncluded={true} isPro={true} />
      <PlanFeature feature="Motion Ask Enhanced" isIncluded={true} isPro={true} />
      <PlanFeature feature="Advanced color themes" isIncluded={true} isPro={true} />
      <PlanFeature feature="Custom templates" isIncluded={true} isPro={true} />
      <PlanFeature feature="Private rooms" isIncluded={true} isPro={true} />
      <PlanFeature feature="Priority support" isIncluded={true} isPro={true} />
    </div>
  </motion.div>
);


function HomePage() {
  const [roomCode, setRoomCode] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [customRoomName, setCustomRoomName] = useState('');
  const navigate = useNavigate();

  const checkRoomExists = async (roomId) => {
    const roomRef = doc(db, 'rooms', roomId);
    const roomSnap = await getDoc(roomRef);
    return roomSnap.exists();
  };
  const handleJoinRoom = async () => {
    if (roomCode) {
      const roomExists = await checkRoomExists(roomCode);
      if (roomExists) {
        navigate(`/room/${roomCode}`);
      } else {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500); // Stop shaking after 500ms
      }
    }
  };

  const handleCreateRoom = () => {
    if (customRoomName.trim() !== "") {
      createRoom(customRoomName);
    } else {
      createRoom();
    }
  };

  const shakeAnimation = {
    shaking: {
      x: [-10, 10, -10, 10, 0],
      transition: { duration: 0.4 }
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-pink-100 via-blue-100 to-purple-100 text-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Helmet>
          <title>Motion - Elevate Your Ideas</title>
          <meta name="description" content="Capture, collaborate, and create with Motion. Your thoughts, beautifully organized and infinitely powerful." />
          <meta name="keywords" content="collaboration, productivity, organization, ideas, creativity" />
          <meta property="og:title" content="Motion - Elevate Your Ideas" />
          <meta property="og:description" content="Capture, collaborate, and create with Motion. Your thoughts, beautifully organized and infinitely powerful." />
          <meta property="og:image" content="/motion-og-image.jpg" />
          <meta property="og:url" content="https://www.motionapp.com" />
          <meta name="twitter:card" content="summary_large_image" />
        </Helmet>

        <header className="bg-white bg-opacity-30 backdrop-blur-md p-4 flex justify-between items-center sticky top-0 z-10">
          <div className='flex items-center space-x-2'>
            <img src='/motion.png' alt="Motion Logo" className='h-8 w-8' />
            <span className="text-xl font-semibold text-gray-800">
              Motion
            </span>
          </div>
          <nav className="flex items-center space-x-12">
            <a href="#features" className="text-gray-600 hover:text-gray-800">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-800">Pricing</a>
            <Button className="bg-blue-400 hover:bg-blue-500 text-white">
              Get Started
            </Button>
          </nav>
        </header>

        <motion.section 
          className="text-center m-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-800">
            Elevate Your Ideas
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Capture, collaborate, and create with Motion. 
            Your thoughts, beautifully organized and infinitely powerful.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <motion.div
              animate={isShaking ? "shaking" : ""}
              variants={shakeAnimation}
            >
              <Input
                type="text"
                placeholder="Enter Room Code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className={`sm:w-64 ${isShaking ? 'border-red-500' : ''}`}
              />
            </motion.div>
            <Button 
              onClick={handleJoinRoom}
              className="bg-blue-400 hover:bg-blue-500 text-white"
            >
              Join Room <ChevronRight className="inline ml-2" size={18} />
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-4">
                <Input
              type="text"
              placeholder="Custom Code (optional)"
              value={customRoomName}
              onChange={(e) => setCustomRoomName(e.target.value.toUpperCase())}
              className="sm:w-64"
            />
            <Button
              onClick={handleCreateRoom}
              className="bg-purple-400 hover:bg-purple-500 text-white"
            >
              New Room <Plus className="inline ml-2" size={18} />
            </Button>
          </div>
        </motion.section>

        <motion.section 
          id="features" 
          className="grid md:grid-cols-3 gap-8 m-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <FeatureCard 
            Icon={Users}
            title="Real-Time Collaboration"
            description="Collaborate seamlessly with your team, no matter where they are."
          />
          <FeatureCard 
            Icon={Droplet}
            title="Beautiful Color Themes"
            description="Customize your workspace with inspiring color themes."
          />
          <FeatureCard 
            Icon={Layout}
            title="Intuitive Design"
            description="A clean, minimal interface that enhances your productivity."
          />
        </motion.section>

        <motion.section 
          id="pricing" 
          className="m-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
            Choose Your Plan
          </h2>
          <PlanComparison />
          <div className="text-center mt-8">
          </div>
        </motion.section>

        <footer className="bg-white bg-opacity-30 backdrop-blur-md py-6 text-center text-gray-600">
          <p>&copy; 2024 Motion. Elevate your ideas.</p>
        </footer>
      </motion.div>
    </AnimatePresence>
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