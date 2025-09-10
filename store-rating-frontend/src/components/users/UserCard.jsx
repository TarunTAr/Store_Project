import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  Box,
  IconButton,
  Button,
  Chip,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Block as BlockIcon,
  CheckCircle as VerifyIcon,
  Star as StarIcon,
  Store as StoreIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as DateIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser, toggleUserStatus, verifyUser } from '../../store/userSlice';

const UserCard = ({
  user = {},
  variant = 'default', // default, compact, detailed, minimal
  showActions = true,
  showStats = true,
  onEdit,
  onView,
  onDelete,
  interactive = true,
  className = ''
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    if (onEdit) {
      onEdit(user);
    }
  };

  const handleView = () => {
    handleMenuClose();
    if (onView) {
      onView(user);
    }
  };

  const handleDelete = async () => {
    handleMenuClose();
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      try {
        await dispatch(deleteUser(user.id)).unwrap();
        if (onDelete) {
          onDelete(user.id);
        }
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const handleToggleStatus = async () => {
    handleMenuClose();
    try {
      await dispatch(toggleUserStatus(user.id)).unwrap();
    } catch (error) {
      console.error('Failed to toggle user status:', error);
    }
  };

  const handleVerifyUser = async () => {
    handleMenuClose();
    try {
      await dispatch(verifyUser(user.id)).unwrap();
    } catch (error) {
      console.error('Failed to verify user:', error);
    }
  };

  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
      case 'system_administrator':
        return <AdminIcon sx={{ fontSize: 16 }} />;
      case 'store_owner':
        return <StoreIcon sx={{ fontSize: 16 }} />;
      case 'user':
      case 'normal_user':
        return <PersonIcon sx={{ fontSize: 16 }} />;
      default:
        return <PersonIcon sx={{ fontSize: 16 }} />;
    }
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
      case 'system_administrator':
        return 'error';
      case 'store_owner':
        return 'warning';
      case 'user':
      case 'normal_user':
        return 'primary';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  };

  if (variant === 'minimal') {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={interactive ? "hover" : {}}
        className={className}
      >
        <Card
          sx={{
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            background: 'rgba(255, 255, 255, 0.9)'
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                src={user.avatar}
                sx={{
                  width: 32,
                  height: 32,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                {user.name?.charAt(0)}
              </Avatar>
              
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {user.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
              
              <Chip
                icon={getRoleIcon(user.role)}
                label={user.role}
                size="small"
                color={getRoleColor(user.role)}
                sx={{ fontSize: '0.7rem' }}
              />
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (variant === 'compact') {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={interactive ? "hover" : {}}
        className={className}
      >
        <Card
          sx={{
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: user.status === 'active' ? 'success.main' : 'error.main',
                      border: '2px solid white'
                    }}
                  />
                }
              >
                <Avatar
                  src={user.avatar}
                  sx={{
                    width: 48,
                    height: 48,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}
                >
                  {user.name?.charAt(0)}
                </Avatar>
              </Badge>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {user.name}
                  </Typography>
                  {user.verified && (
                    <VerifyIcon sx={{ fontSize: 16, color: 'success.main' }} />
                  )}
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {user.email}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    icon={getRoleIcon(user.role)}
                    label={user.role}
                    size="small"
                    color={getRoleColor(user.role)}
                    sx={{ fontSize: '0.7rem' }}
                  />
                  
                  <Chip
                    label={user.status}
                    size="small"
                    color={getStatusColor(user.status)}
                    sx={{ fontSize: '0.7rem' }}
                  />
                </Box>
              </Box>

              {showActions && (
                <IconButton
                  size="small"
                  onClick={handleMenuOpen}
                >
                  <MoreIcon />
                </IconButton>
              )}
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Default detailed variant
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={interactive ? "hover" : {}}
      whileTap={interactive ? "tap" : {}}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={className}
    >
      <Card
        sx={{
          borderRadius: 4,
          border: '1px solid',
          borderColor: isHovered ? 'primary.main' : 'divider',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          overflow: 'hidden',
          '&:hover': {
            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.15)'
          },
          transition: 'all 0.3s ease'
        }}
      >
        {/* Header with gradient background */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            p: 3,
            position: 'relative'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <motion.div
              animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      backgroundColor: user.status === 'active' ? 'success.main' : 'error.main',
                      border: '3px solid white',
                      boxShadow: 2
                    }}
                  />
                }
              >
                <Avatar
                  src={user.avatar}
                  sx={{
                    width: 64,
                    height: 64,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: '4px solid white',
                    boxShadow: 3
                  }}
                >
                  {user.name?.charAt(0)}
                </Avatar>
              </Badge>
            </motion.div>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {user.name}
                  </Typography>
                  {user.verified && (
                    <Tooltip title="Verified User">
                      <VerifyIcon sx={{ fontSize: 20, color: 'success.main' }} />
                    </Tooltip>
                  )}
                </Box>

                {showActions && (
                  <IconButton
                    size="small"
                    onClick={handleMenuOpen}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': {
                        backgroundColor: 'white'
                      }
                    }}
                  >
                    <MoreIcon />
                  </IconButton>
                )}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>

              {user.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {user.phone}
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  icon={getRoleIcon(user.role)}
                  label={user.role}
                  size="small"
                  color={getRoleColor(user.role)}
                  sx={{ fontSize: '0.75rem' }}
                />
                
                <Chip
                  label={user.status}
                  size="small"
                  color={getStatusColor(user.status)}
                  sx={{ fontSize: '0.75rem' }}
                />
              </Box>
            </Box>
          </Box>
        </Box>

        <CardContent sx={{ p: 3 }}>
          {/* Address */}
          {user.address && (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
              <LocationIcon sx={{ fontSize: 18, color: 'text.secondary', mt: 0.2 }} />
              <Typography variant="body2" sx={{ flex: 1, lineHeight: 1.5 }}>
                {user.address}
              </Typography>
            </Box>
          )}

          {/* Stats for Store Owners */}
          {showStats && user.role === 'store_owner' && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Store Statistics
              </Typography>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {user.storeRating?.toFixed(1) || '0.0'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Rating
                  </Typography>
                </Box>
                
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
                    {user.totalReviews || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Reviews
                  </Typography>
                </Box>
                
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'warning.main' }}>
                    {user.storeViews || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Views
                  </Typography>
                </Box>
              </Box>

              {user.storeRating && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Rating Progress
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(user.storeRating / 5) * 100}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: 3
                      }
                    }}
                  />
                </Box>
              )}
            </Box>
          )}

          {/* Joined Date */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <DateIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              Joined {formatDistanceToNow(new Date(user.createdAt || Date.now()))} ago
            </Typography>
          </Box>
        </CardContent>

        {/* Actions */}
        {showActions && (
          <CardActions sx={{ px: 3, py: 2, backgroundColor: 'grey.50' }}>
            <Button
              size="small"
              startIcon={<ViewIcon />}
              onClick={handleView}
              sx={{ borderRadius: 2 }}
            >
              View Profile
            </Button>
            
            <Button
              size="small"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              sx={{ borderRadius: 2 }}
            >
              Edit
            </Button>

            <Box sx={{ flex: 1 }} />
            
            <Typography variant="caption" color="text.disabled">
              ID: {user.id}
            </Typography>
          </CardActions>
        )}
      </Card>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            border: '1px solid',
            borderColor: 'divider'
          }
        }}
      >
        <MenuItem onClick={handleView}>
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Profile</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit User</ListItemText>
        </MenuItem>

        {!user.verified && (
          <MenuItem onClick={handleVerifyUser}>
            <ListItemIcon>
              <VerifyIcon fontSize="small" color="success" />
            </ListItemIcon>
            <ListItemText>Verify User</ListItemText>
          </MenuItem>
        )}

        <MenuItem onClick={handleToggleStatus}>
          <ListItemIcon>
            <BlockIcon fontSize="small" color={user.status === 'active' ? 'error' : 'success'} />
          </ListItemIcon>
          <ListItemText>
            {user.status === 'active' ? 'Deactivate' : 'Activate'}
          </ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete User</ListItemText>
        </MenuItem>
      </Menu>
    </motion.div>
  );
};

export default UserCard;
