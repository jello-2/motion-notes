import React, { useState } from 'react';
import { Copy, X, Check } from 'react-feather';

const ShareRoom = ({ isOpen, onClose, roomLink }) => {
    const [copySuccess, setCopySuccess] = useState(false);

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(roomLink)
            .then(() => {
                setCopySuccess(true);
            })
            .catch(err => console.error('Error copying text: ', err));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 shadow-lg max-w-md relative">
                {/* Close Button */}
                <button 
                    onClick={onClose} 
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 focus:outline-none"
                >
                    <X size={20} />
                </button>

                {/* Title */}
                <h2 className="text-lg font-bold mb-4 text-black">Share this Room</h2>

                {/* Room Link and Copy Button */}
                <div className="flex items-center bg-gray-100 p-4 rounded-md mb-4">
                    <p className="text-sm text-black flex-1">{roomLink}</p>
                    <button 
                        onClick={handleCopyToClipboard} 
                        className={`flex items-center bg-blue-500 text-white py-1 px-2 rounded ml-2 hover:bg-blue-600 transition ${
                            copySuccess ? 'bg-green-500 hover:bg-green-600' : ''
                        }`}
                    >
                        {copySuccess ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShareRoom;
