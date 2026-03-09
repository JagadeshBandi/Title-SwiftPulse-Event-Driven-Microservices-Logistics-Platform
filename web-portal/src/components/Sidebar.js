import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
  Typography,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  LocalShipping as OrdersIcon,
  LocationOn as TrackingIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  TrendingUp,
  Business,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Analytics', icon: <TrendingUp />, path: '/analytics' },
  { text: 'Orders', icon: <OrdersIcon />, path: '/orders' },
  { text: 'Tracking', icon: <TrackingIcon />, path: '/tracking' },
  { text: 'Reports', icon: <ReportsIcon />, path: '/reports' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Avatar 
          sx={{ 
            width: 60, 
            height: 60, 
            mx: 'auto', 
            mb: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontSize: '1.5rem',
            fontWeight: 700,
          }}
        >
          {user?.firstName?.[0] || 'U'}
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3748' }}>
          {user?.firstName} {user?.lastName}
        </Typography>
        <Typography variant="body2" sx={{ color: '#718096', mb: 2 }}>
          {user?.email}
        </Typography>
        <Chip
          label={user?.role || 'User'}
          size="small"
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#ffffff',
            fontWeight: 600,
          }}
        />
      </Box>
      <Divider sx={{ mx: 2, my: 2 }} />
      <List sx={{ px: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                py: 1.5,
                px: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                  transform: 'translateX(4px)',
                },
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
                  borderLeft: '4px solid #667eea',
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? '#667eea' : '#718096',
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontWeight: location.pathname === item.path ? 600 : 500,
                    color: location.pathname === item.path ? '#2d3748' : '#718096',
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <Business sx={{ color: '#667eea', mr: 1 }} />
          <Typography variant="body2" sx={{ color: '#718096', fontWeight: 600 }}>
            SwiftPulse Enterprise
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: '#a0aec0' }}>
          Logistics Management Platform
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
