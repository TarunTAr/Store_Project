import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Avatar,
  Chip,
  Rating,
  IconButton,
  Breadcrumbs,
  Link,
  Badge,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab
} from '@mui/material';
import {
  Category as CategoryIcon,
  ExpandMore as ExpandMoreIcon,
  Restaurant as RestaurantIcon,
  Store as StoreIcon,
  LocalHospital as HealthcareIcon,
  Electronics as ElectronicsIcon,
  DirectionsCar as AutomotiveIcon,
  MenuBook as BooksIcon,
  FitnessCenter as SportsIcon,
  ShoppingCart as ShoppingIcon,
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
  Star as StarIcon,
  LocationOn as LocationIcon,
  TrendingUp as TrendingIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  FilterList as FilterIcon,
  Sort as SortIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';

// Import our custom components
import FadeInUp from '../../components/animations/FadeInUp';
import SlideIn from '../../components/animations/SlideIn';
import SearchBar from '../../components/common/SearchBar';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const StoresByCategory = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set([1, 3, 5]));
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [activeTab, setActiveTab] = useState(0);

  // Categories with subcategories
  const categories = [
    {
      id: 'restaurant',
      name: 'Food & Dining',
      icon: <RestaurantIcon />,
      color: '#ef4444',
      count: 1250,
      description: 'Restaurants, cafes, and food services',
      subcategories: [
        { id: 'fine-dining', name: 'Fine Dining', count: 89 },
        { id: 'fast-food', name: 'Fast Food', count: 234 },
        { id: 'cafes', name: 'Cafes & Coffee', count: 156 },
        { id: 'pizza', name: 'Pizza', count: 78 },
        { id: 'asian', name: 'Asian Cuisine', count: 145 },
        { id: 'desserts', name: 'Desserts', count: 67 }
      ]
    },
    {
      id: 'electronics',
      name: 'Electronics & Technology',
      icon: <ElectronicsIcon />,
      color: '#10b981',
      count: 890,
      description: 'Electronics, gadgets, and tech stores',
      subcategories: [
        { id: 'computers', name: 'Computers', count: 123 },
        { id: 'phones', name: 'Mobile Phones', count: 200 },
        { id: 'appliances', name: 'Home Appliances', count: 145 },
        { id: 'gaming', name: 'Gaming', count: 89 },
        { id: 'accessories', name: 'Accessories', count: 156 }
      ]
    },
    {
      id: 'healthcare',
      name: 'Healthcare & Wellness',
      icon: <HealthcareIcon />,
      color: '#667eea',
      count: 650,
      description: 'Medical services, pharmacies, and wellness centers',
      subcategories: [
        { id: 'pharmacies', name: 'Pharmacies', count: 234 },
        { id: 'clinics', name: 'Medical Clinics', count: 156 },
        { id: 'dental', name: 'Dental Care', count: 89 },
        { id: 'wellness', name: 'Wellness Centers', count: 67 },
        { id: 'optical', name: 'Optical Stores', count: 45 }
      ]
    },
    {
      id: 'automotive',
      name: 'Automotive Services',
      icon: <AutomotiveIcon />,
      color: '#8b5cf6',
      count: 420,
      description: 'Car repair, maintenance, and automotive services',
      subcategories: [
        { id: 'repair', name: 'Auto Repair', count: 145 },
        { id: 'parts', name: 'Auto Parts', count: 89 },
        { id: 'dealers', name: 'Car Dealers', count: 67 },
        { id: 'wash', name: 'Car Wash', count: 78 }
      ]
    },
    {
      id: 'shopping',
      name: 'Shopping & Retail',
      icon: <ShoppingIcon />,
      color: '#f59e0b',
      count: 980,
      description: 'Fashion, accessories, and retail stores',
      subcategories: [
        { id: 'fashion', name: 'Fashion', count: 234 },
        { id: 'shoes', name: 'Shoes', count: 123 },
        { id: 'jewelry', name: 'Jewelry', count: 89 },
        { id: 'bags', name: 'Bags & Accessories', count: 78 }
      ]
    },
    {
      id: 'books',
      name: 'Books & Education',
      icon: <BooksIcon />,
      color: '#06b6d4',
      count: 340,
      description: 'Bookstores, libraries, and educational services',
      subcategories: [
        { id: 'bookstores', name: 'Bookstores', count: 156 },
        { id: 'libraries', name: 'Libraries', count: 45 },
        { id: 'stationery', name: 'Stationery', count: 89 }
      ]
    }
  ];

  // Mock stores data for selected category
  const mockStores = {
    restaurant: [
      {
        id: 1,
        name: "Milano's Italian Restaurant",
        subcategory: 'fine-dining',
        rating: 4.8,
        reviewCount: 1250,
        image: "/api/placeholder/300/200",
        address: "123 Main Street, Downtown",
        priceRange: "$$$",
        distance: "0.5 km",
        openNow: true,
        description: "Authentic Italian cuisine with a modern twist"
      },
      {
        id: 2,
        name: "Burger Express",
        subcategory: 'fast-food',
        rating: 4.3,
        reviewCount: 890,
        image: "/api/placeholder/300/200",
        address: "456 Food Court, Mall Plaza",
        priceRange: "$",
        distance: "1.2 km",
        openNow: true,
        description: "Quick and delicious burgers and fries"
      },
      {
        id: 3,
        name: "Coffee Corner",
        subcategory: 'cafes',
        rating: 4.6,
        reviewCount: 567,
        image: "/api/placeholder/300/200",
        address: "789 Café Street, Arts District",
        priceRange: "$$",
        distance: "0.8 km",
        openNow: true,
        description: "Artisanal coffee and fresh pastries"
      }
    ],
    electronics: [
      {
        id: 4,
        name: "TechHub Store",
        subcategory: 'computers',
        rating: 4.5,
        reviewCount: 432,
        image: "/api/placeholder/300/200",
        address: "321 Tech Avenue, Silicon Valley",
        priceRange: "$$",
        distance: "1.5 km",
        openNow: true,
        description: "Latest computers and tech gadgets"
      },
      {
        id: 5,
        name: "Mobile World",
        subcategory: 'phones',
        rating: 4.4,
        reviewCount: 678,
        image: "/api/placeholder/300/200",
        address: "654 Mobile Street, Tech District",
        priceRange: "$$$",
        distance: "2.1 km",
        openNow: false,
        description: "Smartphones and mobile accessories"
      }
    ],
    healthcare: [
      {
        id: 6,
        name: "Green Gardens Pharmacy",
        subcategory: 'pharmacies',
        rating: 4.9,
        reviewCount: 1890,
        image: "/api/placeholder/300/200",
        address: "987 Health Blvd, Medical Center",
        priceRange: "$$",
        distance: "1.8 km",
        openNow: true,
        description: "Full-service pharmacy with wellness products"
      }
    ]
  };

  useEffect(() => {
    // Find category by ID
    const category = categories.find(cat => cat.id === categoryId) || categories[0];
    setSelectedCategory(category);
    
    // Simulate API call
    setTimeout(() => {
      setStores(mockStores[category.id] || []);
      setLoading(false);
    }, 1000);
  }, [categoryId]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setLoading(true);
    navigate(`/user/categories/${category.id}`);
    
    setTimeout(() => {
      setStores(mockStores[category.id] || []);
      setLoading(false);
    }, 500);
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

  const CategoryCard = ({ category, isSelected }) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        onClick={() => handleCategorySelect(category)}
        sx={{
          cursor: 'pointer',
          borderRadius: 3,
          border: '2px solid',
          borderColor: isSelected ? category.color : 'divider',
          background: isSelected 
            ? `linear-gradient(135deg, ${category.color}10, ${category.color}05)`
            : 'white',
          '&:hover': {
            borderColor: category.color,
            boxShadow: `0 8px 25px ${category.color}20`
          },
          transition: 'all 0.3s ease'
        }}
      >
        <CardContent sx={{ textAlign: 'center', py: 3 }}>
          <Avatar
            sx={{
              backgroundColor: category.color,
              width: 64,
              height: 64,
              margin: '0 auto',
              mb: 2
            }}
          >
            {category.icon}
          </Avatar>
          
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            {category.name}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {category.description}
          </Typography>
          
          <Badge
            badgeContent={category.count}
            color="primary"
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: category.color,
                color: 'white'
              }
            }}
          >
            <Chip
              label="View Stores"
              sx={{
                backgroundColor: `${category.color}15`,
                color: category.color,
                fontWeight: 600
              }}
            />
          </Badge>
        </CardContent>
      </Card>
    </motion.div>
  );

  const StoreCard = ({ store, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          height: '100%',
          border: '1px solid',
          borderColor: 'divider',
          '&:hover': {
            borderColor: selectedCategory?.color,
            boxShadow: `0 8px 25px ${selectedCategory?.color}15`,
            transform: 'translateY(-4px)'
          },
          transition: 'all 0.3s ease'
        }}
      >
        <CardMedia
          component="img"
          height="200"
          image={store.image}
          alt={store.name}
          sx={{ position: 'relative' }}
        />
        
        {/* Overlay with favorite and status */}
        <Box
          sx={{
            position: 'absolute',
            top: 212,
            right: 16,
            transform: 'translateY(-50%)',
            display: 'flex',
            gap: 1
          }}
        >
          <IconButton
            onClick={() => handleFavoriteToggle(store.id)}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': { backgroundColor: 'white' }
            }}
          >
            {favorites.has(store.id) ? (
              <FavoriteIcon sx={{ color: '#ef4444' }} />
            ) : (
              <FavoriteBorderIcon />
            )}
          </IconButton>
        </Box>

        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {store.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <StarIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {store.rating}
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {store.description}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <LocationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {store.distance} • {store.address}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip
              label={selectedCategory?.subcategories?.find(sub => sub.id === store.subcategory)?.name}
              size="small"
              sx={{
                backgroundColor: `${selectedCategory?.color}20`,
                color: selectedCategory?.color
              }}
            />
            <Chip label={store.priceRange} size="small" variant="outlined" />
            {store.openNow && (
              <Chip label="Open Now" size="small" color="success" />
            )}
          </Box>

          <Typography variant="caption" color="text.secondary">
            {store.reviewCount} reviews
          </Typography>
        </CardContent>

        <CardActions>
          <Button
            fullWidth
            variant="contained"
            onClick={() => navigate(`/stores/${store.id}`)}
            sx={{
              borderRadius: 2,
              background: `linear-gradient(135deg, ${selectedCategory?.color} 0%, ${selectedCategory?.color}dd 100%)`,
              '&:hover': {
                boxShadow: `0 4px 15px ${selectedCategory?.color}40`
              }
            }}
          >
            View Store
          </Button>
        </CardActions>
      </Card>
    </motion.div>
  );

  if (loading && !selectedCategory) {
    return <LoadingSpinner />;
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <FadeInUp>
          <Box sx={{ mb: 4 }}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2 }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/user/dashboard')}
                sx={{ textDecoration: 'none' }}
              >
                Dashboard
              </Link>
              <Typography variant="body2" color="text.primary">
                Categories
              </Typography>
              {selectedCategory && (
                <Typography variant="body2" color="text.primary">
                  {selectedCategory.name}
                </Typography>
              )}
            </Breadcrumbs>

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
              {selectedCategory ? selectedCategory.name : 'Store Categories'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {selectedCategory 
                ? `Discover ${selectedCategory.count} stores in ${selectedCategory.name.toLowerCase()}`
                : 'Explore stores organized by categories'
              }
            </Typography>
          </Box>
        </FadeInUp>

        {!selectedCategory ? (
          // Category Selection View
          <FadeInUp delay={0.1}>
            <Grid container spacing={3}>
              {categories.map((category, index) => (
                <Grid item xs={12} sm={6} md={4} key={category.id}>
                  <FadeInUp delay={0.1 + index * 0.05}>
                    <CategoryCard category={category} />
                  </FadeInUp>
                </Grid>
              ))}
            </Grid>
          </FadeInUp>
        ) : (
          // Selected Category View
          <Grid container spacing={3}>
            {/* Category Sidebar */}
            <Grid item xs={12} md={3}>
              <SlideIn direction="left" delay={0.1}>
                <Paper sx={{ borderRadius: 3, overflow: 'hidden', mb: 3 }}>
                  <Box
                    sx={{
                      p: 3,
                      background: `linear-gradient(135deg, ${selectedCategory.color}15, ${selectedCategory.color}05)`,
                      borderBottom: 1,
                      borderColor: 'divider'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar
                        sx={{
                          backgroundColor: selectedCategory.color,
                          width: 48,
                          height: 48
                        }}
                      >
                        {selectedCategory.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {selectedCategory.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedCategory.count} stores
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Subcategories */}
                  <List sx={{ p: 0 }}>
                    <ListItem
                      button
                      onClick={() => setActiveTab(0)}
                      sx={{
                        backgroundColor: activeTab === 0 ? `${selectedCategory.color}10` : 'transparent',
                        borderLeft: activeTab === 0 ? `3px solid ${selectedCategory.color}` : 'none'
                      }}
                    >
                      <ListItemText
                        primary="All Stores"
                        secondary={`${selectedCategory.count} stores`}
                      />
                    </ListItem>
                    
                    {selectedCategory.subcategories?.map((subcategory, index) => (
                      <ListItem
                        button
                        key={subcategory.id}
                        onClick={() => setActiveTab(index + 1)}
                        sx={{
                          backgroundColor: activeTab === index + 1 ? `${selectedCategory.color}10` : 'transparent',
                          borderLeft: activeTab === index + 1 ? `3px solid ${selectedCategory.color}` : 'none'
                        }}
                      >
                        <ListItemText
                          primary={subcategory.name}
                          secondary={`${subcategory.count} stores`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>

                {/* Other Categories */}
                <Paper sx={{ borderRadius: 3, p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    Other Categories
                  </Typography>
                  <List sx={{ p: 0 }}>
                    {categories.filter(cat => cat.id !== selectedCategory.id).slice(0, 4).map((category) => (
                      <ListItem
                        button
                        key={category.id}
                        onClick={() => handleCategorySelect(category)}
                        sx={{ px: 0, borderRadius: 2 }}
                      >
                        <ListItemIcon>
                          <Avatar
                            sx={{
                              backgroundColor: `${category.color}15`,
                              color: category.color,
                              width: 32,
                              height: 32
                            }}
                          >
                            {category.icon}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={category.name}
                          secondary={`${category.count} stores`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </SlideIn>
            </Grid>

            {/* Stores Grid */}
            <Grid item xs={12} md={9}>
              {/* Search and Filters */}
              <SlideIn direction="right" delay={0.1}>
                <Paper sx={{ borderRadius: 3, p: 3, mb: 3 }}>
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={6}>
                      <SearchBar
                        placeholder={`Search in ${selectedCategory.name.toLowerCase()}...`}
                        onSearch={setSearchQuery}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          {stores.length} stores found
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => navigate('/user/categories')}
                        >
                          Change Category
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </SlideIn>

              {/* Stores */}
              {loading ? (
                <LoadingSpinner />
              ) : stores.length > 0 ? (
                <FadeInUp delay={0.2}>
                  <Grid container spacing={3}>
                    {stores.map((store, index) => (
                      <Grid item xs={12} sm={6} lg={4} key={store.id}>
                        <StoreCard store={store} index={index} />
                      </Grid>
                    ))}
                  </Grid>
                </FadeInUp>
              ) : (
                <FadeInUp delay={0.2}>
                  <Paper sx={{ borderRadius: 3, p: 6, textAlign: 'center' }}>
                    <Avatar
                      sx={{
                        backgroundColor: `${selectedCategory.color}15`,
                        color: selectedCategory.color,
                        width: 80,
                        height: 80,
                        margin: '0 auto',
                        mb: 3
                      }}
                    >
                      {selectedCategory.icon}
                    </Avatar>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                      No stores found in this category
                    </Typography>
                    <Typography variant="body2" color="text.disabled" sx={{ mb: 3 }}>
                      Be the first to discover stores in {selectedCategory.name.toLowerCase()}
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => navigate('/user/browse')}
                      sx={{
                        background: `linear-gradient(135deg, ${selectedCategory.color} 0%, ${selectedCategory.color}dd 100%)`
                      }}
                    >
                      Browse All Stores
                    </Button>
                  </Paper>
                </FadeInUp>
              )}
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default StoresByCategory;
