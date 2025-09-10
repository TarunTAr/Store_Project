import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip
} from '@mui/material';
import {
  Home as HomeIcon,
  Search as SearchIcon,
  ArrowBack as BackIcon,
  Store as StoreIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon,
  Help as HelpIcon,
  Contact as ContactIcon,
  Login as LoginIcon,
  Explore as ExploreIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

// Import our custom components
import FadeInUp from '../../components/animations/FadeInUp';
import SlideIn from '../../components/animations/SlideIn';
import Bounce from '../../components/animations/Bounce';
import ParticleBackground from '../../components/animations/ParticleBackground';

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const popularPages = [
    {
      icon: <HomeIcon />,
      title: "Home",
      description: "Return to the homepage",
      path: "/",
      color: '#667eea'
    },
    {
      icon: <StoreIcon />,
      title: "Browse Stores",
      description: "Discover amazing stores",
      path: "/stores",
      color: '#10b981'
    },
    {
      icon: <LoginIcon />,
      title: "Sign In",
      description: "Access your account",
      path: "/login",
      color: '#f59e0b'
    },
    {
      icon: <PersonIcon />,
      title: "Register",
      description: "Create a new account",
      path: "/register",
      color: '#ef4444'
    }
  ];

  const helpfulLinks = [
    {
      icon: <SearchIcon />,
      text: "Search for stores",
      action: () => navigate('/stores')
    },
    {
      icon: <HelpIcon />,
      text: "Visit Help Center",
      action: () => navigate('/help')
    },
    {
      icon: <ContactIcon />,
      text: "Contact Support",
      action: () => navigate('/contact')
    },
    {
      icon: <ExploreIcon />,
      text: "Explore Categories",
      action: () => navigate('/categories')
    }
  ];

  const getErrorMessage = () => {
    const path = location.pathname;
    
    if (path.includes('/admin')) {
      return {
        title: "Admin Area Not Found",
        subtitle: "The admin page you're looking for doesn't exist or you don't have permission to access it."
      };
    } else if (path.includes('/store')) {
      return {
        title: "Store Not Found",
        subtitle: "The store you're looking for might have been removed or the link is incorrect."
      };
    } else if (path.includes('/user')) {
      return {
        title: "User Page Not Found", 
        subtitle: "The user page you're trying to access doesn't exist."
      };
    } else {
      return {
        title: "Page Not Found",
        subtitle: "The page you're looking for doesn't exist or has been moved."
      };
    }
  };

  const errorInfo = getErrorMessage();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Particle Background */}
      <ParticleBackground
        variant="floating"
        particleCount={50}
        colors={['#ffffff', '#f093fb', '#4facfe']}
        interactive={true}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Grid container spacing={6} alignItems="center">
          {/* Error Display */}
          <Grid item xs={12} lg={6}>
            <FadeInUp delay={0.2}>
              <Box sx={{ textAlign: { xs: 'center', lg: 'left' }, color: 'white' }}>
                {/* Animated 404 */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, 1, -1, 0]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: { xs: '6rem', md: '8rem' },
                      fontWeight: 900,
                      textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                      mb: 2,
                      background: 'linear-gradient(45deg, #ffffff, #f093fb, #4facfe)',
                      backgroundSize: '200% 200%',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      animation: 'gradient 3s ease infinite'
                    }}
                  >
                    404
                  </Typography>
                </motion.div>

                <Typography
                  variant="h2"
                  sx={{
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    fontWeight: 700,
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    mb: 2
                  }}
                >
                  {errorInfo.title}
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    opacity: 0.9,
                    mb: 4,
                    maxWidth: 500,
                    mx: { xs: 'auto', lg: 0 }
                  }}
                >
                  {errorInfo.subtitle}
                </Typography>

                {/* Action Buttons */}
                <Box sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  justifyContent: { xs: 'center', lg: 'flex-start' },
                  flexWrap: 'wrap'
                }}>
                  <Bounce>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<HomeIcon />}
                      onClick={() => navigate('/')}
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
                      Go Home
                    </Button>
                  </Bounce>

                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<BackIcon />}
                    onClick={() => window.history.back()}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      borderColor: 'white',
                      color: 'white',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    Go Back
                  </Button>
                </Box>

                {/* Current Path Info */}
                <Box sx={{ mt: 4 }}>
                  <Chip
                    label={`Requested: ${location.pathname}`}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontFamily: 'monospace',
                      '& .MuiChip-label': {
                        fontSize: '0.8rem'
                      }
                    }}
                  />
                </Box>
              </Box>
            </FadeInUp>
          </Grid>

          {/* Popular Pages & Help */}
          <Grid item xs={12} lg={6}>
            <SlideIn direction="right" delay={0.3}>
              <Card
                sx={{
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  overflow: 'hidden'
                }}
              >
                {/* Popular Pages */}
                <Box
                  sx={{
                    p: 3,
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                    Popular Pages
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Maybe you were looking for one of these?
                  </Typography>
                </Box>

                <Box sx={{ p: 3 }}>
                  <Grid container spacing={2}>
                    {popularPages.map((page, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <FadeInUp delay={0.4 + index * 0.1}>
                          <motion.div
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Card
                              onClick={() => navigate(page.path)}
                              sx={{
                                cursor: 'pointer',
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 3,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  borderColor: page.color,
                                  boxShadow: `0 8px 25px ${page.color}20`
                                }
                              }}
                            >
                              <CardContent sx={{ p: 2, textAlign: 'center' }}>
                                <Avatar
                                  sx={{
                                    backgroundColor: `${page.color}15`,
                                    color: page.color,
                                    width: 40,
                                    height: 40,
                                    margin: '0 auto',
                                    mb: 1
                                  }}
                                >
                                  {page.icon}
                                </Avatar>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                  {page.title}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {page.description}
                                </Typography>
                              </CardContent>
                            </Card>
                          </motion.div>
                        </FadeInUp>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                {/* Helpful Links */}
                <Box
                  sx={{
                    p: 3,
                    pt: 0,
                    borderTop: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Need Help?
                  </Typography>
                  
                  <List dense>
                    {helpfulLinks.map((link, index) => (
                      <FadeInUp key={index} delay={0.6 + index * 0.1}>
                        <motion.div
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ListItem
                            button
                            onClick={link.action}
                            sx={{
                              borderRadius: 2,
                              mb: 0.5,
                              '&:hover': {
                                backgroundColor: 'rgba(102, 126, 234, 0.1)'
                              }
                            }}
                          >
                            <ListItemIcon>
                              <Avatar
                                sx={{
                                  width: 32,
                                  height: 32,
                                  backgroundColor: '#667eea15',
                                  color: '#667eea'
                                }}
                              >
                                {link.icon}
                              </Avatar>
                            </ListItemIcon>
                            <ListItemText
                              primary={link.text}
                              primaryTypographyProps={{
                                fontSize: '0.9rem',
                                fontWeight: 600
                              }}
                            />
                          </ListItem>
                        </motion.div>
                      </FadeInUp>
                    ))}
                  </List>
                </Box>
              </Card>
            </SlideIn>
          </Grid>
        </Grid>

        {/* Additional Info */}
        <FadeInUp delay={0.8}>
          <Box
            sx={{
              mt: 6,
              textAlign: 'center',
              color: 'white',
              opacity: 0.8
            }}
          >
            <Typography variant="body2" sx={{ mb: 1 }}>
              If you believe this is an error, please contact our support team
            </Typography>
            <Button
              variant="text"
              size="small"
              onClick={() => navigate('/contact')}
              sx={{
                color: 'white',
                textDecoration: 'underline',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Contact Support
            </Button>
          </Box>
        </FadeInUp>
      </Container>

      {/* CSS for gradient animation */}
      <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </Box>
  );
};

export default NotFound;
