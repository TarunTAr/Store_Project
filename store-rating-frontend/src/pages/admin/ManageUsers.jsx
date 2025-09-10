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
  Fab
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  AdminPanelSettings as AdminIcon,
  Store as StoreOwnerIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Import our custom components
import FadeInUp from '../../components/animations/FadeInUp';
import SlideIn from '../../components/animations/SlideIn';
import SearchBar from '../../components/common/SearchBar';
import FilterPanel from '../../components/common/FilterPanel';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const ManageUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    role: 'user',
    password: ''
  });
  const [errors, setErrors] = useState({});

  // Mock users data
  const mockUsers = [
    {
      id: 1,
      name: 'John Smith Williams Anderson',
      email: 'john.smith@example.com',
      address: '123 Main Street, Downtown City, State 12345, United States of America',
      role: 'user',
      avatar: '/api/placeholder/40/40',
      createdAt: '2024-01-15',
      lastLogin: '2024-03-10',
      ratingsCount: 25,
      storeRating: null
    },
    {
      id: 2,
      name: 'Sarah Johnson Miller Davis',
      email: 'sarah.johnson@example.com',
      address: '456 Oak Avenue, Suburb Town, State 67890, United States of America',
      role: 'admin',
      avatar: '/api/placeholder/40/40',
      createdAt: '2024-01-10',
      lastLogin: '2024-03-12',
      ratingsCount: 0,
      storeRating: null
    },
    {
      id: 3,
      name: 'Michael Chen Rodriguez Wilson',
      email: 'michael.chen@store.com',
      address: '789 Pine Street, Business District, State 13579, United States of America',
      role: 'store_owner',
      avatar: '/api/placeholder/40/40',
      createdAt: '2024-02-01',
      lastLogin: '2024-03-11',
      ratingsCount: 0,
      storeRating: 4.8,
      storeName: "Michael's Electronics"
    },
    {
      id: 4,
      name: 'Emily Rodriguez Thompson Brown',
      email: 'emily.rodriguez@example.com',  
      address: '321 Elm Street, Residential Area, State 24680, United States of America',
      role: 'user',
      avatar: '/api/placeholder/40/40',
      createdAt: '2024-02-15',
      lastLogin: '2024-03-09',
      ratingsCount: 12,
      storeRating: null
    },
    {
      id: 5,
      name: 'David Kim Martinez Garcia Lopez',
      email: 'david.kim@restaurant.com',
      address: '654 Maple Avenue, Food District, State 97531, United States of America',
      role: 'store_owner',
      avatar: '/api/placeholder/40/40',
      createdAt: '2024-02-20',
      lastLogin: '2024-03-12',
      ratingsCount: 0,
      storeRating: 4.6,
      storeName: "Kim's Korean BBQ"
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUsers(mockUsers);
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

  const handleFilter = (filters) => {
    setFilterRole(filters.role || 'all');
    setPage(0);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchQuery || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  const sortedUsers = filteredUsers.sort((a, b) => {
    if (order === 'asc') {
      return a[orderBy] < b[orderBy] ? -1 : 1;
    } else {
      return a[orderBy] > b[orderBy] ? -1 : 1;
    }
  });

  const paginatedUsers = sortedUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <AdminIcon sx={{ fontSize: 16 }} />;
      case 'store_owner':
        return <StoreOwnerIcon sx={{ fontSize: 16 }} />;
      default:
        return <PersonIcon sx={{ fontSize: 16 }} />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'store_owner':
        return 'warning';
      default:
        return 'primary';
    }
  };

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleEdit = () => {
    setFormData({
      name: selectedUser.name,
      email: selectedUser.email,
      address: selectedUser.address,
      role: selectedUser.role,
      password: ''
    });
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    setOpenDeleteDialog(true);
    handleMenuClose();
  };

  const handleSave = () => {
    // Validation
    const newErrors = {};
    if (!formData.name || formData.name.length < 20 || formData.name.length > 60) {
      newErrors.name = 'Name must be between 20 and 60 characters';
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.address || formData.address.length > 400) {
      newErrors.address = 'Address is required (max 400 characters)';
    }
    if (formData.password && !/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/.test(formData.password)) {
      newErrors.password = 'Password must be 8-16 characters with at least one uppercase letter and one special character';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Simulate save
    console.log('Saving user:', formData);
    setOpenDialog(false);
    setFormData({ name: '', email: '', address: '', role: 'user', password: '' });
    setErrors({});
  };

  const handleAddNew = () => {
    setSelectedUser(null);
    setFormData({ name: '', email: '', address: '', role: 'user', password: '' });
    setOpenDialog(true);
  };

  const filterOptions = [
    { label: 'All Roles', value: 'all' },
    { label: 'Users', value: 'user' },
    { label: 'Store Owners', value: 'store_owner' },
    { label: 'Admins', value: 'admin' }
  ];

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
                Manage Users
              </Typography>
              <Typography variant="body1" color="text.secondary">
                View and manage all platform users, store owners, and administrators
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
              Add User
            </Button>
          </Box>
        </FadeInUp>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <FadeInUp delay={0.1}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ backgroundColor: '#667eea15', color: '#667eea', width: 56, height: 56, margin: '0 auto', mb: 2 }}>
                    <PersonIcon />
                  </Avatar>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea' }}>
                    {users.filter(u => u.role === 'user').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Regular Users
                  </Typography>
                </CardContent>
              </Card>
            </FadeInUp>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FadeInUp delay={0.2}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ backgroundColor: '#f59e0b15', color: '#f59e0b', width: 56, height: 56, margin: '0 auto', mb: 2 }}>
                    <StoreOwnerIcon />
                  </Avatar>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                    {users.filter(u => u.role === 'store_owner').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Store Owners
                  </Typography>
                </CardContent>
              </Card>
            </FadeInUp>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FadeInUp delay={0.3}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ backgroundColor: '#ef444415', color: '#ef4444', width: 56, height: 56, margin: '0 auto', mb: 2 }}>
                    <AdminIcon />
                  </Avatar>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#ef4444' }}>
                    {users.filter(u => u.role === 'admin').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Administrators
                  </Typography>
                </CardContent>
              </Card>
            </FadeInUp>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FadeInUp delay={0.4}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ backgroundColor: '#10b98115', color: '#10b981', width: 56, height: 56, margin: '0 auto', mb: 2 }}>
                    <PersonIcon />
                  </Avatar>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981' }}>
                    {users.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Users
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
              <Grid item xs={12} md={6}>
                <SearchBar
                  placeholder="Search users by name, email, or address..."
                  onSearch={handleSearch}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Filter by Role</InputLabel>
                  <Select
                    value={filterRole}
                    label="Filter by Role"
                    onChange={(e) => handleFilter({ role: e.target.value })}
                  >
                    {filterOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Typography variant="body2" color="text.secondary">
                  {filteredUsers.length} users found
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </SlideIn>

        {/* Users Table */}
        <FadeInUp delay={0.3}>
          <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'email'}
                        direction={orderBy === 'email' ? order : 'asc'}
                        onClick={() => handleSort('email')}
                      >
                        Email
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'role'}
                        direction={orderBy === 'role' ? order : 'asc'}
                        onClick={() => handleSort('role')}
                      >
                        Role
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Details</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <AnimatePresence>
                    {paginatedUsers.map((user, index) => (
                      <motion.tr
                        key={user.id}
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
                            <Avatar src={user.avatar}>
                              {user.name.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {user.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Joined {user.createdAt}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {user.email}
                          </Typography>
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
                            {user.address}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getRoleIcon(user.role)}
                            label={user.role.replace('_', ' ').toUpperCase()}
                            color={getRoleColor(user.role)}
                            size="small"
                            sx={{ borderRadius: 2 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box>
                            {user.role === 'store_owner' && user.storeRating && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <Rating value={user.storeRating} readOnly size="small" />
                                <Typography variant="caption">
                                  {user.storeRating}
                                </Typography>
                              </Box>
                            )}
                            {user.role === 'user' && (
                              <Typography variant="caption" color="text.secondary">
                                {user.ratingsCount} ratings submitted
                              </Typography>
                            )}
                            {user.storeName && (
                              <Typography variant="caption" color="text.secondary">
                                Store: {user.storeName}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            onClick={(e) => handleMenuOpen(e, user)}
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
              count={filteredUsers.length}
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
        <MenuItem onClick={() => navigate(`/admin/users/${selectedUser?.id}`)}>
          <ViewIcon sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1 }} />
          Edit User
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete User
        </MenuItem>
      </Menu>

      {/* User Form Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={!!errors.name}
                helperText={errors.name || 'Min 20, Max 60 characters'}
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
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={formData.role}
                  label="Role"
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="store_owner">Store Owner</MenuItem>
                  <MenuItem value="admin">Administrator</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                error={!!errors.address}
                helperText={errors.address || 'Max 400 characters'}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={!!errors.password}
                helperText={errors.password || (selectedUser ? 'Leave blank to keep current password' : '8-16 chars, 1 uppercase, 1 special char')}
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
            {selectedUser ? 'Update' : 'Create'} User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        title="Delete User"
        message={`Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`}
        onConfirm={() => {
          console.log('Deleting user:', selectedUser?.id);
          setOpenDeleteDialog(false);
        }}
      />
    </Box>
  );
};

export default ManageUsers;
