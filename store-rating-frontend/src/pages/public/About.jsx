import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Paper,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from '@mui/lab';
import {
  Star as StarIcon,
  People as PeopleIcon,
  Store as StoreIcon,
  TrendingUp as TrendingIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Support as SupportIcon,
  CheckCircle as CheckIcon,
  Launch as LaunchIcon,
  Code as CodeIcon,
  Design as DesignIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Import our custom components
import FadeInUp from '../../components/animations/FadeInUp';
import SlideIn from '../../components/animations/SlideIn';
import Bounce from '../../components/animations/Bounce';
import CountUp from '../../components/animations/CountUp';
import ParticleBackground from '../../components/animations/ParticleBackground';

const About = () => {
  const navigate = useNavigate();

  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "/api/placeholder/150/150",
      description: "10+ years in tech industry, passionate about connecting communities with local businesses."
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image: "/api/placeholder/150/150", 
      description: "Full-stack developer with expertise in scalable web applications and user experience."
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Design",
      image: "/api/placeholder/150/150",
      description: "UI/UX designer focused on creating intuitive and beautiful user experiences."
    },
    {
      name: "David Kim",
      role: "Data Scientist",
      image: "/api/placeholder/150/150",
      description: "Analytics expert helping businesses understand customer feedback and trends."
    }
  ];

  const milestones = [
    {
      year: "2021",
      title: "Company Founded",
      description: "Started with a vision to revolutionize local business discovery",
      icon: <LaunchIcon />
    },
    {
      year: "2022", 
      title: "1,000 Stores",
      description: "Reached our first milestone of 1,000 registered stores",
      icon: <StoreIcon />
    },
    {
      year: "2023",
      title: "50,000 Users",
      description: "Growing community of engaged users sharing reviews",
      icon: <PeopleIcon />
    },
    {
      year: "2024",
      title: "AI Integration",
      description: "Launched smart recommendation engine for personalized experiences",
      icon: <AnalyticsIcon />
    }
  ];

  const features = [
    {
      icon: <SecurityIcon />,
      title: "Secure & Trusted",
      description: "Your data is protected with enterprise-grade security measures."
    },
    {
      icon: <SpeedIcon />,
      title: "Fast & Reliable",
      description: "Lightning-fast performance with 99.9% uptime guarantee."
    },
    {
      icon: <SupportIcon />,
      title: "24/7 Support",
      description: "Our dedicated support team is always here to help you."
    }
  ];

  const values = [
    "Transparency in all business reviews and ratings",
    "Community-driven approach to local business discovery", 
    "Fair and unbiased platform for all stakeholders",
    "Continuous innovation in user experience",
    "Support for local businesses and entrepreneurs",
    "Data privacy and user security as top priorities"
  ];

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          overflow: 'hidden'
        }}
      >
        <ParticleBackground
          variant="floating"
          particleCount={60}
          colors={['#ffffff', '#f093fb', '#4facfe']}
          interactive={true}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <FadeInUp delay={0.2}>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    fontWeight: 800,
                    mb: 3,
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                >
                  About Our Story
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ 
                    mb: 4, 
                    lineHeight: 1.6,
                    opacity: 0.95
                  }}
                >
                  We're building the future of local business discovery through 
                  authentic community reviews and ratings.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    backgroundColor: 'white',
                    color: '#667eea',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                    '&:hover': {
                      backgroundColor: '#f8fafc',
                      boxShadow: '0 12px 35px rgba(0,0,0,0.3)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  Join Our Community
                </Button>
              </FadeInUp>
            </Grid>

            <Grid item xs={12} md={6}>
              <SlideIn direction="right" delay={0.3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Grid container spacing={3}>
                    <Grid item xs={4}>
                      <Box>
                        <Typography
                          variant="h3"
                          sx={{ fontWeight: 800, mb: 1 }}
                        >
                          <CountUp end={15000} duration={2.5} />
                          +
                        </Typography>
                        <Typography variant="body1">
                          Stores Listed
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box>
                        <Typography
                          variant="h3"
                          sx={{ fontWeight: 800, mb: 1 }}
                        >
                          <CountUp end={250} duration={2.5} />
                          K+
                        </Typography>
                        <Typography variant="body1">
                          Reviews
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box>
                        <Typography
                          variant="h3"
                          sx={{ fontWeight: 800, mb: 1 }}
                        >
                          <CountUp end={50} duration={2.5} />
                          K+
                        </Typography>
                        <Typography variant="body1">
                          Active Users
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </SlideIn>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Mission Section */}
      <Box sx={{ py: 10, backgroundColor: '#f8fafc' }}>
        <Container maxWidth="lg">
          <FadeInUp>
            <Typography
              variant="h2"
              align="center"
              sx={{
                fontWeight: 700,
                mb: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}
            >
              Our Mission
            </Typography>
            <Typography
              variant="h6"
              align="center"
              color="text.secondary"
              sx={{ mb: 6, maxWidth: 800, mx: 'auto', lineHeight: 1.7 }}
            >
              To empower communities by connecting them with the best local businesses 
              through authentic reviews and transparent ratings. We believe every business 
              deserves a fair chance to showcase their quality, and every customer deserves 
              honest insights to make informed decisions.
            </Typography>
          </FadeInUp>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <FadeInUp delay={index * 0.2}>
                  <Card
                    sx={{
                      height: '100%',
                      textAlign: 'center',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 4,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#667eea',
                        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.2)',
                        transform: 'translateY(-8px)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Avatar
                        sx={{
                          width: 80,
                          height: 80,
                          backgroundColor: '#667eea15',
                          color: '#667eea',
                          margin: '0 auto',
                          mb: 3,
                          '& .MuiSvgIcon-root': {
                            fontSize: '2rem'
                          }
                        }}
                      >
                        {feature.icon}
                      </Avatar>
                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </FadeInUp>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Team Section */}
      <Box sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <FadeInUp>
            <Typography
              variant="h2"
              align="center"
              sx={{
                fontWeight: 700,
                mb: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}
            >
              Meet Our Team
            </Typography>
            <Typography
              variant="h6"
              align="center"
              color="text.secondary"
              sx={{ mb: 6 }}
            >
              The passionate individuals behind our platform
            </Typography>
          </FadeInUp>

          <Grid container spacing={4}>
            {teamMembers.map((member, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <FadeInUp delay={index * 0.1}>
                  <Card
                    sx={{
                      height: '100%',
                      textAlign: 'center',
                      borderRadius: 4,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                        transform: 'translateY(-8px)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Avatar
                        src={member.image}
                        alt={member.name}
                        sx={{
                          width: 120,
                          height: 120,
                          margin: '0 auto',
                          mb: 2,
                          border: '4px solid #667eea15'
                        }}
                      />
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        {member.name}
                      </Typography>
                      <Chip
                        label={member.role}
                        sx={{
                          backgroundColor: '#667eea15',
                          color: '#667eea',
                          fontWeight: 600,
                          mb: 2
                        }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ lineHeight: 1.6 }}
                      >
                        {member.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </FadeInUp>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Timeline Section */}
      <Box sx={{ py: 10, backgroundColor: '#f8fafc' }}>
        <Container maxWidth="lg">
          <FadeInUp>
            <Typography
              variant="h2"
              align="center"
              sx={{
                fontWeight: 700,
                mb: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}
            >
              Our Journey
            </Typography>
            <Typography
              variant="h6"
              align="center"
              color="text.secondary"
              sx={{ mb: 6 }}
            >
              Key milestones in our growth story
            </Typography>
          </FadeInUp>

          <SlideIn direction="up" delay={0.3}>
            <Timeline position="alternate">
              {milestones.map((milestone, index) => (
                <TimelineItem key={index}>
                  <TimelineSeparator>
                    <TimelineDot
                      sx={{
                        backgroundColor: '#667eea',
                        width: 60,
                        height: 60,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                      }}
                    >
                      {milestone.icon}
                    </TimelineDot>
                    {index < milestones.length - 1 && (
                      <TimelineConnector sx={{ backgroundColor: '#667eea' }} />
                    )}
                  </TimelineSeparator>
                  <TimelineContent sx={{ py: '12px', px: 2 }}>
                    <Paper
                      elevation={3}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        textAlign: index % 2 === 0 ? 'right' : 'left'
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: '#667eea',
                          mb: 1
                        }}
                      >
                        {milestone.year}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                        {milestone.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {milestone.description}
                      </Typography>
                    </Paper>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </SlideIn>
        </Container>
      </Box>

      {/* Values Section */}
      <Box sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <FadeInUp>
            <Typography
              variant="h2"
              align="center"
              sx={{
                fontWeight: 700,
                mb: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}
            >
              Our Values
            </Typography>
            <Typography
              variant="h6"
              align="center"
              color="text.secondary"
              sx={{ mb: 6 }}
            >
              The principles that guide everything we do
            </Typography>
          </FadeInUp>

          <SlideIn direction="up" delay={0.3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    height: '100%',
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <List>
                    {values.map((value, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon>
                          <CheckIcon sx={{ color: '#667eea' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={value}
                          sx={{
                            '& .MuiListItemText-primary': {
                              fontSize: '1.1rem',
                              lineHeight: 1.6
                            }
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center'
                  }}
                >
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, mb: 3, color: '#667eea' }}
                    >
                      Ready to Join Us?
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 4, lineHeight: 1.7 }}
                    >
                      Become part of our community and help shape the future of 
                      local business discovery. Share your experiences and discover 
                      amazing businesses in your area.
                    </Typography>
                    <Bounce>
                      <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate('/register')}
                        sx={{
                          px: 4,
                          py: 1.5,
                          borderRadius: 3,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          textTransform: 'none',
                          boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                          '&:hover': {
                            boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)',
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        Get Started Today
                      </Button>
                    </Bounce>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </SlideIn>
        </Container>
      </Box>
    </Box>
  );
};

export default About;
