import { collection, addDoc } from 'firebase/firestore';
import { db } from '../Firebase';

const defaultWidgets = {
  note: {
    type: 'note',
    body: JSON.stringify('Amazing ideas here...'),
    colors: JSON.stringify({
      id: "color-blue",
      colorHeader: "#9BD1DE",
      colorBody: "#A6DCE9",
      colorText: "#18181A",
    }),
    position: JSON.stringify({ x: 305, y: 110 }),
    width: "400",
  },
  timer: {
    type: 'timer',
    body: JSON.stringify('This is a timer.'),
    time: JSON.stringify({
      hours: 0,
      minutes: 30,
      seconds: 0,
    }),
    colors: JSON.stringify({
      id: "color-green",
      colorHeader: "#A5D6A7",
      colorBody: "#C8E6C9",
      colorText: "#18181A",
    }),
    position: JSON.stringify({ x: 200, y: 100 }),
    width: "300",
  },
  player: {
    type: 'player',
    body: JSON.stringify('This is a player.'),
    time: JSON.stringify({
      hours: 0,
      minutes: 30,
      seconds: 0,
    }),
    colors: JSON.stringify({
      id: "color-green",
      colorHeader: "#CAA07F",
      colorBody: "#E6Ba92",
      colorText: "#000000",
    }),
    position: JSON.stringify({ x: 200, y: 100 }),
    width: "300",
  },
  quote: {
    type: 'quote',
    body: JSON.stringify('This is a quote.'),
    colors: JSON.stringify({
      id: "color-green",
      colorHeader: "#CAA07F",
      colorBody: "#E6Ba92",
      colorText: "#000000",
    }),
    position: JSON.stringify({ x: 200, y: 100 }),
    width: "300",
  },
  todo: {
    type: 'todo',
    body: JSON.stringify('This is a quote.'),
    colors: JSON.stringify({
      id: "color-green",
      colorHeader: "#CAA07F",
      colorBody: "#E6Ba92",
      colorText: "#000000",
    }),
    position: JSON.stringify({ x: 200, y: 100 }),
    width: "300",
  },
};

// Function to add a widget to the Firestore collection
const addWidget = async (roomCode, widgetType) => {
  try {
    const widgetRef = collection(db, roomCode);
    const widgetData = defaultWidgets[widgetType];

    if (widgetData) {
      await addDoc(widgetRef, widgetData);
      console.log("Widget added successfully!");
    } else {
      console.error("Invalid widget type:", widgetType);
    }
  } catch (error) {
    console.error("Error adding widget: ", widgetType, error);
  }
};

export default addWidget;
