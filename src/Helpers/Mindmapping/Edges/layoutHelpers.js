const BASE_SIZE = 500;
const BASE_RADIUS = 75;
const CHILD_SIZE_FACTOR = 0.4;

function buildTaskMap(allTasks) {
  const map = {};
  allTasks.forEach((task) => {
    map[task._id] = task;
  });
  return map;
}

function layoutTaskRadially(task, taskMap, level = 0, xCenter, yCenter, visited = {}, parentSize = BASE_SIZE) {
  if (visited[task._id]) {
    return { nodes: [], edges: [] };
  }
  visited[task._id] = true;
  const nodeSize = parentSize * CHILD_SIZE_FACTOR;
  const radius = parentSize / 1.5;  
  const nodes = [
    {
      id: task._id,
      type: 'rounded',
      data: {
        label: task.name||"Title",
        task,
        size: nodeSize,
      },
      position: { x: xCenter, y: yCenter },
      parentId: task.parentIds?.[0] || null,
    },
  ];
  const edges = [];
  const children = task.childrenIds || [];
  const childCount = children.length;
  const randomOffset = 0;
  if (childCount > 0) {
    const startAngle = randomOffset;
    const endAngle = 2 * Math.PI + randomOffset;
    const angleStep = (endAngle - startAngle) / childCount;
    children.forEach((childId, index) => {
      const angle = startAngle + angleStep * index;
      const childX = nodeSize - nodeSize / 1.5 + radius * Math.cos(angle);
      const childY = nodeSize - nodeSize / 1.5 + radius * Math.sin(angle);
      edges.push({
        id: `edge-${task._id}-${childId}`,
        source: task._id,
        target: childId,
        type: 'floating',
      });
      const childTask = taskMap[childId];
      if (childTask) {
        const childLayout = layoutTaskRadially(
          childTask,
          taskMap,
          level + 1,
          childX,
          childY,
          visited,
          nodeSize
        );
        nodes.push(...childLayout.nodes);
        edges.push(...childLayout.edges);
      }
    });
  }
  return { nodes, edges };
}

export function buildNodesAndEdges(allTasks, containerCenterX, containerCenterY) {
  const taskMap = buildTaskMap(allTasks);  
  const visited = {};
  let allNodes = [];
  let allEdges = [];
  const rootTasks = allTasks.filter((t) => !t.parentIds || t.parentIds.length === 0);  
  const rootCount = rootTasks.length;
  rootTasks.forEach((rootTask, rootIndex) => {
    let xCenter = containerCenterX - BASE_SIZE / 6;
    let yCenter = containerCenterY - BASE_SIZE / 6;
    if (rootCount > 1) {
      const angle = (2 * Math.PI * rootIndex) / rootCount;
      const rootRadius = 200;
      xCenter += rootRadius * Math.cos(angle) + BASE_SIZE / 6;
      yCenter += rootRadius * Math.sin(angle) + BASE_SIZE / 6;
    }
    const { nodes, edges } = layoutTaskRadially(
      rootTask,
      taskMap,
      0,
      xCenter,
      yCenter,
      visited,
      BASE_SIZE,
      BASE_RADIUS
    );
    allNodes.push(...nodes);
    allEdges.push(...edges);
  });
  return { nodes: allNodes, edges: allEdges };
}
