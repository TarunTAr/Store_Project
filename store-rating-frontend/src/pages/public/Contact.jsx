import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Send as SendIcon,
  Support as SupportIcon,
  Business as BusinessIcon,
  Help as HelpIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Import our custom components
import FadeInUp from '../../components/animations/FadeInUp';
import SlideIn from '../../components/animations/SlideIn';
import Bounce from '../../components/animations/Bounce';
import ParticleBackground from '../../components/animations/ParticleBackground';

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const contactInfo = [
    {
      icon: <EmailIcon />,
      title: "Email Us",
      content: "support@storerating.com",
      description: "We'll respond within 24 hours",
      color: '#667eea'
    },
    {
      icon: <PhoneIcon />,
      title: "Call Us",
      content: "+1 (555) 123-4567",
      description: "Mon-Fri, 9AM-6PM EST",
      color: '#764ba2'
    },
    {
      icon: <LocationIcon />,
      title: "Visit Us",
      content: "123 Tech Street, Silicon Valley, CA 94025",
      description: "By appointment only",
      color: '#f093fb'
    },
    {
      icon: <TimeIcon />,
      title: "Business Hours",
      content: "Mon-Fri: 9AM-6PM",
      description: "Weekend: 10AM-4PM",
      color: '#f5576c'
    }
  ];

  const supportTypes = [
    {
      icon: <SupportIcon />,
      title: "General Support",
      description: "Questions about our platform and services",
      category: 'general'
    },
    {
      icon: <BusinessIcon />,
      title: "Business Inquiries",
      description: "Partnership and business opportunities",
      category: 'business'
    },
    {
      icon: <HelpIcon />,
      title: "Technical Help",
      description: "Technical issues and bug reports",
      category: 'technical'
    }
  ];

  const socialLinks = [
    { icon: <FacebookIcon />, name: 'Facebook', color: '#4267B2', url: '#' },
    { icon: <TwitterIcon />, name: 'Twitter', color: '#1DA1F2', url: '#' },
    { icon: <LinkedInIcon />, name: 'LinkedIn', color: '#0077B5', url: '#' },
    { icon: <InstagramIcon />, name: 'Instagram', color: '#E4405F', url: '#' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitted(true);
    } catch (error) {
      setErrors({ submit: 'Failed to send message. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
            <Paper
              elevation={20}
              sx={{
                borderRadius: 4,
                p: 6,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)'
              }}
            >
              <Bounce>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    backgroundColor: '#10b981',
                    margin: '0 auto',
                    mb: 3
                  }}
                >
                  <CheckIcon sx={{ fontSize: '2.5rem' }} />
                </Avatar>
              </Bounce>

              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  mb: 2
                }}
              >
                Message Sent Successfully!
              </Typography>
              
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                Thank you for reaching out. We'll get back to you within 24 hours.
              </Typography>
              
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/')}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none'
                }}
              >
                Back to Home
              </Button>
            </Paper>
          </FadeInUp>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          minHeight: '40vh',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          overflow: 'hidden'
        }}
      >
        <ParticleBackground
          variant="floating"
          particleCount={40}
          colors={['#ffffff', '#f093fb', '#4facfe']}
          interactive={true}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={8}>
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
                  Get In Touch
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ 
                    mb: 4, 
                    lineHeight: 1.6,
                    opacity: 0.95
                  }}
                >
                  Have questions? We'd love to hear from you. Send us a message 
                  and we'll respond as soon as possible.
                </Typography>
              </FadeInUp>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <SlideIn direction="right" delay={0.3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ mb: 2, opacity: 0.9 }}>
                    Follow Us
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    {socialLinks.map((social) => (
                      <motion.div
                        key={social.name}
                        whileHover={{ scale: 1.1, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <IconButton
                          href={social.url}
                          sx={{
                            width: 50,
                            height: 50,
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: social.color,
                              boxShadow: `0 8px 15px ${social.color}40`
                            },
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {social.icon}
                        </IconButton>
                      </motion.div>
                    ))}
                  </Box>
                </Box>
              </SlideIn>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Contact Form & Info Section */}
      <Box sx={{ py: 10, backgroundColor: '#f8fafc' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            {/* Contact Form */}
            <Grid item xs={12} lg={8}>
              <FadeInUp>
                <Paper
                  elevation={10}
                  sx={{
                    borderRadius: 4,
                    overflow: 'hidden',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(102, 126, 234, 0.1)'
                  }}
                >
                  <Box
                    sx={{
                      p: 4,
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                      borderBottom: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        mb: 1
                      }}
                    >
                      Send us a Message
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Fill out the form below and we'll get back to you as soon as possible.
                    </Typography>
                  </Box>

                  <Box sx={{ p: 4 }}>
                    {/* Support Type Selection */}
                    <FadeInUp delay={0.2}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        What can we help you with?
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
                        {supportTypes.map((type) => (
                          <motion.div
                            key={type.category}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Card
                              sx={{
                                cursor: 'pointer',
                                border: '2px solid',
                                borderColor: formData.category === type.category ? '#667eea' : 'divider',
                                borderRadius: 3,
                                minWidth: 200,
                                '&:hover': {
                                  borderColor: '#667eea',
                                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.2)'
                                },
                                transition: 'all 0.3s ease'
                              }}
                              onClick={() => setFormData(prev => ({ ...prev, category: type.category }))}
                            >
                              <CardContent sx={{ p: 2, textAlign: 'center' }}>
                                <Avatar
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    backgroundColor: formData.category === type.category ? '#667eea' : '#667eea20',
                                    color: formData.category === type.category ? 'white' : '#667eea',
                                    margin: '0 auto',
                                    mb: 1
                                  }}
                                >
                                  {type.icon}
                                </Avatar>
                                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                  {type.title}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {type.description}
                                </Typography>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </Box>
                    </FadeInUp>

                    {/* Contact Form */}
                    <form onSubmit={handleSubmit}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <FadeInUp delay={0.3}>
                            <TextField
                              fullWidth
                              label="Your Name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              error={!!errors.name}
                              helperText={errors.name}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                  '&:hover fieldset': {
                                    borderColor: '#667eea'
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#667eea'
                                  }
                                }
                              }}
                            />
                          </FadeInUp>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <FadeInUp delay={0.4}>
                            <TextField
                              fullWidth
                              label="Email Address"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              error={!!errors.email}
                              helperText={errors.email}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                  '&:hover fieldset': {
                                    borderColor: '#667eea'
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#667eea'
                                  }
                                }
                              }}
                            />
                          </FadeInUp>
                        </Grid>

                        <Grid item xs={12}>
                          <FadeInUp delay={0.5}>
                            <TextField
                              fullWidth
                              label="Subject"
                              name="subject"
                              value={formData.subject}
                              onChange={handleInputChange}
                              error={!!errors.subject}
                              helperText={errors.subject}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                  '&:hover fieldset': {
                                    borderColor: '#667eea'
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#667eea'
                                  }
                                }
                              }}
                            />
                          </FadeInUp>
                        </Grid>

                        <Grid item xs={12}>
                          <FadeInUp delay={0.6}>
                            <TextField
                              fullWidth
                              label="Message"
                              name="message"
                              multiline
                              rows={6}
                              value={formData.message}
                              onChange={handleInputChange}
                              error={!!errors.message}
                              helperText={errors.message || 'Minimum 10 characters'}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                  '&:hover fieldset': {
                                    borderColor: '#667eea'
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#667eea'
                                  }
                                }
                              }}
                            />
                          </FadeInUp>
                        </Grid>

                        <Grid item xs={12}>
                          <FadeInUp delay={0.7}>
                            {errors.submit && (
                              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                                {errors.submit}
                              </Alert>
                            )}

                            <Bounce>
                              <Button
                                type="submit"
                                size="large"
                                disabled={loading}
                                endIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
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
                                  '&:disabled': {
                                    background: '#ccc'
                                  },
                                  transition: 'all 0.3s ease'
                                }}
                              >
                                {loading ? 'Sending...' : 'Send Message'}
                              </Button>
                            </Bounce>
                          </FadeInUp>
                        </Grid>
                      </Grid>
                    </form>
                  </Box>
                </Paper>
              </FadeInUp>
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12} lg={4}>
              <Box sx={{ position: 'sticky', top: 20 }}>
                <FadeInUp delay={0.3}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      mb: 3
                    }}
                  >
                    Contact Information
                  </Typography>
                </FadeInUp>

                <Grid container spacing={3}>
                  {contactInfo.map((info, index) => (
                    <Grid item xs={12} key={index}>
                      <SlideIn direction="right" delay={index * 0.1 + 0.4}>
                        <Card
                          sx={{
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: 'divider',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              borderColor: info.color,
                              boxShadow: `0 8px 25px ${info.color}20`,
                              transform: 'translateY(-4px)'
                            }
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                              <Avatar
                                sx={{
                                  backgroundColor: `${info.color}15`,
                                  color: info.color,
                                  width: 50,
                                  height: 50
                                }}
                              >
                                {info.icon}
                              </Avatar>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                  {info.title}
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 600, color: info.color, mb: 0.5 }}>
                                  {info.content}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {info.description}
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </SlideIn>
                    </Grid>
                  ))}
                </Grid>

                {/* FAQ Link */}
                <FadeInUp delay={0.8}>
                  <Card
                    sx={{
                      mt: 3,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                      border: '1px solid',
                      borderColor: '#667eea30',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#667eea',
                        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.2)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                      <Avatar
                        sx={{
                          width: 60,
                          height: 60,
                          backgroundColor: '#667eea15',
                          color: '#667eea',
                          margin: '0 auto',
                          mb: 2
                        }}
                      >
                        <HelpIcon sx={{ fontSize: '2rem' }} />
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        Frequently Asked Questions
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Find answers to common questions about our platform
                      </Typography>
                      <Button
                        variant="outlined"
                        sx={{
                          borderColor: '#667eea',
                          color: '#667eea',
                          borderRadius: 2,
                          '&:hover': {
                            borderColor: '#764ba2',
                            backgroundColor: 'rgba(102, 126, 234, 0.05)'
                          }
                        }}
                      >
                        View FAQ
                      </Button>
                    </CardContent>
                  </Card>
                </FadeInUp>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Contact;
