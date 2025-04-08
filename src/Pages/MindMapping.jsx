// ===================================================================
// IMPORTS
// ===================================================================
import React, { useCallback, useMemo, useEffect, useRef, useState } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  ReactFlowProvider,
  MarkerType,
  useReactFlow,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import FloatingEdge from '../Components/MindMapping/Edges/FloatingEdge';
import FloatingConnectionLine from '../Components/MindMapping/Edges/FloatingConnectionLine';
import RoundedNode from '../Components/MindMapping/Nodes/MyRoundedNode';
import { buildNodesAndEdges } from '../Helpers/Mindmapping/Edges/layoutHelpers';
import useTasks from '../Hooks/Tasks/useTasks';
import './Css/MindMapping.css';
import { v4 as uuidv4 } from 'uuid';
import OutsideClickHandler from '../Helpers/General/OutsideClickHandler';
import TaskDetails from '../Components/Tasks/TaskDetails/TaskDetails';

// ===================================================================
// UTILITY FUNCTION
// ===================================================================
const getId = () => uuidv4();

// ===================================================================
// MAIN COMPONENT: MindMappingInner
// ===================================================================
function MindMappingInner() {
  // ----------------------- References and State -----------------------
  const containerRef = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [currentZoom, setCurrentZoom] = useState(0.75);
  console.log('selectedTask:', selectedTask);

  const { screenToFlowPosition, getViewport, instance: reactFlowInstance } = useReactFlow();

  // ----------------------- Custom hook for tasks -----------------------
  const {
    tasks,
    initializeTasks,
    handleCreateCard,
    handleUpdateCard,
    handleDeleteCard,
    getAllMyTasks,
  } = useTasks();

  
  // ----------------------- Layout Initialization Effect -----------------------
useEffect(() => {
  if (containerRef.current) {
    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;
    const containerCenterX = containerWidth / 2;
    const containerCenterY = containerHeight / 2;
    const currentTasks = tasks;
    const { nodes: layoutNodes, edges: layoutEdges } = buildNodesAndEdges(
      currentTasks,
      containerCenterX,
      containerCenterY
    );
    setNodes(layoutNodes);
    setEdges(layoutEdges);    
  }
}, [setEdges, setNodes, initializeTasks, tasks, reactFlowInstance]);

// ----------------------- Node Deletion Handling -----------------------
const onNodesDelete = useCallback(
  async (deletedNodes) => {
    if (deletedNodes.length === 0) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${deletedNodes.length} tasks?`
    );
    if (!confirmed) return;

    for (const node of deletedNodes) {
      await handleDeleteCard(node.id, true);
    }

    await getAllMyTasks();
  },
  [handleDeleteCard, getAllMyTasks]
);



  // ----------------------- Handling Node Connection -----------------------
  const onConnect = useCallback(
    (params) => {
      const parentNode = nodes.find((node) => node.id === params.source);
      if (!parentNode) return;



      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'floating',
            markerEnd: { type: MarkerType.ArrowClosed },
          },
          eds
        )
      );
    },
    [setEdges, nodes]
  );

  // ----------------------- Handling End of Connection -----------------------
  const onConnectEnd = useCallback(
    async (event, connectionState) => {
      console.log('onConnectEnd triggered:', { event, connectionState });
      if (!connectionState.isValid) {
        const parentNode = nodes.find((node) => node.id === connectionState.fromNode.id);
        if (!parentNode) return;

        const childSize = (parentNode.data?.size || 50) * 0.4;
        const id = getId();

        const { clientX, clientY } =
          'changedTouches' in event ? event.changedTouches[0] : event;

        const flowPosition = screenToFlowPosition({ x: clientX, y: clientY });

        setNodes((nds) => [
          ...nds,
          {
            id,
            position: flowPosition,
            data: { label: 'Title', size: childSize },
            type: 'rounded',
          },
        ]);

        const edgeThickness = (parentNode.data?.size || 10) / 10;
        setEdges((eds) => [
          ...eds,
          {
            id: `edge-${connectionState.fromNode.id}-${id}`,
            source: connectionState.fromNode.id,
            target: id,
            type: 'floating',
            style: {
              stroke: parentNode.data?.task?.progress === 100 ? '#9fa3a7' : '#000',
              strokeWidth: edgeThickness
            },
            data: { isSourceCompleted: parentNode.data?.task?.progress === 100 }
          },
        ]);

        const newTaskData = {
          name: 'Title',
          parentIds: [parentNode.id],
        };

        const createdTask = await handleCreateCard(newTaskData);
        console.log('Created Task:', createdTask);

        const updatedParentData = {
          ...parentNode.data.task,
          childrenIds: [...(parentNode.data.task?.childrenIds || []), createdTask._id],
        };

        await handleUpdateCard(parentNode.id, updatedParentData);
      }
    },
    [screenToFlowPosition, setEdges, setNodes, nodes, handleCreateCard, handleUpdateCard]
  );

  // ----------------------- Define Node and Edge Types -----------------------
  const edgeTypes = useMemo(() => ({ floating: FloatingEdge }), []);
  const nodeTypes = useMemo(() => ({ rounded: RoundedNode }), []);

  // ----------------------- Node Label Change -----------------------
  const onLabelChange = (id, newLabel) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, label: newLabel } } : node
      )
    );
  };

  // ----------------------- Handling Node Click -----------------------
  const onNodeClick = useCallback(
    (event, node) => {
      // Locate the corresponding task from the loaded tasks.
      const foundTask =
        tasks.find((task) => task._id === node.id) || {
          _id: node.id,
          name: node.data.label,
          description: node.data.description || 'No description available.',
        };
      setSelectedTask(foundTask);
    },
    [tasks]
  );

  // ----------------------- Selecting a Task from the Flow -----------------------
  const onSelectTaskInFlow = (task) => {
    // Update the sidebar
    setSelectedTask(task);
    // Update nodes state: mark the node with id equal to task._id as selected
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        selected: node.id === task._id,
      }))
    );
  };

  // ----------------------- Component Render -----------------------
  return (
    <div
      ref={containerRef}
      style={{ width: '100vw', height: '80vh', marginTop: '-2.5vh' }}
    >
      <ReactFlow
        nodes={nodes.map((node) => {
          return {
            ...node,
            data: {
              ...node.data,
              zoom: currentZoom,
              onLabelChange: (newLabel) => onLabelChange(node.id, newLabel),
              onUpdateTask: handleUpdateCard,
            },
          };
        })}
        onMove={(event) => {
          const viewport = getViewport();
          setCurrentZoom(viewport.zoom);  
        }}
        onlyRenderVisibleElements={true}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodesDelete={onNodesDelete}
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionLineComponent={FloatingConnectionLine}
        onInit={(instance) => {
          setCurrentZoom(instance.getViewport().zoom);
        }}
        onWheelCapture={() => {
          // Update zoom on any wheel event
          const viewport = getViewport();
          setCurrentZoom(viewport.zoom);
        }}
        minZoom={0.0005}
        maxZoom={60}
        defaultViewport={{ x: 0, y: 0, zoom: 0.75 }}
        multiSelectionKeyCode="Control"
        fitView={{ padding: 0.2, includeHiddenNodes: true }}
        fitViewOptions={{ duration: 800 }}
        nodesDraggable
        nodesConnectable
        elementsSelectable
        nodeDragThreshold={1}
        onPaneClick={() => setSelectedTask(null)}
      />
      <Controls />
      <div className={`sidebar-container ${selectedTask ? 'open' : ''}`}>
        <OutsideClickHandler onOutsideClick={() => setSelectedTask(null)}>
          {selectedTask && (
            <TaskDetails
              task={selectedTask}
              allTasks={tasks}
              onSelectTask={onSelectTaskInFlow}
              onUpdateTask={handleUpdateCard}
              mode="sidebar"
              onClose={() => setSelectedTask(null)}
            />
          )}
        </OutsideClickHandler>
      </div>
    </div>
  );
}

// ===================================================================
// EXPORT MAIN COMPONENT: MindMapping
// ===================================================================
export default function MindMapping() {
  return (
    <ReactFlowProvider>
      <MindMappingInner />
    </ReactFlowProvider>
  );
}
