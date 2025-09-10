import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
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
  Chip,
  Avatar,
  Menu,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondary,
  Collapse,
  Badge,
  Alert,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreIcon,
  Category as CategoryIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  Label as LabelIcon,
  Store as StoreIcon,
  DragIndicator as DragIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ColorLens as ColorIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { TreeView, TreeItem } from '@mui/x-tree-view';

// Import our custom components
import FadeInUp from '../../components/animations/FadeInUp';
import SlideIn from '../../components/animations/SlideIn';
import Bounce from '../../components/animations/Bounce';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ImageUpload from '../../components/common/ImageUpload';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState(['1', '2', '3']);
  const [viewMode, setViewMode] = useState('grid'); // grid, tree, list
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentId: null,
    color: '#667eea',
    icon: null,
    isActive: true,
    sortOrder: 0
  });
  const [errors, setErrors] = useState({});

  // Mock categories data with hierarchical structure
  const mockCategories = [
    {
      id: '1',
      name: 'Food & Dining',
      description: 'Restaurants, cafes, and food services',
      parentId: null,
      color: '#ef4444',
      icon: '🍽️',
      isActive: true,
      sortOrder: 1,
      storeCount: 1250,
      children: [
        {
          id: '1-1',
          name: 'Restaurants',
          description: 'Fine dining and casual restaurants',
          parentId: '1',
          color: '#dc2626',
          icon: '🍷',
          isActive: true,
          sortOrder: 1,
          storeCount: 890
        },
        {
          id: '1-2',
          name: 'Fast Food',
          description: 'Quick service restaurants',
          parentId: '1',
          color: '#f87171',
          icon: '🍔',
          isActive: true,
          sortOrder: 2,
          storeCount: 234
        },
        {
          id: '1-3',
          name: 'Cafes & Coffee',
          description: 'Coffee shops and cafes',
          parentId: '1',
          color: '#fca5a5',
          icon: '☕',
          isActive: true,
          sortOrder: 3,
          storeCount: 126
        }
      ]
    },
    {
      id: '2',
      name: 'Shopping & Retail',
      description: 'Stores, boutiques, and retail outlets',
      parentId: null,
      color: '#10b981',
      icon: '🛍️',
      isActive: true,
      sortOrder: 2,
      storeCount: 2100,
      children: [
        {
          id: '2-1',
          name: 'Fashion & Apparel',
          description: 'Clothing, shoes, and accessories',
          parentId: '2',
          color: '#059669',
          icon: '👗',
          isActive: true,
          sortOrder: 1,
          storeCount: 567
        },
        {
          id: '2-2',
          name: 'Electronics',
          description: 'Gadgets, computers, and electronics',
          parentId: '2',
          color: '#34d399',
          icon: '📱',
          isActive: true,
          sortOrder: 2,
          storeCount: 890
        },
        {
          id: '2-3',
          name: 'Home & Garden',
          description: 'Furniture, decor, and garden supplies',
          parentId: '2',
          color: '#6ee7b7',
          icon: '🏠',
          isActive: true,
          sortOrder: 3,
          storeCount: 643
        }
      ]
    },
    {
      id: '3',
      name: 'Services',
      description: 'Professional and personal services',
      parentId: null,
      color: '#667eea',
      icon: '🔧',
      isActive: true,
      sortOrder: 3,
      storeCount: 1800,
      children: [
        {
          id: '3-1',
          name: 'Healthcare',
          description: 'Medical services and pharmacies',
          parentId: '3',
          color: '#4f46e5',
          icon: '🏥',
          isActive: true,
          sortOrder: 1,
          storeCount: 456
        },
        {
          id: '3-2',
          name: 'Automotive',
          description: 'Car repair and maintenance',
          parentId: '3',
          color: '#7c3aed',
          icon: '🚗',
          isActive: true,
          sortOrder: 2,
          storeCount: 324
        },
        {
          id: '3-3',
          name: 'Beauty & Wellness',
          description: 'Salons, spas, and wellness centers',
          parentId: '3',
          color: '#8b5cf6',
          icon: '💄',
          isActive: true,
          sortOrder: 3,
          storeCount: 678
        },
        {
          id: '3-4',
          name: 'Education',
          description: 'Schools, training centers, and tutoring',
          parentId: '3',
          color: '#a78bfa',
          icon: '📚',
          isActive: true,
          sortOrder: 4,
          storeCount: 342
        }
      ]
    }
  ];

  const colorOptions = [
    '#ef4444', '#f59e0b', '#10b981', '#067eea', '#8b5cf6', 
    '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCategories(mockCategories);
      setLoading(false);
    }, 1000);
  }, []);

  const flattenCategories = (cats) => {
    let result = [];
    cats.forEach(cat => {
      result.push(cat);
      if (cat.children) {
        result = result.concat(flattenCategories(cat.children));
      }
    });
    return result;
  };

  const handleMenuOpen = (event, category) => {
    setAnchorEl(event.currentTarget);
    setSelectedCategory(category);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCategory(null);
  };

  const handleEdit = () => {
    setFormData({
      name: selectedCategory.name,
      description: selectedCategory.description,
      parentId: selectedCategory.parentId,
      color: selectedCategory.color,
      icon: selectedCategory.icon,
      isActive: selectedCategory.isActive,
      sortOrder: selectedCategory.sortOrder
    });
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    setOpenDeleteDialog(true);
    handleMenuClose();
  };

  const handleAddNew = (parentId = null) => {
    setSelectedCategory(null);
    setFormData({
      name: '',
      description: '',
      parentId,
      color: '#667eea',
      icon: null,
      isActive: true,
      sortOrder: 0
    });
    setOpenDialog(true);
  };

  const handleSave = () => {
    // Validation
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Simulate save
    console.log('Saving category:', formData);
    setOpenDialog(false);
    setFormData({
      name: '', description: '', parentId: null, color: '#667eea',
      icon: null, isActive: true, sortOrder: 0
    });
    setErrors({});
  };

  const renderCategoryCard = (category) => (
    <motion.div
      key={category.id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        sx={{
          borderRadius: 3,
          border: '2px solid',
          borderColor: category.isActive ? category.color : 'grey.300',
          background: category.isActive 
            ? `linear-gradient(135deg, ${category.color}10, ${category.color}05)`
            : 'grey.50',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: category.color,
            boxShadow: `0 8px 25px ${category.color}30`,
            transform: 'translateY(-4px)'
          }
        }}
      >
        <CardContent sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  backgroundColor: category.color,
                  width: 48,
                  height: 48,
                  fontSize: '1.5rem'
                }}
              >
                {category.icon || <CategoryIcon />}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {category.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {category.description}
                </Typography>
              </Box>
            </Box>

            <IconButton
              onClick={(e) => handleMenuOpen(e, category)}
              size="small"
            >
              <MoreIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                label={`${category.storeCount} stores`}
                size="small"
                sx={{
                  backgroundColor: `${category.color}20`,
                  color: category.color,
                  fontWeight: 600
                }}
              />
              <Chip
                label={category.isActive ? 'Active' : 'Inactive'}
                size="small"
                color={category.isActive ? 'success' : 'default'}
              />
            </Box>
          </Box>

          {category.children && (
            <Typography variant="caption" color="text.secondary">
              {category.children.length} subcategories
            </Typography>
          )}
        </CardContent>

        <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={() => handleAddNew(category.id)}
            sx={{ color: category.color }}
          >
            Add Subcategory
          </Button>
          <Button
            size="small"
            startIcon={<StoreIcon />}
            onClick={() => console.log('View stores in category:', category.id)}
            sx={{ color: category.color }}
          >
            View Stores
          </Button>
        </CardActions>
      </Card>
    </motion.div>
  );

  const renderTreeView = () => (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ExpandLessIcon />}
      expanded={expandedNodes}
      onNodeToggle={(event, nodeIds) => setExpandedNodes(nodeIds)}
      sx={{
        flexGrow: 1,
        overflowY: 'auto',
        '& .MuiTreeItem-root': {
          '& .MuiTreeItem-content': {
            borderRadius: 2,
            margin: '4px 0',
            '&:hover': {
              backgroundColor: 'rgba(102, 126, 234, 0.1)'
            }
          }
        }
      }}
    >
      {categories.map(category => (
        <TreeItem
          key={category.id}
          nodeId={category.id}
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1 }}>
              <Avatar
                sx={{
                  backgroundColor: category.color,
                  width: 32,
                  height: 32,
                  fontSize: '1rem'
                }}
              >
                {category.icon || <CategoryIcon />}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {category.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {category.storeCount} stores
                </Typography>
              </Box>
              <Chip
                label={category.isActive ? 'Active' : 'Inactive'}
                size="small"
                color={category.isActive ? 'success' : 'default'}
              />
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMenuOpen(e, category);
                }}
              >
                <MoreIcon />
              </IconButton>
            </Box>
          }
        >
          {category.children?.map(subcategory => (
            <TreeItem
              key={subcategory.id}
              nodeId={subcategory.id}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                  <Avatar
                    sx={{
                      backgroundColor: subcategory.color,
                      width: 24,
                      height: 24,
                      fontSize: '0.8rem'
                    }}
                  >
                    {subcategory.icon || <LabelIcon />}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {subcategory.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {subcategory.storeCount} stores
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuOpen(e, subcategory);
                    }}
                  >
                    <MoreIcon />
                  </IconButton>
                </Box>
              }
            />
          ))}
        </TreeItem>
      ))}
    </TreeView>
  );

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
                Manage Categories
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Organize and manage store categories and subcategories
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setViewMode(viewMode === 'grid' ? 'tree' : 'grid')}
                sx={{
                  borderColor: '#667eea',
                  color: '#667eea',
                  '&:hover': {
                    borderColor: '#764ba2',
                    backgroundColor: 'rgba(102, 126, 234, 0.05)'
                  }
                }}
              >
                {viewMode === 'grid' ? 'Tree View' : 'Grid View'}
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleAddNew()}
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
                Add Category
              </Button>
            </Box>
          </Box>
        </FadeInUp>

        {/* Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <FadeInUp delay={0.1}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ backgroundColor: '#667eea15', color: '#667eea', width: 56, height: 56, margin: '0 auto', mb: 2 }}>
                    <CategoryIcon />
                  </Avatar>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea' }}>
                    {categories.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Main Categories
                  </Typography>
                </CardContent>
              </Card>
            </FadeInUp>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FadeInUp delay={0.2}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ backgroundColor: '#10b98115', color: '#10b981', width: 56, height: 56, margin: '0 auto', mb: 2 }}>
                    <LabelIcon />
                  </Avatar>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981' }}>
                    {flattenCategories(categories).length - categories.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Subcategories
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
                    <StoreIcon />
                  </Avatar>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                    {flattenCategories(categories).reduce((sum, cat) => sum + cat.storeCount, 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Stores
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
                    <VisibilityIcon />
                  </Avatar>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#ef4444' }}>
                    {flattenCategories(categories).filter(cat => cat.isActive).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Categories
                  </Typography>
                </CardContent>
              </Card>
            </FadeInUp>
          </Grid>
        </Grid>

        {/* Categories Display */}
        {viewMode === 'grid' ? (
          <Grid container spacing={3}>
            {categories.map(category => (
              <Grid item xs={12} md={6} lg={4} key={category.id}>
                <FadeInUp delay={categories.indexOf(category) * 0.1}>
                  {renderCategoryCard(category)}
                </FadeInUp>
              </Grid>
            ))}
            
            {/* Show subcategories */}
            {categories.map(category => 
              category.children?.map(subcategory => (
                <Grid item xs={12} md={6} lg={4} key={subcategory.id}>
                  <FadeInUp delay={0.5}>
                    <Card
                      sx={{
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                        ml: 4,
                        position: 'relative',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          left: -20,
                          top: '50%',
                          width: 20,
                          height: 2,
                          backgroundColor: category.color
                        }
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Avatar
                            sx={{
                              backgroundColor: subcategory.color,
                              width: 40,
                              height: 40
                            }}
                          >
                            {subcategory.icon || <LabelIcon />}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {subcategory.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {subcategory.description}
                            </Typography>
                          </Box>
                          <IconButton
                            onClick={(e) => handleMenuOpen(e, subcategory)}
                            size="small"
                          >
                            <MoreIcon />
                          </IconButton>
                        </Box>
                        
                        <Chip
                          label={`${subcategory.storeCount} stores`}
                          size="small"
                          sx={{
                            backgroundColor: `${subcategory.color}20`,
                            color: subcategory.color
                          }}
                        />
                      </CardContent>
                    </Card>
                  </FadeInUp>
                </Grid>
              ))
            )}
          </Grid>
        ) : (
          <SlideIn direction="up" delay={0.3}>
            <Paper sx={{ borderRadius: 3, p: 3, minHeight: 600 }}>
              {renderTreeView()}
            </Paper>
          </SlideIn>
        )}
      </Container>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1 }} />
          Edit Category
        </MenuItem>
        <MenuItem onClick={() => handleAddNew(selectedCategory?.id)}>
          <AddIcon sx={{ mr: 1 }} />
          Add Subcategory
        </MenuItem>
        <MenuItem onClick={() => console.log('View stores:', selectedCategory?.id)}>
          <StoreIcon sx={{ mr: 1 }} />
          View Stores ({selectedCategory?.storeCount})
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete Category
        </MenuItem>
      </Menu>

      {/* Category Form Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedCategory ? 'Edit Category' : 'Add New Category'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Category Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Parent Category</InputLabel>
                <Select
                  value={formData.parentId || ''}
                  label="Parent Category"
                  onChange={(e) => setFormData({ ...formData, parentId: e.target.value || null })}
                >
                  <MenuItem value="">None (Main Category)</MenuItem>
                  {categories.map(category => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                error={!!errors.description}
                helperText={errors.description}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Category Color
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {colorOptions.map(color => (
                  <motion.div
                    key={color}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <IconButton
                      onClick={() => setFormData({ ...formData, color })}
                      sx={{
                        width: 40,
                        height: 40,
                        backgroundColor: color,
                        border: formData.color === color ? '3px solid #333' : 'none',
                        '&:hover': {
                          backgroundColor: color
                        }
                      }}
                    />
                  </motion.div>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Sort Order"
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Category Icon (Emoji)
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter an emoji (e.g., 🍕, 🛍️, 🔧)"
                value={formData.icon || ''}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
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
            {selectedCategory ? 'Update' : 'Create'} Category
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        title="Delete Category"
        message={`Are you sure you want to delete "${selectedCategory?.name}"? This will also remove all subcategories and reassign stores to "Uncategorized".`}
        onConfirm={() => {
          console.log('Deleting category:', selectedCategory?.id);
          setOpenDeleteDialog(false);
        }}
      />
    </Box>
  );
};

export default ManageCategories;
