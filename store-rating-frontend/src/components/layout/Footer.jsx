import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  Stack,
  Chip,
  useTheme
} from '@mui/material';
import {
  Store as StoreIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  Favorite as HeartIcon,
  Security as SecurityIcon,
  Policy as PolicyIcon,
  Help as HelpIcon,
  Info as AboutIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Footer = ({ variant = 'default' }) => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  const footerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const socialIconVariants = {
    hover: { 
      scale: 1.2, 
      rotate: 10,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.9 }
  };

  const linkHoverVariants = {
    hover: {
      color: '#667eea',
      x: 5,
      transition: { duration: 0.2 }
    }
  };

  if (variant === 'minimal') {
    return (
      <motion.footer
        variants={footerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <Box
          sx={{
            py: 3,
            px: 2,
            borderTop: 1,
            borderColor: 'divider',
            background: 'rgba(248, 250, 252, 0.8)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Container maxWidth="lg">
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
            >
              <Typography variant="body2" color="text.secondary">
                © {currentYear} Store Rating Platform. All rights reserved.
              </Typography>
              
              <Stack direction="row" spacing={2}>
                <Link href="/privacy" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                  Privacy
                </Link>
                <Link href="/terms" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                  Terms
                </Link>
                <Link href="/contact" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                  Contact
                </Link>
              </Stack>
            </Stack>
          </Container>
        </Box>
      </motion.footer>
    );
  }

  return (
    <motion.footer
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Animated Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.05,
            backgroundImage: 'radial-gradient(circle at 25% 25%, white 2px, transparent 2px)',
            backgroundSize: '50px 50px'
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Main Footer Content */}
          <Box sx={{ py: 6 }}>
            <Grid container spacing={4}>
              {/* Company Info */}
              <Grid item xs={12} md={4}>
                <motion.div variants={itemVariants}>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      >
                        <StoreIcon sx={{ fontSize: 32, color: '#667eea' }} />
                      </motion.div>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 800,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent'
                        }}
                      >
                        StoreRating
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" sx={{ mb: 3, opacity: 0.8, lineHeight: 1.6 }}>
                      Your trusted platform for discovering and rating amazing stores. 
                      Connect with businesses and share authentic reviews with the community.
                    </Typography>

                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon sx={{ fontSize: 16, color: '#667eea' }} />
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          contact@storerating.com
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon sx={{ fontSize: 16, color: '#667eea' }} />
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          +1 (555) 123-4567
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationIcon sx={{ fontSize: 16, color: '#667eea' }} />
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          San Francisco, CA
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </motion.div>
              </Grid>

              {/* Quick Links */}
              <Grid item xs={12} sm={6} md={2}>
                <motion.div variants={itemVariants}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 3,
                      fontWeight: 600,
                      color: '#667eea'
                    }}
                  >
                    Platform
                  </Typography>
                  <Stack spacing={2}>
                    {[
                      { label: 'Browse Stores', href: '/stores' },
                      { label: 'Categories', href: '/categories' },
                      { label: 'Top Rated', href: '/top-rated' },
                      { label: 'Recent Reviews', href: '/recent' }
                    ].map((link) => (
                      <motion.div
                        key={link.label}
                        variants={linkHoverVariants}
                        whileHover="hover"
                      >
                        <Link
                          href={link.href}
                          color="inherit"
                          underline="none"
                          sx={{
                            opacity: 0.8,
                            fontSize: '0.875rem',
                            '&:hover': { opacity: 1 }
                          }}
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    ))}
                  </Stack>
                </motion.div>
              </Grid>

              {/* For Business */}
              <Grid item xs={12} sm={6} md={2}>
                <motion.div variants={itemVariants}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 3,
                      fontWeight: 600,
                      color: '#667eea'
                    }}
                  >
                    For Business
                  </Typography>
                  <Stack spacing={2}>
                    {[
                      { label: 'List Your Store', href: '/business/register' },
                      { label: 'Business Dashboard', href: '/business/dashboard' },
                      { label: 'Analytics', href: '/business/analytics' },
                      { label: 'Support', href: '/business/support' }
                    ].map((link) => (
                      <motion.div
                        key={link.label}
                        variants={linkHoverVariants}
                        whileHover="hover"
                      >
                        <Link
                          href={link.href}
                          color="inherit"
                          underline="none"
                          sx={{
                            opacity: 0.8,
                            fontSize: '0.875rem',
                            '&:hover': { opacity: 1 }
                          }}
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    ))}
                  </Stack>
                </motion.div>
              </Grid>

              {/* Legal & Support */}
              <Grid item xs={12} sm={6} md={2}>
                <motion.div variants={itemVariants}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 3,
                      fontWeight: 600,
                      color: '#667eea'
                    }}
                  >
                    Support
                  </Typography>
                  <Stack spacing={2}>
                    {[
                      { label: 'Help Center', href: '/help', icon: <HelpIcon sx={{ fontSize: 16 }} /> },
                      { label: 'About Us', href: '/about', icon: <AboutIcon sx={{ fontSize: 16 }} /> },
                      { label: 'Privacy Policy', href: '/privacy', icon: <PolicyIcon sx={{ fontSize: 16 }} /> },
                      { label: 'Terms of Service', href: '/terms', icon: <SecurityIcon sx={{ fontSize: 16 }} /> }
                    ].map((link) => (
                      <motion.div
                        key={link.label}
                        variants={linkHoverVariants}
                        whileHover="hover"
                      >
                        <Link
                          href={link.href}
                          color="inherit"
                          underline="none"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            opacity: 0.8,
                            fontSize: '0.875rem',
                            '&:hover': { opacity: 1 }
                          }}
                        >
                          {link.icon}
                          {link.label}
                        </Link>
                      </motion.div>
                    ))}
                  </Stack>
                </motion.div>
              </Grid>

              {/* Social & Newsletter */}
              <Grid item xs={12} sm={6} md={2}>
                <motion.div variants={itemVariants}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 3,
                      fontWeight: 600,
                      color: '#667eea'
                    }}
                  >
                    Connect
                  </Typography>

                  {/* Social Icons */}
                  <Box sx={{ mb: 3 }}>
                    <Stack direction="row" spacing={1}>
                      {[
                        { icon: <FacebookIcon />, href: '#', color: '#3b82f6' },
                        { icon: <TwitterIcon />, href: '#', color: '#06b6d4' },
                        { icon: <InstagramIcon />, href: '#', color: '#ec4899' },
                        { icon: <LinkedInIcon />, href: '#', color: '#0ea5e9' },
                        { icon: <GitHubIcon />, href: '#', color: '#6b7280' }
                      ].map((social, index) => (
                        <motion.div
                          key={index}
                          variants={socialIconVariants}
                          whileHover="hover"
                          whileTap="tap"
                        >
                          <IconButton
                            href={social.href}
                            size="small"
                            sx={{
                              color: social.color,
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              '&:hover': {
                                backgroundColor: social.color,
                                color: 'white'
                              }
                            }}
                          >
                            {social.icon}
                          </IconButton>
                        </motion.div>
                      ))}
                    </Stack>
                  </Box>

                  {/* App Store Badges */}
                  <Stack spacing={1}>
                    <Chip
                      label="Download iOS App"
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(102, 126, 234, 0.2)',
                        color: 'white',
                        fontSize: '0.7rem',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'rgba(102, 126, 234, 0.3)'
                        }
                      }}
                    />
                    <Chip
                      label="Download Android App"
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(118, 75, 162, 0.2)',
                        color: 'white',
                        fontSize: '0.7rem',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'rgba(118, 75, 162, 0.3)'
                        }
                      }}
                    />
                  </Stack>
                </motion.div>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

          {/* Bottom Bar */}
          <Box sx={{ py: 3 }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
            >
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                © {currentYear} Store Rating Platform. All rights reserved.
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  Made with
                </Typography>
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <HeartIcon sx={{ color: '#ef4444', fontSize: 16 }} />
                </motion.div>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  by developers
                </Typography>
              </Box>

              <Stack direction="row" spacing={1}>
                <Chip
                  label="React"
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(97, 218, 251, 0.2)',
                    color: '#61dafb',
                    fontSize: '0.6rem'
                  }}
                />
                <Chip
                  label="NestJS"
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(224, 33, 76, 0.2)',
                    color: '#e0214c',
                    fontSize: '0.6rem'
                  }}
                />
                <Chip
                  label="PostgreSQL"
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(51, 103, 145, 0.2)',
                    color: '#336791',
                    fontSize: '0.6rem'
                  }}
                />
              </Stack>
            </Stack>
          </Box>
        </Container>
      </Box>
    </motion.footer>
  );
};

export default Footer;
