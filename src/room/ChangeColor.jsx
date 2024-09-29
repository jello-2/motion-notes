import React, { useState } from 'react';
import { doc, updateDoc, collection } from 'firebase/firestore';
import { db } from '../Firebase';

import updateWidget from './UpdateWidget';

const ChangeColor = (RoomId, widgetId) =>{

    console.log("trying to change colour")

    const [showPalette, setShowPalette] = useState(false); // State to show/hide palette
    const [selectedColor, setSelectedColor] = useState(''); // State to store selected color
  
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFBD33', '#33FFF0']; // Example colors

    const togglePalette = () => {
        setShowPalette(!showPalette);
      };
    
      // Handle color selection
    const handleColorClick = async (color) => {
        setSelectedColor(color); // Set selected color
        setShowPalette(false);   // Hide the palette after selecting
        
 
            // Update the document with the new colorHeader (re-stringify the colors)

            const payload = {[colors]: JSON.stringify()}
            updateWidget(RoomId,widgetId,{
                colors: JSON.stringify(colors.colorHeader = selectedColor),})

    }
    
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ textAlign: 'center' }}>
          <button onClick={togglePalette}>
            {selectedColor ? `Selected Color: ${selectedColor}` : 'Pick a Color'}
          </button>
    
          {showPalette && (
            <div style={styles.paletteContainer}>
              {colors.map((color, index) => (
                <div
                  key={index}
                  onClick={() => handleColorClick(color)}
                  style={{ ...styles.colorBox, backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </div>
      );


};

const styles = {
    paletteContainer: {
      marginTop: '10px',
      display: 'flex',
      justifyContent: 'center',
      gap: '10px',
    },
    colorBox: {
      width: '40px',
      height: '40px',
      cursor: 'pointer',
      border: '1px solid #000',
    },
  };

export default ChangeColor;
