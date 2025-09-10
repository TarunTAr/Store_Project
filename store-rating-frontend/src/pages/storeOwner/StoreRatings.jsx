import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  Rating,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  LinearProgress,
  Badge,
  Divider,
  Alert
} from '@mui/material';
import {
  Star as StarIcon,
  Reply as ReplyIcon,
  MoreVert as MoreIcon,
  ThumbUp as ThumbUpIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingIcon,
  TrendingDown as TrendingDownIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Analytics as AnalyticsIcon,
  Person as PersonIcon,
  Chat as ChatIcon,
  Share as ShareIcon,
  Flag as FlagIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Import our custom components
import FadeInUp from '../../components/animations/FadeInUp';
import SlideIn from '../../components/animations/SlideIn';
import CountUp from '../../components/animations/CountUp';
import SearchBar from '../../components/common/SearchBar';
import DonutChart from '../../components/charts/DonutChart';
import LineChart from '../../components/charts/LineChart';

const StoreRatings = () => {
  const navigate = useNavigate();
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('date');
  const [order, setOrder] = useState('desc');
  const [filterRating, setFilterRating] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRating, setSelectedRating] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openReplyDialog, setOpenReplyDialog] = useState(false);
  const [replyText, setReplyText] = useState('');

  // Mock ratings data
  const mockRatings = [
    {
      id: 1,
      user: {
        name: 'John Smith Anderson Williams',
        email: 'john.smith@example.com',
        avatar: '/api/placeholder/40/40',
        joinedDate: '2023-08-15'
      },
      rating: 5,
      comment: 'Amazing pasta and excellent service! The ambiance was perfect for a dinner date. Highly recommend the tiramisu dessert. Will definitely come back again.',
      date: new Date('2024-03-10T19:30:00'),
      helpful: 12,
      replied: false,
      photos: 2,
      verified: true
    },
    {
      id: 2,
      user: {
        name: 'Sarah Johnson Miller Davis',
        email: 'sarah.johnson@example.com',
        avatar: '/api/placeholder/40/40',
        joinedDate: '2023-05-20'
      },
      rating: 4,
      comment: 'Great food quality but service was a bit slow during peak hours. The staff was friendly though.',
      date: new Date('2024-03-08T20:15:00'),
      helpful: 8,
      replied: true,
      replyText: 'Thank you for your feedback! We are working on improving our service during peak hours.',
      replyDate: new Date('2024-03-09T10:30:00'),
      photos: 1,
      verified: true
    },
    {
      id: 3,
      user: {
        name: 'Michael Chen Rodriguez Wilson',
        email: 'michael.chen@example.com',
        avatar: '/api/placeholder/40/40',
        joinedDate: '2023-12-01'
      },
      rating: 5,
      comment: 'Best Italian restaurant in the city! Highly recommend the seafood risotto.',
      date: new Date('2024-03-07T18:45:00'),
      helpful: 15,
      replied: false,
      photos: 3,
      verified: true
    },
    {
      id: 4,
      user: {
        name: 'Emily Rodriguez Thompson Brown',
        email: 'emily.rodriguez@example.com',
        avatar: '/api/placeholder/40/40',
        joinedDate: '2024-01-10'
      },
      rating: 3,
      comment: 'Food was okay but portions were smaller than expected for the price.',
      date: new Date('2024-03-05T19:00:00'),
      helpful: 3,
      replied: true,
      replyText: 'We appreciate your honest feedback and will review our portion sizes.',
      replyDate: new Date('2024-03-06T09:15:00'),
      photos: 0,
      verified: false
    },
    {
      id: 5,
      user: {
        name: 'David Kim Martinez Garcia Lopez',
        email: 'david.kim@example.com',
        avatar: '/api/placeholder/40/40',
        joinedDate: '2023-09-12'
      },
      rating: 2,
      comment: 'Disappointed with the service. Food took too long and arrived cold.',
      date: new Date('2024-03-03T20:30:00'),
      helpful: 5,
      replied: false,
      photos: 0,
      verified: true
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRatings(mockRatings);
      setLoading(false);
    }, 1000);
  }, []);

  // Calculate statistics
  const stats = {
    totalRatings: ratings.length,
    averageRating: ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length,
    responseRate: (ratings.filter(r => r.replied).length / ratings.length) * 100,
    pendingReplies: ratings.filter(r => !r.replied).length,
    ratingDistribution: {
      5: ratings.filter(r => r.rating === 5).length,
      4: ratings.filter(r => r.rating === 4).length,
      3: ratings.filter(r => r.rating === 3).length,
      2: ratings.filter(r => r.rating === 2).length,
      1: ratings.filter(r => r.rating === 1).length
    }
  };

  // Chart data
  const ratingDistributionData = {
    labels: ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'],
    datasets: [{
      data: [stats.ratingDistribution[5], stats.ratingDistribution[4], stats.ratingDistribution[3], stats.ratingDistribution[2], stats.ratingDistribution[1]],
      backgroundColor: ['#10b981', '#22c55e', '#eab308', '#f59e0b', '#ef4444']
    }]
  };

  const ratingTrendsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Average Rating',
      data: [4.2, 4.4, 4.6, 4.5, 4.7, stats.averageRating],
      borderColor: '#667eea',
      backgroundColor: 'rgba(102, 126, 234, 0.1)',
      tension: 0.4
    }]
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(0);
  };

  const handleMenuOpen = (event, rating) => {
    setAnchorEl(event.currentTarget);
    setSelectedRating(rating);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRating(null);
  };

  const handleReply = () => {
    setOpenReplyDialog(true);
    handleMenuClose();
  };

  const handleReplySubmit = () => {
    // Update the rating with reply
    setRatings(prev => prev.map(rating => 
      rating.id === selectedRating.id 
        ? { 
            ...rating, 
            replied: true,
            replyText: replyText,
            replyDate: new Date()
          }
        : rating
    ));
    setOpenReplyDialog(false);
    setReplyText('');
    setSelectedRating(null);
  };

  // Filter and sort ratings
  const filteredRatings = ratings.filter(rating => {
    const matchesSearch = !searchQuery || 
      rating.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rating.comment.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRating = filterRating === 'all' || rating.rating === parseInt(filterRating);
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'replied' && rating.replied) ||
      (filterStatus === 'pending' && !rating.replied);
    
    return matchesSearch && matchesRating && matchesStatus;
  });

  const sortedRatings = filteredRatings.sort((a, b) => {
    if (order === 'asc') {
      return a[orderBy] < b[orderBy] ? -1 : 1;
    } else {
      return a[orderBy] > b[orderBy] ? -1 : 1;
    }
  });

  const paginatedRatings = sortedRatings.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const RatingCard = ({ rating, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card
        sx={{
          borderRadius: 3,
          mb: 3,
          border: '1px solid',
          borderColor: 'divider',
          '&:hover': {
            borderColor: '#667eea',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.1)'
          },
          transition: 'all 0.3s ease'
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar src={rating.user.avatar}>
                {rating.user.name.charAt(0)}
              </Avatar>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {rating.user.name}
                  </Typography>
                  {rating.verified && (
                    <Chip label="Verified" size="small" color="success" />
                  )}
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Customer since {new Date(rating.user.joinedDate).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Rating value={rating.rating} readOnly size="small" />
              <IconButton
                size="small"
                onClick={(e) => handleMenuOpen(e, rating)}
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Box>

          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
            "{rating.comment}"
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                icon={<ThumbUpIcon />}
                label={`${rating.helpful} helpful`}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem' }}
              />
              {rating.photos > 0 && (
                <Chip
                  label={`${rating.photos} photos`}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
              )}
              <Chip
                label={formatDate(rating.date)}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem' }}
              />
            </Box>

            {!rating.replied ? (
              <Button
                size="small"
                startIcon={<ReplyIcon />}
                onClick={() => {
                  setSelectedRating(rating);
                  handleReply();
                }}
                sx={{
                  borderRadius: 2,
                  color: '#667eea',
                  '&:hover': {
                    backgroundColor: '#667eea10'
                  }
                }}
              >
                Reply
              </Button>
            ) : (
              <Chip
                label="Replied"
                size="small"
                color="success"
                sx={{ fontSize: '0.7rem' }}
              />
            )}
          </Box>

          {rating.replied && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                borderRadius: 2,
                backgroundColor: 'grey.50',
                border: '1px solid',
                borderColor: 'grey.200'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Your Reply
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(rating.replyDate)}
                </Typography>
              </Box>
              <Typography variant="body2">
                {rating.replyText}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <StarIcon sx={{ fontSize: 48, color: '#667eea' }} />
        </motion.div>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <FadeInUp>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
            <Box>
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
                Customer Reviews & Ratings
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Monitor and respond to customer feedback
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                sx={{
                  borderColor: '#667eea',
                  color: '#667eea',
                  borderRadius: 3
                }}
              >
                Export Data
              </Button>
              <Button
                variant="contained"
                startIcon={<AnalyticsIcon />}
                sx={{
                  px: 3,
                  py: 1.5,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                View Analytics
              </Button>
            </Box>
          </Box>
        </FadeInUp>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <FadeInUp delay={0.1}>
              <Card sx={{ borderRadius: 3, textAlign: 'center', py: 2 }}>
                <Avatar sx={{ backgroundColor: '#667eea15', color: '#667eea', width: 56, height: 56, margin: '0 auto', mb: 2 }}>
                  <StarIcon />
                </Avatar>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea' }}>
                  <CountUp end={stats.totalRatings} />
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Reviews
                </Typography>
              </Card>
            </FadeInUp>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FadeInUp delay={0.2}>
              <Card sx={{ borderRadius: 3, textAlign: 'center', py: 2 }}>
                <Avatar sx={{ backgroundColor: '#10b98115', color: '#10b981', width: 56, height: 56, margin: '0 auto', mb: 2 }}>
                  <TrendingIcon />
                </Avatar>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981' }}>
                  {stats.averageRating.toFixed(1)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average Rating
                </Typography>
              </Card>
            </FadeInUp>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FadeInUp delay={0.3}>
              <Card sx={{ borderRadius: 3, textAlign: 'center', py: 2 }}>
                <Avatar sx={{ backgroundColor: '#f59e0b15', color: '#f59e0b', width: 56, height: 56, margin: '0 auto', mb: 2 }}>
                  <ChatIcon />
                </Avatar>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                  {stats.responseRate.toFixed(0)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Response Rate
                </Typography>
              </Card>
            </FadeInUp>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FadeInUp delay={0.4}>
              <Card sx={{ borderRadius: 3, textAlign: 'center', py: 2 }}>
                <Badge badgeContent={stats.pendingReplies} color="error">
                  <Avatar sx={{ backgroundColor: '#ef444415', color: '#ef4444', width: 56, height: 56, margin: '0 auto', mb: 2 }}>
                    <ReplyIcon />
                  </Avatar>
                </Badge>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#ef4444' }}>
                  <CountUp end={stats.pendingReplies} />
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending Replies
                </Typography>
              </Card>
            </FadeInUp>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Rating Charts */}
          <Grid item xs={12} lg={8}>
            {/* Search and Filters */}
            <SlideIn direction="left" delay={0.2}>
              <Paper sx={{ borderRadius: 3, p: 3, mb: 3 }}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <SearchBar
                      placeholder="Search reviews by customer name or content..."
                      onSearch={handleSearch}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={2}>
                    <FormControl fullWidth>
                      <InputLabel>Rating</InputLabel>
                      <Select
                        value={filterRating}
                        label="Rating"
                        onChange={(e) => setFilterRating(e.target.value)}
                      >
                        <MenuItem value="all">All Ratings</MenuItem>
                        <MenuItem value="5">5 Stars</MenuItem>
                        <MenuItem value="4">4 Stars</MenuItem>
                        <MenuItem value="3">3 Stars</MenuItem>
                        <MenuItem value="2">2 Stars</MenuItem>
                        <MenuItem value="1">1 Star</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={2}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={filterStatus}
                        label="Status"
                        onChange={(e) => setFilterStatus(e.target.value)}
                      >
                        <MenuItem value="all">All Reviews</MenuItem>
                        <MenuItem value="replied">Replied</MenuItem>
                        <MenuItem value="pending">Pending Reply</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right' }}>
                      {filteredRatings.length} reviews found
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </SlideIn>

            {/* Reviews List */}
            <SlideIn direction="left" delay={0.3}>
              <Box>
                <AnimatePresence>
                  {paginatedRatings.map((rating, index) => (
                    <RatingCard key={rating.id} rating={rating} index={index} />
                  ))}
                </AnimatePresence>
                
                {paginatedRatings.length === 0 && (
                  <Paper sx={{ borderRadius: 3, p: 6, textAlign: 'center' }}>
                    <StarIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                      No reviews found
                    </Typography>
                    <Typography variant="body2" color="text.disabled">
                      Try adjusting your search criteria
                    </Typography>
                  </Paper>
                )}

                {/* Pagination */}
                {filteredRatings.length > rowsPerPage && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <TablePagination
                      component="div"
                      count={filteredRatings.length}
                      page={page}
                      onPageChange={(e, newPage) => setPage(newPage)}
                      rowsPerPage={rowsPerPage}
                      onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                      }}
                      rowsPerPageOptions={[5, 10, 25]}
                    />
                  </Box>
                )}
              </Box>
            </SlideIn>
          </Grid>

          {/* Analytics Sidebar */}
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              {/* Rating Distribution */}
              <Grid item xs={12}>
                <SlideIn direction="right" delay={0.2}>
                  <DonutChart
                    title="Rating Distribution"
                    data={ratingDistributionData}
                    height={300}
                    showStats={true}
                    centerMetric="average"
                  />
                </SlideIn>
              </Grid>

              {/* Rating Trends */}
              <Grid item xs={12}>
                <SlideIn direction="right" delay={0.3}>
                  <LineChart
                    title="Rating Trends"
                    data={ratingTrendsData}
                    height={250}
                    showArea={true}
                    animate={true}
                  />
                </SlideIn>
              </Grid>

              {/* Quick Stats */}
              <Grid item xs={12}>
                <SlideIn direction="right" delay={0.4}>
                  <Paper sx={{ borderRadius: 3, p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                      Review Insights
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Average Response Time: 4.2 hours
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={75}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#10b981',
                            borderRadius: 3
                          }
                        }}
                      />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Customer Satisfaction: 85%
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={85}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#667eea',
                            borderRadius: 3
                          }
                        }}
                      />
                    </Box>

                    <Alert severity="info" sx={{ borderRadius: 2, fontSize: '0.8rem' }}>
                      You have {stats.pendingReplies} reviews waiting for your response. 
                      Quick responses improve customer satisfaction!
                    </Alert>
                  </Paper>
                </SlideIn>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleReply} disabled={selectedRating?.replied}>
          <ReplyIcon sx={{ mr: 1 }} />
          Reply to Review
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <PersonIcon sx={{ mr: 1 }} />
          View Customer Profile
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ShareIcon sx={{ mr: 1 }} />
          Share Review
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <FlagIcon sx={{ mr: 1 }} />
          Report Review
        </MenuItem>
      </Menu>

      {/* Reply Dialog */}
      <Dialog
        open={openReplyDialog}
        onClose={() => setOpenReplyDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Reply to Customer Review</DialogTitle>
        <DialogContent>
          {selectedRating && (
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar src={selectedRating.user.avatar}>
                  {selectedRating.user.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {selectedRating.user.name}
                  </Typography>
                  <Rating value={selectedRating.rating} readOnly size="small" />
                </Box>
              </Box>
              <Paper sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="body2">
                  "{selectedRating.comment}"
                </Typography>
              </Paper>
            </Box>
          )}
          
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your Reply"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Thank you for your feedback! We appreciate your review and..."
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: 2 }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReplyDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleReplySubmit}
            variant="contained"
            disabled={!replyText.trim()}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            Send Reply
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StoreRatings;
