export const updateNodeSize = (nodes, nodeId, newSize) => {
    return nodes.map((node) =>
      node.id === nodeId ? { ...node, data: { ...node.data, size: newSize } } : node
    );
  };