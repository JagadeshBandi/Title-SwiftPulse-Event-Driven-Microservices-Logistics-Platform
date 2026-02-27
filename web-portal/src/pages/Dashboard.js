import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
} from '@mui/material';
import {
  LocalShipping,
  CheckCircle,
  Schedule,
  TrendingUp,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const stats = [
  { title: 'Total Orders', value: '1,234', icon: <LocalShipping />, color: '#1976d2' },
  { title: 'Delivered', value: '1,045', icon: <CheckCircle />, color: '#2e7d32' },
  { title: 'In Transit', value: '156', icon: <Schedule />, color: '#ed6c02' },
  { title: 'Revenue', value: '$45,678', icon: <TrendingUp />, color: '#9c27b0' },
];

const chartData = [
  { name: 'Mon', orders: 65, deliveries: 58 },
  { name: 'Tue', orders: 59, deliveries: 55 },
  { name: 'Wed', orders: 80, deliveries: 72 },
  { name: 'Thu', orders: 81, deliveries: 76 },
  { name: 'Fri', orders: 96, deliveries: 89 },
  { name: 'Sat', orders: 55, deliveries: 48 },
  { name: 'Sun', orders: 40, deliveries: 35 },
];

const Dashboard = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      backgroundColor: stat.color,
                      borderRadius: '50%',
                      p: 1,
                      color: 'white',
                      mr: 2,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography color="textSecondary" gutterBottom>
                    {stat.title}
                  </Typography>
                </Box>
                <Typography variant="h4" component="div">
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Weekly Orders & Deliveries
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="orders" stroke="#1976d2" name="Orders" />
                <Line type="monotone" dataKey="deliveries" stroke="#2e7d32" name="Deliveries" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Order #1234 delivered to New York
              </Typography>
              <Typography variant="caption" color="textSecondary">
                2 minutes ago
              </Typography>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Order #1235 assigned to Driver John
              </Typography>
              <Typography variant="caption" color="textSecondary">
                5 minutes ago
              </Typography>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="textSecondary">
                New order created from Los Angeles
              </Typography>
              <Typography variant="caption" color="textSecondary">
                10 minutes ago
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
