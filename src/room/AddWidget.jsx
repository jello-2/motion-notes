import { collection, addDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import { processBatchUpdate } from './UpdateWidget';

const colorPresets = [
  { name: 'Soft Peach', header: '#FFDAB9', body: '#FFF0E6', text: '#8B4513' },
  { name: 'Mint Dream', header: '#c9e7d2', body: '#F0FFF0', text: '#006400' },
  { name: 'Lavender Mist', header: '#E6E6FA', body: '#F8F8FF', text: '#4B0082' },
  { name: 'Lemon Chiffon', header: '#f9ebbe', body: '#FAFAD2', text: '#8B8B00' },
  { name: 'Baby Blue', header: '#ADD8E6', body: '#F0F8FF', text: '#00008B' },
  { name: 'Blush Pink', header: '#FFB6C1', body: '#FFF0F5', text: '#8B008B' },
];

const getRandomColorPreset = () => {
    const randomIndex = Math.floor(Math.random() * colorPresets.length);
    return colorPresets[randomIndex];
};

const defaultWidgets = {
  note: {
    type: 'note',
    body: 'Amazing ideas here...',
    position: { x: 305, y: 110 },
    width: 160,
  },
  timer: {
    type: 'timer',
    body: 'This is a timer.',
    position: { x: 200, y: 100 },
    width: 400,
  },
  player: {
    type: 'player',
    body: 'This is a player.',
    playlistUrl: '',
    position: { x: 200, y: 100 },
    width: 400,
  },
  quote: {
    type: 'quote',
    body: 'This is a quote.',
    position: { x: 200, y: 100 },
    width: 400,
  },
  todo: {
    type: 'todo',
    body: 'This is a todo list.',
    position: { x: 200, y: 100 },
    width: 300,
  },
  motionask: {
    type: 'motionask',
    body: 'Ask away!',
    position: { x: 200, y: 100 },
    width: 300,
  },
};

const addWidget = async (roomCode, widgetType) => {
  try {
    await processBatchUpdate();
    const widgetRef = collection(db, roomCode);
    const widgetData = defaultWidgets[widgetType];

    if (widgetData) {
      const randomColorPreset = getRandomColorPreset();
      
      const preparedData = {
        ...widgetData,
        body: JSON.stringify(widgetData.body),
        colors: JSON.stringify(randomColorPreset),
        position: JSON.stringify(widgetData.position),
        width: widgetData.width.toString(),
      };

      await addDoc(widgetRef, preparedData);
      console.log(`${widgetType} widget added successfully with ${randomColorPreset.name} color scheme!`);
    } else {
      console.error("Invalid widget type:", widgetType);
    }
  } catch (error) {
    console.error(`Error adding ${widgetType} widget:`, error);
  }
};

export default addWidget;