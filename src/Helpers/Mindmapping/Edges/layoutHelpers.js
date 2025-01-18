
const BASE_SIZE = 500; // Root node size
const BASE_RADIUS = 75; // The distance for the root's children
const CHILD_SIZE_FACTOR = 0.4; // Each child is half the parent’s size
// const MIN_NODE_SIZE = 10; // Minimum size for a node
 

/**
 * Build an index of tasks by ID for quick lookup.
 */
function buildTaskMap(allTasks) {
  const map = {};
  allTasks.forEach((task) => {
    map[task.Id] = task;
  });
  return map;
}



/**
 * Radially layout tasks in a full circle.
 *
 * @param {Object} task The current task object
 * @param {Object} taskMap All tasks indexed by ID
 * @param {number} level Depth in the hierarchy (0 = root)
 * @param {number} xCenter X position of the parent
 * @param {number} yCenter Y position of the parent
 * @param {Object} visited Tracks which tasks have been processed
 * @param {number} parentSize The parent’s node size
 * @return {Object} { nodes, edges }
 */
function layoutTaskRadially(
  task,
  taskMap,
  level = 0,
  xCenter ,
  yCenter ,
  visited = {},
  parentSize=BASE_SIZE,
) {  
  if (visited[task.Id]) {
    // Avoid processing the same task multiple times
    return { nodes: [], edges: [] };
  }
  visited[task.Id] = true;

  // Node size
  const nodeSize = parentSize * CHILD_SIZE_FACTOR;

  // Radius for child nodes
  const radius = parentSize/(1.5);
  
  console.log(
    `Parent Node: ${task.Id}, Level: ${level}, X: ${xCenter.toFixed(
      2
    )}, Y: ${yCenter.toFixed(2)}`
  );
  // Create the node
  const nodes = [
    {
      id: task.Id,
      type: 'rounded',
      data: {
        label: task.Name,
        task,
        size: nodeSize,
      },
      position: { x: xCenter, y: yCenter },
      parentId: task.ParentIds?.[0] || null,
      
    },
  ];
  const edges = [];

  // Distribute children in full circle
  const children = task.ChildrenIds || [];
  const childCount = children.length;
  const randomOffset = 2 * Math.PI * Math.random(); 
  if (childCount > 0) {
    const startAngle = 0+randomOffset;
    const endAngle = 2 * Math.PI+randomOffset;
    const angleStep = (endAngle - startAngle) / childCount;

    children.forEach((childId, index) => {
      const angle = startAngle + angleStep * index;
      const childX = nodeSize-(nodeSize/1.5) + radius * Math.cos(angle);
      const childY = nodeSize-(nodeSize/1.5) + radius * Math.sin(angle);

      console.log(
        `  Child Node: ${childId}, Parent: ${task.Id}, Level: ${level + 1}, X: ${childX.toFixed(
          2
        )}, Y: ${childY.toFixed(2)}`
      );
      // Add edge from parent to child
      edges.push({
        id: `edge-${task.Id}-${childId}`,
        source: task.Id,
        target: childId,
        type: 'floating',
      });

      // Recurse for sub-children
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

/**
 * Main function: builds the React Flow nodes + edges from a list of tasks.
 */
export function buildNodesAndEdges(allTasks,containerCenterX,containerCenterY) {
  const taskMap = buildTaskMap(allTasks);
  const visited = {};
  let allNodes = [];
  let allEdges = [];

    
  // Find root tasks (no parents)
  const rootTasks = allTasks.filter(
    (t) => !t.ParentIds || t.ParentIds.length === 0
  );

  

  // If you have multiple roots, offset them around the center
  const rootCount = rootTasks.length;
  rootTasks.forEach((rootTask, rootIndex) => {
    let xCenter = containerCenterX-BASE_SIZE/6;
    let yCenter = containerCenterY-BASE_SIZE/6;

    if (rootCount > 1) {
      const angle = (2 * Math.PI * rootIndex) / rootCount;
      const rootRadius = 200; // Distance from center
      xCenter += rootRadius * Math.cos(angle)+BASE_SIZE/6;
      yCenter += rootRadius * Math.sin(angle)+BASE_SIZE/6;
    }

    const { nodes, edges } = layoutTaskRadially(
      rootTask,
      taskMap,
      0,        
      xCenter,
      yCenter,
      visited,
      BASE_SIZE,
      BASE_RADIUS,
    );
    allNodes.push(...nodes);
    allEdges.push(...edges);
  });

  return { nodes: allNodes, edges: allEdges };
}
