import React, { useCallback, useState, useMemo, useEffect, useRef } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  ReactFlowProvider,
  MarkerType,
  useReactFlow,           // 1) Import useReactFlow
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import initialTestModel from '../Data/MindMapping/initialTestModel.json';
import FloatingEdge from '../Components/MindMapping/Edges/FloatingEdge';
import FloatingConnectionLine from '../Components/MindMapping/Edges/FloatingConnectionLine';
import RoundedNode from '../Components/MindMapping/Nodes/MyRoundedNode';
import { buildNodesAndEdges } from '../Helpers/Mindmapping/Edges/layoutHelpers';

let nodeId = 1; // Keeps track of node IDs
const getId = () => `node-${nodeId++}`;

function MindMappingInner() {
  const containerRef = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  // 2) Destructure `project` from useReactFlow.
  //    (It might be called `screenToFlowPosition` depending on your version.)
  const { screenToFlowPosition  } = useReactFlow();

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;

      const containerCenterX = containerWidth / 2;
      const containerCenterY = containerHeight / 2;

      const { nodes: layoutNodes, edges: layoutEdges } = buildNodesAndEdges(
        initialTestModel,
        containerCenterX,
        containerCenterY
      );
      setNodes(layoutNodes);
      setEdges(layoutEdges);
    }
  }, [setEdges, setNodes]);

  const onConnect = useCallback((params) => {
    const parentNode = nodes.find((node) => node.id === params.source);
    if (!parentNode) return;
    const edgeThickness = 20;
    setEdges((eds) =>
      
      addEdge(
        {
          ...params,
          type: 'floating',
          markerEnd: { type: MarkerType.ArrowClosed },
          style: { stroke: '#000',strokeWidth: edgeThickness },
        },
        eds
      )
    );
  }, [setEdges, nodes]);

  // 3) Use the `project` function to place the node at the correct position
  //    in the flow’s coordinate system.
  const onConnectEnd = useCallback(
    (event, connectionState) => {
      if (!connectionState.isValid) {
        const parentNode = nodes.find((node) => node.id === connectionState.fromNode.id);
        if (!parentNode) return;
  
        // Calculate the size of the new node based on the parent's size
        const childSize = (parentNode.data?.size || 50) * 0.4; // Match size factor for children
  
        const id = getId();

        // get the screen position from the mouse/touch event
        const { clientX, clientY } =
          'changedTouches' in event ? event.changedTouches[0] : event;

        // convert from screen coords to flow coords
        const flowPosition = screenToFlowPosition ({ x: clientX, y: clientY });

        setNodes((nds) => [
          ...nds,
          {
            id,
            position: flowPosition,        // 4) use the flow position
            data: { label: `Node ${id}`, size: childSize }, // same size as siblings
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
            style: { stroke: '#000',strokeWidth: edgeThickness },
          },
        ]);
      }
    },
    [screenToFlowPosition , setEdges, setNodes, nodes]
  );

  const edgeTypes = useMemo(() => ({ floating: FloatingEdge }), []);
  const nodeTypes = useMemo(() => ({ rounded: RoundedNode }), []);

  const highlightSelectedNode = useCallback(() => {
    setNodes((nds) =>
      nds.map((node) => {
        const size = node.data?.size || 50;
        const shadowSpread = size / 100;
        const shadowBlur = size / 20;
        return {
          ...node,
          style: {
            ...node.style,
            boxShadow:
              node.id === selectedNodeId
                ? `0 0 ${shadowBlur}px ${shadowSpread}px rgba(0, 0, 255, 0.8)`
                : `0 4px 6px rgba(0,0,0,0.1)`,
            borderRadius: '50%',
          },
        };
      })
    );
  }, [selectedNodeId, setNodes]);

  const onNodeClick = useCallback((event, node) => {
    setSelectedNodeId(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  useEffect(() => {
    highlightSelectedNode();
  }, [selectedNodeId, highlightSelectedNode]);

  const onLabelChange = (id, newLabel) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, label: newLabel } } : node
      )
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
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionLineComponent={FloatingConnectionLine}
        minZoom={0.1}
        maxZoom={50}
      />
      <Controls />
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
