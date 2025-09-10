import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  IconButton,
  Avatar,
  Chip,
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
  Grid,
  Card,
  CardContent,
  Rating,
  Alert,
  Badge,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreIcon,
  Store as StoreIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  Visibility as ViewIcon,
  VisibilityOff as VisibilityOffIcon,
  Category as CategoryIcon,
  Phone as PhoneIcon,
  Language as WebsiteIcon,
  BusinessCenter as BusinessIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Import our custom components
import FadeInUp from '../../components/animations/FadeInUp';
import SlideIn from '../../components/animations/SlideIn';
import SearchBar from '../../components/common/SearchBar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ImageUpload from '../../components/common/ImageUpload';

const ManageStores = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedStore, setSelectedStore] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    category: '',
    phone: '',
    website: '',
    description: '',
    isActive: true,
    logo: null
  });
  const [errors, setErrors] = useState({});

  // Mock stores data
  const mockStores = [
    {
      id: 1,
      name: "Milano's Italian Restaurant",
      email: 'info@milanos.com',
      address: '123 Main Street, Downtown City, State 12345',
      category: 'Restaurant',
      phone: '+1 (555) 123-4567',
      website: 'https://milanos.com',
      description: 'Authentic Italian cuisine with a modern twist',
      rating: 4.8,
      reviewCount: 1250,
      logo: '/api/placeholder/60/60',
      isActive: true,
      createdAt: '2024-01-15',
      lastUpdated: '2024-03-10'
    },
    {
      id: 2,
      name: 'TechHub Electronics Store',
      email: 'contact@techhub.com',
      address: '456 Tech Avenue, Silicon Valley, State 67890',
      category: 'Electronics',
      phone: '+1 (555) 234-5678',
      website: 'https://techhub.com',
      description: 'Your one-stop shop for latest gadgets and electronics',
      rating: 4.6,
      reviewCount: 890,
      logo: '/api/placeholder/60/60',
      isActive: true,
      createdAt: '2024-01-20',
      lastUpdated: '2024-03-09'
    },
    {
      id: 3,
      name: 'Green Gardens Pharmacy',
      email: 'info@greengardens.com',
      address: '789 Health Boulevard, Wellness District, State 13579',
      category: 'Healthcare',
      phone: '+1 (555) 345-6789',
      website: 'https://greengardens.com',
      description: 'Trusted healthcare and wellness solutions for your family',
      rating: 4.9,
      reviewCount: 2100,
      logo: '/api/placeholder/60/60',
      isActive: true,
      createdAt: '2024-02-01',
      lastUpdated: '2024-03-11'
    },
    {
      id: 4,
      name: 'Fashion Forward Boutique',
      email: 'hello@fashionforward.com',
      address: '321 Style Street, Fashion District, State 24680',
      category: 'Fashion',
      phone: '+1 (555) 456-7890',
      website: 'https://fashionforward.com',
      description: 'Trendy fashion and accessories for modern lifestyle',
      rating: 4.3,
      reviewCount: 567,
      logo: '/api/placeholder/60/60',
      isActive: false,
      createdAt: '2024-02-15',
      lastUpdated: '2024-03-08'
    },
    {
      id: 5,
      name: 'Auto Care Service Center',
      email: 'service@autocare.com',
      address: '654 Motor Way, Industrial Area, State 97531',
      category: 'Automotive',
      phone: '+1 (555) 567-8901',
      website: 'https://autocare.com',
      description: 'Professional automotive repair and maintenance services',
      rating: 4.5,
      reviewCount: 432,
      logo: '/api/placeholder/60/60',
      isActive: true,
      createdAt: '2024-02-20',
      lastUpdated: '2024-03-12'
    }
  ];

  const categories = [
    'Restaurant', 'Electronics', 'Healthcare', 'Fashion', 'Automotive',
    'Grocery', 'Beauty', 'Sports', 'Books', 'Home & Garden'
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStores(mockStores);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(0);
  };

  const filteredStores = stores.filter(store => {
    const matchesSearch = !searchQuery || 
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || store.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && store.isActive) ||
      (filterStatus === 'inactive' && !store.isActive);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedStores = filteredStores.sort((a, b) => {
    if (order === 'asc') {
      return a[orderBy] < b[orderBy] ? -1 : 1;
    } else {
      return a[orderBy] > b[orderBy] ? -1 : 1;
    }
  });

  const paginatedStores = sortedStores.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleMenuOpen = (event, store) => {
    setAnchorEl(event.currentTarget);
    setSelectedStore(store);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedStore(null);
  };

  const handleEdit = () => {
    setFormData({
      name: selectedStore.name,
      email: selectedStore.email,
      address: selectedStore.address,
      category: selectedStore.category,
      phone: selectedStore.phone,
      website: selectedStore.website,
      description: selectedStore.description,
      isActive: selectedStore.isActive,
      logo: selectedStore.logo
    });
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    setOpenDeleteDialog(true);
    handleMenuClose();
  };

  const handleToggleStatus = () => {
    // Simulate API call to toggle store status
    console.log('Toggling status for store:', selectedStore.id);
    handleMenuClose();
  };

  const handleSave = () => {
    // Validation
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Store name is required';
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Simulate save
    console.log('Saving store:', formData);
    setOpenDialog(false);
    setFormData({
      name: '', email: '', address: '', category: '', phone: '',
      website: '', description: '', isActive: true, logo: null
    });
    setErrors({});
  };

  const handleAddNew = () => {
    setSelectedStore(null);
    setFormData({
      name: '', email: '', address: '', category: '', phone: '',
      website: '', description: '', isActive: true, logo: null
    });
    setOpenDialog(true);
  };

  if (loading) {
    return <LoadingSpinner />;
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
                Manage Stores
              </Typography>
              <Typography variant="body1" color="text.secondary">
                View and manage all registered stores on the platform
              </Typography>
            </Box>
            
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddNew}
              sx={{
                px: 3,
                py: 1.5,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                '&:hover': {
                  boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Add Store
            </Button>
          </Box>
        </FadeInUp>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <FadeInUp delay={0.1}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ backgroundColor: '#10b98115', color: '#10b981', width: 56, height: 56, margin: '0 auto', mb: 2 }}>
                    <StoreIcon />
                  </Avatar>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981' }}>
                    {stores.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Stores
                  </Typography>
                </CardContent>
              </Card>
            </FadeInUp>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FadeInUp delay={0.2}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ backgroundColor: '#667eea15', color: '#667eea', width: 56, height: 56, margin: '0 auto', mb: 2 }}>
                    <BusinessIcon />
                  </Avatar>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea' }}>
                    {stores.filter(s => s.isActive).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Stores
                  </Typography>
                </CardContent>
              </Card>
            </FadeInUp>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FadeInUp delay={0.3}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ backgroundColor: '#f59e0b15', color: '#f59e0b', width: 56, height: 56, margin: '0 auto', mb: 2 }}>
                    <StarIcon />
                  </Avatar>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                    {(stores.reduce((sum, store) => sum + store.rating, 0) / stores.length).toFixed(1)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average Rating
                  </Typography>
                </CardContent>
              </Card>
            </FadeInUp>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FadeInUp delay={0.4}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ backgroundColor: '#ef444415', color: '#ef4444', width: 56, height: 56, margin: '0 auto', mb: 2 }}>
                    <CategoryIcon />
                  </Avatar>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#ef4444' }}>
                    {new Set(stores.map(s => s.category)).size}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Categories
                  </Typography>
                </CardContent>
              </Card>
            </FadeInUp>
          </Grid>
        </Grid>

        {/* Search and Filters */}
        <SlideIn direction="up" delay={0.2}>
          <Paper sx={{ borderRadius: 3, mb: 3, p: 3 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={5}>
                <SearchBar
                  placeholder="Search stores by name, email, or address..."
                  onSearch={handleSearch}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={filterCategory}
                    label="Category"
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    <MenuItem value="all">All Categories</MenuItem>
                    {categories.map(category => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
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
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Typography variant="body2" color="text.secondary">
                  {filteredStores.length} stores found
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </SlideIn>

        {/* Stores Table */}
        <FadeInUp delay={0.3}>
          <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell>Store</TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'email'}
                        direction={orderBy === 'email' ? order : 'asc'}
                        onClick={() => handleSort('email')}
                      >
                        Contact
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'category'}
                        direction={orderBy === 'category' ? order : 'asc'}
                        onClick={() => handleSort('category')}
                      >
                        Category
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'rating'}
                        direction={orderBy === 'rating' ? order : 'asc'}
                        onClick={() => handleSort('rating')}
                      >
                        Rating
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <AnimatePresence>
                    {paginatedStores.map((store, index) => (
                      <motion.tr
                        key={store.id}
                        component={TableRow}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        sx={{
                          '&:hover': {
                            backgroundColor: '#f8fafc'
                          }
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar src={store.logo} sx={{ width: 50, height: 50 }}>
                              <StoreIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {store.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Created {store.createdAt}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                              {store.email}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {store.phone}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              maxWidth: 200,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {store.address}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={store.category}
                            size="small"
                            sx={{ 
                              borderRadius: 2,
                              backgroundColor: '#667eea15',
                              color: '#667eea'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Rating value={store.rating} readOnly size="small" />
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {store.rating}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ({store.reviewCount})
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={store.isActive ? 'Active' : 'Inactive'}
                            color={store.isActive ? 'success' : 'error'}
                            size="small"
                            sx={{ borderRadius: 2 }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            onClick={(e) => handleMenuOpen(e, store)}
                            size="small"
                          >
                            <MoreIcon />
                          </IconButton>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredStores.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
            />
          </Paper>
        </FadeInUp>
      </Container>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => navigate(`/admin/stores/${selectedStore?.id}`)}>
          <ViewIcon sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1 }} />
          Edit Store
        </MenuItem>
        <MenuItem onClick={handleToggleStatus}>
          {selectedStore?.isActive ? <VisibilityOffIcon sx={{ mr: 1 }} /> : <ViewIcon sx={{ mr: 1 }} />}
          {selectedStore?.isActive ? 'Deactivate' : 'Activate'} Store
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete Store
        </MenuItem>
      </Menu>

      {/* Store Form Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedStore ? 'Edit Store' : 'Add New Store'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Store Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.category}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.map(category => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                error={!!errors.address}
                helperText={errors.address}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                }
                label="Store is Active"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Store Logo
              </Typography>
              <ImageUpload
                value={formData.logo}
                onChange={(logo) => setFormData({ ...formData, logo })}
                accept="image/*"
                maxSize={5 * 1024 * 1024} // 5MB
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            {selectedStore ? 'Update' : 'Create'} Store
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        title="Delete Store"
        message={`Are you sure you want to delete ${selectedStore?.name}? This action cannot be undone and will remove all associated ratings.`}
        onConfirm={() => {
          console.log('Deleting store:', selectedStore?.id);
          setOpenDeleteDialog(false);
        }}
      />
    </Box>
  );
};

export default ManageStores;
