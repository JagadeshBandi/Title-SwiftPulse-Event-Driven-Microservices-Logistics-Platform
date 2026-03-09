import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Chip,
  LinearProgress,
  Fade,
  Slide,
} from '@mui/material';
import {
  LocalShipping,
  CheckCircle,
  Schedule,
  TrendingUp,
  People,
  Map,
  Assessment,
  Notifications,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from 'recharts';

const stats = [
  { 
    title: 'Total Orders', 
    value: '1,234', 
    change: '+12.5%',
    icon: <LocalShipping />, 
    color: '#667eea',
    trend: 'up'
  },
  { 
    title: 'Delivered', 
    value: '1,045', 
    change: '+8.2%',
    icon: <CheckCircle />, 
    color: '#48bb78',
    trend: 'up'
  },
  { 
    title: 'In Transit', 
    value: '156', 
    change: '-2.1%',
    icon: <Schedule />, 
    color: '#ed8936',
    trend: 'down'
  },
  { 
    title: 'Revenue', 
    value: '$45,678', 
    change: '+15.3%',
    icon: <TrendingUp />, 
    color: '#f56565',
    trend: 'up'
  },
];

const chartData = [
  { name: 'Mon', orders: 65, deliveries: 58, revenue: 4200 },
  { name: 'Tue', orders: 59, deliveries: 55, revenue: 3800 },
  { name: 'Wed', orders: 80, deliveries: 72, revenue: 5200 },
  { name: 'Thu', orders: 81, deliveries: 76, revenue: 5400 },
  { name: 'Fri', orders: 96, deliveries: 89, revenue: 6200 },
  { name: 'Sat', orders: 55, deliveries: 48, revenue: 3500 },
  { name: 'Sun', orders: 40, deliveries: 35, revenue: 2800 },
];

const performanceData = [
  { subject: 'On-Time Delivery', A: 85, fullMark: 100 },
  { subject: 'Customer Satisfaction', A: 92, fullMark: 100 },
  { subject: 'Route Efficiency', A: 78, fullMark: 100 },
  { subject: 'Driver Performance', A: 88, fullMark: 100 },
  { subject: 'Cost Management', A: 76, fullMark: 100 },
];

const recentActivity = [
  { id: 1, action: 'Order #1234 delivered to New York', time: '2 minutes ago', type: 'success' },
  { id: 2, action: 'Order #1235 assigned to Driver John', time: '5 minutes ago', type: 'info' },
  { id: 3, action: 'New order created from Los Angeles', time: '10 minutes ago', type: 'primary' },
  { id: 4, action: 'Payment received for Order #1232', time: '15 minutes ago', type: 'success' },
  { id: 5, action: 'Route optimized for delivery batch #45', time: '20 minutes ago', type: 'warning' },
];

const topDrivers = [
  { name: 'John Smith', deliveries: 45, rating: 4.8, efficiency: 92 },
  { name: 'Sarah Johnson', deliveries: 42, rating: 4.9, efficiency: 88 },
  { name: 'Mike Wilson', deliveries: 38, rating: 4.7, efficiency: 85 },
  { name: 'Emily Davis', deliveries: 36, rating: 4.9, efficiency: 90 },
];

const Dashboard = () => {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Fade in timeout={800}>
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 800,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Analytics Dashboard
            </Typography>
            <Chip
              label="Live Data"
              color="success"
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
          </Box>
          
          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={stat.title}>
                <Slide in timeout={600 + index * 100} direction="up">
                  <Card sx={{ 
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.8)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                    }
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          sx={{
                            backgroundColor: stat.color,
                            width: 56,
                            height: 56,
                            mr: 2,
                            boxShadow: `0 4px 20px ${stat.color}40`,
                          }}
                        >
                          {stat.icon}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body2" color="textSecondary" gutterBottom>
                            {stat.title}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                              {stat.value}
                            </Typography>
                            <Chip
                              label={stat.change}
                              size="small"
                              color={stat.trend === 'up' ? 'success' : 'error'}
                              sx={{ ml: 1, fontWeight: 600 }}
                            />
                          </Box>
                        </Box>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={Math.random() * 30 + 70}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'rgba(0, 0, 0, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: stat.color,
                            borderRadius: 4,
                          }
                        }}
                      />
                    </CardContent>
                  </Card>
                </Slide>
              </Grid>
            ))}

            <Grid item xs={12} md={8}>
              <Slide in timeout={800} direction="right">
                <Paper sx={{ 
                  p: 3, 
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Weekly Performance Overview
                  </Typography>
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#667eea" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorDeliveries" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#48bb78" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#48bb78" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)" />
                      <XAxis dataKey="name" stroke="#718096" />
                      <YAxis stroke="#718096" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid rgba(0, 0, 0, 0.1)',
                          borderRadius: 8,
                        }}
                      />
                      <Area type="monotone" dataKey="orders" stroke="#667eea" fillOpacity={1} fill="url(#colorOrders)" strokeWidth={2} />
                      <Area type="monotone" dataKey="deliveries" stroke="#48bb78" fillOpacity={1} fill="url(#colorDeliveries)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </Paper>
              </Slide>
            </Grid>

            <Grid item xs={12} md={4}>
              <Slide in timeout={900} direction="left">
                <Paper sx={{ 
                  p: 3, 
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Performance Metrics
                  </Typography>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)" />
                      <XAxis dataKey="subject" stroke="#718096" />
                      <YAxis stroke="#718096" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid rgba(0, 0, 0, 0.1)',
                          borderRadius: 8,
                        }}
                      />
                      <Bar dataKey="A" fill="#667eea" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Slide>
            </Grid>

            <Grid item xs={12} md={6}>
              <Slide in timeout={1000} direction="up">
                <Paper sx={{ 
                  p: 3, 
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                    Recent Activity
                  </Typography>
                  <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                    {recentActivity.map((activity, index) => (
                      <Fade in timeout={1200 + index * 100} key={activity.id}>
                        <Box sx={{ mb: 2, p: 2, borderRadius: 2, backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {activity.action}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {activity.time}
                          </Typography>
                        </Box>
                      </Fade>
                    ))}
                  </Box>
                </Paper>
              </Slide>
            </Grid>

            <Grid item xs={12} md={6}>
              <Slide in timeout={1100} direction="up">
                <Paper sx={{ 
                  p: 3, 
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                    Top Drivers This Week
                  </Typography>
                  <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                    {topDrivers.map((driver, index) => (
                      <Fade in timeout={1300 + index * 100} key={driver.name}>
                        <Box sx={{ mb: 2, p: 2, borderRadius: 2, backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Avatar sx={{ mr: 2, bgcolor: '#667eea' }}>
                              {driver.name.split(' ').map(n => n[0]).join('')}
                            </Avatar>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {driver.name}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {driver.deliveries} deliveries
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {driver.rating} stars
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {driver.efficiency}% efficiency
                              </Typography>
                            </Box>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={driver.efficiency}
                            sx={{
                              height: 4,
                              borderRadius: 2,
                              backgroundColor: 'rgba(0, 0, 0, 0.1)',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: '#667eea',
                                borderRadius: 2,
                              }
                            }}
                          />
                        </Box>
                      </Fade>
                    ))}
                  </Box>
                </Paper>
              </Slide>
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </Container>
  );
};

export default Dashboard;
