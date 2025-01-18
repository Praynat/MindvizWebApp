import React from 'react';
import { getBezierPath, useInternalNode } from '@xyflow/react';
import { getEdgeParams } from '../../../Helpers/Mindmapping/Edges/EdgesHelper';

function FloatingEdge({ id, source, target, markerEnd, style }) {
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

  return (
    <path
      id={id}
      style={{
        ...style,
        stroke: 'black',
        strokeWidth: parentSize / 500,
      }} 
      className="react-flow__edge-path"
      d={edgePath}
      markerEnd={markerEnd}
    />
  );
}

export default FloatingEdge;
