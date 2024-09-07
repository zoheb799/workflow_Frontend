
export const getOrderedNodes = (nodes, edges) => {
    const nodeMap = new Map(nodes.map(node => [node.id, node.data.label]));
    const nodeSet = new Set(nodeMap.keys());
    
    // Create a map to store the incoming edges for each node
    const incomingEdges = new Map();
    nodeSet.forEach(nodeId => incomingEdges.set(nodeId, []));
    
    edges.forEach(edge => {
      if (incomingEdges.has(edge.target)) {
        incomingEdges.get(edge.target).push(edge.source);
      }
    });
    
    // Use a queue to process nodes with no incoming edges
    const queue = [];
    const result = [];
    nodeSet.forEach(nodeId => {
      if (incomingEdges.get(nodeId).length === 0) {
        queue.push(nodeId);
      }
    });
    
    while (queue.length > 0) {
      const nodeId = queue.shift();
      result.push(nodeMap.get(nodeId));
      
      edges.forEach(edge => {
        if (edge.source === nodeId) {
          const target = edge.target;
          incomingEdges.get(target).splice(incomingEdges.get(target).indexOf(nodeId), 1);
          if (incomingEdges.get(target).length === 0) {
            queue.push(target);
          }
        }
      });
    }
    
    return result;
  };
  