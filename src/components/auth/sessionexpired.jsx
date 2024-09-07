import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography } from '@mui/material';

const SessionExpired = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/');
  };

  return (
    <Container component="main" maxWidth="xs">
      <div style={{ marginTop: '100px', textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Session Expired
        </Typography>
        <Typography variant="body1">
          Your session has expired. Please log in again.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleLoginRedirect}
          style={{ marginTop: '20px' }}
        >
          Go to Login
        </Button>
      </div>
    </Container>
  );
};

export default SessionExpired;
