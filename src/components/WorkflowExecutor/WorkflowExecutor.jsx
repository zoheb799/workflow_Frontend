import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  LinearProgress,
  Paper,
  IconButton,
  useTheme,CircularProgress,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
const WorkflowExecutor = () => {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState('');
  const [workflowNodes, setWorkflowNodes] = useState([]);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const fileInputRef = useRef(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        const response = await axios.get('/api/v1/workflows');
        setWorkflows(response.data);
      } catch (error) {
        toast.error('Error fetching workflows');
      }
    };

    fetchWorkflows();
  }, []);

  const handleWorkflowChange = async (e) => {
    const workflowId = e.target.value;
    setSelectedWorkflow(workflowId);

    if (workflowId) {
      try {
        const response = await axios.get(`/api/v1/workflows/${workflowId}`);
        setWorkflowNodes(response.data.nodes);
      } catch (error) {
        toast.error('Error fetching workflow data');
      }
    } else {
      setWorkflowNodes([]);
    }
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setFileName(uploadedFile.name);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const uploadedFile = e.dataTransfer.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setFileName(uploadedFile.name);
    }
  };

  const removeFile = () => {
    setFile(null);
    setFileName('');
    fileInputRef.current.value = '';
  };

  const handleExecuteWorkflow = async () => {
    if (!file || !selectedWorkflow) {
      toast.error('Please select a workflow and upload a file.');
      return;
    }
setLoading(true);
    setIsRunning(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('csvData', file);
      formData.append('workflowId', selectedWorkflow);
      formData.append('nodes', JSON.stringify(workflowNodes));

      const totalNodes = workflowNodes.length;
      const progressInterval = 100 / totalNodes;

      const updateProgress = () => {
        setProgress((prev) => Math.min(prev + progressInterval, 100));
      };

      await axios.post(`/api/v1/executeWorkflow/${selectedWorkflow}`, formData, {
        onUploadProgress: (progressEvent) => {
          updateProgress(progressEvent.loaded / progressEvent.total);
        },
      });

      setProgress(100);
      toast.success('Workflow executed and saved successfully');
    } catch (error) {
      setProgress(0);
      toast.error(`Error executing workflow: ${error.response ? error.response.data.message : error.message}`);
    } finally {
      setIsRunning(false);
      setLoading(false);

    }
  };

  return (
    <Container maxWidth="md" sx={{Margin: "20"}}>
      <Typography variant="h4" component="h2" gutterBottom >
        Run Workflow Screen
      </Typography>

      <Paper
        elevation={dragActive ? 6 : 1}
        sx={{
          p: 2,
          border: dragActive ? `2px dashed ${theme.palette.primary.main}` : '2px dashed #ccc',
          textAlign: 'center',
          mb: 3,
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CloudUploadIcon sx={{ fontSize: 50, color: dragActive ? theme.palette.primary.main : '#ccc' }} />
        <Typography variant="body1">Drag and drop Files Here to Upload</Typography>
        <Typography variant="body2">Or Select Files to Upload</Typography>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
        <Button variant="contained" onClick={() => fileInputRef.current.click()} sx={{ mt: 2 }}>
          Select File
        </Button>
        {fileName && (
          <Box display="flex" alignItems="center" justifyContent="center" mt={2}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              {fileName}
            </Typography>
            <IconButton onClick={removeFile} size="small" color="secondary">
              <DeleteIcon />
            </IconButton>
          </Box>
        )}
      </Paper>

      <FormControl fullWidth variant="outlined" sx={{ mb: 3 }}>
        <InputLabel id="workflow-select-label">Select Workflow</InputLabel>
        <Select
          labelId="workflow-select-label"
          id="workflowId"
          value={selectedWorkflow}
          onChange={handleWorkflowChange}
          label="Select Workflow"
          sx={{
            display: 'flex',
            justifyContent: 'center', // This centers the text within the MenuItem
            alignItems: 'center',
            height: '50px'
          }}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {workflows.map((workflow) => (
            <MenuItem key={workflow.workflowId} value={workflow.workflowId}>
              {workflow.workflowId}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {isRunning && (
        <Box sx={{ width: '100%', mb: 2 }}>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="body2" color="text.secondary" align="center">
            {`Progress: ${Math.round(progress)}%`}
          </Typography>
        </Box>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleExecuteWorkflow}
        disabled={isRunning}
        fullWidth
      >
        {loading ? <CircularProgress size={24} /> : 'Run Workflow'}
      </Button>

      <ToastContainer />
    </Container>
  );
};

export default WorkflowExecutor;
