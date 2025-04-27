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
import { useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate and useLocation
import ROUTES from '../Routes/routesModel'; // Import ROUTES

import '@xyflow/react/dist/style.css';
import FloatingEdge from '../Components/MindMapping/Edges/FloatingEdge';
import FloatingConnectionLine from '../Components/MindMapping/Edges/FloatingConnectionLine';
import RoundedNode from '../Components/MindMapping/Nodes/MyRoundedNode';
import { buildNodesAndEdges } from '../Helpers/Mindmapping/Edges/layoutHelpers';
import useTasks from '../Hooks/Tasks/useTasks';
import { useGroups } from '../Hooks/Groups/useGroups'; // Correct import
import './Css/MindMapping.css'; // Import CSS Modules
import { v4 as uuidv4 } from 'uuid';
import OutsideClickHandler from '../Helpers/General/OutsideClickHandler';
import TaskDetails from '../Components/Tasks/TaskDetails/TaskDetails';
import QuickAddBar from '../Components/Tasks/QuickAddBar/QuickAddBar';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Paper, List, ListItemButton, ListItemText, Typography } from '@mui/material';
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

  const navigate = useNavigate(); // Initialize navigate
  const location = useLocation(); // Get current location
  const { screenToFlowPosition, getViewport, instance: reactFlowInstance } = useReactFlow();

  // ----------------------- Custom hook for tasks (for CRUD) -----------------------
  const {
    tasks: allTasks, // Keep allTasks if needed elsewhere, e.g., for searching across all tasks
    isInitializing,
    handleCreateCard,
    handleUpdateCard,
    handleDeleteCard,
    getAllMyTasks,
  } = useTasks();

  // ---- Use useGroups for group selection and filtered tasks ----
  const {
    groups,
    selectedId: selectedGroupId,
    setSelectedId,
    tasks: groupTasks, // <-- Get the tasks specific to the selected group
    detailLoading: groupTasksLoading, // <-- Use loading state for group tasks
    fetchGroups, // Add this
  } = useGroups();

  // --- Effect to refresh the group list when the component mounts ---
  useEffect(() => {
    // Refresh groups when component mounts
    fetchGroups();
  }, [fetchGroups]);

  // --- Effect to select the first group if none is selected ---
  useEffect(() => {
    // If no group is selected AND groups are loaded AND there are groups available
    if (!selectedGroupId && !groupTasksLoading && groups.length > 0) {
      setSelectedId(groups[0].id); // Select the first group in the list
    }
    // If the currently selected group ID is no longer found in the list (e.g., deleted)
    // and there are other groups available, select the first one.
    else if (selectedGroupId && !groupTasksLoading && groups.length > 0 && !groups.find(g => g.id === selectedGroupId)) {
      setSelectedId(groups[0].id);
    }
    // If groups load and the list becomes empty, set selectedId to null
    else if (!groupTasksLoading && groups.length === 0) {
      setSelectedId(null);
    }
  }, [groups, selectedGroupId, groupTasksLoading, setSelectedId]);

  // ----------------------- Layout Initialization Effect -----------------------
  useEffect(() => {
    // Wait for container and group tasks to be loaded
    if (!containerRef.current || groupTasksLoading) return;

    const { offsetWidth: w, offsetHeight: h } = containerRef.current;

    // Use groupTasks directly
    const { nodes: n, edges: e } = buildNodesAndEdges(
      groupTasks, // <-- Use tasks provided by useGroups
      w / 2,
      h / 2,
    );
    setNodes(n);
    setEdges(e);

    // Optional: Fit view when group tasks change
    if (reactFlowInstance) {
      setTimeout(() => reactFlowInstance.fitView({ padding: 0.2, duration: 300 }), 100);
    }
  }, [
    setNodes,
    setEdges,
    groupTasks, // <-- Depend on the filtered tasks from useGroups
    groupTasksLoading, // <-- Depend on the loading state
    reactFlowInstance, // <-- Dependency for fitView
  ]);

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
      window.location.reload();

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

        const createdTask = await handleCreateCard(newTaskData, selectedGroupId);
        console.log('Created Task:', createdTask);

        const updatedParentData = {
          ...parentNode.data.task,
          childrenIds: [...(parentNode.data.task?.childrenIds || []), createdTask._id],
        };

        await handleUpdateCard(parentNode.id, updatedParentData, { silent: true });
        window.location.reload();
      }
    },
    [screenToFlowPosition, setEdges, setNodes, nodes, handleCreateCard, handleUpdateCard, selectedGroupId]
  );

  // ----------------------- Define Node and Edge Types -----------------------
  const edgeTypes = useMemo(() => ({ floating: FloatingEdge }), []);
  const nodeTypes = useMemo(() => ({ rounded: RoundedNode }), []);

  // ----------------------- Node Label Change -----------------------
  const onLabelChange = useCallback((id, newLabel) => {
    // First update the visual node appearance
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, label: newLabel } } : node
      )
    );

    // Then update the actual task data
    const taskToUpdate = groupTasks.find(task => task._id === id);
    if (taskToUpdate) {
      const updatedTask = {
        ...taskToUpdate,
        name: newLabel
      };

      // Use the silent option to avoid double-confirm
      handleUpdateCard(id, updatedTask);
    }
  }, [setNodes, groupTasks, handleUpdateCard]);
  // Add this function near your onLabelChange function
 // Add this function near your onLabelChange function
 const onCheckboxChange = useCallback(
  async (id, isChecked) => {
    // 1) Optimistically flip the checkbox in the UI
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                task: {
                  ...node.data.task,
                  progress: isChecked ? 100 : 0,
                },
              },
            }
          : node
      )
    );

    // 2) Find the _entire_ task object you already have in state
    const taskToUpdate = groupTasks.find((t) => t._id === id);
    if (!taskToUpdate) return;

    // 3) Merge in the new progress so normalizeTask() sees everything
    const fullUpdate = {
      ...taskToUpdate,
      isChecked: isChecked, 
      progress: isChecked ? 100 : 0,
    };

    try {
      // 4) Await the API call so it actually goes out
      await handleUpdateCard(id, fullUpdate, { silent: true });
    } catch (err) {

      setNodes((nds) =>
        nds.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  task: {
                    ...node.data.task,
                    progress: taskToUpdate.progress,
                  },
                },
              }
            : node
        )
      );
    }
  },
  [setNodes, groupTasks, handleUpdateCard]
);


  // ----------------------- Handling Node Click -----------------------
  const onNodeClick = useCallback(
    (event, node) => {
      // Try finding in groupTasks first, as that's what's displayed
      const foundTask =
        groupTasks.find((task) => task._id === node.id) ||
        // Fallback to allTasks if needed, or handle missing task case
        allTasks.find((task) => task._id === node.id) ||
        {
          _id: node.id,
          name: node.data.label,
          description: 'Task details not found in current context.',
        };
      setSelectedTask(foundTask);
    },
    [groupTasks, allTasks] // Depend on both if using fallback
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

  // Function for adding a child task from sidebar
  const handleAddChildFromSidebar = useCallback((parentTask) => {
    console.log("Add child triggered for parent:", parentTask);

    // 1. Define the prefill data
    const prefill = {
      parentIds: [parentTask._id] // Set the parent ID
      // You could add other defaults here if needed, e.g., type: 'Simple'
    };

    // 2. Navigate to Create Task page with prefill and current location state
    navigate(ROUTES.CREATE_TASK, { state: { prefill, from: location } });

    // Optional: Close the sidebar after initiating navigation
    // setSelectedTask(null);

  }, [navigate, location]); // Add navigate and location as dependencies

  // ----------------------- Component Render -----------------------
  return (
    <>
      <Paper
        elevation={0} // Keep elevation 0 if using custom shadow/border
        className="groupSelectorPaper" /* Use string class name */
      >
        {/* Use string class name */}
        <Typography variant="subtitle2" className="groupSelectorTitle">
          Groups
        </Typography>

        <List dense disablePadding>
          {groups.map(g => (
            <ListItemButton
              key={g.id}
              selected={selectedGroupId === g.id}
              onClick={() => setSelectedId(g.id)}
            >
              <ListItemText primary={g.name} />
            </ListItemButton>
          ))}
        </List>
      </Paper>
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
                onCheckboxChange: (id, isChecked) => onCheckboxChange(id, isChecked),
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
                allTasks={groupTasks}
                onSelectTask={onSelectTaskInFlow}
                onUpdateTask={handleUpdateCard}
                onDeleteTask={handleDeleteCard} // Pass delete handler
                onAddChild={handleAddChildFromSidebar} // This now navigates
                onNavigate={navigate} // Pass navigate function
                mode="sidebar"
                onClose={() => setSelectedTask(null)}
                isRoot={selectedTask?.isRoot}
              />
            )}
          </OutsideClickHandler>
        </div>
      </div>
      <QuickAddBar
        tasks={groupTasks} // Pass groupTasks for context
        selectedTask={selectedTask}
        onTaskCreated={async (newTask) => {
          await handleCreateCard(newTask, selectedGroupId);
          await getAllMyTasks();
          window.location.reload();
        }}
        onOpenFullModal={(prefill) => {
          // Handle opening the full modal with prefilled data
          console.log('Open full modal with prefill:', prefill);
        }}
        
      />
      <Backdrop
        sx={{ color: '#fff', zIndex: 9999 }}
        open={isInitializing}
      >
        <CircularProgress />
      </Backdrop>
    </>
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
