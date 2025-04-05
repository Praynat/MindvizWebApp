const BASE_SIZE = 400000;
const BASE_RADIUS = 75;
const CHILD_SIZE_FACTOR = 0.4;

function buildTaskMap(allTasks) {
  const map = {};
  allTasks.forEach((task) => {
    map[task._id] = task;
  });
  return map;
}

// Helper to check if a task is completed (progress = 100%)
function isTaskCompleted(task) {
  return task && task.progress === 100;
}

// Helper to check if any parent of a task is completed
function hasCompletedParent(task, taskMap, visitedTasks = new Set()) {
  // Prevent infinite loops with cyclic relationships
  if (visitedTasks.has(task._id)) {
    return false;
  }
  visitedTasks.add(task._id);
  
  // Check direct parents
  if (!task.parentIds || task.parentIds.length === 0) {
    return false;
  }
  
  for (const parentId of task.parentIds) {
    const parentTask = taskMap[parentId];
    if (!parentTask) continue;
    
    // If parent is completed, return true
    if (isTaskCompleted(parentTask)) {
      return true;
    }
    
    // Check parent's parents recursively
    if (hasCompletedParent(parentTask, taskMap, visitedTasks)) {
      return true;
    }
  }
  
  return false;
}

function layoutTaskRadially(task, taskMap, level = 0, xCenter, yCenter, visited = {}, parentSize = BASE_SIZE) {
  if (visited[task._id]) {
    return { nodes: [], edges: [] };
  }
  visited[task._id] = true;
  const nodeSize = parentSize * CHILD_SIZE_FACTOR;
  const radius = parentSize / 1.5;  
  
  // Check if this task has any completed parent
  const completedParent = hasCompletedParent(task, taskMap);
  
  const nodes = [
    {
      id: task._id,
      type: 'rounded',
      data: {
        label: task.name||"Title",
        task,
        size: nodeSize,
        hasCompletedParent: completedParent
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
      
      // Determine if source task is completed
      const isSourceCompleted = isTaskCompleted(task) || completedParent;
      
      edges.push({
        id: `edge-${task._id}-${childId}`,
        source: task._id,
        target: childId,
        type: 'floating',
        data: { isSourceCompleted }
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
