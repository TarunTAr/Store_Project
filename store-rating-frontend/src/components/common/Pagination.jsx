import React from 'react';
import {
  Box,
  Pagination as MuiPagination,
  Select,
  MenuItem,
  FormControl,
  Typography,
  IconButton,
  Tooltip,
  Paper
} from '@mui/material';
import {
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon,
  ChevronLeft as PrevIcon,
  ChevronRight as NextIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Pagination = ({
  count = 1,
  page = 1,
  rowsPerPage = 10,
  rowsPerPageOptions = [5, 10, 25, 50, 100],
  onPageChange,
  onRowsPerPageChange,
  showRowsPerPage = true,
  showFirstLastButtons = true,
  showInfo = true,
  totalItems = 0,
  color = 'primary',
  variant = 'outlined', // outlined, contained, text
  size = 'medium',
  disabled = false
}) => {
  const handlePageChange = (event, newPage) => {
    if (onPageChange) {
      onPageChange(event, newPage);
    }
  };

  const handleRowsPerPageChange = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    if (onRowsPerPageChange) {
      onRowsPerPageChange(event, newRowsPerPage);
    }
  };

  const handleFirstPage = () => {
    if (page > 1 && onPageChange) {
      onPageChange(null, 1);
    }
  };

  const handleLastPage = () => {
    if (page < count && onPageChange) {
      onPageChange(null, count);
    }
  };

  const getItemInfo = () => {
    if (totalItems === 0) {
      return 'No items found';
    }

    const startItem = (page - 1) * rowsPerPage + 1;
    const endItem = Math.min(page * rowsPerPage, totalItems);
    
    return `${startItem}–${endItem} of ${totalItems.toLocaleString()}`;
  };

  const paginationVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.1,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  if (count <= 1 && !showInfo && !showRowsPerPage) {
    return null;
  }

  return (
    <motion.div
      variants={paginationVariants}
      initial="hidden"
      animate="visible"
    >
      <Paper
        elevation={1}
        sx={{
          p: 2,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          {/* Items info and rows per page */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
            {showInfo && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontWeight: 500,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                {getItemInfo()}
              </Typography>
            )}

            {showRowsPerPage && rowsPerPageOptions.length > 1 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Rows per page:
                </Typography>
                <FormControl size="small">
                  <Select
                    value={rowsPerPage}
                    onChange={handleRowsPerPageChange}
                    disabled={disabled}
                    sx={{
                      minWidth: 80,
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none'
                      },
                      '& .MuiSelect-select': {
                        py: 0.5,
                        background: 'rgba(102, 126, 234, 0.1)',
                        borderRadius: 1,
                        fontSize: '0.875rem',
                        fontWeight: 500
                      }
                    }}
                  >
                    {rowsPerPageOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}
          </Box>

          {/* Pagination controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {showFirstLastButtons && (
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Tooltip title="First page">
                  <span>
                    <IconButton
                      onClick={handleFirstPage}
                      disabled={disabled || page <= 1}
                      size={size}
                      sx={{
                        borderRadius: 2,
                        background: page <= 1 ? 'transparent' : 'rgba(102, 126, 234, 0.1)',
                        '&:hover': {
                          background: 'rgba(102, 126, 234, 0.2)'
                        }
                      }}
                    >
                      <FirstPageIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </motion.div>
            )}

            {/* Main pagination */}
            <MuiPagination
              count={count}
              page={page}
              onChange={handlePageChange}
              disabled={disabled}
              color={color}
              variant={variant}
              size={size}
              showFirstButton={false}
              showLastButton={false}
              siblingCount={1}
              boundaryCount={1}
              sx={{
                '& .MuiPaginationItem-root': {
                  borderRadius: 2,
                  fontWeight: 500,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(102, 126, 234, 0.3)'
                  },
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                    }
                  }
                },
                '& .MuiPaginationItem-ellipsis': {
                  color: 'text.secondary'
                }
              }}
            />

            {showFirstLastButtons && (
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Tooltip title="Last page">
                  <span>
                    <IconButton
                      onClick={handleLastPage}
                      disabled={disabled || page >= count}
                      size={size}
                      sx={{
                        borderRadius: 2,
                        background: page >= count ? 'transparent' : 'rgba(102, 126, 234, 0.1)',
                        '&:hover': {
                          background: 'rgba(102, 126, 234, 0.2)'
                        }
                      }}
                    >
                      <LastPageIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </motion.div>
            )}
          </Box>
        </Box>

        {/* Progress indicator */}
        {count > 1 && (
          <Box
            sx={{
              mt: 2,
              height: 4,
              backgroundColor: 'grey.200',
              borderRadius: 2,
              overflow: 'hidden'
            }}
          >
            <motion.div
              style={{
                height: '100%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 2
              }}
              initial={{ width: 0 }}
              animate={{ width: `${(page / count) * 100}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </Box>
        )}

        {/* Quick jump */}
        {count > 10 && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Page {page} of {count}
            </Typography>
          </Box>
        )}
      </Paper>
    </motion.div>
  );
};

export default Pagination;
