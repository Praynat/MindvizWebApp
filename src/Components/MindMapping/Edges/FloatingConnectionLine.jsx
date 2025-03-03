import React from 'react';
import { getBezierPath } from '@xyflow/react';
import { getEdgeParams } from '../../../Helpers/Mindmapping/Edges/EdgesHelper';

function FloatingConnectionLine({ toX, toY, fromPosition, toPosition, fromNode }) {
  if (!fromNode) return null;

  const targetNode = {
    id: 'connection-target',
    measured: { width: 1, height: 1 },
    internals: {
      positionAbsolute: { x: toX, y: toY },
    },
  };

  const { sx, sy } = getEdgeParams(fromNode, targetNode);
  
  // Calculate appropriate stroke width based on source node size
  const sourceNodeSize = fromNode.data?.size || 50;
  // Cap the stroke width between 0.5 and 2.5
  const strokeWidth = Math.min(Math.max(sourceNodeSize / 500, 0.5), 2.5);
  
  const [edgePath] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: fromPosition,
    targetX: toX,
    targetY: toY,
    targetPosition: toPosition,
  });

  return (
    <g>
      <path 
        fill="none" 
        stroke="#222" 
        strokeWidth={strokeWidth} 
        className="animated" 
        d={edgePath} 
      />
      <circle 
        cx={toX} 
        cy={toY} 
        fill="#fff" 
        // Cap the radius between 3 and 6
        r={Math.min(Math.max(sourceNodeSize / 25, 3), 6)} 
        stroke="#222" 
        strokeWidth={strokeWidth / 2} 
      />
    </g>
  );
}

export default FloatingConnectionLine;
