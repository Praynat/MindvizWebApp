import React, { useState, useEffect } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';

const RoundedNode = ({ id, data, selected }) => {
  const { size , label, onLabelChange } = data;

  // Access the flow instance to get the current zoom
  const reactFlowInstance = useReactFlow();
  const currentZoom = reactFlowInstance?.toObject()?.zoom || 1;

  // Local states
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(label);
  const [isHovered, setIsHovered] = useState(false);
  const [isShiftPressed, setIsShiftPressed] = useState(false);

  // 1) Detect Shift key press/release
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.shiftKey) {
        setIsShiftPressed(true);
      }
    };
    const handleKeyUp = () => {
      setIsShiftPressed(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // 2) Label Editing
  const handleDoubleClick = () => {
    setIsEditing(true);
  };
  const saveChanges = () => {
    setIsEditing(false);
    if (inputValue !== label) {
      onLabelChange(inputValue);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      saveChanges();
    }
  };

// 1) A "referenceSize" - acts as the baseline size
const referenceSize = 50;  

// 2) Base spread/blur values for the shadow at reference size
const baseSpread = 8;  // Reduce if too aggressive
const baseBlur = 2;    // Reduce if too aggressive

// 3) Softening factor to control subtle vs pronounced scaling
const scaleFactor = 0.0001;  // Lower = more subtle, Higher = more pronounced

// 4) Compute ratio with a softening factor
const rawRatio = referenceSize / size;
const softenedRatio = 1 + (rawRatio - 5) * scaleFactor; // Keeps subtle changes

// 5) Clamp ratio to avoid extreme changes
const ratio = Math.max(0.4, Math.min(softenedRatio, 0.001)); // Limits scaling effect

// 6) Apply ratio to spread and blur
const shadowSpread = baseSpread * ratio;
const shadowBlur = baseBlur * ratio;

// 7) Styles
const borderSize = size / 100;
const handleSize = size / 25;

// 8) Choose shadow
const normalShadow = `0 0 0 ${borderSize}px #555`;  
const highlightShadow = `0 0 ${shadowBlur}px ${shadowSpread}px rgba(0, 0, 255, 0.8)`;


  const nodeStyle = {
    width: `${size}px`,
    height: `${size}px`,
    boxShadow: selected ? highlightShadow : normalShadow,
    border: 'none',
    borderRadius: '50%',
    background: '#fff',
    color: '#333',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: `${Math.max(size / 8, 1)}px`,
    textAlign: 'center',
    position: 'relative',
    // Hover scaling
    transform: isHovered ? 'scale(1.03)' : 'scale(1)',
    transition: 'transform 0.1s ease-in-out',
    cursor: 'move',
  };

  return (
    <div
      style={nodeStyle}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 5) Editing Label */}
      {isEditing ? (
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={saveChanges}
          onKeyDown={handleKeyDown}
          autoFocus
          style={{
            width: '90%',
            border: 'none',
            textAlign: 'center',
            background: 'transparent',
            fontSize: `${size / 8}px`,
            outline: 'none',
          }}
        />
      ) : (
        <div>{label}</div>
      )}

      {/* 6) Connection Handles */}
      <Handle
        type="target"
        position={Position.Top}
        style={{
          width: `${handleSize}px !important`,
          height: `${handleSize}px !important`,
          background: '#555',
          borderRadius: '50%',
          opacity: 0,
        }}
      />

      {isShiftPressed ? (
        <Handle
          className="easy-connect-handle"
          type="source"
          style={{
            position: 'absolute',
            top: size / 2,
            left: size / 2,
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            backgroundColor: 'transparent',
            cursor: 'crosshair', // A crosshair to indicate easy-connect
          }}
        />
      ) : (
        <Handle
        type="source"
        position={Position.Bottom}
        style={{
          width: `${handleSize}px`,
          height: `${handleSize}px`,
          background: '#555',
          borderRadius: '50%',
          opacity: 0.8,
          // Position at bottom edge
          left: '50%',
          bottom: -handleSize ,
          // Combine scale and translation
          transform: `
            translateX(-50%) 
            scale(${Math.max(size / 80, 0.1)})
          `,
          // Anchor scaling at bottom center
          transformOrigin: 'bottom center'
        }}
      />
      )}
    </div>
  );
};

export default RoundedNode;
