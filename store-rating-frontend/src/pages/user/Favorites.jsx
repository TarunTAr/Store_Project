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
  CardMedia,
  Button,
  Avatar,
  Chip,
  Rating,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Menu,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Fab
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  GridView as GridViewIcon,
  ViewList as ListViewIcon,
  Sort as SortIcon,
  FilterList as FilterIcon,
  Share as ShareIcon,
  DirectionsWalk as DirectionsIcon,
  Phone as PhoneIcon,
  Language as WebsiteIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  Store as StoreIcon,
  LocationOn as LocationIcon,
  MoreVert as MoreIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  Category as CategoryIcon,
  TrendingUp as TrendingIcon,
  LocalOffer as OfferIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Import our custom components
import FadeInUp from '../../components/animations/FadeInUp';
import SlideIn from '../../components/animations/SlideIn';
import Bounce from '../../components/animations/Bounce';
import CountUp from '../../components/animations/CountUp';
import SearchBar from '../../components/common/SearchBar';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('dateAdded');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [openRemoveDialog, setOpenRemoveDialog] = useState(false);

  // Mock favorites data
  const mockFavorites = [
    {
      id: 1,
      name: "Milano's Italian Restaurant",
      category: "Restaurant",
      rating: 4.8,
      reviewCount: 1250,
      userRating: 5,
      image: "/api/placeholder/300/200",
      address: "123 Main Street, Downtown City",
      phone: "+1 (555) 123-4567",
      website: "https://milanos.com",
      distance: "0.5 km",
      priceRange: "$$$",
      openNow: true,
      dateAdded: new Date('2024-03-01'),
      lastVisited: new Date('2024-03-10'),
      tags: ['Italian', 'Romantic', 'Fine Dining'],
      offers: 2
    },
    {
      id: 2,
      name: "TechHub Electronics Store",
      category: "Electronics",
      rating: 4.6,
      reviewCount: 890,
      userRating: 4,
      image: "/api/placeholder/300/200",
      address: "456 Tech Avenue, Silicon Valley",
      phone: "+1 (555) 234-5678",
      website: "https://techhub.com",
      distance: "1.2 km",
      priceRange: "$$",
      openNow: true,
      dateAdded: new Date('2024-02-28'),
      lastVisited: new Date('2024-03-08'),
      tags: ['Electronics', 'Gadgets', 'Tech Support'],
      offers: 1
    },
    {
      id: 3,
      name: "Green Gardens Pharmacy",
      category: "Healthcare",
      rating: 4.9,
      reviewCount: 2100,
      userRating: 4,
      image: "/api/placeholder/300/200",
      address: "789 Health Boulevard, Medical Center",
      phone: "+1 (555) 345-6789",
      website: "https://greengardens.com",
      distance: "2.1 km",
      priceRange: "$$",
      openNow: false,
      dateAdded: new Date('2024-02-25'),
      lastVisited: new Date('2024-03-05'),
      tags: ['Pharmacy', 'Healthcare', '24/7'],
      offers: 0
    },
    {
      id: 4,
      name: "Coffee Corner Cafe",
      category: "Restaurant",
      rating: 4.7,
      reviewCount: 567,
      userRating: 5,
      image: "/api/placeholder/300/200",
      address: "567 Brew Street, Arts District",
      phone: "+1 (555) 456-7890",
      website: "https://coffeecorner.com",
      distance: "0.8 km",
      priceRange: "$",
      openNow: true,
      dateAdded: new Date('2024-02-20'),
      lastVisited: new Date('2024-03-12'),
      tags: ['Coffee', 'Cozy', 'WiFi'],
      offers: 3
    },
    {
      id: 5,
      name: "Fashion Forward Boutique",
      category: "Fashion",
      rating: 4.3,
      reviewCount: 423,
      userRating: 3,
      image: "/api/placeholder/300/200",
      address: "321 Style Street, Fashion District",
      phone: "+1 (555) 567-8901",
      website: "https://fashionforward.com",
      distance: "1.8 km",
      priceRange: "$$$",
      openNow: true,
      dateAdded: new Date('2024-02-15'),
      lastVisited: null,
      tags: ['Fashion', 'Trendy', 'Designer'],
      offers: 1
    }
  ];

  const categories = [
    'All Categories', 'Restaurant', 'Electronics', 'Healthcare', 
    'Fashion', 'Automotive', 'Books', 'Sports'
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFavorites(mockFavorites);
      setLoading(false);
    }, 1000);
  }, []);

  const handleRemoveFromFavorites = (storeId) => {
    setFavorites(prev => prev.filter(store => store.id !== storeId));
    setOpenRemoveDialog(false);
    setSelectedStore(null);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleMenuOpen = (event, store) => {
    setAnchorEl(event.currentTarget);
    setSelectedStore(store);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedStore(null);
  };

  // Filter and sort favorites
  const filteredFavorites = favorites.filter(store => {
    const matchesSearch = !searchQuery || 
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = filterCategory === 'all' || 
      filterCategory === 'All Categories' || 
      store.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const sortedFavorites = filteredFavorites.sort((a, b) => {
    switch (sortBy) {
      case 'dateAdded':
        return new Date(b.dateAdded) - new Date(a.dateAdded);
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rating':
        return b.rating - a.rating;
      case 'distance':
        return parseFloat(a.distance) - parseFloat(b.distance);
      case 'lastVisited':
        return new Date(b.lastVisited || 0) - new Date(a.lastVisited || 0);
      default:
        return 0;
    }
  });

  // Calculate stats
  const stats = {
    totalFavorites: favorites.length,
    avgRating: favorites.reduce((sum, store) => sum + store.rating, 0) / favorites.length,
    categoriesCount: new Set(favorites.map(store => store.category)).size,
    totalOffers: favorites.reduce((sum, store) => sum + store.offers, 0)
  };

  const StoreCard = ({ store, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          height: viewMode === 'grid' ? 'auto' : 200,
          display: viewMode === 'list' ? 'flex' : 'block',
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
        <CardMedia
          component="img"
          height={viewMode === 'grid' ? 200 : '100%'}
          width={viewMode === 'list' ? 200 : 'auto'}
          image={store.image}
          alt={store.name}
          sx={{
            position: 'relative',
            width: viewMode === 'list' ? 200 : 'auto',
            minWidth: viewMode === 'list' ? 200 : 'auto'
          }}
        />

        {/* Overlay badges */}
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            display: 'flex',
            flexDirection: 'column',
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
          {store.offers > 0 && (
            <Badge badgeContent={store.offers} color="error">
              <Chip
                icon={<OfferIcon />}
                label="Offers"
                size="small"
                color="warning"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  color: '#f57c00'
                }}
              />
            </Badge>
          )}
        </Box>

        {/* Rating overlay */}
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
            px: 1.5,
            py: 0.5,
            borderRadius: 2
          }}
        >
          <StarIcon sx={{ fontSize: 16, color: '#ffd700' }} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {store.rating}
          </Typography>
        </Box>

        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, flex: 1 }}>
              {store.name}
            </Typography>
            
            <IconButton
              size="small"
              onClick={(e) => handleMenuOpen(e, store)}
            >
              <MoreIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <LocationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {store.distance} • {store.address.split(',')[0]}
            </Typography>
          </Box>

          {/* User Rating */}
          {store.userRating && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Your rating:
              </Typography>
              <Rating value={store.userRating} size="small" readOnly />
            </Box>
          )}

          {/* Tags */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2, flex: 1 }}>
            {store.tags.slice(0, 3).map((tag, tagIndex) => (
              <Chip
                key={tagIndex}
                label={tag}
                size="small"
                variant="outlined"
                sx={{ 
                  fontSize: '0.7rem',
                  height: 24
                }}
              />
            ))}
          </Box>

          {/* Store Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip label={store.priceRange} size="small" variant="outlined" />
              <Chip 
                label={store.openNow ? 'Open' : 'Closed'} 
                size="small" 
                color={store.openNow ? 'success' : 'default'}
              />
            </Box>
            <Typography variant="caption" color="text.secondary">
              Added {store.dateAdded.toLocaleDateString()}
            </Typography>
          </Box>

          {store.lastVisited && (
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
              Last visited {store.lastVisited.toLocaleDateString()}
            </Typography>
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
            View Store
          </Button>
        </CardActions>
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
          <FavoriteIcon sx={{ fontSize: 48, color: '#667eea' }} />
        </motion.div>
      </Box>
    );
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
              My Favorite Stores
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Your saved collection of amazing stores
            </Typography>
          </Box>
        </FadeInUp>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <FadeInUp delay={0.1}>
              <Card sx={{ borderRadius: 3, textAlign: 'center', py: 2 }}>
                <Avatar sx={{ backgroundColor: '#ef444415', color: '#ef4444', width: 56, height: 56, margin: '0 auto', mb: 2 }}>
                  <FavoriteIcon />
                </Avatar>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#ef4444' }}>
                  <CountUp end={stats.totalFavorites} />
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Favorite Stores
                </Typography>
              </Card>
            </FadeInUp>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FadeInUp delay={0.2}>
              <Card sx={{ borderRadius: 3, textAlign: 'center', py: 2 }}>
                <Avatar sx={{ backgroundColor: '#f59e0b15', color: '#f59e0b', width: 56, height: 56, margin: '0 auto', mb: 2 }}>
                  <StarIcon />
                </Avatar>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                  {stats.avgRating.toFixed(1)}
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
                <Avatar sx={{ backgroundColor: '#667eea15', color: '#667eea', width: 56, height: 56, margin: '0 auto', mb: 2 }}>
                  <CategoryIcon />
                </Avatar>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea' }}>
                  <CountUp end={stats.categoriesCount} />
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Categories
                </Typography>
              </Card>
            </FadeInUp>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FadeInUp delay={0.4}>
              <Card sx={{ borderRadius: 3, textAlign: 'center', py: 2 }}>
                <Avatar sx={{ backgroundColor: '#10b98115', color: '#10b981', width: 56, height: 56, margin: '0 auto', mb: 2 }}>
                  <OfferIcon />
                </Avatar>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981' }}>
                  <CountUp end={stats.totalOffers} />
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Offers
                </Typography>
              </Card>
            </FadeInUp>
          </Grid>
        </Grid>

        {/* Search and Filters */}
        <SlideIn direction="up" delay={0.2}>
          <Paper sx={{ borderRadius: 3, p: 3, mb: 3 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <SearchBar
                  placeholder="Search favorites by name, location, or tags..."
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
                    <MenuItem value="dateAdded">Date Added</MenuItem>
                    <MenuItem value="name">Name</MenuItem>
                    <MenuItem value="rating">Rating</MenuItem>
                    <MenuItem value="distance">Distance</MenuItem>
                    <MenuItem value="lastVisited">Last Visited</MenuItem>
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
                  {sortedFavorites.length} favorites
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </SlideIn>

        {/* Favorites Grid/List */}
        {sortedFavorites.length > 0 ? (
          <>
            <FadeInUp delay={0.3}>
              <Grid container spacing={3}>
                <AnimatePresence>
                  {sortedFavorites.map((store, index) => (
                    <Grid item xs={12} sm={6} md={viewMode === 'grid' ? 4 : 12} key={store.id}>
                      <StoreCard store={store} index={index} />
                    </Grid>
                  ))}
                </AnimatePresence>
              </Grid>
            </FadeInUp>
          </>
        ) : (
          <FadeInUp delay={0.3}>
            <Paper sx={{ borderRadius: 3, p: 6, textAlign: 'center' }}>
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <FavoriteBorderIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
              </motion.div>
              <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
                {searchQuery || filterCategory !== 'all' 
                  ? 'No favorites match your search'
                  : 'No favorite stores yet'
                }
              </Typography>
              <Typography variant="body1" color="text.disabled" sx={{ mb: 4 }}>
                {searchQuery || filterCategory !== 'all'
                  ? 'Try adjusting your search criteria'
                  : 'Start adding stores to your favorites to see them here'
                }
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/user/browse')}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                Discover Stores
              </Button>
            </Paper>
          </FadeInUp>
        )}
      </Container>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          navigate(`/stores/${selectedStore?.id}`);
          handleMenuClose();
        }}>
          <ViewIcon sx={{ mr: 1 }} />
          View Store
        </MenuItem>
        <MenuItem onClick={() => {
          window.open(`tel:${selectedStore?.phone}`, '_self');
          handleMenuClose();
        }}>
          <PhoneIcon sx={{ mr: 1 }} />
          Call Store
        </MenuItem>
        <MenuItem onClick={() => {
          window.open(selectedStore?.website, '_blank');
          handleMenuClose();
        }}>
          <WebsiteIcon sx={{ mr: 1 }} />
          Visit Website
        </MenuItem>
        <MenuItem onClick={() => {
          // Share functionality
          handleMenuClose();
        }}>
          <ShareIcon sx={{ mr: 1 }} />
          Share Store
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={() => {
            setOpenRemoveDialog(true);
            handleMenuClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ mr: 1 }} />
          Remove from Favorites
        </MenuItem>
      </Menu>

      {/* Remove Confirmation Dialog */}
      <ConfirmDialog
        open={openRemoveDialog}
        onClose={() => setOpenRemoveDialog(false)}
        title="Remove from Favorites"
        message={`Are you sure you want to remove ${selectedStore?.name} from your favorites?`}
        onConfirm={() => handleRemoveFromFavorites(selectedStore?.id)}
        confirmText="Remove"
        severity="warning"
      />

      {/* Floating Action Button */}
      <Bounce>
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)'
            }
          }}
          onClick={() => navigate('/user/browse')}
        >
          <SearchIcon />
        </Fab>
      </Bounce>
    </Box>
  );
};

export default Favorites;
