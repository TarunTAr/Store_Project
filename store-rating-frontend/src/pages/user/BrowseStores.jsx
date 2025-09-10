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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Slider,
  Switch,
  FormControlLabel,
  Badge
} from '@mui/material';
import {
  Store as StoreIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  Phone as PhoneIcon,
  Language as WebsiteIcon,
  GridView as GridViewIcon,
  ViewList as ListViewIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Search as SearchIcon,
  Category as CategoryIcon,
  TrendingUp as TrendingIcon,
  Schedule as ScheduleIcon,
  Reviews as ReviewsIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Import our custom components
import FadeInUp from '../../components/animations/FadeInUp';
import SlideIn from '../../components/animations/SlideIn';
import Bounce from '../../components/animations/Bounce';
import SearchBar from '../../components/common/SearchBar';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const BrowseStores = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('rating');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [storesPerPage] = useState(12);
  const [favorites, setFavorites] = useState(new Set([1, 3, 5]));
  const [openRatingDialog, setOpenRatingDialog] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  // Mock stores data
  const mockStores = [
    {
      id: 1,
      name: "Milano's Italian Restaurant",
      address: "123 Main Street, Downtown City",
      category: "Restaurant",
      rating: 4.8,
      reviewCount: 1250,
      image: "/api/placeholder/300/200",
      phone: "+1 (555) 123-4567",
      website: "https://milanos.com",
      userRating: 5,
      description: "Authentic Italian cuisine with a modern twist",
      priceRange: "$$$",
      openNow: true,
      distance: "0.5 km"
    },
    {
      id: 2,
      name: "TechHub Electronics Store",
      address: "456 Tech Avenue, Silicon Valley",
      category: "Electronics",
      rating: 4.6,
      reviewCount: 890,
      image: "/api/placeholder/300/200",
      phone: "+1 (555) 234-5678",
      website: "https://techhub.com",
      userRating: null,
      description: "Your one-stop shop for latest gadgets and electronics",
      priceRange: "$$",
      openNow: true,
      distance: "1.2 km"
    },
    {
      id: 3,
      name: "Green Gardens Pharmacy",
      address: "789 Health Boulevard, Wellness District",
      category: "Healthcare",
      rating: 4.9,
      reviewCount: 2100,
      image: "/api/placeholder/300/200",
      phone: "+1 (555) 345-6789",
      website: "https://greengardens.com",
      userRating: 4,
      description: "Trusted healthcare and wellness solutions",
      priceRange: "$$",
      openNow: false,
      distance: "2.1 km"
    },
    {
      id: 4,
      name: "Fashion Forward Boutique",
      address: "321 Style Street, Fashion District",
      category: "Fashion",
      rating: 4.3,
      reviewCount: 567,
      image: "/api/placeholder/300/200",
      phone: "+1 (555) 456-7890",
      website: "https://fashionforward.com",
      userRating: null,
      description: "Trendy fashion and accessories for modern lifestyle",
      priceRange: "$$$",
      openNow: true,
      distance: "1.8 km"
    },
    {
      id: 5,
      name: "Auto Care Service Center",
      address: "654 Motor Way, Industrial Area",
      category: "Automotive",
      rating: 4.5,
      reviewCount: 432,
      image: "/api/placeholder/300/200",
      phone: "+1 (555) 567-8901",
      website: "https://autocare.com",
      userRating: null,
      description: "Professional automotive repair and maintenance services",
      priceRange: "$$",
      openNow: true,
      distance: "3.5 km"
    },
    {
      id: 6,
      name: "Books & Beyond",
      address: "987 Literary Lane, Knowledge Quarter",
      category: "Books",
      rating: 4.7,
      reviewCount: 734,
      image: "/api/placeholder/300/200",
      phone: "+1 (555) 678-9012",
      website: "https://booksbeyond.com",
      userRating: null,
      description: "Wide selection of books, magazines, and stationery",
      priceRange: "$",
      openNow: true,
      distance: "1.1 km"
    }
  ];

  const categories = [
    'All Categories', 'Restaurant', 'Electronics', 'Healthcare', 
    'Fashion', 'Automotive', 'Books', 'Grocery', 'Beauty', 'Sports'
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStores(mockStores);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleFavoriteToggle = (storeId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(storeId)) {
        newFavorites.delete(storeId);
      } else {
        newFavorites.add(storeId);
      }
      return newFavorites;
    });
  };

  const handleRatingSubmit = () => {
    console.log('Rating submitted:', { store: selectedStore?.id, rating: userRating, review: reviewText });
    // Update store rating in the list
    setStores(prev => prev.map(store => 
      store.id === selectedStore?.id 
        ? { ...store, userRating: userRating }
        : store
    ));
    setOpenRatingDialog(false);
    setUserRating(0);
    setReviewText('');
    setSelectedStore(null);
  };

  // Filter and sort stores
  const filteredStores = stores.filter(store => {
    const matchesSearch = !searchQuery || 
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || 
      filterCategory === 'All Categories' || 
      store.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const sortedStores = filteredStores.sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'reviews':
        return b.reviewCount - a.reviewCount;
      case 'distance':
        return parseFloat(a.distance) - parseFloat(b.distance);
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const paginatedStores = sortedStores.slice(
    (page - 1) * storesPerPage,
    page * storesPerPage
  );

  const StoreCard = ({ store, index }) => (
    <motion.div
      key={store.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid',
          borderColor: 'divider',
          '&:hover': {
            borderColor: '#667eea',
            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.15)',
            transform: 'translateY(-4px)'
          },
          transition: 'all 0.3s ease'
        }}
      >
        {/* Store Image */}
        <Box
          sx={{
            height: 200,
            backgroundImage: `url(${store.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative'
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              display: 'flex',
              gap: 1
            }}
          >
            <Chip
              label={store.category}
              size="small"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 600
              }}
            />
            {store.openNow && (
              <Chip
                label="Open"
                size="small"
                color="success"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  color: 'success.main'
                }}
              />
            )}
          </Box>

          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 12
            }}
          >
            <IconButton
              onClick={() => handleFavoriteToggle(store.id)}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 1)'
                }
              }}
            >
              {favorites.has(store.id) ? (
                <FavoriteIcon sx={{ color: '#ef4444' }} />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
          </Box>

          <Box
            sx={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              px: 1.5,
              py: 0.5,
              borderRadius: 2
            }}
          >
            <StarIcon sx={{ fontSize: 16, color: '#ffd700' }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {store.rating}
            </Typography>
            <Typography variant="caption">
              ({store.reviewCount})
            </Typography>
          </Box>
        </Box>

        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            {store.name}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flex: 1 }}>
            {store.description}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <LocationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
              {store.distance} • {store.address}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip label={store.priceRange} size="small" variant="outlined" />
              <Chip label={`${store.reviewCount} reviews`} size="small" variant="outlined" />
            </Box>
          </Box>

          {/* User's Rating Display */}
          {store.userRating ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Your rating:
              </Typography>
              <Rating value={store.userRating} size="small" readOnly />
              <Button
                size="small"
                onClick={() => {
                  setSelectedStore(store);
                  setUserRating(store.userRating);
                  setOpenRatingDialog(true);
                }}
                sx={{ ml: 'auto', fontSize: '0.75rem' }}
              >
                Modify
              </Button>
            </Box>
          ) : (
            <Box sx={{ mb: 2 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<StarIcon />}
                onClick={() => {
                  setSelectedStore(store);
                  setUserRating(0);
                  setOpenRatingDialog(true);
                }}
                sx={{
                  borderRadius: 2,
                  borderColor: '#667eea',
                  color: '#667eea',
                  '&:hover': {
                    borderColor: '#764ba2',
                    backgroundColor: 'rgba(102, 126, 234, 0.05)'
                  }
                }}
              >
                Rate Store
              </Button>
            </Box>
          )}
        </CardContent>

        <CardActions sx={{ px: 2, pb: 2 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => navigate(`/stores/${store.id}`)}
            sx={{
              borderRadius: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
              }
            }}
          >
            View Details
          </Button>
        </CardActions>
      </Card>
    </motion.div>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

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
              Browse Stores
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Discover amazing stores in your area and share your experiences
            </Typography>
          </Box>
        </FadeInUp>

        {/* Search and Filters */}
        <SlideIn direction="up" delay={0.1}>
          <Paper sx={{ borderRadius: 3, p: 3, mb: 3 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <SearchBar
                  placeholder="Search stores by name or address..."
                  onSearch={handleSearch}
                />
              </Grid>
              
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={filterCategory}
                    label="Category"
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    {categories.map(category => (
                      <MenuItem key={category} value={category === 'All Categories' ? 'all' : category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Sort by</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort by"
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <MenuItem value="rating">Rating</MenuItem>
                    <MenuItem value="reviews">Review Count</MenuItem>
                    <MenuItem value="distance">Distance</MenuItem>
                    <MenuItem value="name">Name</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={2}>
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={(e, newView) => newView && setViewMode(newView)}
                  size="small"
                >
                  <ToggleButton value="grid">
                    <GridViewIcon />
                  </ToggleButton>
                  <ToggleButton value="list">
                    <ListViewIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>
              
              <Grid item xs={12} md={2}>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                  {filteredStores.length} stores found
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </SlideIn>

        {/* Stores Grid */}
        {paginatedStores.length > 0 ? (
          <>
            <FadeInUp delay={0.2}>
              <Grid container spacing={3}>
                {paginatedStores.map((store, index) => (
                  <Grid item xs={12} sm={6} md={viewMode === 'grid' ? 4 : 12} key={store.id}>
                    <StoreCard store={store} index={index} />
                  </Grid>
                ))}
              </Grid>
            </FadeInUp>

            {/* Pagination */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={Math.ceil(filteredStores.length / storesPerPage)}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
                size="large"
              />
            </Box>
          </>
        ) : (
          <FadeInUp delay={0.2}>
            <Paper sx={{ borderRadius: 3, p: 6, textAlign: 'center' }}>
              <StoreIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                No stores found
              </Typography>
              <Typography variant="body2" color="text.disabled">
                Try adjusting your search criteria or browse different categories
              </Typography>
            </Paper>
          </FadeInUp>
        )}
      </Container>

      {/* Rating Dialog */}
      <Dialog
        open={openRatingDialog}
        onClose={() => setOpenRatingDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedStore?.userRating ? 'Update Your Rating' : 'Rate Store'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {selectedStore?.name}
            </Typography>
            
            <Typography variant="body2" sx={{ mb: 3 }}>
              How would you rate your experience at this store?
            </Typography>
            
            <Rating
              value={userRating}
              onChange={(e, newValue) => setUserRating(newValue)}
              size="large"
              sx={{ mb: 3 }}
            />
            
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Write a review (optional)"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience with other users..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRatingDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleRatingSubmit}
            variant="contained"
            disabled={userRating === 0}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            {selectedStore?.userRating ? 'Update Rating' : 'Submit Rating'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BrowseStores;
