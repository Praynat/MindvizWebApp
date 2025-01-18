import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';

const RoundedNode = ({ data}) => {
  const { size = 50, label, onLabelChange  } = data;

  const borderSize =size / 100; 
  const handleSize =size / 25; 

  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(label);

  const nodeStyle = {
    width: `${size}px`,
    height: `${size}px`,
    boxShadow: `0 0 0 ${borderSize}px #555`,
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
  };

  // Handler to switch to edit mode
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

  return (
    <div style={nodeStyle} onDoubleClick={handleDoubleClick}>
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
      {/* Handles for connecting edges */}
      <Handle
        type="target"
        position={Position.Top}
        style={{
          width: `${handleSize}px`,
          height: `${handleSize}px`,
          background: '#555',
          borderRadius: '50%',
          opacity: 0,
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          width: `${handleSize}px !important`,
          height: `${handleSize}px !important`,
          minWidth: `${handleSize}px`,
          minHeight: `${handleSize}px`,
          maxWidth: `${handleSize}px`,
          maxHeight: `${handleSize}px`,

          background: '#555',
          borderRadius: '80%',
          opacity: 0.8,
        }}
      />
    </div>
  );
};

export default RoundedNode;
