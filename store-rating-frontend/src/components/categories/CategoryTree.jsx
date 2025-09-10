import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  TextField,
  Button,
  Chip,
  Tooltip,
  Collapse,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Badge,
  Divider,
  LinearProgress,
  Alert
} from '@mui/material';
import {
  ExpandMore as ExpandIcon,
  ChevronRight as CollapseIcon,
  MoreVert as MoreIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Category as CategoryIcon,
  Store as StoreIcon,
  AccountTree as TreeIcon,
  Refresh as RefreshIcon,
  UnfoldMore as ExpandAllIcon,
  UnfoldLess as CollapseAllIcon
} from '@mui/icons-material';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  reorderCategories
} from '../../store/categorySlice';

const CategoryTree = ({
  categories = [],
  loading = false,
  onCategorySelect,
  onCategoryEdit,
  onCategoryCreate,
  showSearch = true,
  showActions = true,
  allowReorder = false,
  expandByDefault = false,
  maxDepth = 3,
  className = ''
}) => {
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [createDialog, setCreateDialog] = useState({ open: false, parent: null });

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Build hierarchical tree structure
  const categoryTree = useMemo(() => {
    const categoryMap = new Map();
    const rootCategories = [];

    // First pass: create map of all categories
    categories.forEach(category => {
      categoryMap.set(category.id, {
        ...category,
        children: []
      });
    });

    // Second pass: build hierarchy
    categories.forEach(category => {
      const categoryNode = categoryMap.get(category.id);
      
      if (category.parentId && categoryMap.has(category.parentId)) {
        const parent = categoryMap.get(category.parentId);
        parent.children.push(categoryNode);
      } else {
        rootCategories.push(categoryNode);
      }
    });

    return rootCategories;
  }, [categories]);

  // Filter tree based on search
  const filteredTree = useMemo(() => {
    if (!searchTerm) return categoryTree;

    const filterNode = (node) => {
      const matchesSearch = node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           node.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const filteredChildren = node.children
        .map(child => filterNode(child))
        .filter(child => child !== null);

      if (matchesSearch || filteredChildren.length > 0) {
        return {
          ...node,
          children: filteredChildren
        };
      }

      return null;
    };

    return categoryTree
      .map(node => filterNode(node))
      .filter(node => node !== null);
  }, [categoryTree, searchTerm]);

  const handleNodeToggle = (nodeId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const handleExpandAll = () => {
    const allIds = new Set();
    const collectIds = (nodes) => {
      nodes.forEach(node => {
        allIds.add(node.id);
        if (node.children) {
          collectIds(node.children);
        }
      });
    };
    collectIds(categoryTree);
    setExpandedNodes(allIds);
  };

  const handleCollapseAll = () => {
    setExpandedNodes(new Set());
  };

  const handleMenuOpen = (event, node) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedNode(node);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedNode(null);
  };

  const handleCreateSubcategory = (parent) => {
    setCreateDialog({ open: true, parent });
    handleMenuClose();
  };

  const handleEdit = (node) => {
    if (onCategoryEdit) {
      onCategoryEdit(node);
    }
    handleMenuClose();
  };

  const handleDelete = async (node) => {
    if (window.confirm(`Delete "${node.name}" and all its subcategories?`)) {
      try {
        await dispatch(deleteCategory(node.id)).unwrap();
      } catch (error) {
        console.error('Failed to delete category:', error);
      }
    }
    handleMenuClose();
  };

  const handleView = (node) => {
    if (onCategorySelect) {
      onCategorySelect(node);
    }
    handleMenuClose();
  };

  const getCategoryIcon = (category) => {
    // Same icon logic as CategoryCard
    const name = (category.icon || category.name || '').toLowerCase();
    const iconProps = { sx: { fontSize: 18 } };

    switch (name) {
      case 'restaurant':
      case 'food':
        return '🍽️';
      case 'shopping':
      case 'retail':
        return '🛍️';
      case 'gas':
      case 'fuel':
        return '⛽';
      case 'pharmacy':
      case 'health':
        return '💊';
      case 'education':
      case 'school':
        return '🎓';
      case 'fitness':
      case 'gym':
        return '💪';
      default:
        return '📁';
    }
  };

  const getCategoryColor = (id) => {
    const colors = [
      '#667eea', '#764ba2', '#f093fb', '#f5576c',
      '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'
    ];
    return colors[id % colors.length];
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const nodeVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  const TreeNode = ({ node, level = 0, index = 0 }) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedNode?.id === node.id;

    return (
      <motion.div
        variants={nodeVariants}
        initial="hidden"
        animate="visible"
        custom={index}
        style={{ marginLeft: level * 24 }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            py: 1,
            px: 2,
            borderRadius: 2,
            border: '1px solid transparent',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'action.hover',
              borderColor: getCategoryColor(node.id)
            },
            backgroundColor: isSelected ? `${getCategoryColor(node.id)}15` : 'transparent',
            borderColor: isSelected ? getCategoryColor(node.id) : 'transparent',
            transition: 'all 0.2s ease'
          }}
          onClick={() => onCategorySelect && onCategorySelect(node)}
        >
          {/* Expand/Collapse Button */}
          <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {hasChildren ? (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNodeToggle(node.id);
                }}
                sx={{ p: 0.5 }}
              >
                <motion.div
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <CollapseIcon sx={{ fontSize: 16 }} />
                </motion.div>
              </IconButton>
            ) : (
              <Box sx={{ width: 16 }} />
            )}
          </Box>

          {/* Category Icon */}
          <Box sx={{ mr: 1.5, fontSize: '18px' }}>
            {getCategoryIcon(node)}
          </Box>

          {/* Category Name and Info */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {node.name}
              </Typography>

              {node.isActive === false && (
                <Chip
                  label="Inactive"
                  size="small"
                  color="error"
                  sx={{ fontSize: '0.65rem', height: 16 }}
                />
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.25 }}>
              <Typography variant="caption" color="text.secondary">
                {node.storeCount || 0} stores
              </Typography>
              
              {node.children?.length > 0 && (
                <Typography variant="caption" color="text.disabled">
                  • {node.children.length} subcategories
                </Typography>
              )}
            </Box>
          </Box>

          {/* Store Count Badge */}
          {(node.storeCount || 0) > 0 && (
            <Badge
              badgeContent={node.storeCount}
              color="primary"
              sx={{
                mr: 1,
                '& .MuiBadge-badge': {
                  fontSize: '0.7rem',
                  height: 18,
                  minWidth: 18
                }
              }}
            >
              <StoreIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            </Badge>
          )}

          {/* Actions Menu */}
          {showActions && (
            <IconButton
              size="small"
              onClick={(e) => handleMenuOpen(e, node)}
              sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
            >
              <MoreIcon sx={{ fontSize: 16 }} />
            </IconButton>
          )}
        </Box>

        {/* Children */}
        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ ml: 1, borderLeft: '1px dashed', borderColor: 'divider', pl: 1 }}>
                {node.children.map((child, childIndex) => (
                  <TreeNode
                    key={child.id}
                    node={child}
                    level={level + 1}
                    index={childIndex}
                  />
                ))}
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <LinearProgress sx={{ mb: 2 }} />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Loading categories...
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      <Paper
        elevation={3}
        sx={{
          borderRadius: 4,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)'
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 3,
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            borderBottom: 1,
            borderColor: 'divider'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TreeIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Category Tree
              </Typography>
              <Chip
                label={`${categories.length} categories`}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Expand All">
                <IconButton size="small" onClick={handleExpandAll}>
                  <ExpandAllIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Collapse All">
                <IconButton size="small" onClick={handleCollapseAll}>
                  <UnfoldLess />
                </IconButton>
              </Tooltip>

              <Tooltip title="Refresh">
                <IconButton size="small" onClick={() => dispatch(fetchCategories())}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>

              {onCategoryCreate && (
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => onCategoryCreate()}
                  sx={{
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}
                >
                  Add Category
                </Button>
              )}
            </Box>
          </Box>

          {/* Search */}
          {showSearch && (
            <TextField
              fullWidth
              size="small"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                endAdornment: searchTerm && (
                  <IconButton
                    size="small"
                    onClick={() => setSearchTerm('')}
                  >
                    <ClearIcon />
                  </IconButton>
                ),
                sx: { borderRadius: 3 }
              }}
            />
          )}
        </Box>

        {/* Tree Content */}
        <Box sx={{ p: 2, maxHeight: 600, overflow: 'auto' }}>
          {filteredTree.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <CategoryIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                {searchTerm ? 'No matching categories' : 'No categories found'}
              </Typography>
              <Typography variant="body2" color="text.disabled">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Create your first category to get started'
                }
              </Typography>
              
              {!searchTerm && onCategoryCreate && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => onCategoryCreate()}
                  sx={{
                    mt: 2,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}
                >
                  Create Category
                </Button>
              )}
            </Box>
          ) : (
            <Box>
              {filteredTree.map((node, index) => (
                <TreeNode key={node.id} node={node} index={index} />
              ))}
            </Box>
          )}
        </Box>

        {/* Footer Stats */}
        <Box
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
            backgroundColor: 'grey.50'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              {filteredTree.length} parent categories • {categories.filter(c => c.parentId).length} subcategories
            </Typography>
            
            <Typography variant="caption" color="text.secondary">
              Total: {categories.reduce((sum, cat) => sum + (cat.storeCount || 0), 0)} stores
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: { borderRadius: 2, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }
        }}
      >
        <MenuItem onClick={() => handleView(selectedNode)}>
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Stores</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleEdit(selectedNode)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Category</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleCreateSubcategory(selectedNode)}>
          <ListItemIcon>
            <AddIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Add Subcategory</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem 
          onClick={() => handleDelete(selectedNode)}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete Category</ListItemText>
        </MenuItem>
      </Menu>
    </motion.div>
  );
};

export default CategoryTree;
