import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  Fade,
  Slide,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  LocalShipping,
  Speed,
  Assessment,
  Security,
  TrendingUp,
  People,
  Map,
  Timeline,
  CheckCircle,
  ArrowForward,
  Star,
  Business,
  Support,
  IntegrationInstructions,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <Speed />,
      title: 'Real-Time Tracking',
      description: 'Track shipments in real-time with GPS precision and live updates.',
      color: '#667eea',
    },
    {
      icon: <Assessment />,
      title: 'Advanced Analytics',
      description: 'Comprehensive analytics and insights to optimize your logistics operations.',
      color: '#48bb78',
    },
    {
      icon: <Security />,
      title: 'Secure Platform',
      description: 'Enterprise-grade security with end-to-end encryption and compliance.',
      color: '#f56565',
    },
    {
      icon: <TrendingUp />,
      title: 'Scalable Solution',
      description: 'Scale from small business to enterprise with our flexible architecture.',
      color: '#ed8936',
    },
    {
      icon: <People />,
      title: 'Team Collaboration',
      description: 'Seamless collaboration tools for your entire logistics team.',
      color: '#9f7aea',
    },
    {
      icon: <IntegrationInstructions />,
      title: 'API Integration',
      description: 'Easy integration with existing systems via RESTful APIs and webhooks.',
      color: '#38b2ac',
    },
  ];

  const stats = [
    { value: '10M+', label: 'Packages Delivered', icon: <LocalShipping /> },
    { value: '500+', label: 'Cities Served', icon: <Map /> },
    { value: '99.9%', label: 'Uptime', icon: <CheckCircle /> },
    { value: '24/7', label: 'Support', icon: <Support /> },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CEO, Global Logistics Inc.',
      content: 'SwiftPulse transformed our operations. Efficiency increased by 40% in just 3 months.',
      rating: 5,
      avatar: 'SJ',
    },
    {
      name: 'Michael Chen',
      role: 'Operations Director, FastShip Co.',
      content: 'The real-time tracking and analytics features are game-changers for our business.',
      rating: 5,
      avatar: 'MC',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Supply Chain Manager, RetailPro',
      content: 'Best logistics platform we\'ve used. The integration capabilities are outstanding.',
      rating: 5,
      avatar: 'ER',
    },
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: '$99',
      period: '/month',
      features: [
        'Up to 1,000 shipments/month',
        'Basic analytics',
        'Email support',
        'API access',
        'Mobile app',
      ],
      color: '#667eea',
      popular: false,
    },
    {
      name: 'Professional',
      price: '$299',
      period: '/month',
      features: [
        'Up to 10,000 shipments/month',
        'Advanced analytics',
        'Priority support',
        'Custom integrations',
        'White-label options',
      ],
      color: '#48bb78',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      features: [
        'Unlimited shipments',
        'Custom analytics',
        'Dedicated support',
        'On-premise deployment',
        'Custom development',
      ],
      color: '#ed8936',
      popular: false,
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        />
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Slide in timeout={600} direction="right">
                <Box>
                  <Chip
                    label="Enterprise Logistics Platform"
                    sx={{
                      mb: 3,
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 800,
                      mb: 3,
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                    }}
                  >
                    Transform Your Logistics with Smart Technology
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 4,
                      opacity: 0.9,
                      lineHeight: 1.6,
                    }}
                  >
                    Streamline operations, reduce costs, and deliver exceptional customer experiences with our comprehensive logistics management platform.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/register')}
                      sx={{
                        py: 1.5,
                        px: 4,
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        },
                      }}
                    >
                      Start Free Trial
                      <ArrowForward sx={{ ml: 1 }} />
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate('/login')}
                      sx={{
                        py: 1.5,
                        px: 4,
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                        color: 'white',
                        '&:hover': {
                          borderColor: 'white',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        },
                      }}
                    >
                      Sign In
                    </Button>
                  </Box>
                </Box>
              </Slide>
            </Grid>
            <Grid item xs={12} md={6}>
              <Slide in timeout={800} direction="left">
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: { xs: '100%', md: '500px' },
                      height: { xs: '300px', md: '400px' },
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: 4,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    <LocalShipping sx={{ fontSize: 80, opacity: 0.8 }} />
                  </Box>
                </Box>
              </Slide>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={stat.label}>
              <Fade in timeout={800 + index * 100}>
                <Card sx={{ textAlign: 'center', py: 4 }}>
                  <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: 'primary.main', width: 60, height: 60 }}>
                    {stat.icon}
                  </Avatar>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {stat.label}
                  </Typography>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ py: 8, backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
              Powerful Features for Modern Logistics
            </Typography>
            <Typography variant="h6" color="textSecondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Everything you need to manage your logistics operations efficiently and scale your business.
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={feature.title}>
                <Fade in timeout={600 + index * 100}>
                  <Card
                    sx={{
                      height: '100%',
                      p: 3,
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      border: activeFeature === index ? '2px solid' : '1px solid',
                      borderColor: activeFeature === index ? feature.color : 'divider',
                      transform: activeFeature === index ? 'translateY(-8px)' : 'translateY(0)',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                      },
                    }}
                    onClick={() => setActiveFeature(index)}
                  >
                    <Avatar
                      sx={{
                        mx: 'auto',
                        mb: 2,
                        bgcolor: feature.color,
                        width: 60,
                        height: 60,
                      }}
                    >
                      {feature.icon}
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {feature.description}
                    </Typography>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
            Trusted by Industry Leaders
          </Typography>
          <Typography variant="h6" color="textSecondary">
            See what our customers have to say about SwiftPulse
          </Typography>
        </Box>
        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={testimonial.name}>
              <Fade in timeout={800 + index * 100}>
                <Card sx={{ height: '100%', p: 3 }}>
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} sx={{ color: '#ffc107', fontSize: 20 }} />
                    ))}
                  </Box>
                  <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic' }}>
                    "{testimonial.content}"
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      {testimonial.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Pricing Section */}
      <Box sx={{ py: 8, backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
              Simple, Transparent Pricing
            </Typography>
            <Typography variant="h6" color="textSecondary">
              Choose the plan that fits your business needs
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {pricingPlans.map((plan, index) => (
              <Grid item xs={12} md={4} key={plan.name}>
                <Fade in timeout={600 + index * 100}>
                  <Card
                    sx={{
                      height: '100%',
                      position: 'relative',
                      border: plan.popular ? '2px solid' : '1px solid',
                      borderColor: plan.popular ? plan.color : 'divider',
                      transform: plan.popular ? 'translateY(-8px)' : 'translateY(0)',
                      '&:hover': {
                        transform: plan.popular ? 'translateY(-12px)' : 'translateY(-4px)',
                        boxShadow: 4,
                      },
                    }}
                  >
                    {plan.popular && (
                      <Chip
                        label="Most Popular"
                        sx={{
                          position: 'absolute',
                          top: -12,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          backgroundColor: plan.color,
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    )}
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                        {plan.name}
                      </Typography>
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h3" sx={{ fontWeight: 700, color: plan.color }}>
                          {plan.price}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {plan.period}
                        </Typography>
                      </Box>
                      <Button
                        variant={plan.popular ? 'contained' : 'outlined'}
                        fullWidth
                        sx={{
                          mb: 3,
                          py: 1.5,
                          borderColor: plan.color,
                          color: plan.popular ? 'white' : plan.color,
                          backgroundColor: plan.popular ? plan.color : 'transparent',
                          '&:hover': {
                            backgroundColor: plan.popular ? `${plan.color}dd` : `${plan.color}10`,
                            borderColor: plan.color,
                          },
                        }}
                      >
                        Get Started
                      </Button>
                      <Box sx={{ textAlign: 'left' }}>
                        {plan.features.map((feature) => (
                          <Box key={feature} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CheckCircle sx={{ color: plan.color, mr: 1, fontSize: 20 }} />
                            <Typography variant="body2">{feature}</Typography>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 12,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
            Ready to Transform Your Logistics?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of companies that trust SwiftPulse for their logistics needs
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            sx={{
              py: 2,
              px: 6,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
              },
            }}
          >
            Start Your Free Trial
            <ArrowForward sx={{ ml: 1 }} />
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;
