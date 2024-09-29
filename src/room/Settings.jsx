import React, { useState } from 'react';
import { X } from 'react-feather';
import { storage } from '../Firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const templateImages = [
    { name: 'Night', url: 'https://firebasestorage.googleapis.com/v0/b/yvrnotes-77c78.appspot.com/o/room-backgrounds%2FNIGHTTIME%2Fnighttime%20new.gif?alt=media&token=2c8484c2-b4be-4e30-a34a-1d3c8d926c37' },
    { name: 'Cutesy', url: 'https://firebasestorage.googleapis.com/v0/b/yvrnotes-77c78.appspot.com/o/room-backgrounds%2FNIGHTTIME%2Fcutesty.gif?alt=media&token=3494de0d-d6bc-4032-9bf9-3f51bad21a3a' },
    { name: 'Nature', url: 'https://firebasestorage.googleapis.com/v0/b/yvrnotes-77c78.appspot.com/o/room-backgrounds%2FNIGHTTIME%2Fnature.png?alt=media&token=ab3f4849-c26c-4976-8d95-db69f4deb29d' },
    { name: 'Aurora', url: 'https://firebasestorage.googleapis.com/v0/b/yvrnotes-77c78.appspot.com/o/room-backgrounds%2FNIGHTTIME%2Fsimple-clean.jpg?alt=media&token=85b3b9da-8b28-4421-84e8-4bf7dd9439ad' },
    { name: 'Retro', url: 'https://wallpapercave.com/wp/wp2757967.gif' },
    { name: 'Kawaii ≽^•⩊•^≼', url: 'https://wallpaperaccess.com/full/8278309.gif' },
];
    
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

    const handleTemplateChange = (event) => {
        const selectedUrl = event.target.value;
        if (selectedUrl) {
            onBackgroundChange(selectedUrl, darkness);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[32rem]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Settings</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>
                <div className="space-y-6">
                    <div className="flex space-x-4">
                        <div className="flex-1">
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
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Template Images
                            </label>
                            <select
                                onChange={handleTemplateChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md text-black"
                            >
                                <option value="">Select template</option>
                                {templateImages.map((template) => (
                                    <option key={template.name} value={template.url}>
                                        {template.name}
                                    </option>
                                ))}
                            </select>
                        </div>
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
