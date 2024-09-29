import React, { useState } from 'react';
import { X } from 'react-feather';
import { storage } from '../Firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Settings = ({ isOpen, onClose, roomId, onBackgroundChange, currentBackgroundUrl, currentDarkness }) => {
    const [darkness, setDarkness] = useState(currentDarkness);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const storageRef = ref(storage, `room-backgrounds/${roomId}/${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            onBackgroundChange(downloadURL, darkness);
        }
    };

    const handleDarknessChange = (event) => {
        const newDarkness = parseFloat(event.target.value);
        setDarkness(newDarkness);
        onBackgroundChange(currentBackgroundUrl, newDarkness);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Settings</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload Background Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Background Darkness: {(darkness * 100).toFixed(0)}%
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={darkness}
                            onChange={handleDarknessChange}
                            className="w-full"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;