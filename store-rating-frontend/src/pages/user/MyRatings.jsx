import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Chip,
  Rating,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  LinearProgress,
  Badge,
  Menu
} from '@mui/material';
import {
  Star as StarIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreIcon,
  Store as StoreIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingIcon,
  Favorite as FavoriteIcon,
  ThumbUp as ThumbUpIcon,
  Share as ShareIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Analytics as AnalyticsIcon,
  EmojiEvents as AwardIcon,
  LocalFireDepartment as FireIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Import our custom components
import FadeInUp from '../../components/animations/FadeInUp';
import SlideIn from '../../components/animations/SlideIn';
import CountUp from '../../components/animations/CountUp';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import DonutChart from '../../components/charts/DonutChart';

const MyRatings = () => {
  const navigate = useNavigate();
  const [ratings, setRatings] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editReview, setEditReview] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  // Mock user ratings data
  const mockRatings = [
    {
      id: 1,
      store: {
        id: 1,
        name: "Milano's Italian Restaurant",
        category: 'Restaurant',
        image: '/api/placeholder/80/80',
        address: '123 Main Street, Downtown'
      },
      rating: 5,
      review: 'Amazing pasta and excellent service! The ambiance was perfect for a dinner date. Highly recommended for Italian food lovers.',
      date: new Date('2024-03-10'),
      helpful: 12,
      photos: 2,
      isPublic: true,
      lastModified: new Date('2024-03-10')
    },
    {
      id: 2,
      store: {
        id: 2,
        name: 'TechHub Electronics',
        category: 'Electronics',
        image: '/api/placeholder/80/80',
        address: '456 Tech Avenue, Silicon Valley'
      },
      rating: 4,
      review: 'Great selection of gadgets and competitive prices. Staff was knowledgeable and helpful.',
      date: new Date('2024-03-08'),
      helpful: 8,
      photos: 1,
      isPublic: true,
      lastModified: new Date('2024-03-08')
    },
    {
      id: 3,
      store: {
        id: 3,
        name: 'Green Gardens Pharmacy',
        category: 'Healthcare',
        image: '/api/placeholder/80/80',
        address: '789 Health Blvd, Medical Center'
      },
      rating: 4,
      review: 'Quick service and good prices. The pharmacist was very helpful with my questions.',
      date: new Date('2024-03-05'),
      helpful: 5,
      photos: 0,
      isPublic: true,
      lastModified: new Date('2024-03-06')
    },
    {
      id: 4,
      store: {
        id: 4,
        name: 'Fashion Forward Boutique',
        category: 'Fashion',
        image: '/api/placeholder/80/80',
        address: '321 Style Street, Fashion District'
      },
      rating: 3,
      review: 'Trendy clothes but a bit overpriced. Limited size selection.',
      date: new Date('2024-03-01'),
      helpful: 3,
      photos: 0,
      isPublic: false,
      lastModified: new Date('2024-03-01')
    },
    {
      id: 5,
      store: {
        id: 5,
        name: 'Coffee Corner Cafe',
        category: 'Restaurant',
        image: '/api/placeholder/80/80',
        address: '567 Brew Street, Arts District'
      },
      rating: 5,
      review: 'Best coffee in town! Love the cozy atmosphere and friendly baristas.',
      date: new Date('2024-02-28'),
      helpful: 15,
      photos: 3,
      isPublic: true,
      lastModified: new Date('2024-02-28')
    }
  ];

  useEffect(() => {
    setRatings(mockRatings);
  }, []);

  // Calculate statistics
  const stats = {
    totalRatings: ratings.length,
    averageRating: ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length,
    helpfulVotes: ratings.reduce((sum, r) => sum + r.helpful, 0),
    categoriesRated: new Set(ratings.map(r => r.category)).size,
    publicReviews: ratings.filter(r => r.isPublic).length,
    photosShared: ratings.reduce((sum, r) => sum + r.photos, 0)
  };

  // Rating distribution for chart
  const ratingDistribution = {
    labels: ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'],
    datasets: [{
      data: [
        ratings.filter(r => r.rating === 5).length,
        ratings.filter(r => r.rating === 4).length,
        ratings.filter(r => r.rating === 3).length,
        ratings.filter(r => r.rating === 2).length,
        ratings.filter(r => r.rating === 1).length
      ],
      backgroundColor: ['#10b981', '#22c55e', '#eab308', '#f59e0b', '#ef4444']
    }]
  };

  const handleEdit = (rating) => {
    setSelectedRating(rating);
    setEditRating(rating.rating);
    setEditReview(rating.review);
    setOpenEditDialog(true);
  };

  const handleDelete = (rating) => {
    setSelectedRating(rating);
    setOpenDeleteDialog(true);
  };

  const handleEditSubmit = () => {
    setRatings(prev => prev.map(rating => 
      rating.id === selectedRating.id 
        ? { 
            ...rating, 
            rating: editRating, 
            review: editReview,
            lastModified: new Date()
          }
        : rating
    ));
    setOpenEditDialog(false);
    setSelectedRating(null);
    setEditRating(0);
    setEditReview('');
  };

  const handleDeleteConfirm = () => {
    setRatings(prev => prev.filter(rating => rating.id !== selectedRating.id));
    setOpenDeleteDialog(false);
    setSelectedRating(null);
  };

  const handleMenuOpen = (event, rating) => {
    setAnchorEl(event.currentTarget);
    setSelectedRating(rating);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRating(null);
  };

  // Filter and sort ratings
  const filteredRatings = ratings.filter(rating => {
    if (activeTab === 1) return rating.isPublic;
    if (activeTab === 2) return !rating.isPublic;
    if (filterCategory === 'all') return true;
    return rating.store.category === filterCategory;
  });

  const sortedRatings = filteredRatings.sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.date) - new Date(a.date);
      case 'rating':
        return b.rating - a.rating;
      case 'helpful':
        return b.helpful - a.helpful;
      case 'store':
        return a.store.name.localeCompare(b.store.name);
      default:
        return 0;
    }
  });

  const RatingCard = ({ rating, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          mb: 2,
          '&:hover': {
            borderColor: '#667eea',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.1)'
          },
          transition: 'all 0.3s ease'
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Avatar
              src={rating.store.image}
              sx={{ width: 60, height: 60 }}
            />
            
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ 
                      fontWeight: 700,
                      cursor: 'pointer',
                      '&:hover': { color: '#667eea' }
                    }}
                    onClick={() => navigate(`/stores/${rating.store.id}`)}
                  >
                    {rating.store.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {rating.store.address}
                  </Typography>
                </Box>
                
                <IconButton
                  onClick={(e) => handleMenuOpen(e, rating)}
                  size="small"
                >
                  <MoreIcon />
                </IconButton>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Rating value={rating.rating} readOnly size="small" />
                <Chip
                  label={rating.store.category}
                  size="small"
                  sx={{
                    backgroundColor: '#667eea15',
                    color: '#667eea'
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {rating.date.toLocaleDateString()}
                </Typography>
              </Box>

              {rating.review && (
                <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
                  "{rating.review}"
                </Typography>
              )}

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {rating.helpful > 0 && (
                    <Chip
                      icon={<ThumbUpIcon />}
                      label={`${rating.helpful} helpful`}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  )}
                  {rating.photos > 0 && (
                    <Chip
                      label={`${rating.photos} photos`}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  )}
                  {!rating.isPublic && (
                    <Chip
                      label="Private"
                      size="small"
                      color="warning"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  )}
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(rating)}
                    sx={{ borderRadius: 2 }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    startIcon={<ShareIcon />}
                    sx={{ borderRadius: 2 }}
                  >
                    Share
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <FadeInUp>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                mb: 1
              }}
            >
              My Ratings & Reviews
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your store ratings and reviews
            </Typography>
          </Box>
        </FadeInUp>

        <Grid container spacing={3}>
          {/* Stats Cards */}
          <Grid item xs={12}>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={2}>
                <FadeInUp delay={0.1}>
                  <Card sx={{ borderRadius: 3, textAlign: 'center', py: 2 }}>
                    <Avatar sx={{ backgroundColor: '#667eea15', color: '#667eea', width: 48, height: 48, margin: '0 auto', mb: 1 }}>
                      <StarIcon />
                    </Avatar>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#667eea' }}>
                      <CountUp end={stats.totalRatings} />
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total Reviews
                    </Typography>
                  </Card>
                </FadeInUp>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FadeInUp delay={0.2}>
                  <Card sx={{ borderRadius: 3, textAlign: 'center', py: 2 }}>
                    <Avatar sx={{ backgroundColor: '#10b98115', color: '#10b981', width: 48, height: 48, margin: '0 auto', mb: 1 }}>
                      <TrendingIcon />
                    </Avatar>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#10b981' }}>
                      {stats.averageRating.toFixed(1)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Avg Rating
                    </Typography>
                  </Card>
                </FadeInUp>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FadeInUp delay={0.3}>
                  <Card sx={{ borderRadius: 3, textAlign: 'center', py: 2 }}>
                    <Avatar sx={{ backgroundColor: '#f59e0b15', color: '#f59e0b', width: 48, height: 48, margin: '0 auto', mb: 1 }}>
                      <ThumbUpIcon />
                    </Avatar>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                      <CountUp end={stats.helpfulVotes} />
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Helpful Votes
                    </Typography>
                  </Card>
                </FadeInUp>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FadeInUp delay={0.4}>
                  <Card sx={{ borderRadius: 3, textAlign: 'center', py: 2 }}>
                    <Avatar sx={{ backgroundColor: '#8b5cf615', color: '#8b5cf6', width: 48, height: 48, margin: '0 auto', mb: 1 }}>
                      <StoreIcon />
                    </Avatar>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#8b5cf6' }}>
                      <CountUp end={stats.categoriesRated} />
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Categories
                    </Typography>
                  </Card>
                </FadeInUp>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FadeInUp delay={0.5}>
                  <Card sx={{ borderRadius: 3, textAlign: 'center', py: 2 }}>
                    <Avatar sx={{ backgroundColor: '#ef444415', color: '#ef4444', width: 48, height: 48, margin: '0 auto', mb: 1 }}>
                      <FireIcon />
                    </Avatar>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#ef4444' }}>
                      <CountUp end={stats.publicReviews} />
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Public Reviews
                    </Typography>
                  </Card>
                </FadeInUp>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FadeInUp delay={0.6}>
                  <Card sx={{ borderRadius: 3, textAlign: 'center', py: 2 }}>
                    <Avatar sx={{ backgroundColor: '#06b6d415', color: '#06b6d4', width: 48, height: 48, margin: '0 auto', mb: 1 }}>
                      <AwardIcon />
                    </Avatar>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#06b6d4' }}>
                      <CountUp end={stats.photosShared} />
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Photos Shared
                    </Typography>
                  </Card>
                </FadeInUp>
              </Grid>
            </Grid>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} lg={8}>
            {/* Filters */}
            <SlideIn direction="left" delay={0.2}>
              <Paper sx={{ borderRadius: 3, p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Tabs
                    value={activeTab}
                    onChange={(e, newValue) => setActiveTab(newValue)}
                    sx={{
                      '& .MuiTab-root': {
                        textTransform: 'none',
                        fontWeight: 600
                      }
                    }}
                  >
                    <Tab label="All Reviews" />
                    <Tab label="Public" />
                    <Tab label="Private" />
                  </Tabs>
                </Box>

                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Category</InputLabel>
                      <Select
                        value={filterCategory}
                        label="Category"
                        onChange={(e) => setFilterCategory(e.target.value)}
                      >
                        <MenuItem value="all">All Categories</MenuItem>
                        <MenuItem value="Restaurant">Restaurant</MenuItem>
                        <MenuItem value="Electronics">Electronics</MenuItem>
                        <MenuItem value="Healthcare">Healthcare</MenuItem>
                        <MenuItem value="Fashion">Fashion</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Sort by</InputLabel>
                      <Select
                        value={sortBy}
                        label="Sort by"
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <MenuItem value="date">Recent First</MenuItem>
                        <MenuItem value="rating">Rating (High to Low)</MenuItem>
                        <MenuItem value="helpful">Most Helpful</MenuItem>
                        <MenuItem value="store">Store Name</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right' }}>
                      {sortedRatings.length} reviews found
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </SlideIn>

            {/* Ratings List */}
            <SlideIn direction="left" delay={0.3}>
              <Box>
                <AnimatePresence>
                  {sortedRatings.map((rating, index) => (
                    <RatingCard key={rating.id} rating={rating} index={index} />
                  ))}
                </AnimatePresence>
                
                {sortedRatings.length === 0 && (
                  <Paper sx={{ borderRadius: 3, p: 6, textAlign: 'center' }}>
                    <StarIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                      No reviews found
                    </Typography>
                    <Typography variant="body2" color="text.disabled" sx={{ mb: 3 }}>
                      Start rating stores to see them here
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => navigate('/user/browse')}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      }}
                    >
                      Browse Stores
                    </Button>
                  </Paper>
                )}
              </Box>
            </SlideIn>
          </Grid>

          {/* Rating Distribution Chart */}
          <Grid item xs={12} lg={4}>
            <SlideIn direction="right" delay={0.2}>
              <DonutChart
                title="Rating Distribution"
                data={ratingDistribution}
                height={350}
                showStats={true}
                centerMetric="average"
              />
            </SlideIn>

            {/* Recent Activity */}
            <SlideIn direction="right" delay={0.3}>
              <Paper sx={{ borderRadius: 3, mt: 3, overflow: 'hidden' }}>
                <Box sx={{
                  p: 3,
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                  borderBottom: 1,
                  borderColor: 'divider'
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Achievement Progress
                  </Typography>
                </Box>
                
                <Box sx={{ p: 3 }}>
                  {[
                    { label: 'First Review', progress: 100, color: '#10b981' },
                    { label: 'Explorer (5 reviews)', progress: 100, color: '#667eea' },
                    { label: 'Reviewer (10 reviews)', progress: 100, color: '#f59e0b' },
                    { label: 'Expert (25 reviews)', progress: (stats.totalRatings / 25) * 100, color: '#8b5cf6' }
                  ].map((achievement, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {achievement.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {Math.min(achievement.progress, 100).toFixed(0)}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(achievement.progress, 100)}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: achievement.color,
                            borderRadius: 3
                          }
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </Paper>
            </SlideIn>
          </Grid>
        </Grid>
      </Container>

      {/* Edit Rating Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Your Rating</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {selectedRating?.store.name}
            </Typography>
            
            <Typography variant="body2" sx={{ mb: 2 }}>
              Update your rating:
            </Typography>
            
            <Rating
              value={editRating}
              onChange={(e, newValue) => setEditRating(newValue)}
              size="large"
              sx={{ mb: 3 }}
            />
            
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Update your review"
              value={editReview}
              onChange={(e) => setEditReview(e.target.value)}
              placeholder="Share your updated experience..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            disabled={editRating === 0}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            Update Rating
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        title="Delete Rating"
        message={`Are you sure you want to delete your rating for ${selectedRating?.store.name}? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
      />

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          handleEdit(selectedRating);
          handleMenuClose();
        }}>
          <EditIcon sx={{ mr: 1 }} />
          Edit Rating
        </MenuItem>
        <MenuItem onClick={() => {
          handleDelete(selectedRating);
          handleMenuClose();
        }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete Rating
        </MenuItem>
        <MenuItem onClick={() => {
          navigate(`/stores/${selectedRating?.store.id}`);
          handleMenuClose();
        }}>
          <StoreIcon sx={{ mr: 1 }} />
          View Store
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default MyRatings;
