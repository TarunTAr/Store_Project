import React, { useState, useMemo } from 'react';
import {
  Paper,
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Rating,
  LinearProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Tooltip,
  Badge,
  Select,
  FormControl,
  InputLabel,
  Grid
} from '@mui/material';
import {
  Store as StoreIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  MoreVert as MoreIcon,
  Visibility as ViewIcon,
  Share as ShareIcon,
  Favorite as FavoriteIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Group as GroupIcon,
  Timeline as TimelineIcon,
  EmojiEvents as TrophyIcon,
  WorkspacePremium as PremiumIcon,
  LocalFireDepartment as FireIcon,
  Whatshot as HotIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTopStores, favoriteStore } from '../../store/storeSlice';

const TopStores = ({
  stores = [],
  loading = false,
  timeRange = '30d',
  onTimeRangeChange,
  maxItems = 10,
  variant = 'list', // list, cards, compact, podium
  showRankings = true,
  showTrends = true,
  showStats = true,
  onStoreClick,
  className = ''
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [viewMode, setViewMode] = useState(variant);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Sort stores by rating and calculate rankings
  const rankedStores = useMemo(() => {
    return stores
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, maxItems)
      .map((store, index) => ({
        ...store,
        rank: index + 1,
        trend: store.previousRating 
          ? store.rating > store.previousRating ? 'up' 
            : store.rating < store.previousRating ? 'down' : 'stable'
          : 'new'
      }));
  }, [stores, maxItems]);

  const handleMenuOpen = (event, store) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedStore(store);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedStore(null);
  };

  const handleStoreClick = (store) => {
    if (onStoreClick) {
      onStoreClick(store);
    } else {
      navigate(`/stores/${store.id}`);
    }
  };

  const handleFavorite = async (store) => {
    try {
      await dispatch(favoriteStore(store.id)).unwrap();
    } catch (error) {
      console.error('Failed to favorite store:', error);
    }
    handleMenuClose();
  };

  const getRankBadgeColor = (rank) => {
    switch (rank) {
      case 1: return '#FFD700'; // Gold
      case 2: return '#C0C0C0'; // Silver
      case 3: return '#CD7F32'; // Bronze
      default: return '#667eea';
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <TrophyIcon sx={{ color: '#FFD700' }} />;
      case 2: return <PremiumIcon sx={{ color: '#C0C0C0' }} />;
      case 3: return <PremiumIcon sx={{ color: '#CD7F32' }} />;
      default: return null;
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />;
      case 'down':
        return <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main' }} />;
      case 'new':
        return <HotIcon sx={{ fontSize: 16, color: 'warning.main' }} />;
      default:
        return null;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4 }
    }
  };

  const podiumVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (rank) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: rank * 0.2,
        duration: 0.6,
        type: "spring",
        stiffness: 100
      }
    })
  };

  if (loading) {
    return (
      <Paper
        elevation={2}
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          p: 3
        }}
        className={className}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <TrophyIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Top Stores
          </Typography>
        </Box>
        
        {[...Array(5)].map((_, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: 'grey.200' }} />
            <Box sx={{ flex: 1 }}>
              <LinearProgress sx={{ mb: 1, borderRadius: 1 }} />
              <LinearProgress sx={{ width: '60%', borderRadius: 1 }} />
            </Box>
          </Box>
        ))}
      </Paper>
    );
  }

  if (variant === 'podium') {
    const topThree = rankedStores.slice(0, 3);
    const podiumOrder = [2, 1, 3]; // Silver, Gold, Bronze for visual hierarchy
    
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={className}
      >
        <Paper
          elevation={3}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 3,
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              borderBottom: 1,
              borderColor: 'divider'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrophyIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Top Performers
                </Typography>
              </Box>

              {onTimeRangeChange && (
                <FormControl size="small" sx={{ minWidth: 100 }}>
                  <InputLabel>Period</InputLabel>
                  <Select
                    value={timeRange}
                    onChange={(e) => onTimeRangeChange(e.target.value)}
                    label="Period"
                  >
                    <MenuItem value="7d">7 Days</MenuItem>
                    <MenuItem value="30d">30 Days</MenuItem>
                    <MenuItem value="90d">90 Days</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Box>
          </Box>

          {/* Podium */}
          <Box sx={{ p: 4, background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'end',
                justifyContent: 'center',
                gap: 2,
                minHeight: 300
              }}
            >
              {podiumOrder.map((position, index) => {
                const store = topThree.find(s => s.rank === position);
                if (!store) return null;

                const heights = { 1: 200, 2: 160, 3: 120 };
                const colors = { 1: '#FFD700', 2: '#C0C0C0', 3: '#CD7F32' };

                return (
                  <motion.div
                    key={store.id}
                    custom={index}
                    variants={podiumVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale: 1.05 }}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleStoreClick(store)}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center'
                      }}
                    >
                      {/* Store Info */}
                      <Box sx={{ mb: 2 }}>
                        <motion.div
                          animate={{
                            rotate: [0, 5, -5, 0],
                            scale: [1, 1.1, 1]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.5
                          }}
                        >
                          <Avatar
                            src={store.logo}
                            sx={{
                              width: position === 1 ? 80 : 64,
                              height: position === 1 ? 80 : 64,
                              border: `3px solid ${colors[position]}`,
                              mb: 1
                            }}
                          >
                            <StoreIcon />
                          </Avatar>
                        </motion.div>

                        <Typography
                          variant={position === 1 ? 'h6' : 'subtitle1'}
                          sx={{ fontWeight: 700, mb: 0.5 }}
                        >
                          {store.name}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 1 }}>
                          <StarIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {store.rating?.toFixed(1)}
                          </Typography>
                        </Box>

                        <Typography variant="caption" color="text.secondary">
                          {store.reviewCount} reviews
                        </Typography>
                      </Box>

                      {/* Podium Base */}
                      <Box
                        sx={{
                          width: 120,
                          height: heights[position],
                          background: `linear-gradient(180deg, ${colors[position]}, ${colors[position]}99)`,
                          borderRadius: '8px 8px 0 0',
                          border: `2px solid ${colors[position]}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'column',
                          position: 'relative',
                          boxShadow: `0 8px 20px ${colors[position]}40`
                        }}
                      >
                        <Typography
                          variant="h3"
                          sx={{
                            fontWeight: 900,
                            color: 'white',
                            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                          }}
                        >
                          {position}
                        </Typography>

                        {/* Rank Badge */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: -15,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 30,
                            height: 30,
                            borderRadius: '50%',
                            backgroundColor: colors[position],
                            border: '2px solid white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {getRankIcon(position)}
                        </Box>
                      </Box>
                    </Box>
                  </motion.div>
                );
              })}
            </Box>
          </Box>

          {/* Remaining Stores */}
          {rankedStores.length > 3 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Other Top Performers
              </Typography>
              
              <List>
                {rankedStores.slice(3).map((store, index) => (
                  <motion.div
                    key={store.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index + 3}
                  >
                    <ListItem
                      button
                      onClick={() => handleStoreClick(store)}
                      sx={{
                        borderRadius: 2,
                        mb: 1,
                        border: '1px solid transparent',
                        '&:hover': {
                          borderColor: 'primary.main',
                          backgroundColor: 'primary.light'
                        }
                      }}
                    >
                      <ListItemAvatar>
                        <Badge
                          badgeContent={store.rank}
                          color="primary"
                          sx={{
                            '& .MuiBadge-badge': {
                              backgroundColor: getRankBadgeColor(store.rank),
                              color: 'white',
                              fontWeight: 700
                            }
                          }}
                        >
                          <Avatar src={store.logo}>
                            <StoreIcon />
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>

                      <ListItemText
                        primary={store.name}
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Rating value={store.rating} readOnly size="small" />
                            <Typography variant="caption">
                              {store.rating?.toFixed(1)} ({store.reviewCount} reviews)
                            </Typography>
                          </Box>
                        }
                      />

                      {showTrends && getTrendIcon(store.trend)}
                    </ListItem>
                  </motion.div>
                ))}
              </List>
            </Box>
          )}
        </Paper>
      </motion.div>
    );
  }

  if (variant === 'cards') {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={className}
      >
        <Paper
          elevation={2}
          sx={{
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 3,
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              borderBottom: 1,
              borderColor: 'divider'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FireIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Top Rated Stores
                </Typography>
              </Box>

              {onTimeRangeChange && (
                <FormControl size="small" sx={{ minWidth: 100 }}>
                  <InputLabel>Period</InputLabel>
                  <Select
                    value={timeRange}
                    onChange={(e) => onTimeRangeChange(e.target.value)}
                    label="Period"
                  >
                    <MenuItem value="7d">7 Days</MenuItem>
                    <MenuItem value="30d">30 Days</MenuItem>
                    <MenuItem value="90d">90 Days</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Box>
          </Box>

          {/* Cards Grid */}
          <Box sx={{ p: 3 }}>
            <Grid container spacing={2}>
              {rankedStores.map((store, index) => (
                <Grid item xs={12} sm={6} md={4} key={store.id}>
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                    whileHover={{ y: -4, scale: 1.02 }}
                  >
                    <Card
                      sx={{
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: store.rank <= 3 ? getRankBadgeColor(store.rank) : 'divider',
                        cursor: 'pointer',
                        height: '100%',
                        background: store.rank <= 3 
                          ? `linear-gradient(135deg, ${getRankBadgeColor(store.rank)}10, transparent)`
                          : 'white',
                        '&:hover': {
                          boxShadow: `0 8px 25px ${getRankBadgeColor(store.rank)}20`
                        },
                        transition: 'all 0.3s ease'
                      }}
                      onClick={() => handleStoreClick(store)}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                          <Badge
                            badgeContent={store.rank}
                            color="primary"
                            sx={{
                              '& .MuiBadge-badge': {
                                backgroundColor: getRankBadgeColor(store.rank),
                                color: 'white',
                                fontWeight: 700
                              }
                            }}
                          >
                            <Avatar
                              src={store.logo}
                              sx={{
                                width: 48,
                                height: 48,
                                border: store.rank <= 3 ? `2px solid ${getRankBadgeColor(store.rank)}` : 'none'
                              }}
                            >
                              <StoreIcon />
                            </Avatar>
                          </Badge>

                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                              {store.name}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Rating value={store.rating} readOnly size="small" />
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {store.rating?.toFixed(1)}
                              </Typography>
                            </Box>

                            <Typography variant="caption" color="text.secondary">
                              {store.reviewCount} reviews
                            </Typography>
                            
                            {store.rank <= 3 && (
                              <Box sx={{ mt: 1 }}>
                                <Chip
                                  icon={getRankIcon(store.rank)}
                                  label={store.rank === 1 ? 'Champion' : store.rank === 2 ? 'Runner Up' : 'Third Place'}
                                  size="small"
                                  sx={{
                                    backgroundColor: `${getRankBadgeColor(store.rank)}20`,
                                    color: getRankBadgeColor(store.rank),
                                    fontWeight: 600,
                                    fontSize: '0.7rem'
                                  }}
                                />
                              </Box>
                            )}
                          </Box>

                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, store)}
                          >
                            <MoreIcon />
                          </IconButton>
                        </Box>

                        {showStats && (
                          <Box sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <GroupIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="caption" color="text.secondary">
                                  {store.reviewCount} reviews
                                </Typography>
                              </Box>

                              {showTrends && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  {getTrendIcon(store.trend)}
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: store.trend === 'up' ? 'success.main' 
                                        : store.trend === 'down' ? 'error.main' 
                                        : 'warning.main',
                                      fontWeight: 600
                                    }}
                                  >
                                    {store.trend === 'new' ? 'New!' : 
                                     store.trend === 'up' ? '+0.2' : 
                                     store.trend === 'down' ? '-0.1' : '—'}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Paper>
      </motion.div>
    );
  }

  // Default list variant
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      <Paper
        elevation={2}
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 3,
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            borderBottom: 1,
            borderColor: 'divider'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrophyIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Top Rated Stores
              </Typography>
              <Chip
                label={`Top ${rankedStores.length}`}
                size="small"
                color="primary"
                sx={{ fontSize: '0.7rem' }}
              />
            </Box>

            {onTimeRangeChange && (
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel>Period</InputLabel>
                <Select
                  value={timeRange}
                  onChange={(e) => onTimeRangeChange(e.target.value)}
                  label="Period"
                >
                  <MenuItem value="7d">7 Days</MenuItem>
                  <MenuItem value="30d">30 Days</MenuItem>
                  <MenuItem value="90d">90 Days</MenuItem>
                </Select>
              </FormControl>
            )}
          </Box>
        </Box>

        {/* Store List */}
        <List sx={{ p: 2 }}>
          <AnimatePresence>
            {rankedStores.map((store, index) => (
              <motion.div
                key={store.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                custom={index}
              >
                <ListItem
                  button
                  onClick={() => handleStoreClick(store)}
                  sx={{
                    borderRadius: 3,
                    mb: 1,
                    border: '1px solid',
                    borderColor: store.rank <= 3 ? getRankBadgeColor(store.rank) : 'divider',
                    background: store.rank <= 3 
                      ? `linear-gradient(135deg, ${getRankBadgeColor(store.rank)}08, transparent)`
                      : 'white',
                    '&:hover': {
                      borderColor: getRankBadgeColor(store.rank),
                      backgroundColor: `${getRankBadgeColor(store.rank)}15`,
                      transform: 'translateX(4px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <ListItemAvatar>
                    <Badge
                      badgeContent={store.rank}
                      color="primary"
                      sx={{
                        '& .MuiBadge-badge': {
                          backgroundColor: getRankBadgeColor(store.rank),
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '0.75rem'
                        }
                      }}
                    >
                      <Avatar
                        src={store.logo}
                        sx={{
                          width: 48,
                          height: 48,
                          border: store.rank <= 3 ? `2px solid ${getRankBadgeColor(store.rank)}` : 'none'
                        }}
                      >
                        <StoreIcon />
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                          {store.name}
                        </Typography>
                        
                        {store.rank <= 3 && getRankIcon(store.rank)}
                        
                        {store.trend === 'new' && (
                          <Chip
                            label="NEW"
                            size="small"
                            color="warning"
                            sx={{ fontSize: '0.6rem', height: 18 }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Rating value={store.rating} readOnly size="small" />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {store.rating?.toFixed(1)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ({store.reviewCount} reviews)
                          </Typography>
                        </Box>

                        {store.address && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <LocationIcon sx={{ fontSize: 12, color: 'text.disabled' }} />
                            <Typography variant="caption" color="text.secondary">
                              {store.address.length > 50 
                                ? `${store.address.substring(0, 50)}...` 
                                : store.address
                              }
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    }
                  />

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {showTrends && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {getTrendIcon(store.trend)}
                        <Typography
                          variant="caption"
                          sx={{
                            color: store.trend === 'up' ? 'success.main' 
                              : store.trend === 'down' ? 'error.main' 
                              : store.trend === 'new' ? 'warning.main'
                              : 'text.secondary',
                            fontWeight: 600
                          }}
                        >
                          {store.trend === 'new' ? 'New!' : 
                           store.trend === 'up' ? '+0.2' : 
                           store.trend === 'down' ? '-0.1' : '—'}
                        </Typography>
                      </Box>
                    )}

                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, store)}
                    >
                      <MoreIcon />
                    </IconButton>
                  </Box>
                </ListItem>
              </motion.div>
            ))}
          </AnimatePresence>
        </List>
      </Paper>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            border: '1px solid',
            borderColor: 'divider'
          }
        }}
      >
        <MenuItem onClick={() => { handleStoreClick(selectedStore); handleMenuClose(); }}>
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Store</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => { handleFavorite(selectedStore); }}>
          <ListItemIcon>
            <FavoriteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Add to Favorites</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => { /* Share logic */ handleMenuClose(); }}>
          <ListItemIcon>
            <ShareIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Share Store</ListItemText>
        </MenuItem>
      </Menu>
    </motion.div>
  );
};

export default TopStores;
