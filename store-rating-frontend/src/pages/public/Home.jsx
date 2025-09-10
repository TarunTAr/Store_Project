import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Rating,
  Chip,
  Paper,
  IconButton,
  Fab
} from '@mui/material';
import {
  Star as StarIcon,
  Store as StoreIcon,
  People as PeopleIcon,
  TrendingUp as TrendingIcon,
  Search as SearchIcon,
  ArrowForward as ArrowIcon,
  PlayArrow as PlayIcon,
  KeyboardArrowDown as DownIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Import our custom components
import FadeInUp from '../../components/animations/FadeInUp';
import SlideIn from '../../components/animations/SlideIn';
import Bounce from '../../components/animations/Bounce';
import CountUp from '../../components/animations/CountUp';
import ParticleBackground from '../../components/animations/ParticleBackground';
import StatsCard from '../../components/dashboard/StatsCard';
import TopStores from '../../components/dashboard/TopStores';
import SearchBar from '../../components/common/SearchBar';

const Home = () => {
  const navigate = useNavigate();
  const [featuredStores, setFeaturedStores] = useState([]);

  // Mock data for featured stores
  const mockFeaturedStores = [
    {
      id: 1,
      name: "Milano's Italian Restaurant",
      image: "/api/placeholder/300/200",
      rating: 4.8,
      reviewCount: 1250,
      category: "Restaurant",
      address: "123 Main Street, Downtown",
      description: "Authentic Italian cuisine with a modern twist"
    },
    {
      id: 2,
      name: "TechHub Electronics",
      image: "/api/placeholder/300/200", 
      rating: 4.6,
      reviewCount: 890,
      category: "Electronics",
      address: "456 Tech Avenue, Silicon Valley",
      description: "Your one-stop shop for latest gadgets"
    },
    {
      id: 3,
      name: "Green Gardens Pharmacy",
      image: "/api/placeholder/300/200",
      rating: 4.9,
      reviewCount: 2100,
      category: "Pharmacy",
      address: "789 Health Blvd, Wellness District",
      description: "Trusted healthcare and wellness solutions"
    }
  ];

  useEffect(() => {
    setFeaturedStores(mockFeaturedStores);
  }, []);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)'
    }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden'
        }}
      >
        {/* Particle Background */}
        <ParticleBackground
          variant="floating"
          particleCount={60}
          colors={['#667eea', '#764ba2', '#f093fb']}
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
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    mb: 3
                  }}
                >
                  Discover & Rate Amazing Stores
                </Typography>
              </FadeInUp>

              <FadeInUp delay={0.4}>
                <Typography
                  variant="h5"
                  color="text.secondary"
                  sx={{ mb: 4, lineHeight: 1.6 }}
                >
                  Join thousands of users in rating and discovering the best stores 
                  in your area. Share your experiences and help others make better choices.
                </Typography>
              </FadeInUp>

              <FadeInUp delay={0.6}>
                <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
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
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Get Started Free
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => scrollToSection('features')}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      borderColor: '#667eea',
                      color: '#667eea',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: '#764ba2',
                        backgroundColor: 'rgba(102, 126, 234, 0.05)'
                      }
                    }}
                  >
                    Learn More
                  </Button>
                </Box>
              </FadeInUp>

              {/* Quick Stats */}
              <FadeInUp delay={0.8}>
                <Grid container spacing={3}>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 700,
                          color: '#667eea',
                          mb: 0.5
                        }}
                      >
                        <CountUp end={15000} duration={2.5} />
                        +
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Stores Listed
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 700,
                          color: '#764ba2',
                          mb: 0.5
                        }}
                      >
                        <CountUp end={250000} duration={2.5} />
                        +
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        User Reviews
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 700,
                          color: '#f093fb',
                          mb: 0.5
                        }}
                      >
                        <CountUp end={50000} duration={2.5} />
                        +
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Active Users
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </FadeInUp>
            </Grid>

            <Grid item xs={12} md={6}>
              <SlideIn direction="right" delay={0.3}>
                <Box
                  sx={{
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: -20,
                      left: -20,
                      right: 20,
                      bottom: 20,
                      background: 'linear-gradient(135deg, #667eea20, #764ba220)',
                      borderRadius: 4,
                      zIndex: -1
                    }
                  }}
                >
                  <Paper
                    elevation={20}
                    sx={{
                      borderRadius: 4,
                      overflow: 'hidden',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <Box sx={{ p: 3 }}>
                      <SearchBar
                        placeholder="Search for stores, restaurants, services..."
                        onSearch={(query) => navigate(`/stores?search=${query}`)}
                        showFilters={false}
                      />
                    </Box>
                    
                    <Box sx={{ p: 3, pt: 0 }}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        Popular Categories
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {['Restaurants', 'Shopping', 'Healthcare', 'Electronics', 'Services'].map((category, index) => (
                          <Chip
                            key={category}
                            label={category}
                            onClick={() => navigate(`/stores?category=${category}`)}
                            sx={{
                              background: `linear-gradient(135deg, #667eea${(index + 1) * 20}, #764ba2${(index + 1) * 15})`,
                              color: 'white',
                              fontWeight: 600,
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: 2
                              },
                              transition: 'all 0.2s ease'
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Paper>
                </Box>
              </SlideIn>
            </Grid>
          </Grid>
        </Container>

        {/* Scroll Indicator */}
        <Bounce variant="gentle" repeat={true}>
          <Fab
            size="small"
            onClick={() => scrollToSection('features')}
            sx={{
              position: 'absolute',
              bottom: 30,
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: '#667eea',
              '&:hover': {
                backgroundColor: 'white'
              }
            }}
          >
            <DownIcon />
          </Fab>
        </Bounce>
      </Box>

      {/* Features Section */}
      <Box
        id="features"
        sx={{
          py: 10,
          background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)'
        }}
      >
        <Container maxWidth="lg">
          <FadeInUp>
            <Typography
              variant="h2"
              align="center"
              sx={{
                fontWeight: 700,
                mb: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}
            >
              Why Choose Our Platform?
            </Typography>
            <Typography
              variant="h6"
              align="center"
              color="text.secondary"
              sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
            >
              Discover the features that make us the preferred choice for store ratings and reviews
            </Typography>
          </FadeInUp>

          <Grid container spacing={4}>
            {[
              {
                icon: <StoreIcon />,
                title: "15,000+ Stores",
                description: "Browse through our extensive database of verified stores across all categories",
                color: '#667eea'
              },
              {
                icon: <StarIcon />,
                title: "Verified Reviews",
                description: "Read authentic reviews from real customers to make informed decisions",
                color: '#764ba2'
              },
              {
                icon: <PeopleIcon />,
                title: "Community Driven",
                description: "Join a community of users sharing genuine experiences and recommendations",
                color: '#f093fb'
              },
              {
                icon: <TrendingIcon />,
                title: "Real-time Updates",
                description: "Get instant notifications about new reviews and store updates",
                color: '#f5576c'
              }
            ].map((feature, index) => (
              <Grid item xs={12} md={6} lg={3} key={index}>
                <FadeInUp delay={index * 0.1}>
                  <Bounce>
                    <Card
                      sx={{
                        height: '100%',
                        textAlign: 'center',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 4,
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          borderColor: feature.color,
                          boxShadow: `0 10px 30px ${feature.color}20`,
                          transform: 'translateY(-8px)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 4 }}>
                        <Avatar
                          sx={{
                            width: 80,
                            height: 80,
                            backgroundColor: `${feature.color}15`,
                            color: feature.color,
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
                  </Bounce>
                </FadeInUp>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Featured Stores Section */}
      <Box sx={{ py: 10, backgroundColor: '#f8fafc' }}>
        <Container maxWidth="lg">
          <FadeInUp>
            <Typography
              variant="h2"
              align="center"
              sx={{
                fontWeight: 700,
                mb: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}
            >
              Featured Stores
            </Typography>
            <Typography
              variant="h6"
              align="center"
              color="text.secondary"
              sx={{ mb: 6 }}
            >
              Discover top-rated stores loved by our community
            </Typography>
          </FadeInUp>

          <Grid container spacing={4}>
            {featuredStores.map((store, index) => (
              <Grid item xs={12} md={4} key={store.id}>
                <SlideIn direction={index % 2 === 0 ? 'left' : 'right'} delay={index * 0.2}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 4,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 15px 40px rgba(0,0,0,0.1)'
                      }
                    }}
                    onClick={() => navigate(`/stores/${store.id}`)}
                  >
                    <Box
                      sx={{
                        height: 200,
                        backgroundImage: `url(${store.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative'
                      }}
                    >
                      <Chip
                        label={store.category}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 12,
                          left: 12,
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          fontWeight: 600
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          color: 'white',
                          px: 1,
                          py: 0.5,
                          borderRadius: 2
                        }}
                      >
                        <StarIcon sx={{ fontSize: 16, color: '#ffd700' }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {store.rating}
                        </Typography>
                      </Box>
                    </Box>

                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        {store.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {store.description}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        📍 {store.address}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Rating value={store.rating} readOnly size="small" />
                          <Typography variant="body2" color="text.secondary">
                            ({store.reviewCount})
                          </Typography>
                        </Box>
                        <IconButton
                          size="small"
                          sx={{
                            color: '#667eea',
                            '&:hover': {
                              backgroundColor: '#667eea15'
                            }
                          }}
                        >
                          <ArrowIcon />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </SlideIn>
              </Grid>
            ))}
          </Grid>

          <FadeInUp delay={0.5}>
            <Box sx={{ textAlign: 'center', mt: 6 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/stores')}
                endIcon={<ArrowIcon />}
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
                View All Stores
              </Button>
            </Box>
          </FadeInUp>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Box
        sx={{
          py: 10,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <ParticleBackground
          variant="stars"
          particleCount={80}
          colors={['#ffffff', '#f093fb']}
          speed={0.3}
        />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <FadeInUp>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                mb: 3,
                textShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              Ready to Start Rating?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                opacity: 0.9,
                maxWidth: 600,
                mx: 'auto'
              }}
            >
              Join thousands of users who are already sharing their store experiences. 
              Your opinion matters and helps others make better choices.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
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
                Sign Up Now
              </Button>

              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/login')}
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
                Sign In
              </Button>
            </Box>
          </FadeInUp>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
