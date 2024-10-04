import React, { useState } from 'react';
import { X } from 'react-feather';
import { storage } from '../Firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase';

const templateImages = [
    { name: 'Night', url: '/night.gif' },
    { name: 'White', url: '/white.gif' },
    { name: 'Blossom', url: '/japan.gif' },
    { name: 'Aurora', url: 'https://firebasestorage.googleapis.com/v0/b/yvrnotes-77c78.appspot.com/o/room-backgrounds%2FNIGHTTIME%2Fsimple-clean.jpg?alt=media&token=85b3b9da-8b28-4421-84e8-4bf7dd9439ad' },
    { name: 'Retro', url: 'https://wallpapercave.com/wp/wp2757967.gif' },
    { name: 'Sugoi', url: 'https://firebasestorage.googleapis.com/v0/b/yvrnotes-77c78.appspot.com/o/room-backgrounds%2FNIGHTTIME%2Fcar.gif?alt=media&token=4b3ccbfd-cbbd-4ad4-a354-2949a0792200' },
    { name: 'Rain', url: '/rain.gif' },
    { name: 'Kawaii ≽^•⩊•^≼', url: '/kawaii.gif' },
];
    
const Settings = ({ isOpen, onClose, roomId, onBackgroundChange, currentBackgroundUrl, currentDarkness }) => {
    const [darkness, setDarkness] = useState(currentDarkness);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');


    const handlePasswordChange = async (event) => {
        event.preventDefault();
        setPasswordMessage('');

        if (!newPassword) {
            setPasswordMessage('Missing Fields!');
            return;
        }

        try {
            const roomRef = doc(db, 'rooms', roomId);
            const roomDoc = await getDoc(roomRef);
            
            if (roomDoc.exists()) {
                const roomData = roomDoc.data();
                
                if (roomData.password === currentPassword) {
                    await updateDoc(roomRef, { password: newPassword });
                    setPasswordMessage('Password updated successfully.');
                    setCurrentPassword('');
                    setNewPassword('');
                } else {
                    setPasswordMessage('Current password is incorrect.');
                }
            } else {
                setPasswordMessage('Room not found.');
            }
        } catch (error) {
            console.error("Error updating password:", error);
            setPasswordMessage('An error occurred while updating the password.');
        }
    };

    if (!isOpen) return null;

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
            <div className="bg-white p-8 rounded-lg shadow-lg w-[32rem] max-h-[90vh] overflow-y-auto">
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

                <div className="border-t pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div>
                                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    id="currentPassword"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Change Password
                            </button>
                        </form>
                        {passwordMessage && (
                            <p className={`mt-2 text-sm ${passwordMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                                {passwordMessage}
                            </p>
                        )}
                    </div>

            </div>
        </div>
    );
};

export default Settings;
