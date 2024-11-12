import React from 'react';
import { Star, Award, Zap } from 'react-feather';

const PetModal = ({ isOpen, onClose, studyHours = 0 }) => {
  if (!isOpen) return null;

  const getPetImage = () => {
    if (studyHours < 2) {
      return "/s1.png";
    } else if (studyHours < 4) {
      return "/s2.png";
    } else {
      return "/s3.png";
    }
  };

  const getLevel = () => {
    if (studyHours < 2) {
      return 1;
    } else if (studyHours < 4) {
      return 2;
    } else {
      return 3;
    }
  };

  const getLevelInfo = () => {
    const level = getLevel();
    switch (level) {
      case 1:
        return {
          title: "Newbie Scholar",
          message: "Just starting your journey! Keep studying to help your pet grow.",
          decoration: <Star size={20} className="text-yellow-400" />,
          bgColor: "bg-blue-50",
          textColor: "text-blue-600",
          borderColor: "border-blue-200"
        };
      case 2:
        return {
          title: "Dedicated Learner",
          message: "Your pet is growing stronger with your dedication!",
          decoration: <Award size={24} className="text-indigo-400" />,
          bgColor: "bg-indigo-50",
          textColor: "text-indigo-600",
          borderColor: "border-indigo-200"
        };
      case 3:
        return {
          title: "Master Student",
          message: "Amazing work! Your pet has reached its final form!",
          decoration: <Zap size={24} className="text-purple-400" />,
          bgColor: "bg-purple-50",
          textColor: "text-purple-600",
          borderColor: "border-purple-200"
        };
      default:
        return {
          title: "Scholar",
          message: "Keep studying!",
          decoration: null,
          bgColor: "bg-gray-50",
          textColor: "text-gray-600",
          borderColor: "border-gray-200"
        };
    }
  };

  const levelInfo = getLevelInfo();

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                      bg-white rounded-xl p-8 z-50 w-[400px] shadow-2xl
                      ${levelInfo.bgColor} border-2 ${levelInfo.borderColor}`}>
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>

        {/* Title with decoration */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {levelInfo.decoration}
          <h2 className={`text-xl font-bold ${levelInfo.textColor}`}>
            {levelInfo.title}
          </h2>
          {levelInfo.decoration}
        </div>
        
        {/* Study Hours */}
        <div className="text-center mb-4">
          <span className="text-gray-600 font-medium">
            Hours Studied: {studyHours}
          </span>
        </div>

        {/* Pet Image Container */}
        <div className="min-h-[200px] flex items-center justify-center mb-4">
          <div className="relative">
            {/* Decorative elements based on level */}
            {getLevel() === 3 && (
              <div className="absolute -inset-4">
                <div className="absolute inset-0 rounded-full animate-spin-slow bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 blur-lg"/>
              </div>
            )}
            <img 
              src={getPetImage()} 
              alt="Study Pet" 
              className="max-w-full max-h-[180px] object-contain relative z-10"
            />
          </div>
        </div>

        {/* Message */}
        <div className="text-center">
          <p className={`${levelInfo.textColor} font-medium`}>
            {levelInfo.message}
          </p>
          
          {/* Next Level Info */}
          {getLevel() < 3 && (
            <p className="text-gray-500 text-sm mt-2">
              Study {2 - (studyHours % 2)} more hours to reach the next level!
            </p>
          )}
        </div>

        {/* Progress Circles */}
        <div className="flex justify-center gap-2 mt-4">
          {[1, 2, 3].map((level) => (
            <div
              key={level}
              className={`w-2 h-2 rounded-full ${
                level <= getLevel() 
                  ? levelInfo.textColor.replace('text', 'bg')
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default PetModal;