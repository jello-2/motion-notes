import React, { useState, useEffect } from 'react';
import NoteCard from '../cards/NoteCard';
import TimerCard from '../cards/TimerCard';
import { useParams } from 'react-router-dom';
import fetchRoomData from './FetchRoom';
import addWidget from './AddWidget';
import ShareRoom from './ShareRoom';
import SettingsModal from './Settings';
import { Share2, Tag, Clock, Music, PenTool, Settings, ChevronRight, ChevronLeft, PlusSquare, HelpCircle } from 'react-feather';
import { collection, onSnapshot, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../Firebase';

import Card from '../cards/TemplateCard';
import SpotifyCard from '../cards/SpotifyCard';
import QuoteCard from '../cards/QuoteCard';
import MotionAskCard from '../cards/MotionAskCard';

const Room = () => {
    const { roomId } = useParams();
    const [roomData, setRoomData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isShareOpen, setShareOpen] = useState(false);
    const [isSettingsOpen, setSettingsOpen] = useState(false);
    const [backgroundUrl, setBackgroundUrl] = useState('');
    const [backgroundDarkness, setBackgroundDarkness] = useState(0);

    useEffect(() => {
        loadRoomData();
        loadRoomSettings();
    }, [roomId]);

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
                            return <Card key={widget.id} widget={widget} BodyComponent={SpotifyCard} onDelete={handleDelete} min_width={400}/>;
                        } else if (widget.type === 'note') {
                            return <Card key={widget.id} widget={widget} BodyComponent={() => <NoteCard note={widget} />} onDelete={handleDelete} min_width={160} />;
                        } else if (widget.type === 'motionask'){
                            return <Card key={widget.id} widget={widget} BodyComponent={() => <MotionAskCard note={widget} />} onDelete={handleDelete} min_width={160}/>;
                        } else if (widget.type === 'quote') {
                            return <Card key={widget.id} widget={widget} BodyComponent={QuoteCard} onDelete={handleDelete} min_width={400} />;
                        }
                    })}
                </div>
            </div>

{/* Toolbar */}


<div 
    className="fixed left-0 top-1/2 transform -translate-y-1/2 z-50 flex flex-col items-start"
    onMouseEnter={() => setIsOpen(true)}
    onMouseLeave={() => setIsOpen(false)}
>

    <div className={`flex flex-col items-center space-y-3 bg-white p-2 rounded-r-md shadow-md transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button
         className='flex items-center w-full p-2 rounded-md hover:bg-blue-300 transition-colors'
         onClick={() => { addWidget(roomId, "motionask"); loadRoomData(); }}
        >
        <HelpCircle size={20} color='black'/>
        </button>
        <button 
            className="flex items-center w-full p-2 rounded-md hover:bg-teal-300 transition-colors" 
            onClick={() => { addWidget(roomId, "note"); loadRoomData(); }}
        >
            <PlusSquare size={20} color='black' />
        </button>
        <button 
            className="flex items-center w-full p-2 rounded-md hover:bg-green-300 transition-colors" 
            onClick={() => { addWidget(roomId, "player"); loadRoomData(); }}
        >
            <Music size={20} color='black' />
        </button>
        <button 
            className="flex items-center w-full p-2 rounded-md hover:bg-fuchsia-300 transition-colors" 
            onClick={() => { addWidget(roomId, "quote"); loadRoomData(); }}
        >
            <PenTool size={20} color='black' />
        </button>
        <button 
            className="flex items-center w-full p-2 rounded-md hover:bg-red-300 transition-colors" 
            onClick={() => { addWidget(roomId, "timer"); loadRoomData(); }}
        >
            <Clock size={20} color='black' />
        </button>
        <button 
            className="flex items-center w-full p-2 rounded-md hover:bg-purple-300 transition-colors" 
            onClick={() => setSettingsOpen(true)}
        >
            <Settings size={20} color='black' />
        </button>
        <button 
            className="flex items-center w-full p-2 rounded-md hover:bg-blue-300 transition-colors" 
            onClick={() => setShareOpen(prev => !prev)}
        >
            <Share2 size={20} color='black' />
        </button>
    </div>
</div>



        </div>
    );
};

export default Room;