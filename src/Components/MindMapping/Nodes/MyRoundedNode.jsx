import React, { useState, useEffect, useRef } from 'react';
import { Handle, Position } from '@xyflow/react';

const RoundedNode = ({ id, data, selected }) => {
  const { size, label, onLabelChange, task, hasCompletedParent, zoom } = data;
  const containerRef = useRef(null);
  const [fontSize, setFontSize] = useState(16);
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        const base = Math.min(width, height);
        // store `base` itself, then multiply in the style
        setFontSize(base);
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);
  // ========== CONFIGURABLE STYLING PARAMETERS ==========
  // Reference values
  const referenceSize = 40;  // Base size for calculations

  // Shadow base settings
  const shadowConfig = {
    // Normal node shadow
    normal: {
      borderSize: size / 150,         // Border thickness
      borderColor: '#555',            // Border color
      spreadFactor: 1.1,              // Multiplier for border thickness
    },
    // Completed node shadow
    completed: {
      borderSize: size / 1,         // Border thickness  
      borderColor: '#9fa3a7',         // Border color
      spreadFactor: 1.0,              // Multiplier for border thickness
    },
    // Selected/highlighted node shadow
    highlight: {
      spreadFactor: 3,                // How much the highlight extends (higher = larger glow)
      blurFactor: 2,                  // How blurry the highlight is (higher = more blur)
      color: 'rgba(0, 0, 255, 0.8)',  // Highlight color
      minSpread: 5,                   // Minimum size of highlight regardless of zoom
      minBlur: 3,                     // Minimum blur regardless of zoom
    },
    // Progress indicator shadow (inside the node)
    progress: {
      spreadFactor: 0.4,                // How much the progress shadow extends inward
      blurFactor: 4,                    // How blurry the progress shadow is
      minSpread: 3,                     // Lower minimum to avoid threshold effects
      minBlur: 2,                       // Minimum blur regardless of zoom
      zoomDivisor: 200,                 // More balanced zoom sensitivity
      sizeScale: 0.045,                 // Adjusted for better size proportion
      zoomCompensation: 0.1,            // NEW: Factor to compensate for zoom changes
    },
    // General shadow settings
    general: {
      baseSpread: 8,                  // Base spread value at reference size
      baseBlur: 2,                    // Base blur value at reference size
      scaleFactor: 0.00001,           // Controls subtle vs pronounced scaling with size
      zoomDivisor: 300,                 // Higher = less effect from zoom
    }
  };

  // ========== NODE SIZE & ZOOM CALCULATIONS ==========
  // Local states
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(label);
  const [isHovered, setIsHovered] = useState(false);
  const [isShiftPressed, setIsShiftPressed] = useState(false);

  // Check if task is completed (progress = 100%) or has completed parent
  const isCompleted = (task && task.progress === 100) || hasCompletedParent;
  // Handle checkbox click

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    const newChecked = !isCompleted;
    data.onCheckboxChange(id, newChecked);
  };
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

  // ========== SHADOW CALCULATIONS ==========
  // Size ratio calculations
  const rawRatio = referenceSize / size;
  const softenedRatio = 1 + (rawRatio - 2) * shadowConfig.general.scaleFactor;
  const ratio = Math.max(0.4, Math.min(softenedRatio, 0.001));

  // Apply ratio with zoom adjustment
  const zoomAdjustment = 1 / (zoom || 1);
  const shadowSpread = shadowConfig.general.baseSpread * ratio * 1.8 * zoomAdjustment / shadowConfig.general.zoomDivisor;
  const shadowBlur = shadowConfig.general.baseBlur * ratio * 1.8 * zoomAdjustment / shadowConfig.general.zoomDivisor;

  // Style constants
  const borderSize = shadowConfig.normal.borderSize;
  const handleSize = size / 15;

  // ========== PROGRESS COLOR FUNCTION ==========
  const getProgressColor = (progress) => {
    const normalizedProgress = Math.max(0, Math.min(100, progress || 0));

    if (normalizedProgress < 50) {
      return 'rgb(255, 0, 0)';
    } else if (normalizedProgress < 100) {
      return 'rgb(255, 166, 0)';
    } else {
      return 'rgb(0, 185, 0)';
    }
  };

  // ========== SHADOW GENERATION ==========
  const progressValue = task?.progress || 0;
  let progressColor;
  let useProgressShadow = true;

  // Determine progress color based on completion status
  if (isCompleted) {
    // If this task is completed (directly or through parent), use green
    if (task && task.progress === 100) {
      progressColor = 'rgb(0, 185, 0)';  // Green for completed tasks
    } else {
      // This is a child of completed parent, but not completed itself - no progress shadow
      useProgressShadow = false;
      progressColor = 'transparent';
    }
  } else {
    // Normal progress color for incomplete tasks with incomplete parents
    progressColor = getProgressColor(progressValue);
  }

  // Add a size factor to maintain shadow proportion at different sizes
  const zoomCompensationFactor = Math.pow(zoom || 1, shadowConfig.progress.zoomCompensation);
  const sizeFactor = size * shadowConfig.progress.sizeScale * zoomCompensationFactor;

  // Progress shadow calculation with smoother transitions
  const progressShadowSpread = Math.max(
    shadowSpread * borderSize * shadowConfig.progress.spreadFactor + sizeFactor,
    shadowConfig.progress.minSpread * zoomCompensationFactor
  );

  const progressShadowBlur = Math.max(
    shadowBlur * shadowConfig.progress.blurFactor,
    shadowConfig.progress.minBlur * zoomCompensationFactor
  );

  const progressShadow = useProgressShadow
    ? `inset 0 0 ${progressShadowBlur}px ${progressShadowSpread}px ${progressColor}`
    : '';  // Empty string means no inner shadow

  // Highlight shadow
  const highlightSpread = Math.max(shadowSpread * shadowConfig.highlight.spreadFactor, shadowConfig.highlight.minSpread);
  const highlightBlur = Math.max(shadowBlur * shadowConfig.highlight.blurFactor, shadowConfig.highlight.minBlur);

  // Combined shadows - add progress shadow only if it should be used
  const normalShadow = `0 0 0 ${borderSize * shadowConfig.normal.spreadFactor}px ${shadowConfig.normal.borderColor}${useProgressShadow ? ', ' + progressShadow : ''}`;
  const completedShadow = `0 0 0 ${borderSize * shadowConfig.completed.spreadFactor}px ${shadowConfig.completed.borderColor}${useProgressShadow ? ', ' + progressShadow : ''}`;
  const highlightShadow = `0 0 ${highlightBlur}px ${highlightSpread}px ${shadowConfig.highlight.color}${useProgressShadow ? ', ' + progressShadow : ''}`;

  // ========== NODE STYLES ==========
  const nodeStyle = {
    width: `${size}px`,
    height: `${size}px`,
    boxShadow: selected
      ? highlightShadow
      : isCompleted
        ? completedShadow
        : normalShadow,
    border: 'none',
    borderRadius: '50%',
    background: isCompleted ? '#ffffff' : '#fff',
    backgroundColor: "transparent",

    color: isCompleted ? '#9fa3a7' : '#333',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    position: 'relative',
    transform: isHovered ? 'scale(1.03)' : 'scale(1)',
    transition: 'transform 0.1s ease-in-out, background 0.2s ease, color 0.2s ease',
    cursor: 'move',
    opacity: isCompleted ? 0.8 : 1,
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
            fontSize: `1000px`,
            outline: 'none',
          }}
        />
      ) : (
        <div
          ref={containerRef}
          style={{
            ...(isCompleted ? {
              textDecoration: 'line-through',
              textDecorationThickness: `${size / 5000}px`,
            } : {}),
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            padding: `${size * 0.1}px`,    // 10% padding all around
            boxSizing: 'border-box',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'black',
            textAlign: 'center',
            fontSize: `100px`,
          }}
        >
          <div
            style={{
              width: '8ch',                 // set your pre-scale wrap width
              whiteSpace: 'normal',
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
              padding: '0.2em',
              boxSizing: 'border-box',
            }}
          >
            {/* 2) this inner span only scales the text itself */}
            <span
              style={{
                display: 'block',
                width: '100%',
                transform: `scale(${size / 600})`,
                transformOrigin: 'center center',
              }}
            >
              {label}
            </span>
          </div>
        </div>
      )}

      {/* Absolutely positioned checkbox at bottom of node */}
      {!isEditing && (
        <div
          style={{
            position: 'absolute',
            bottom: `${size / 10}px`,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={handleCheckboxClick}
            onClick={(e) => e.stopPropagation()}
            style={{
              cursor: 'pointer',
              width: `${size / 10}px`,
              height: `${size / 10}px`,
              aspectRatio: '1 / 1',
              accentColor: isCompleted ? 'rgb(0, 185, 0)' : undefined,
              appearance: 'none',
              border: 'none', // Remove the default border
              boxShadow: `inset 0 0 0 ${size / 250}px black`, // Use box-shadow to simulate a thin border
              backgroundColor: 'white',
              borderRadius: `${size / 50}px`,
            }}
          />

        </div>
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
            cursor: 'crosshair',
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
            left: '50%',
            bottom: -handleSize / 2,
            transform: `
              translateX(-50%) 
              scale(${Math.min(Math.max(size / 80, 0.1), 1)})
            `,
            transformOrigin: 'bottom center'
          }}
        />
      )}
    </div>
  );
};

export default RoundedNode;