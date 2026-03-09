import React, { useState, useEffect } from 'react';
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  LocalShipping,
  Map,
  Assessment,
  Download,
  Refresh,
  FilterList,
  Timeline,
  PieChart,
  BarChart,
  Speed,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
} from 'recharts';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);

  const revenueData = [
    { month: 'Jan', revenue: 125000, orders: 1200, customers: 890 },
    { month: 'Feb', revenue: 132000, orders: 1350, customers: 920 },
    { month: 'Mar', revenue: 145000, orders: 1420, customers: 980 },
    { month: 'Apr', revenue: 138000, orders: 1380, customers: 1010 },
    { month: 'May', revenue: 156000, orders: 1520, customers: 1080 },
    { month: 'Jun', revenue: 167000, orders: 1650, customers: 1150 },
  ];

  const performanceMetrics = [
    { metric: 'On-Time Delivery', current: 94, target: 95, trend: 'up' },
    { metric: 'Customer Satisfaction', current: 4.6, target: 4.8, trend: 'up' },
    { metric: 'Route Efficiency', current: 82, target: 85, trend: 'down' },
    { metric: 'Cost per Delivery', current: 12.50, target: 11.00, trend: 'down' },
    { metric: 'Driver Utilization', current: 78, target: 80, trend: 'up' },
  ];

  const regionalData = [
    { region: 'North America', revenue: 450000, orders: 4200, growth: 12.5 },
    { region: 'Europe', revenue: 380000, orders: 3600, growth: 8.3 },
    { region: 'Asia Pacific', revenue: 520000, orders: 4800, growth: 18.7 },
    { region: 'Latin America', revenue: 180000, orders: 1700, growth: 15.2 },
    { region: 'Africa', revenue: 95000, orders: 900, growth: 22.1 },
  ];

  const fleetUtilization = [
    { type: 'Vans', available: 45, inUse: 38, maintenance: 7 },
    { type: 'Trucks', available: 28, inUse: 24, maintenance: 4 },
    { type: 'Motorcycles', available: 65, inUse: 58, maintenance: 7 },
    { type: 'Drones', available: 12, inUse: 8, maintenance: 4 },
  ];

  const customerSegments = [
    { segment: 'Enterprise', value: 45, color: '#667eea' },
    { segment: 'Medium Business', value: 30, color: '#48bb78' },
    { segment: 'Small Business', value: 20, color: '#ed8936' },
    { segment: 'Individual', value: 5, color: '#f56565' },
  ];

  const operationalEfficiency = [
    { subject: 'Delivery Speed', A: 85, fullMark: 100 },
    { subject: 'Route Optimization', A: 78, fullMark: 100 },
    { subject: 'Load Management', A: 92, fullMark: 100 },
    { subject: 'Fuel Efficiency', A: 73, fullMark: 100 },
    { subject: 'Customer Service', A: 88, fullMark: 100 },
    { subject: 'Technology Adoption', A: 95, fullMark: 100 },
  ];

  const topPerformers = [
    { name: 'Sarah Chen', role: 'Driver', score: 98, deliveries: 156, efficiency: 96 },
    { name: 'Michael Rodriguez', role: 'Operations Manager', score: 95, deliveries: 0, efficiency: 94 },
    { name: 'Emily Watson', role: 'Driver', score: 94, deliveries: 142, efficiency: 92 },
    { name: 'David Kim', role: 'Fleet Manager', score: 92, deliveries: 0, efficiency: 90 },
  ];

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
              Advanced Analytics
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Time Range</InputLabel>
                <Select
                  value={timeRange}
                  label="Time Range"
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <MenuItem value="24h">Last 24 Hours</MenuItem>
                  <MenuItem value="7d">Last 7 Days</MenuItem>
                  <MenuItem value="30d">Last 30 Days</MenuItem>
                  <MenuItem value="90d">Last 90 Days</MenuItem>
                  <MenuItem value="1y">Last Year</MenuItem>
                </Select>
              </FormControl>
              <Tooltip title="Refresh Data">
                <IconButton onClick={handleRefresh} disabled={loading}>
                  <Refresh />
                </IconButton>
              </Tooltip>
              <Tooltip title="Export Report">
                <IconButton>
                  <Download />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 4 }}>
            <Tab label="Overview" />
            <Tab label="Performance" />
            <Tab label="Regional" />
            <Tab label="Fleet" />
            <Tab label="People" />
          </Tabs>

          {tabValue === 0 && (
            <Grid container spacing={3}>
              {performanceMetrics.map((metric, index) => (
                <Grid item xs={12} sm={6} md={2.4} key={metric.metric}>
                  <Slide in timeout={600 + index * 100} direction="up">
                    <Card sx={{ 
                      height: '100%',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.8)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
                      }
                    }}>
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          {metric.trend === 'up' ? (
                            <TrendingUp sx={{ color: '#48bb78', mr: 1 }} />
                          ) : (
                            <TrendingDown sx={{ color: '#f56565', mr: 1 }} />
                          )}
                          <Typography variant="body2" color="textSecondary">
                            {metric.metric}
                          </Typography>
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                          {typeof metric.current === 'number' && metric.current < 10 
                            ? metric.current.toFixed(1) 
                            : metric.current}
                          {metric.metric.includes('Satisfaction') ? '/5' : 
                           metric.metric.includes('Cost') ? '' : '%'}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={(metric.current / metric.target) * 100}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: metric.trend === 'up' ? '#48bb78' : '#f56565',
                              borderRadius: 3,
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
                      Revenue & Growth Trends
                    </Typography>
                    <ResponsiveContainer width="100%" height={400}>
                      <ComposedChart data={revenueData}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#667eea" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)" />
                        <XAxis dataKey="month" stroke="#718096" />
                        <YAxis yAxisId="left" stroke="#718096" />
                        <YAxis yAxisId="right" orientation="right" stroke="#718096" />
                        <RechartsTooltip 
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid rgba(0, 0, 0, 0.1)',
                            borderRadius: 8,
                          }}
                        />
                        <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#667eea" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                        <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#48bb78" strokeWidth={2} />
                        <Line yAxisId="right" type="monotone" dataKey="customers" stroke="#ed8936" strokeWidth={2} />
                      </ComposedChart>
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
                      Customer Segments
                    </Typography>
                    <ResponsiveContainer width="100%" height={400}>
                      <RechartsPieChart>
                        <Pie
                          data={customerSegments}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {customerSegments.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                    <Box sx={{ mt: 2 }}>
                      {customerSegments.map((segment) => (
                        <Box key={segment.segment} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Box sx={{ width: 12, height: 12, backgroundColor: segment.color, mr: 2, borderRadius: 2 }} />
                          <Typography variant="body2">{segment.segment}: {segment.value}%</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                </Slide>
              </Grid>
            </Grid>
          )}

          {tabValue === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Slide in timeout={700} direction="up">
                  <Paper sx={{ 
                    p: 3, 
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.8)',
                  }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      Operational Efficiency Radar
                    </Typography>
                    <ResponsiveContainer width="100%" height={400}>
                      <RadarChart data={operationalEfficiency}>
                        <PolarGrid stroke="rgba(0, 0, 0, 0.1)" />
                        <PolarAngleAxis dataKey="subject" stroke="#718096" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#718096" />
                        <Radar name="Current" dataKey="A" stroke="#667eea" fill="#667eea" fillOpacity={0.6} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </Paper>
                </Slide>
              </Grid>

              <Grid item xs={12} md={6}>
                <Slide in timeout={800} direction="up">
                  <Paper sx={{ 
                    p: 3, 
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.8)',
                  }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      Performance Benchmarks
                    </Typography>
                    <ResponsiveContainer width="100%" height={400}>
                      <RechartsBarChart data={performanceMetrics}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)" />
                        <XAxis dataKey="metric" angle={-45} textAnchor="end" height={100} stroke="#718096" />
                        <YAxis stroke="#718096" />
                        <RechartsTooltip 
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid rgba(0, 0, 0, 0.1)',
                            borderRadius: 8,
                          }}
                        />
                        <Bar dataKey="current" fill="#667eea" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="target" fill="#48bb78" radius={[8, 8, 0, 0]} />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </Paper>
                </Slide>
              </Grid>
            </Grid>
          )}

          {tabValue === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Slide in timeout={700} direction="up">
                  <Paper sx={{ 
                    p: 3, 
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.8)',
                  }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      Regional Performance Analysis
                    </Typography>
                    <ResponsiveContainer width="100%" height={500}>
                      <RechartsBarChart data={regionalData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)" />
                        <XAxis dataKey="region" stroke="#718096" />
                        <YAxis yAxisId="left" stroke="#718096" />
                        <YAxis yAxisId="right" orientation="right" stroke="#718096" />
                        <RechartsTooltip 
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid rgba(0, 0, 0, 0.1)',
                            borderRadius: 8,
                          }}
                        />
                        <Bar yAxisId="left" dataKey="revenue" fill="#667eea" radius={[8, 8, 0, 0]} />
                        <Bar yAxisId="left" dataKey="orders" fill="#48bb78" radius={[8, 8, 0, 0]} />
                        <Line yAxisId="right" type="monotone" dataKey="growth" stroke="#ed8936" strokeWidth={3} />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </Paper>
                </Slide>
              </Grid>
            </Grid>
          )}

          {tabValue === 3 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Slide in timeout={700} direction="up">
                  <Paper sx={{ 
                    p: 3, 
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.8)',
                  }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      Fleet Utilization Overview
                    </Typography>
                    <ResponsiveContainer width="100%" height={400}>
                      <RechartsBarChart data={fleetUtilization}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)" />
                        <XAxis dataKey="type" stroke="#718096" />
                        <YAxis stroke="#718096" />
                        <RechartsTooltip 
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid rgba(0, 0, 0, 0.1)',
                            borderRadius: 8,
                          }}
                        />
                        <Bar dataKey="available" stackId="a" fill="#48bb78" />
                        <Bar dataKey="inUse" stackId="a" fill="#667eea" />
                        <Bar dataKey="maintenance" stackId="a" fill="#f56565" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </Paper>
                </Slide>
              </Grid>

              <Grid item xs={12} md={4}>
                <Slide in timeout={800} direction="up">
                  <Paper sx={{ 
                    p: 3, 
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.8)',
                  }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      Fleet Status Summary
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      {fleetUtilization.map((vehicle) => (
                        <Box key={vehicle.type} sx={{ mb: 3 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                            {vehicle.type}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="caption" color="textSecondary">
                              In Use: {vehicle.inUse}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              Available: {vehicle.available}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              Maintenance: {vehicle.maintenance}
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={(vehicle.inUse / (vehicle.available + vehicle.inUse + vehicle.maintenance)) * 100}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: 'rgba(0, 0, 0, 0.1)',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: '#667eea',
                                borderRadius: 4,
                              }
                            }}
                          />
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                </Slide>
              </Grid>
            </Grid>
          )}

          {tabValue === 4 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Slide in timeout={700} direction="up">
                  <Paper sx={{ 
                    p: 3, 
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.8)',
                  }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      Top Performers
                    </Typography>
                    <Grid container spacing={3}>
                      {topPerformers.map((performer, index) => (
                        <Grid item xs={12} sm={6} md={3} key={performer.name}>
                          <Fade in timeout={800 + index * 100}>
                            <Card sx={{ 
                              textAlign: 'center',
                              p: 2,
                              background: 'rgba(255, 255, 255, 0.8)',
                              border: '1px solid rgba(255, 255, 255, 0.6)',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                              }
                            }}>
                              <Avatar sx={{ 
                                mx: 'auto', 
                                mb: 2, 
                                bgcolor: '#667eea',
                                width: 60,
                                height: 60,
                              }}>
                                {performer.name.split(' ').map(n => n[0]).join('')}
                              </Avatar>
                              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                {performer.name}
                              </Typography>
                              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                                {performer.role}
                              </Typography>
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                                  {performer.score}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  Performance Score
                                </Typography>
                              </Box>
                              {performer.deliveries > 0 && (
                                <Box sx={{ mb: 1 }}>
                                  <Typography variant="body2">
                                    {performer.deliveries} deliveries
                                  </Typography>
                                </Box>
                              )}
                              <LinearProgress
                                variant="determinate"
                                value={performer.efficiency}
                                sx={{
                                  height: 6,
                                  borderRadius: 3,
                                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: '#667eea',
                                    borderRadius: 3,
                                  }
                                }}
                              />
                              <Typography variant="caption" color="textSecondary">
                                {performer.efficiency}% efficiency
                              </Typography>
                            </Card>
                          </Fade>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                </Slide>
              </Grid>
            </Grid>
          )}
        </Box>
      </Fade>
    </Container>
  );
};

export default Analytics;
