import React, { useState, useEffect } from 'react';
import { Clock } from 'react-feather'; // Import Feather icon

const TimerCard = () => {
  const [sessionLength, setSessionLength] = useState(25); // default session length in minutes
  const [breakLength, setBreakLength] = useState(5); // default break length in minutes
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60); // time left in seconds
  const [isActive, setIsActive] = useState(false);
  const [isSession, setIsSession] = useState(true); // to track whether it's session or break

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      if (isSession) {
        setTimeLeft(breakLength * 60); // switch to break
      } else {
        setTimeLeft(sessionLength * 60); // switch back to session
      }
      setIsSession(!isSession);
    } else if (!isActive && timeLeft !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isSession, sessionLength, breakLength]);

  const handleStart = () => {
    setIsActive(true);
  };

  const handleStop = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(sessionLength * 60);
    setIsSession(true);
  };

  const handleSessionChange = (e) => {
    const newSessionLength = parseInt(e.target.value) || 0;
    setSessionLength(newSessionLength);
    if (isSession) {
      setTimeLeft(newSessionLength * 60); // Reset timeLeft if changing during session
    }
  };

  const handleBreakChange = (e) => {
    const newBreakLength = parseInt(e.target.value) || 0;
    setBreakLength(newBreakLength);
    if (!isSession) {
      setTimeLeft(newBreakLength * 60); // Reset timeLeft if changing during break
    }
  };

  const formatTime = (seconds) => {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${minutes}:${secs}`;
  };

  return (
    <div className="card-body">
      <div className="flex flex-col items-center mb-4">

      <div className="text-3xl mt-2 text-gray-500">
          {isSession ? 'Working...' : 'Break for'}
        </div>

      </div>

      <div className="text-4xl font-mono mb-6 text-gray-800 flex items-center justify-center">
        <Clock className={`mr-2 ${isActive ? 'animate-pulse' : ''}`} /> {/* Clock icon with animation */}
        {formatTime(timeLeft)}
      </div>

      
      
      <div className="flex flex-col items-center mb-4">
        <div className="text-sm text-gray-500">
          <label>Work Time: </label>
          <input
            type="number"
            className="border rounded px-2 py-1 text-center w-16"
            value={sessionLength}
            onChange={handleSessionChange}
            min="1"
          />
        </div>
        <div className="text-sm text-gray-500 mt-2">
          <label>Break Time: </label>
          <input
            type="number"
            className="border rounded px-2 py-1 text-center w-16"
            value={breakLength}
            onChange={handleBreakChange}
            min="1"
          />
        </div>
      
      </div>

      <div className="flex justify-center space-x-2">
        <button
          onClick={handleStart}
          className="bg-green-400 text-black rounded-lg px-4 py-2 hover:bg-green-400 transition"
        >
          Start
        </button>
        <button
          onClick={handleStop}
          className="bg-yellow-400 text-black rounded-lg px-4 py-2 hover:bg-yellow-400 transition"
        >
          Stop
        </button>
        <button
          onClick={handleReset}
          className="bg-red-400 text-black rounded-lg px-4 py-2 hover:bg-red-400 transition"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default TimerCard;
