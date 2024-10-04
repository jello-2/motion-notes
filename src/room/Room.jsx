import React, { useState, useEffect } from 'react';
import NoteCard from '../cards/NoteCard';
import TimerCard from '../cards/TimerCard';
import { useParams } from 'react-router-dom';
import fetchRoomData from './FetchRoom';
import addWidget from './AddWidget';
import ShareRoom from './ShareRoom';
import SettingsModal from './Settings';
import { Share2, Clock, Music, PenTool, Settings, PlusSquare, HelpCircle } from 'react-feather';
import { collection, onSnapshot, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../Firebase';

import Card from '../cards/TemplateCard';
import SpotifyCard from '../cards/SpotifyCard';
import QuoteCard from '../cards/QuoteCard';
import MotionAskCard from '../cards/MotionAskCard';
import PasswordPrompt from './PasswordPrompt';
import LoadingSpinner from '../utilities/LoadingSpinner';

const SidebarButton = ({ icon: Icon, onClick, label }) => {
    const [isHovered, setIsHovered] = useState(false);
  
    return (
      <div className="relative">
        <button
          className='flex items-center justify-center w-10 h-10 rounded-full hover:bg-blue-300 transition-colors'
          onClick={onClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Icon size={24} color='black'/>
        </button>
        {isHovered && (
          <div className="absolute left-12 top-1/2 -translate-y-1/2 bg-white px-2 py-1 rounded shadow-md text-sm whitespace-nowrap text-black">
            {label}
          </div>
        )}
      </div>
    );
  };

const Room = () => {
    const { roomId } = useParams();
    const [roomData, setRoomData] = useState([]);
    const [isPasswordProtected, setIsPasswordProtected] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [isShareOpen, setShareOpen] = useState(false);
    const [isSettingsOpen, setSettingsOpen] = useState(false);
    const [backgroundUrl, setBackgroundUrl] = useState('');
    const [backgroundDarkness, setBackgroundDarkness] = useState(0);
    
    useEffect(() => {
        checkRoomAccess();
    }, [roomId]);

    const checkRoomAccess = async () => {
        setIsLoading(true);
        const roomDocRef = doc(db, 'rooms', roomId);
        try {
            const roomDoc = await getDoc(roomDocRef);
            if (roomDoc.exists()) {
                const data = roomDoc.data();
                if (data.password) {
                    setIsPasswordProtected(true);
                    setIsAuthenticated(false);
                } else {
                    setIsPasswordProtected(false);
                    setIsAuthenticated(true);
                    await loadRoomData();
                    await loadRoomSettings();
                }
            } else {
                // If the room doesn't exist, create it without password protection
                await setDoc(roomDocRef, { password: '' });
                setIsPasswordProtected(false);
                setIsAuthenticated(true);
                await loadRoomData();
                await loadRoomSettings();
            }
        } catch (error) {
            console.error("Error checking room access:", error);
            // Handle the error appropriately (e.g., show an error message to the user)
        } finally {
            setIsLoading(false);
        }
    };


    const handlePasswordSubmit = async (password) => {
        setIsLoading(true);
        const roomDocRef = doc(db, 'rooms', roomId);
        try {
            const roomDoc = await getDoc(roomDocRef);
            if (roomDoc.exists()) {
                const data = roomDoc.data();
                if (data.password === password) {
                    setIsAuthenticated(true);
                    await loadRoomData();
                    await loadRoomSettings();
                } else {
                    alert('Incorrect password. Please try again.');
                }
            }
        } catch (error) {
            console.error("Error validating password:", error);
            // Handle the error appropriately
        } finally {
            setIsLoading(false);
        }
    };


    const loadRoomData = async () => {
        const data = await fetchRoomData(roomId);
        setRoomData(data);
    };

    const loadRoomSettings = async () => {
        const roomDocRef = doc(db, 'rooms', roomId);
        const roomDoc = await getDoc(roomDocRef);
        if (roomDoc.exists()) {
            const data = roomDoc.data();
            setBackgroundUrl(data.backgroundUrl || '');
            setBackgroundDarkness(data.backgroundDarkness || 0);
        } else {
            // If the room document doesn't exist, create it with default values
            await setDoc(roomDocRef, { backgroundUrl: '', backgroundDarkness: 0 });
        }
    };

    const buttons = [
        { icon: PlusSquare, onClick: () => { addWidget(roomId, "note"); loadRoomData(); }, label: "Add Sticky Note" },
        { icon: HelpCircle, onClick: () => { addWidget(roomId, "motionask"); loadRoomData(); }, label: "Ask Motion" },
        { icon: Music, onClick: () => { addWidget(roomId, "player"); loadRoomData(); }, label: "Add Music Player" },
        { icon: PenTool, onClick: () => { addWidget(roomId, "quote"); loadRoomData(); }, label: "Add Quote" },
        { icon: Clock, onClick: () => { addWidget(roomId, "timer"); loadRoomData(); }, label: "Add Timer" },
        { icon: Settings, onClick: () => setSettingsOpen(true), label: "Background Settings" },
        { icon: Share2, onClick: () => setShareOpen(prev => !prev), label: "Share Room" },
    ];

    const handleDelete = (widgetId) => {
        setRoomData(prevData => prevData.filter(widget => widget.id !== widgetId));
    };

    const handleBackgroundChange = async (url, darkness) => {
        setBackgroundUrl(url);
        setBackgroundDarkness(darkness);
        const roomDocRef = doc(db, 'rooms', roomId);
        await setDoc(roomDocRef, {
            backgroundUrl: url,
            backgroundDarkness: darkness
        }, { merge: true });
    };
    
    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (isPasswordProtected && !isAuthenticated) {
        return <PasswordPrompt onPasswordSubmit={handlePasswordSubmit} />;
    }

    return (
        <div>
            <ShareRoom 
                isOpen={isShareOpen} 
                onClose={() => setShareOpen(false)} 
                roomLink={window.location.href}
            />

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setSettingsOpen(false)}
                roomId={roomId}
                onBackgroundChange={handleBackgroundChange}
                currentBackgroundUrl={backgroundUrl}
                currentDarkness={backgroundDarkness}
            />

            <div 
                className="fixed overflow-auto inset-0 bg-black bg-[length:50px_50px] bg-[linear-gradient(90deg,_rgba(200,200,200,0.2)_1px,_transparent_1px),_linear-gradient(180deg,_rgba(200,200,200,0.2)_1px,_transparent_1px)]"
                style={{
                    backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >

            {/* Overlay div for darkness */}
            <div
                className="fixed inset-0 pointer-events-none"
                style={{
                    backgroundColor: `rgba(0, 0, 0, ${backgroundDarkness})`,
                }}
            />


                {/* Content */}
                <div className="relative z-10">
                    {roomData.map((widget) => {
                        if (widget.type === 'timer') {
                            return <Card key={widget.id} widget={widget} BodyComponent={TimerCard} onDelete={handleDelete} min_width={400}/>;
                        } else if (widget.type === 'player') {
                            return <Card key={widget.id} widget={widget} BodyComponent={() => <SpotifyCard player={widget}/>} onDelete={handleDelete} min_width={400}/>;
                        } else if (widget.type === 'note') {
                            return <Card key={widget.id} widget={widget} BodyComponent={() => <NoteCard note={widget} />} onDelete={handleDelete} min_width={160} />;
                        } else if (widget.type === 'motionask'){
                            return <Card key={widget.id} widget={widget} BodyComponent={() => <MotionAskCard note={widget} />} onDelete={handleDelete} min_width={210}/>;
                        } else if (widget.type === 'quote') {
                            return <Card key={widget.id} widget={widget} BodyComponent={QuoteCard} onDelete={handleDelete} min_width={400} />;
                        }
                    })}
                </div>
            </div>

            {/* Toolbar */}
            <div className="fixed left-2 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center bg-white p-2 rounded-full shadow-lg">
                <div className="flex flex-col items-center space-y-4 py-2">
                    {buttons.map((button, index) => (
                        <SidebarButton key={index} {...button} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Room;