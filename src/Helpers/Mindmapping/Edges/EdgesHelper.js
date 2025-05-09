// import { Position } from '@xyflow/react';
 
// this helper function returns the intersection point
// of the line between the center of the intersectionNode and the target node
// function getNodeIntersection(intersectionNode, targetNode) {
//   // https://math.stackexchange.com/questions/1724792/an-algorithm-for-finding-the-intersection-point-between-a-center-of-vision-and-a
//   const { width: intersectionNodeWidth, height: intersectionNodeHeight } =
//     intersectionNode.measured;
//   const intersectionNodePosition = intersectionNode.internals.positionAbsolute;
//   const targetPosition = targetNode.internals.positionAbsolute;
 
//   const w = intersectionNodeWidth / 2;
//   const h = intersectionNodeHeight / 2;
 
//   const x2 = intersectionNodePosition.x + w;
//   const y2 = intersectionNodePosition.y + h;
//   const x1 = targetPosition.x + targetNode.measured.width / 2;
//   const y1 = targetPosition.y + targetNode.measured.height / 2;
 
//   const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
//   const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
//   const a = 1 / (Math.abs(xx1) + Math.abs(yy1));
//   const xx3 = a * xx1;
//   const yy3 = a * yy1;
//   const x = w * (xx3 + yy3) + x2;
//   const y = h * (-xx3 + yy3) + y2;
 
//   return { x, y };
// }
 
// // returns the position (top,right,bottom or right) passed node compared to the intersection point
// function getEdgePosition(node, intersectionPoint) {
//   const n = { ...node.internals.positionAbsolute, ...node };
//   const nx = Math.round(n.x);
//   const ny = Math.round(n.y);
//   const px = Math.round(intersectionPoint.x);
//   const py = Math.round(intersectionPoint.y);
 
//   if (px <= nx + 1) {
//     return Position.Left;
//   }
//   if (px >= nx + n.measured.width - 1) {
//     return Position.Right;
//   }
//   if (py <= ny + 1) {
//     return Position.Top;
//   }
//   if (py >= n.y + n.measured.height - 1) {
//     return Position.Bottom;
//   }
 
//   return Position.Top;
// }
 
// returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) you need to create an edge
export function getEdgeParams(sourceNode, targetNode) {
  const { positionAbsolute: sourcePosition } = sourceNode.internals;
  const { positionAbsolute: targetPosition } = targetNode.internals;

  const sourceRadius = Math.min(sourceNode.measured.width, sourceNode.measured.height) / 2;
  const targetRadius = Math.min(targetNode.measured.width, targetNode.measured.height) / 2;

  const sourceCenterX = sourcePosition.x + sourceNode.measured.width / 2;
  const sourceCenterY = sourcePosition.y + sourceNode.measured.height / 2;
  const targetCenterX = targetPosition.x + targetNode.measured.width / 2;
  const targetCenterY = targetPosition.y + targetNode.measured.height / 2;

  const dx = targetCenterX - sourceCenterX;
  const dy = targetCenterY - sourceCenterY;
  const angle = Math.atan2(dy, dx);

  // Calculate connection points on the circle boundary
  const sx = sourceCenterX + sourceRadius * Math.cos(angle);
  const sy = sourceCenterY + sourceRadius * Math.sin(angle);
  const tx = targetCenterX - targetRadius * Math.cos(angle);
  const ty = targetCenterY - targetRadius * Math.sin(angle);

  return {
    sx,
    sy,
    tx,
    ty,
    sourcePos: undefined, // Not needed for floating edges
    targetPos: undefined, // Not needed for floating edges
  };
}
