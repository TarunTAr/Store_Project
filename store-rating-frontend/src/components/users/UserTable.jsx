import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Avatar,
  Typography,
  Chip,
  IconButton,
  Checkbox,
  Box,
  Paper,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
  LinearProgress,
  Collapse,
  Alert
} from '@mui/material';
import {
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Block as BlockIcon,
  CheckCircle as VerifyIcon,
  Person as PersonIcon,
  Store as StoreIcon,
  AdminPanelSettings as AdminIcon,
  KeyboardArrowDown as ExpandIcon,
  KeyboardArrowUp as CollapseIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { 
  deleteUser, 
  toggleUserStatus, 
  verifyUser,
  bulkDeleteUsers,
  selectUser
} from '../../store/userSlice';

const UserTable = ({
  users = [],
  loading = false,
  sortConfig = { key: 'name', direction: 'asc' },
  onSort,
  selectedUsers = new Set(),
  onSelectUser,
  onSelectAll,
  onUserEdit,
  onUserView,
  showBulkActions = true,
  showExpandableRows = true,
  dense = false,
  stickyHeader = true,
  maxHeight = null
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: '', user: null });

  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);

  const handleMenuOpen = (event, user) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleConfirmAction = (action, user) => {
    setConfirmDialog({ open: true, action, user });
    handleMenuClose();
  };

  const executeAction = async () => {
    const { action, user } = confirmDialog;
    
    try {
      switch (action) {
        case 'delete':
          await dispatch(deleteUser(user.id)).unwrap();
          break;
        case 'toggleStatus':
          await dispatch(toggleUserStatus(user.id)).unwrap();
          break;
        case 'verify':
          await dispatch(verifyUser(user.id)).unwrap();
          break;
      }
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
    } finally {
      setConfirmDialog({ open: false, action: '', user: null });
    }
  };

  const handleRowExpand = (userId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedRows(newExpanded);
  };

  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
      case 'system_administrator':
        return <AdminIcon sx={{ fontSize: 16, color: 'error.main' }} />;
      case 'store_owner':
        return <StoreIcon sx={{ fontSize: 16, color: 'warning.main' }} />;
      default:
        return <PersonIcon sx={{ fontSize: 16, color: 'primary.main' }} />;
    }
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
      case 'system_administrator':
        return 'error';
      case 'store_owner':
        return 'warning';
      default:
        return 'primary';
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

  const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: { duration: 0.2 }
    }
  };

  const expandVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: { duration: 0.3 }
    }
  };

  if (loading) {
    return (
      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <LinearProgress
          sx={{
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }
          }}
        />
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Loading users...
          </Typography>
        </Box>
      </Paper>
    );
  }

  if (users.length === 0) {
    return (
      <Paper sx={{ borderRadius: 3, p: 4, textAlign: 'center' }}>
        <PersonIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No users found
        </Typography>
        <Typography variant="body2" color="text.disabled">
          Try adjusting your filters or add some users
        </Typography>
      </Paper>
    );
  }

  return (
    <motion.div
      variants={tableVariants}
      initial="hidden"
      animate="visible"
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
        <TableContainer sx={{ maxHeight }}>
          <Table stickyHeader={stickyHeader} size={dense ? 'small' : 'medium'}>
            <TableHead>
              <TableRow>
                {showBulkActions && (
                  <TableCell padding="checkbox" sx={{ backgroundColor: 'grey.50' }}>
                    <Checkbox
                      checked={selectedUsers.size === users.length && users.length > 0}
                      indeterminate={selectedUsers.size > 0 && selectedUsers.size < users.length}
                      onChange={onSelectAll}
                      color="primary"
                    />
                  </TableCell>
                )}

                {showExpandableRows && (
                  <TableCell sx={{ backgroundColor: 'grey.50', width: 50 }} />
                )}

                <TableCell sx={{ backgroundColor: 'grey.50' }}>
                  <TableSortLabel
                    active={sortConfig.key === 'name'}
                    direction={sortConfig.key === 'name' ? sortConfig.direction : 'asc'}
                    onClick={() => onSort('name')}
                    sx={{ fontWeight: 600 }}
                  >
                    User
                  </TableSortLabel>
                </TableCell>

                <TableCell sx={{ backgroundColor: 'grey.50' }}>
                  <TableSortLabel
                    active={sortConfig.key === 'email'}
                    direction={sortConfig.key === 'email' ? sortConfig.direction : 'asc'}
                    onClick={() => onSort('email')}
                    sx={{ fontWeight: 600 }}
                  >
                    Contact
                  </TableSortLabel>
                </TableCell>

                <TableCell sx={{ backgroundColor: 'grey.50' }}>
                  <TableSortLabel
                    active={sortConfig.key === 'role'}
                    direction={sortConfig.key === 'role' ? sortConfig.direction : 'asc'}
                    onClick={() => onSort('role')}
                    sx={{ fontWeight: 600 }}
                  >
                    Role
                  </TableSortLabel>
                </TableCell>

                <TableCell sx={{ backgroundColor: 'grey.50' }}>
                  <TableSortLabel
                    active={sortConfig.key === 'status'}
                    direction={sortConfig.key === 'status' ? sortConfig.direction : 'asc'}
                    onClick={() => onSort('status')}
                    sx={{ fontWeight: 600 }}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>

                <TableCell sx={{ backgroundColor: 'grey.50' }}>
                  <TableSortLabel
                    active={sortConfig.key === 'createdAt'}
                    direction={sortConfig.key === 'createdAt' ? sortConfig.direction : 'asc'}
                    onClick={() => onSort('createdAt')}
                    sx={{ fontWeight: 600 }}
                  >
                    Joined
                  </TableSortLabel>
                </TableCell>

                {!dense && (
                  <TableCell sx={{ backgroundColor: 'grey.50' }}>
                    Address
                  </TableCell>
                )}

                <TableCell align="center" sx={{ backgroundColor: 'grey.50' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <AnimatePresence>
                {users.map((user, index) => (
                  <React.Fragment key={user.id}>
                    <motion.tr
                      component={TableRow}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      custom={index}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'action.hover'
                        },
                        cursor: 'pointer'
                      }}
                      onClick={() => onUserView && onUserView(user)}
                    >
                      {showBulkActions && (
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedUsers.has(user.id)}
                            onChange={() => onSelectUser(user.id)}
                            onClick={(e) => e.stopPropagation()}
                            color="primary"
                          />
                        </TableCell>
                      )}

                      {showExpandableRows && (
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRowExpand(user.id);
                            }}
                          >
                            {expandedRows.has(user.id) ? <CollapseIcon /> : <ExpandIcon />}
                          </IconButton>
                        </TableCell>
                      )}

                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                              user.verified && (
                                <Box
                                  sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    backgroundColor: 'success.main',
                                    border: '2px solid white'
                                  }}
                                />
                              )
                            }
                          >
                            <Avatar
                              src={user.avatar}
                              sx={{
                                width: dense ? 32 : 40,
                                height: dense ? 32 : 40,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                              }}
                            >
                              {user.name?.charAt(0)}
                            </Avatar>
                          </Badge>

                          <Box sx={{ minWidth: 0 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {user.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                display: 'block',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: 150
                              }}
                            >
                              ID: {user.id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                            <EmailIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                            <Typography
                              variant="body2"
                              sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: 150
                              }}
                            >
                              {user.email}
                            </Typography>
                          </Box>
                          
                          {user.phone && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <PhoneIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                              <Typography variant="caption" color="text.secondary">
                                {user.phone}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Chip
                          icon={getRoleIcon(user.role)}
                          label={user.role}
                          size="small"
                          color={getRoleColor(user.role)}
                          sx={{ fontSize: '0.75rem' }}
                        />
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={user.status}
                            size="small"
                            color={getStatusColor(user.status)}
                            sx={{ fontSize: '0.75rem' }}
                          />
                          
                          {user.role === 'store_owner' && user.storeRating && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <StarIcon sx={{ fontSize: 14, color: '#f59e0b' }} />
                              <Typography variant="caption">
                                {user.storeRating.toFixed(1)}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {formatDistanceToNow(new Date(user.createdAt || Date.now()))} ago
                        </Typography>
                      </TableCell>

                      {!dense && (
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
                      )}

                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, user)}
                        >
                          <MoreIcon />
                        </IconButton>
                      </TableCell>
                    </motion.tr>

                    {/* Expandable Row Content */}
                    {showExpandableRows && expandedRows.has(user.id) && (
                      <TableRow>
                        <TableCell
                          colSpan={showBulkActions ? (!dense ? 8 : 7) : (!dense ? 7 : 6)}
                          sx={{ py: 0, borderBottom: 'none' }}
                        >
                          <Collapse in={expandedRows.has(user.id)}>
                            <motion.div
                              variants={expandVariants}
                              initial="hidden"
                              animate="visible"
                            >
                              <Box sx={{ p: 3, backgroundColor: 'grey.50', borderRadius: 2, m: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                                  Additional Information
                                </Typography>
                                
                                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                  <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                      <LocationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                      <Typography variant="body2">
                                        <strong>Address:</strong>
                                      </Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ ml: 3 }}>
                                      {user.address}
                                    </Typography>
                                  </Box>

                                  <Box>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                      <strong>Account Details:</strong>
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                      Verified: {user.verified ? 'Yes' : 'No'}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                      Last Login: {user.lastLogin ? formatDistanceToNow(new Date(user.lastLogin)) + ' ago' : 'Never'}
                                    </Typography>
                                    {user.role === 'store_owner' && (
                                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                        Store Rating: {user.storeRating?.toFixed(1) || 'N/A'}
                                      </Typography>
                                    )}
                                  </Box>
                                </Box>
                              </Box>
                            </motion.div>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </TableContainer>

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
          <MenuItem onClick={() => { onUserView && onUserView(selectedUser); handleMenuClose(); }}>
            <ListItemIcon>
              <ViewIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Profile</ListItemText>
          </MenuItem>

          <MenuItem onClick={() => { onUserEdit && onUserEdit(selectedUser); handleMenuClose(); }}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit User</ListItemText>
          </MenuItem>

          {selectedUser && !selectedUser.verified && (
            <MenuItem onClick={() => handleConfirmAction('verify', selectedUser)}>
              <ListItemIcon>
                <VerifyIcon fontSize="small" color="success" />
              </ListItemIcon>
              <ListItemText>Verify User</ListItemText>
            </MenuItem>
          )}

          <MenuItem onClick={() => handleConfirmAction('toggleStatus', selectedUser)}>
            <ListItemIcon>
              <BlockIcon 
                fontSize="small" 
                color={selectedUser?.status === 'active' ? 'error' : 'success'} 
              />
            </ListItemIcon>
            <ListItemText>
              {selectedUser?.status === 'active' ? 'Deactivate' : 'Activate'}
            </ListItemText>
          </MenuItem>

          <MenuItem 
            onClick={() => handleConfirmAction('delete', selectedUser)}
            sx={{ color: 'error.main' }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Delete User</ListItemText>
          </MenuItem>
        </Menu>

        {/* Confirmation Dialog */}
        <Dialog
          open={confirmDialog.open}
          onClose={() => setConfirmDialog({ open: false, action: '', user: null })}
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle>
            Confirm {confirmDialog.action === 'delete' ? 'Deletion' : 'Action'}
          </DialogTitle>
          <DialogContent>
            <Typography>
              {confirmDialog.action === 'delete' && 
                `Are you sure you want to delete ${confirmDialog.user?.name}? This action cannot be undone.`
              }
              {confirmDialog.action === 'toggleStatus' && 
                `Are you sure you want to ${confirmDialog.user?.status === 'active' ? 'deactivate' : 'activate'} ${confirmDialog.user?.name}?`
              }
              {confirmDialog.action === 'verify' && 
                `Are you sure you want to verify ${confirmDialog.user?.name}?`
              }
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setConfirmDialog({ open: false, action: '', user: null })}
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              onClick={executeAction}
              variant="contained"
              color={confirmDialog.action === 'delete' ? 'error' : 'primary'}
              sx={{ borderRadius: 2 }}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </motion.div>
  );
};

export default UserTable;
