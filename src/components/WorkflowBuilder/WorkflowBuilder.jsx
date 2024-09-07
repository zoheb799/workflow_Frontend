import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background
} from 'reactflow';
import 'reactflow/dist/style.css';
import { v4 as uuidv4 } from 'uuid';  // Import uuid
import { useNavigate } from 'react-router-dom';  // For navigation
import { getOrderedNodes } from '../../utils/utils';
import NodePanel from './Nodepanel';
import './style.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';  // Import Toastify
import 'react-toastify/dist/ReactToastify.css';  

import LogoutIcon from '@mui/icons-material/Logout';

const initialNodes = [];

let id = 0;
const getId = () => `dndnode_${id++}`;

const WorkflowBuilder = () => {
  const [isLoading, setIsLoading] = useState(false);
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [workflowId, setWorkflowId] = useState('');
  const navigate = useNavigate(); // Navigation hook

  // Generate 8-character Workflow ID on component mount
  useEffect(() => {
    const shortId = uuidv4().slice(0, 8);  // Generate and slice UUID
    setWorkflowId(shortId);  // Set Workflow ID
  }, []);

  // Background
  const [variant, setVariant] = useState('Lines');

  // Update Node
  const [editValue, setEditValue] = useState(nodes.data);
  const [nodeId, setNodeId] = useState();

  // Edit function
  const onNodeClick = (e, val) => {
    setEditValue(val.data.label);
    setNodeId(val.id);
  };

  // Handle Function
  const handleEdit = () => {
    const updatedNodes = nodes.map((item) => {
      if (item.id === nodeId) {
        item.data = {
          ...item.data,
          label: editValue,
        };
      }
      return item;
    });
    setNodes(updatedNodes);
    setEditValue('');
  };

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (!type) return;

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: type },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  // Handle Save Workflow and Navigate to WorkflowExecutionPage
  const handleSaveWorkflow = async () => {
    const nodesArray = nodes.map(node => node.data.label);
    const edgesArray = edges.map(edge => edge.id);
    if (nodesArray.length === 0) {
      toast.error('add nodes for the workflow');
      return;
    }

    if (edgesArray.length === 0) {
      toast.error('No connections between the nodes');
      return;
    }
  
    const payload = {
      workflowId,
      nodes: nodesArray
    };
  
    console.log('Sending payload:', payload);
  
    try {
      await axios.post('/api/v1/workflows', payload);
      console.log('Workflow saved successfully');
      navigate('/workflow-executor', { state: payload });
    } catch (error) {
      console.error('Error saving workflow:', error.response ? error.response.data : error.message);
    }
  };
  
  const HandleExisting =()=> {
    navigate('/workflow-executor');
  }
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await axios.post('/api/v1/logout'); // Assumes your logout route is set up as a POST request
      setIsLoading(false);
      navigate('/'); // Redirect to login page after successful logout
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="dndflow">
     <div className="bg-cyan-400 p-4">
  <div className="flex flex-col sm:flex-col w-full space-y-4 lg:space-y-0 lg:space-x-4">
    <div className="flex flex-col sm:flex-row lg:flex-col space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-0">
      <button onClick={handleLogout} className="relative p-3">
        <LogoutIcon />
      </button>
      <label className="self-center">Workflow ID: {workflowId}</label>
    </div>

    <div className="flex flex-col sm:flex-col sm:space-y-4 ">
      <button onClick={handleSaveWorkflow} className="btn">
        
        Save Workflow
      </button>
      <button onClick={HandleExisting} className="btn">
        Use previous Workflow
      </button>
    </div>
  </div>
</div>



  
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodeClick={(e, val) => onNodeClick(e, val)}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
          >
            <Background color="#99b3ec" variant={variant} />
            <Controls />
          </ReactFlow>
        </div>
        <div className=''>
        <NodePanel />
        </div>
        
      </ReactFlowProvider>
  
      <ToastContainer />
    </div>
  );
  
};

export default WorkflowBuilder;
