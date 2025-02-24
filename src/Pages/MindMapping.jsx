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
import TaskDetailsPage from './Tasks/TaskDetailsPage';
import OutsideClickHandler from '../Helpers/General/OutsideClickHandler';

const getId = () => uuidv4();

function MindMappingInner() {
  const containerRef = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  console.log('selectedTask:', selectedTask);
  

  const { toObject, screenToFlowPosition } = useReactFlow();
  const currentZoom = toObject()?.zoom || 1;

  const {
    tasks,
    initializeTasks,
    handleCreateCard,
    handleUpdateCard,
    handleDeleteCard,
    getAllMyTasks,
  } = useTasks();

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
  }, [setEdges, setNodes, initializeTasks, tasks]);

  const onConnect = useCallback(
    (params) => {
      const parentNode = nodes.find((node) => node.id === params.source);
      if (!parentNode) return;
      const edgeThickness = 20;
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'floating',
            markerEnd: { type: MarkerType.ArrowClosed },
            style: { stroke: '#000', strokeWidth: edgeThickness },
          },
          eds
        )
      );
    },
    [setEdges, nodes]
  );

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
            style: { stroke: '#000', strokeWidth: edgeThickness },
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

  const edgeTypes = useMemo(() => ({ floating: FloatingEdge }), []);
  const nodeTypes = useMemo(() => ({ rounded: RoundedNode }), []);

  const onLabelChange = (id, newLabel) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, label: newLabel } } : node
      )
    );
  };

  // When a node is clicked, find its corresponding task and open the sidebar panel.
  const onNodeClick = useCallback(
    (event, node) => {
      // Locate the matching task from the loaded tasks.
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
  
  

  return (
    <div
      ref={containerRef}
      style={{ width: '100vw', height: '80vh', marginTop: '-2.5vh' }}
    >
      <ReactFlow
        nodes={nodes.map((node) => ({
          ...node,
          data: {
            ...node.data,
            onLabelChange: (newLabel) => onLabelChange(node.id, newLabel),
          },
        }))}
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
        minZoom={0.1}
        maxZoom={50}
        multiSelectionKeyCode="Control"
        selectionKeyCode="Control"
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
            <TaskDetailsPage
              task={selectedTask}
              allTasks={tasks}
              onSelectTask={onSelectTaskInFlow} 
              mode="sidebar"
              onClose={() => setSelectedTask(null)}
            />
          
          )}
        </OutsideClickHandler>
      </div>



    </div>
  );
}

export default function MindMapping() {
  return (
    <ReactFlowProvider>
      <MindMappingInner />
    </ReactFlowProvider>
  );
}