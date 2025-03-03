import React from 'react';
import { getBezierPath, useInternalNode } from '@xyflow/react';
import { getEdgeParams } from '../../../Helpers/Mindmapping/Edges/EdgesHelper';

function FloatingEdge({ id, source, target, markerEnd, style, data }) {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  if (!sourceNode || !targetNode) return null;

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(sourceNode, targetNode);

  const [edgePath] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    targetX: tx,
    targetY: ty,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
  });

  const parentSize = sourceNode.data?.size || 50;
  
  // Check if either node is completed or has a completed parent
  const isSourceCompleted = sourceNode.data?.task?.progress === 100 || sourceNode.data?.hasCompletedParent || data?.isSourceCompleted;
  const isTargetCompleted = targetNode.data?.task?.progress === 100 || targetNode.data?.hasCompletedParent || data?.isTargetCompleted;
  const isCompleted = isSourceCompleted || isTargetCompleted;
  
  // Determine stroke color based on completion status of either node
  const strokeColor = isCompleted ? '#9fa3a7' : (style?.stroke || '#000');

  return (
    <path
      id={id}
      style={{
        ...style,
        stroke: strokeColor,
        strokeWidth: parentSize / 500,
      }} 
      className="react-flow__edge-path"
      d={edgePath}
      markerEnd={markerEnd}
    />
  );
}

export default FloatingEdge;
