import React, { useEffect, useState } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const LinearProgressWithLabel = ({ value }) => {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" value={value} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(value)}%`}</Typography>
      </Box>
    </Box>
  );
};

const ProgressBar = ({ steps = [], workflowId }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!workflowId) return; // Exit if no workflowId

    const animateProgress = () => {
      if (currentStep < steps.length) {
        setTimeout(() => {
          setProgress((prevProgress) => prevProgress + (100 / steps.length));
          setCurrentStep((prevStep) => prevStep + 1);
        }, 1000); // Adjust the interval as needed
      }
    };

    animateProgress();
  }, [currentStep, steps.length, workflowId]);

  useEffect(() => {
    if (progress >= 100) {
      // Logic to execute when the progress reaches 100%
      console.log('Workflow execution complete');
    }
  }, [progress]);

  return (
    <div style={{ marginTop: '20px' }}>
      <h2>Progress: {`Step ${currentStep} of ${steps.length}`}</h2>
      <LinearProgressWithLabel value={progress} />
    </div>
  );
};

export default ProgressBar;
