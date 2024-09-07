import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { Typography, Paper, Tooltip } from '@mui/material';

const nodeList = [
  { id: 'filterData', type: 'Filter Data', label: 'Filter in the csv data'  },
  { id: 'wait', type: 'Wait', label: 'wait delay for 1 minute'  },
  { id: 'convertFormat', type: 'Convert Format', label: 'convert csv file to the json data'  },
  { id: 'sendPostRequest', type: 'Send POST Request', label: 'data to database'  }
];

const NodePanel = () => {
  const [isVisible, setIsVisible] = useState(false);

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const togglePanel = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className='w-full h-full bg-cyan-400 p-4' style={{ position: 'relative' }}>
      {/* Toggle Button */}
      <button onClick={togglePanel} style={{ fontSize: '24px', padding: '10px', marginTop: '36px' }}>
        {isVisible ? <CloseIcon /> : <AddIcon />}
      </button>

      {isVisible && (
        <aside style={{ padding: '10px', border: '1px solid #ddd', marginTop: '10px', height: '70vh' }}>
          <Typography variant="h6" gutterBottom>
            Drag these nodes to the canvas:
          </Typography>

          {nodeList.map((node) => (
            <Tooltip key={node.id} title={`Drag to add a ${node.label}`} placement="right" arrow>
              <Paper
                onDragStart={(event) => onDragStart(event, node.id)}
                draggable
                elevation={3}
                sx={{
                  marginBottom: '10px',
                  padding: '10px',
                  cursor: 'grab',
                  '&:hover': {
                    backgroundColor: 'grey.200',
                  },
                }}
              >
                {node.type}
              </Paper>
            </Tooltip>
          ))}
        </aside>
      )}
    </div>
  );
};

export default NodePanel;
