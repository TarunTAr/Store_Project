import React, { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Collapse,
  Paper
} from '@mui/material';
import {
  Category as CategoryIcon,
  Restaurant as RestaurantIcon,
  ShoppingCart as ShoppingIcon,
  LocalGasStation as GasIcon,
  LocalPharmacy as PharmacyIcon,
  School as SchoolIcon,
  FitnessCenter as GymIcon,
  BeautyAndBeast as BeautyIcon,
  Build as ServiceIcon,
  More as MoreIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Add as AddIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, createCategory } from '../../store/storeSlice';

const StoreCategorySelector = ({
  value = '',
  onChange,
  error = false,
  helperText = '',
  label = 'Category',
  required = false,
  disabled = false,
  variant = 'standard', // standard, grid, list
  showCreateNew = false,
  multiple = false,
  size = 'medium'
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newCategoryData, setNewCategoryData] = useState({
    name: '',
    description: '',
    icon: '',
    parentId: null
  });

  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.stores);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  const getCategoryIcon = (category) => {
    const iconName = category.icon?.toLowerCase();
    const iconProps = { sx: { fontSize: 24 } };

    switch (iconName || category.name.toLowerCase()) {
      case 'restaurant':
      case 'food':
      case 'dining':
        return <RestaurantIcon {...iconProps} />;
      case 'shopping':
      case 'retail':
      case 'store':
        return <ShoppingIcon {...iconProps} />;
      case 'gas':
      case 'fuel':
        return <GasIcon {...iconProps} />;
      case 'pharmacy':
      case 'health':
        return <PharmacyIcon {...iconProps} />;
      case 'education':
      case 'school':
        return <SchoolIcon {...iconProps} />;
      case 'fitness':
      case 'gym':
        return <GymIcon {...iconProps} />;
      case 'beauty':
      case 'salon':
        return <BeautyIcon {...iconProps} />;
      case 'service':
      case 'repair':
        return <ServiceIcon {...iconProps} />;
      default:
        return <CategoryIcon {...iconProps} />;
    }
  };

  const getCategoryColor = (category) => {
    const colors = [
      '#667eea', '#764ba2', '#f093fb', '#f5576c',
      '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
      '#ffecd2', '#fcb69f', '#a8edea', '#fed6e3'
    ];
    return colors[category.id % colors.length];
  };

  // Filter categories based on search term
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group categories by parent
  const groupedCategories = filteredCategories.reduce((acc, category) => {
    const parentId = category.parentId || 'root';
    if (!acc[parentId]) acc[parentId] = [];
    acc[parentId].push(category);
    return acc;
  }, {});

  const handleCategorySelect = (categoryId) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(categoryId)
        ? currentValues.filter(id => id !== categoryId)
        : [...currentValues, categoryId];
      onChange(newValues);
    } else {
      onChange(categoryId);
      setOpen(false);
    }
  };

  const handleExpandCategory = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleCreateCategory = async () => {
    try {
      const result = await dispatch(createCategory(newCategoryData)).unwrap();
      setCreateDialogOpen(false);
      setNewCategoryData({ name: '', description: '', icon: '', parentId: null });
      onChange(result.id);
    } catch (error) {
      console.error('Failed to create category:', error);
    }
  };

  const getSelectedCategory = () => {
    if (multiple) {
      return Array.isArray(value) ? value : [];
    }
    return categories.find(cat => cat.id === value);
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3
      }
    })
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 300 }
    },
    hover: {
      scale: 1.02,
      y: -2,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  };

  if (variant === 'grid') {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
            {label} {required && <span style={{ color: 'error.main' }}>*</span>}
          </Typography>
          
          <TextField
            placeholder="Search categories..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              sx: { borderRadius: 2 }
            }}
            sx={{ mb: 2, width: '100%' }}
          />
        </Box>

        <Grid container spacing={2}>
          <AnimatePresence>
            {filteredCategories.map((category, index) => (
              <Grid item xs={6} sm={4} md={3} key={category.id}>
                <motion.div
                  custom={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: 2,
                      borderColor: value === category.id ? 'primary.main' : 'transparent',
                      borderRadius: 3,
                      overflow: 'hidden',
                      '&:hover': {
                        borderColor: 'primary.light',
                        boxShadow: 4
                      },
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: getCategoryColor(category),
                          width: 48,
                          height: 48,
                          mx: 'auto',
                          mb: 2
                        }}
                      >
                        {getCategoryIcon(category)}
                      </Avatar>
                      
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          mb: 0.5,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {category.name}
                      </Typography>
                      
                      {category.storeCount && (
                        <Typography variant="caption" color="text.secondary">
                          {category.storeCount} stores
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </AnimatePresence>

          {/* Create New Category */}
          {showCreateNew && (
            <Grid item xs={6} sm={4} md={3}>
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Card
                  sx={{
                    cursor: 'pointer',
                    border: 2,
                    borderColor: 'dashed',
                    borderStyle: 'dashed',
                    borderRadius: 3,
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'primary.light'
                    },
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => setCreateDialogOpen(true)}
                >
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: 'grey.200',
                        width: 48,
                        height: 48,
                        mx: 'auto',
                        mb: 2
                      }}
                    >
                      <AddIcon />
                    </Avatar>
                    
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Create New
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          )}
        </Grid>

        {error && helperText && (
          <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
            {helperText}
          </Typography>
        )}
      </motion.div>
    );
  }

  if (variant === 'list') {
    return (
      <Paper sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
            {label}
          </Typography>
          
          <TextField
            placeholder="Search categories..."
            size="small"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              sx: { borderRadius: 2 }
            }}
          />
        </Box>

        <List sx={{ maxHeight: 300, overflow: 'auto' }}>
          <AnimatePresence>
            {Object.entries(groupedCategories).map(([parentId, categoryList]) => (
              <Box key={parentId}>
                {categoryList.map((category, index) => (
                  <motion.div
                    key={category.id}
                    custom={index}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <ListItem disablePadding>
                      <ListItemButton
                        selected={value === category.id}
                        onClick={() => handleCategorySelect(category.id)}
                        sx={{
                          borderRadius: 1,
                          mx: 1,
                          '&.Mui-selected': {
                            backgroundColor: 'primary.light',
                            '&:hover': {
                              backgroundColor: 'primary.main',
                              color: 'white'
                            }
                          }
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              bgcolor: getCategoryColor(category),
                              width: 32,
                              height: 32
                            }}
                          >
                            {getCategoryIcon(category)}
                          </Avatar>
                        </ListItemAvatar>
                        
                        <ListItemText
                          primary={category.name}
                          secondary={category.description}
                        />
                        
                        {category.storeCount && (
                          <Chip
                            label={category.storeCount}
                            size="small"
                            variant="outlined"
                          />
                        )}
                        
                        {category.children?.length > 0 && (
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExpandCategory(category.id);
                            }}
                          >
                            {expandedCategories.has(category.id) ? <CollapseIcon /> : <ExpandIcon />}
                          </IconButton>
                        )}
                      </ListItemButton>
                    </ListItem>

                    {/* Subcategories */}
                    {category.children?.length > 0 && (
                      <Collapse in={expandedCategories.has(category.id)}>
                        <List component="div" disablePadding sx={{ ml: 4 }}>
                          {category.children.map((child) => (
                            <ListItemButton
                              key={child.id}
                              selected={value === child.id}
                              onClick={() => handleCategorySelect(child.id)}
                              sx={{ pl: 4, borderRadius: 1 }}
                            >
                              <ListItemAvatar>
                                <Avatar sx={{ width: 24, height: 24, bgcolor: 'grey.300' }}>
                                  {getCategoryIcon(child)}
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText primary={child.name} />
                            </ListItemButton>
                          ))}
                        </List>
                      </Collapse>
                    )}
                  </motion.div>
                ))}
              </Box>
            ))}
          </AnimatePresence>
        </List>
      </Paper>
    );
  }

  // Standard dropdown variant
  return (
    <FormControl
      fullWidth
      error={error}
      disabled={disabled}
      size={size}
      required={required}
    >
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        label={label}
        MenuProps={{
          PaperProps: {
            sx: {
              maxHeight: 300,
              borderRadius: 2
            }
          }
        }}
        sx={{
          borderRadius: 2,
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }
        }}
      >
        {categories.map((category) => (
          <MenuItem key={category.id} value={category.id}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
              <Avatar
                sx={{
                  bgcolor: getCategoryColor(category),
                  width: 24,
                  height: 24
                }}
              >
                {getCategoryIcon(category)}
              </Avatar>
              
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2">
                  {category.name}
                </Typography>
                {category.description && (
                  <Typography variant="caption" color="text.secondary">
                    {category.description}
                  </Typography>
                )}
              </Box>
              
              {category.storeCount && (
                <Chip
                  label={category.storeCount}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.6rem' }}
                />
              )}
            </Box>
          </MenuItem>
        ))}

        {showCreateNew && (
          <MenuItem onClick={() => setCreateDialogOpen(true)}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'primary.main' }}>
              <Avatar sx={{ bgcolor: 'primary.light', width: 24, height: 24 }}>
                <AddIcon sx={{ fontSize: 16 }} />
              </Avatar>
              <Typography variant="body2">Create New Category</Typography>
            </Box>
          </MenuItem>
        )}
      </Select>
      
      {helperText && (
        <Typography
          variant="caption"
          color={error ? 'error' : 'text.secondary'}
          sx={{ mt: 0.5, ml: 1 }}
        >
          {helperText}
        </Typography>
      )}

      {/* Selected Categories (for multiple) */}
      {multiple && Array.isArray(value) && value.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
          {value.map((categoryId) => {
            const category = categories.find(c => c.id === categoryId);
            if (!category) return null;
            
            return (
              <Chip
                key={categoryId}
                label={category.name}
                onDelete={() => handleCategorySelect(categoryId)}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ borderRadius: 2 }}
              />
            );
          })}
        </Box>
      )}

      {/* Create Category Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Create New Category</Typography>
          <IconButton onClick={() => setCreateDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Category Name"
              fullWidth
              value={newCategoryData.name}
              onChange={(e) => setNewCategoryData(prev => ({ ...prev, name: e.target.value }))}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            
            <TextField
              label="Description (Optional)"
              fullWidth
              multiline
              rows={2}
              value={newCategoryData.description}
              onChange={(e) => setNewCategoryData(prev => ({ ...prev, description: e.target.value }))}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            
            <FormControl fullWidth>
              <InputLabel>Parent Category (Optional)</InputLabel>
              <Select
                value={newCategoryData.parentId || ''}
                onChange={(e) => setNewCategoryData(prev => ({ ...prev, parentId: e.target.value || null }))}
                label="Parent Category (Optional)"
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="">None (Top Level)</MenuItem>
                {categories.filter(cat => !cat.parentId).map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                onClick={() => setCreateDialogOpen(false)}
                sx={{ borderRadius: 2 }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateCategory}
                variant="contained"
                disabled={!newCategoryData.name}
                sx={{
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                Create Category
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </FormControl>
  );
};

export default StoreCategorySelector;
