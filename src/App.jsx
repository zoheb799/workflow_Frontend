import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import WorkflowBuilder from './components/WorkflowBuilder/WorkflowBuilder';
import WorkflowExecutor from './components/WorkflowExecutor/WorkflowExecutor';

const App = () => {
  return (
    <div style={{width:'100%', height:'100vh'}}>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />


        <Route path="/register" element={<Register />} />
        
        <Route path="/WorkFlowBuilder" element={<WorkflowBuilder />} />

        <Route path="/workflow-executor" element={<WorkflowExecutor />} />
      </Routes>
    </Router>
    </div>
  );
};

export default App;
