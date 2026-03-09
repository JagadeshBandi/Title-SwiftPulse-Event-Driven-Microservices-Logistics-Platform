import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Toolbar, Fade, Slide } from '@mui/material';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Background from './components/Background';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import CreateOrder from './pages/CreateOrder';
import Tracking from './pages/Tracking';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Background />
      {isAuthenticated && <Header />}
      {isAuthenticated && <Sidebar />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'transparent',
          minHeight: '100vh',
          ...(isAuthenticated && { ml: '240px', mt: '64px' }),
          transition: 'all 0.3s ease-in-out',
        }}
      >
        {isAuthenticated && <Toolbar />}
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={
            <Fade in timeout={500}>
              <Box>
                <Login />
              </Box>
            </Fade>
          } />
          <Route path="/register" element={
            <Fade in timeout={500}>
              <Box>
                <Register />
              </Box>
            </Fade>
          } />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Slide in timeout={300} direction="right">
                  <Box>
                    <Dashboard />
                  </Box>
                </Slide>
              </PrivateRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <PrivateRoute>
                <Slide in timeout={300} direction="right">
                  <Box>
                    <Analytics />
                  </Box>
                </Slide>
              </PrivateRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <Slide in timeout={300} direction="right">
                  <Box>
                    <Orders />
                  </Box>
                </Slide>
              </PrivateRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <PrivateRoute>
                <Slide in timeout={300} direction="left">
                  <Box>
                    <OrderDetail />
                  </Box>
                </Slide>
              </PrivateRoute>
            }
          />
          <Route
            path="/orders/create"
            element={
              <PrivateRoute>
                <Slide in timeout={300} direction="left">
                  <Box>
                    <CreateOrder />
                  </Box>
                </Slide>
              </PrivateRoute>
            }
          />
          <Route
            path="/tracking"
            element={
              <PrivateRoute>
                <Slide in timeout={300} direction="up">
                  <Box>
                    <Tracking />
                  </Box>
                </Slide>
              </PrivateRoute>
            }
          />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
