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
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  LinearProgress,
  Badge,
  Alert,
  Divider,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import {
  Chat as ChatIcon,
  Reply as ReplyIcon,
  MoreVert as MoreIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Sentiment as SentimentIcon,
  SentimentVeryDissatisfied as NegativeIcon,
  SentimentNeutral as NeutralIcon,
  SentimentVerySatisfied as PositiveIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Download as DownloadIcon,
  Analytics as AnalyticsIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Star as StarIcon,
  Flag as FlagIcon,
  Archive as ArchiveIcon,
  Visibility as ViewIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Import our custom components
import FadeInUp from '../../components/animations/FadeInUp';
import SlideIn from '../../components/animations/SlideIn';
import CountUp from '../../components/animations/CountUp';
import SearchBar from '../../components/common/SearchBar';
import DonutChart from '../../components/charts/DonutChart';
import LineChart from '../../components/charts/LineChart';
import BarChart from '../../components/charts/BarChart';

const CustomerFeedback = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSentiment, setFilterSentiment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openReplyDialog, setOpenReplyDialog] = useState(false);
  const [replyText, setReplyText] = useState('');

  // Mock customer feedback data
  const mockFeedback = [
    {
      id: 1,
      user: {
        name: 'John Smith Anderson Williams',
        email: 'john.smith@example.com',
        avatar: '/api/placeholder/40/40',
        loyaltyLevel: 'Gold'
      },
      rating: 5,
      comment: 'Outstanding service and amazing food quality! The staff was incredibly friendly and attentive. The ambiance is perfect for both family dinners and romantic dates.',
      date: new Date('2024-03-10T19:30:00'),
      sentiment: 'positive',
      helpful: 15,
      replied: false,
      category: 'service',
      tags: ['food-quality', 'staff', 'ambiance'],
      photos: 3,
      verified: true,
      source: 'website'
    },
    {
      id: 2,
      user: {
        name: 'Sarah Johnson Miller Davis',
        email: 'sarah.johnson@example.com',
        avatar: '/api/placeholder/40/40',
        loyaltyLevel: 'Silver'
      },
      rating: 4,
      comment: 'Good food but the wait time was longer than expected during peak hours. The pasta was delicious though.',
      date: new Date('2024-03-08T20:15:00'),
      sentiment: 'neutral',
      helpful: 8,
      replied: true,
      replyText: 'Thank you for your feedback! We are working on reducing wait times during peak hours.',
      replyDate: new Date('2024-03-09T10:30:00'),
      category: 'wait-time',
      tags: ['wait-time', 'food-quality'],
      photos: 1,
      verified: true,
      source: 'google'
    },
    {
      id: 3,
      user: {
        name: 'Michael Chen Rodriguez',
        email: 'michael.chen@example.com',
        avatar: '/api/placeholder/40/40',
        loyaltyLevel: 'Bronze'
      },
      rating: 2,
      comment: 'Very disappointed with the service. Food arrived cold and the staff seemed disinterested. Expected much better.',
      date: new Date('2024-03-05T18:45:00'),
      sentiment: 'negative',
      helpful: 12,
      replied: false,
      category: 'service',
      tags: ['cold-food', 'poor-service'],
      photos: 0,
      verified: true,
      source: 'yelp'
    },
    {
      id: 4,
      user: {
        name: 'Emily Rodriguez Thompson',
        email: 'emily.rodriguez@example.com',
        avatar: '/api/placeholder/40/40',
        loyaltyLevel: 'Gold'
      },
      rating: 5,
      comment: 'Absolutely fantastic! Best Italian restaurant in the city. The tiramisu is to die for!',
      date: new Date('2024-03-03T19:20:00'),
      sentiment: 'positive',
      helpful: 20,
      replied: true,
      replyText: 'Thank you so much! We are delighted you enjoyed our tiramisu!',
      replyDate: new Date('2024-03-04T09:15:00'),
      category: 'food',
      tags: ['food-quality', 'dessert'],
      photos: 2,
      verified: true,
      source: 'website'
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setFeedback(mockFeedback);
      setLoading(false);
    }, 1000);
  }, []);

  // Calculate feedback statistics
  const stats = {
    total: feedback.length,
    positive: feedback.filter(f => f.sentiment === 'positive').length,
    neutral: feedback.filter(f => f.sentiment === 'neutral').length,
    negative: feedback.filter(f => f.sentiment === 'negative').length,
    replied: feedback.filter(f => f.replied).length,
    pending: feedback.filter(f => !f.replied).length,
    averageRating: feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length,
    responseRate: (feedback.filter(f => f.replied).length / feedback.length) * 100
  };

  // Chart data
  const sentimentData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [{
      data: [stats.positive, stats.neutral, stats.negative],
      backgroundColor: ['#10b981', '#eab308', '#ef4444']
    }]
  };

  const feedbackTrendsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Positive Feedback',
      data: [45, 52, 48, 61, 58, 67],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
    }, {
      label: 'Negative Feedback',
      data: [12, 8, 15, 10, 7, 5],
      borderColor: '#ef4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
    }]
  };

  const categoryBreakdownData = {
    labels: ['Service', 'Food Quality', 'Wait Time', 'Ambiance', 'Value'],
    datasets: [{
      data: [35, 28, 18, 12, 7],
      backgroundColor: ['#667eea', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444']
    }]
  };

  const handleMenuOpen = (event, feedbackItem) => {
    setAnchorEl(event.currentTarget);
    setSelectedFeedback(feedbackItem);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedFeedback(null);
  };

  const handleReply = () => {
    setOpenReplyDialog(true);
    handleMenuClose();
  };

  const handleReplySubmit = () => {
    setFeedback(prev => prev.map(item => 
      item.id === selectedFeedback.id 
        ? { 
            ...item, 
            replied: true,
            replyText: replyText,
            replyDate: new Date()
          }
        : item
    ));
    setOpenReplyDialog(false);
    setReplyText('');
    setSelectedFeedback(null);
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return <PositiveIcon sx={{ color: '#10b981' }} />;
      case 'neutral':
        return <NeutralIcon sx={{ color: '#eab308' }} />;
      case 'negative':
        return <NegativeIcon sx={{ color: '#ef4444' }} />;
      default:
        return <SentimentIcon />;
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '#10b981';
      case 'neutral': return '#eab308';
      case 'negative': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const FeedbackCard = ({ feedbackItem, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card
        sx={{
          borderRadius: 3,
          mb: 2,
          border: '1px solid',
          borderColor: 'divider',
          '&:hover': {
            borderColor: getSentimentColor(feedbackItem.sentiment),
            boxShadow: `0 4px 15px ${getSentimentColor(feedbackItem.sentiment)}20`
          },
          transition: 'all 0.3s ease'
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Badge
                badgeContent={feedbackItem.loyaltyLevel}
                color={feedbackItem.loyaltyLevel === 'Gold' ? 'warning' : 
                       feedbackItem.loyaltyLevel === 'Silver' ? 'info' : 'default'}
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.6rem',
                    minWidth: '16px',
                    height: '16px'
                  }
                }}
              >
                <Avatar src={feedbackItem.user.avatar}>
                  {feedbackItem.user.name.charAt(0)}
                </Avatar>
              </Badge>
              
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {feedbackItem.user.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Rating value={feedbackItem.rating} size="small" readOnly />
                  <Typography variant="caption" color="text.secondary">
                    {feedbackItem.date.toLocaleDateString()}
                  </Typography>
                  <Chip
                    label={feedbackItem.source}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem', height: 20 }}
                  />
                </Box>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {getSentimentIcon(feedbackItem.sentiment)}
              <IconButton size="small" onClick={(e) => handleMenuOpen(e, feedbackItem)}>
                <MoreIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Comment */}
          <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
            "{feedbackItem.comment}"
          </Typography>

          {/* Tags */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
            <Chip
              label={feedbackItem.category}
              size="small"
              sx={{
                backgroundColor: `${getSentimentColor(feedbackItem.sentiment)}20`,
                color: getSentimentColor(feedbackItem.sentiment),
                fontSize: '0.7rem'
              }}
            />
            {feedbackItem.tags.slice(0, 2).map((tag, tagIndex) => (
              <Chip
                key={tagIndex}
                label={tag}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem' }}
              />
            ))}
          </Box>

          {/* Action Bar */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                icon={<ThumbUpIcon />}
                label={`${feedbackItem.helpful} helpful`}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem' }}
              />
              {feedbackItem.photos > 0 && (
                <Chip
                  label={`${feedbackItem.photos} photos`}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem' }}
                />
              )}
              {feedbackItem.verified && (
                <Chip
                  label="Verified"
                  size="small"
                  color="success"
                  sx={{ fontSize: '0.7rem' }}
                />
              )}
            </Box>

            {!feedbackItem.replied ? (
              <Button
                size="small"
                startIcon={<ReplyIcon />}
                onClick={() => {
                  setSelectedFeedback(feedbackItem);
                  handleReply();
                }}
                sx={{
                  borderRadius: 2,
                  color: getSentimentColor(feedbackItem.sentiment),
                  '&:hover': {
                    backgroundColor: `${getSentimentColor(feedbackItem.sentiment)}10`
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

          {/* Reply Display */}
          {feedbackItem.replied && (
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
                  {feedbackItem.replyDate?.toLocaleDateString()}
                </Typography>
              </Box>
              <Typography variant="body2">
                {feedbackItem.replyText}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderFeedbackTab = () => (
    <Box>
      {/* Filters */}
      <SlideIn direction="up" delay={0.1}>
        <Paper sx={{ borderRadius: 3, p: 3, mb: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <SearchBar
                placeholder="Search feedback by customer name or content..."
                onSearch={setSearchQuery}
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Sentiment</InputLabel>
                <Select
                  value={filterSentiment}
                  label="Sentiment"
                  onChange={(e) => setFilterSentiment(e.target.value)}
                >
                  <MenuItem value="all">All Sentiments</MenuItem>
                  <MenuItem value="positive">Positive</MenuItem>
                  <MenuItem value="neutral">Neutral</MenuItem>
                  <MenuItem value="negative">Negative</MenuItem>
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
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="replied">Replied</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(e, newMode) => newMode && setViewMode(newMode)}
                size="small"
              >
                <ToggleButton value="cards">Cards</ToggleButton>
                <ToggleButton value="list">List</ToggleButton>
              </ToggleButtonGroup>
            </Grid>

            <Grid item xs={12} md={2}>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right' }}>
                {feedback.length} reviews
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </SlideIn>

      {/* Feedback List */}
      <SlideIn direction="up" delay={0.2}>
        <Box>
          <AnimatePresence>
            {feedback.map((item, index) => (
              <FeedbackCard key={item.id} feedbackItem={item} index={index} />
            ))}
          </AnimatePresence>
        </Box>
      </SlideIn>
    </Box>
  );

  const renderAnalyticsTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <DonutChart
          title="Sentiment Analysis"
          data={sentimentData}
          height={300}
          showStats={true}
          centerMetric="total"
        />
      </Grid>
      
      <Grid item xs={12} md={4}>
        <DonutChart
          title="Feedback Categories"
          data={categoryBreakdownData}
          height={300}
          showStats={true}
        />
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Card sx={{ borderRadius: 3, height: 300 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Key Insights
            </Typography>
            
            <List sx={{ p: 0 }}>
              <ListItem sx={{ px: 0, py: 1 }}>
                <ListItemText
                  primary="Response Rate"
                  secondary={`${stats.responseRate.toFixed(1)}%`}
                  secondaryTypographyProps={{
                    sx: { fontWeight: 600, color: '#10b981' }
                  }}
                />
              </ListItem>
              
              <ListItem sx={{ px: 0, py: 1 }}>
                <ListItemText
                  primary="Average Rating"
                  secondary={stats.averageRating.toFixed(1)}
                  secondaryTypographyProps={{
                    sx: { fontWeight: 600, color: '#667eea' }
                  }}
                />
              </ListItem>
              
              <ListItem sx={{ px: 0, py: 1 }}>
                <ListItemText
                  primary="Pending Replies"
                  secondary={stats.pending}
                  secondaryTypographyProps={{
                    sx: { fontWeight: 600, color: '#ef4444' }
                  }}
                />
              </ListItem>
            </List>

            <Alert severity="info" sx={{ mt: 2, borderRadius: 2, fontSize: '0.8rem' }}>
              {stats.positive > stats.negative ? 
                'Great job! Your positive feedback outweighs negative.' :
                'Focus on addressing negative feedback to improve satisfaction.'
              }
            </Alert>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12}>
        <LineChart
          title="Feedback Trends Over Time"
          data={feedbackTrendsData}
          height={350}
          showArea={true}
          animate={true}
        />
      </Grid>
    </Grid>
  );

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
                Customer Feedback
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Analyze and respond to customer feedback across all platforms
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
                Export Report
              </Button>
            </Box>
          </Box>
        </FadeInUp>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <FadeInUp delay={0.1}>
              <Card sx={{ borderRadius: 3, textAlign: 'center', py: 2 }}>
                <Avatar sx={{ backgroundColor: '#10b98115', color: '#10b981', width: 56, height: 56, margin: '0 auto', mb: 2 }}>
                  <PositiveIcon />
                </Avatar>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981' }}>
                  <CountUp end={stats.positive} />
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Positive Feedback
                </Typography>
              </Card>
            </FadeInUp>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FadeInUp delay={0.2}>
              <Card sx={{ borderRadius: 3, textAlign: 'center', py: 2 }}>
                <Avatar sx={{ backgroundColor: '#eab30815', color: '#eab308', width: 56, height: 56, margin: '0 auto', mb: 2 }}>
                  <NeutralIcon />
                </Avatar>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#eab308' }}>
                  <CountUp end={stats.neutral} />
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Neutral Feedback
                </Typography>
              </Card>
            </FadeInUp>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FadeInUp delay={0.3}>
              <Card sx={{ borderRadius: 3, textAlign: 'center', py: 2 }}>
                <Avatar sx={{ backgroundColor: '#ef444415', color: '#ef4444', width: 56, height: 56, margin: '0 auto', mb: 2 }}>
                  <NegativeIcon />
                </Avatar>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#ef4444' }}>
                  <CountUp end={stats.negative} />
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Negative Feedback
                </Typography>
              </Card>
            </FadeInUp>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FadeInUp delay={0.4}>
              <Card sx={{ borderRadius: 3, textAlign: 'center', py: 2 }}>
                <Badge badgeContent={stats.pending} color="error">
                  <Avatar sx={{ backgroundColor: '#667eea15', color: '#667eea', width: 56, height: 56, margin: '0 auto', mb: 2 }}>
                    <ReplyIcon />
                  </Avatar>
                </Badge>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea' }}>
                  {stats.responseRate.toFixed(0)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Response Rate
                </Typography>
              </Card>
            </FadeInUp>
          </Grid>
        </Grid>

        {/* Feedback Tabs */}
        <SlideIn direction="up" delay={0.2}>
          <Paper sx={{ borderRadius: 3, overflow: 'hidden', mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{
                backgroundColor: 'grey.50',
                '& .MuiTab-root': {
                  fontWeight: 600,
                  textTransform: 'none',
                  minHeight: 64,
                  '&.Mui-selected': {
                    color: '#667eea'
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#667eea',
                  height: 3
                }
              }}
            >
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ChatIcon />
                    Feedback ({stats.total})
                  </Box>
                }
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AnalyticsIcon />
                    Analytics
                  </Box>
                }
              />
            </Tabs>
          </Paper>
        </SlideIn>

        {/* Tab Content */}
        <FadeInUp delay={0.3} key={activeTab}>
          {activeTab === 0 && renderFeedbackTab()}
          {activeTab === 1 && renderAnalyticsTab()}
        </FadeInUp>
      </Container>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleReply} disabled={selectedFeedback?.replied}>
          <ReplyIcon sx={{ mr: 1 }} />
          Reply to Feedback
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <PersonIcon sx={{ mr: 1 }} />
          View Customer Profile
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ViewIcon sx={{ mr: 1 }} />
          View Full Details
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose}>
          <ArchiveIcon sx={{ mr: 1 }} />
          Archive Feedback
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <FlagIcon sx={{ mr: 1 }} />
          Report Inappropriate
        </MenuItem>
      </Menu>

      {/* Reply Dialog */}
      <Dialog
        open={openReplyDialog}
        onClose={() => setOpenReplyDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Reply to Customer Feedback</DialogTitle>
        <DialogContent>
          {selectedFeedback && (
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar src={selectedFeedback.user.avatar}>
                  {selectedFeedback.user.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {selectedFeedback.user.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating value={selectedFeedback.rating} readOnly size="small" />
                    {getSentimentIcon(selectedFeedback.sentiment)}
                  </Box>
                </Box>
              </Box>
              <Paper sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="body2">
                  "{selectedFeedback.comment}"
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
            placeholder="Thank you for your valuable feedback! We appreciate you taking the time to..."
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
            startIcon={<SendIcon />}
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

export default CustomerFeedback;
