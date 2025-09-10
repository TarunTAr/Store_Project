import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Autocomplete,
  TextField,
  Box,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Chip,
  Button,
  InputAdornment,
  IconButton,
  Divider,
  Popper,
  Fade,
  CircularProgress,
  Card,
  CardContent
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  History as HistoryIcon,
  TrendingUp as TrendingIcon,
  LocationOn as LocationIcon,
  Category as CategoryIcon,
  Store as StoreIcon,
  Star as StarIcon,
  FilterList as FilterIcon,
  Mic as MicIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { debounce } from 'lodash';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { searchStores, fetchTrendingSearches, addToSearchHistory } from '../../store/storeSlice';

const StoreSearch = ({
  onSearch,
  onStoreSelect,
  placeholder = "Search stores, categories, or locations...",
  showAdvanced = false,
  showVoiceSearch = false,
  showFilters = false,
  autoFocus = false,
  variant = 'standard', // standard, minimal, enhanced
  size = 'medium'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [trendingSearches, setTrendingSearches] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    category: '',
    location: '',
    minRating: 0
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.stores);

  const searchInputRef = useRef(null);
  const recognition = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    if (showVoiceSearch && 'webkitSpeechRecognition' in window) {
      recognition.current = new window.webkitSpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = 'en-US';

      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchTerm(transcript);
        handleSearch(transcript);
        setIsListening(false);
      };

      recognition.current.onerror = () => {
        setIsListening(false);
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [showVoiceSearch]);

  // Load initial data
  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem('recentStoreSearches') || '[]');
    setRecentSearches(recent.slice(0, 5));
    
    // Fetch trending searches
    dispatch(fetchTrendingSearches()).then(result => {
      if (result.payload) {
        setTrendingSearches(result.payload);
      }
    });
  }, [dispatch]);

  // Auto-focus if requested
  useEffect(() => {
    if (autoFocus && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [autoFocus]);

  // Debounced search suggestions
  const debouncedGetSuggestions = useMemo(
    () => debounce(async (term) => {
      if (term.length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const result = await dispatch(searchStores({
          query: term,
          limit: 8,
          includeStores: true,
          includeCategories: true
        })).unwrap();

        const allSuggestions = [];

        // Add store suggestions
        if (result.stores) {
          allSuggestions.push(
            ...result.stores.map(store => ({
              id: store.id,
              type: 'store',
              title: store.name,
              subtitle: store.address,
              rating: store.rating,
              category: store.category?.name,
              image: store.image,
              data: store
            }))
          );
        }

        // Add category suggestions
        if (result.categories) {
          allSuggestions.push(
            ...result.categories.map(category => ({
              id: category.id,
              type: 'category',
              title: category.name,
              subtitle: `${category.storeCount} stores`,
              data: category
            }))
          );
        }

        setSuggestions(allSuggestions);
      } catch (error) {
        console.error('Search suggestions error:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    [dispatch]
  );

  useEffect(() => {
    debouncedGetSuggestions(searchTerm);
    return () => debouncedGetSuggestions.cancel();
  }, [searchTerm, debouncedGetSuggestions]);

  const handleSearch = (value = searchTerm) => {
    if (!value.trim()) return;

    // Save to recent searches
    const newRecentSearches = [
      value,
      ...recentSearches.filter(item => item !== value)
    ].slice(0, 10);
    
    setRecentSearches(newRecentSearches);
    localStorage.setItem('recentStoreSearches', JSON.stringify(newRecentSearches));

    // Add to search history
    dispatch(addToSearchHistory(value));

    if (onSearch) {
      onSearch(value, searchFilters);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'store' && onStoreSelect) {
      onStoreSelect(suggestion.data);
    } else if (suggestion.type === 'category') {
      setSearchTerm(suggestion.title);
      handleSearch(suggestion.title);
    } else {
      setSearchTerm(suggestion.title);
      handleSearch(suggestion.title);
    }
  };

  const handleVoiceSearch = () => {
    if (recognition.current && !isListening) {
      setIsListening(true);
      recognition.current.start();
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSuggestions([]);
  };

  const getSuggestionIcon = (type) => {
    const iconProps = { sx: { fontSize: 20 } };
    switch (type) {
      case 'store': return <StoreIcon {...iconProps} />;
      case 'category': return <CategoryIcon {...iconProps} />;
      case 'recent': return <HistoryIcon {...iconProps} />;
      case 'trending': return <TrendingIcon {...iconProps} />;
      default: return <SearchIcon {...iconProps} />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 }
    }
  };

  const suggestionVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.2
      }
    }),
    exit: { opacity: 0, y: -10 }
  };

  const quickSearchVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3
      }
    })
  };

  // Combine all suggestions for display
  const allSuggestions = useMemo(() => {
    const combined = [];

    // Add recent searches (only if no search term)
    if (!searchTerm && recentSearches.length > 0) {
      combined.push(
        ...recentSearches.slice(0, 3).map(term => ({
          id: `recent-${term}`,
          type: 'recent',
          title: term,
          subtitle: 'Recent search'
        }))
      );
    }

    // Add trending searches (only if no search term)
    if (!searchTerm && trendingSearches.length > 0) {
      combined.push(
        ...trendingSearches.slice(0, 3).map(term => ({
          id: `trending-${term.query}`,
          type: 'trending',
          title: term.query,
          subtitle: `${term.count} searches`
        }))
      );
    }

    // Add current suggestions
    combined.push(...suggestions);

    return combined.slice(0, 8);
  }, [searchTerm, suggestions, recentSearches, trendingSearches]);

  if (variant === 'minimal') {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <TextField
          ref={searchInputRef}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          placeholder={placeholder}
          size={size}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton onClick={clearSearch} size="small">
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              borderRadius: 3,
              backgroundColor: 'background.paper',
              '&:hover': {
                backgroundColor: 'grey.50'
              }
            }
          }}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ position: 'relative', width: '100%' }}
    >
      <Autocomplete
        freeSolo
        options={allSuggestions}
        groupBy={(option) => {
          if (option.type === 'recent') return 'Recent Searches';
          if (option.type === 'trending') return 'Trending';
          if (option.type === 'store') return 'Stores';
          if (option.type === 'category') return 'Categories';
          return 'Suggestions';
        }}
        getOptionLabel={(option) => 
          typeof option === 'string' ? option : option.title || ''
        }
        renderOption={(props, option, { index }) => (
          <motion.li
            {...props}
            key={`${option.type}-${option.id}`}
            custom={index}
            variants={suggestionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => handleSuggestionClick(option)}
          >
            <ListItem sx={{ p: 1 }}>
              <ListItemAvatar sx={{ minWidth: 40 }}>
                <Avatar
                  src={option.image}
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText'
                  }}
                >
                  {getSuggestionIcon(option.type)}
                </Avatar>
              </ListItemAvatar>
              
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {option.title}
                    </Typography>
                    {option.type === 'store' && option.rating && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <StarIcon sx={{ fontSize: 14, color: '#f59e0b' }} />
                        <Typography variant="caption">
                          {option.rating.toFixed(1)}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    {option.subtitle}
                    {option.category && (
                      <Chip
                        label={option.category}
                        size="small"
                        sx={{
                          fontSize: '0.65rem',
                          height: 16,
                          ml: 1
                        }}
                      />
                    )}
                  </Typography>
                }
              />
            </ListItem>
          </motion.li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            ref={searchInputRef}
            placeholder={placeholder}
            variant="outlined"
            size={size}
            fullWidth
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <motion.div
                    animate={loading ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ 
                      duration: loading ? 1 : 0,
                      repeat: loading ? Infinity : 0,
                      ease: "linear"
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={20} />
                    ) : (
                      <SearchIcon color="action" />
                    )}
                  </motion.div>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {showVoiceSearch && (
                      <Tooltip title="Voice search">
                        <IconButton
                          onClick={handleVoiceSearch}
                          size="small"
                          disabled={isListening}
                          sx={{
                            color: isListening ? 'error.main' : 'action.active',
                            animation: isListening ? 'pulse 1s infinite' : 'none'
                          }}
                        >
                          <MicIcon />
                        </IconButton>
                      </Tooltip>
                    )}

                    {showFilters && (
                      <Tooltip title="Search filters">
                        <IconButton
                          onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                          size="small"
                          color={showAdvancedOptions ? 'primary' : 'default'}
                        >
                          <FilterIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    
                    {searchTerm && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <IconButton onClick={clearSearch} size="small">
                          <ClearIcon />
                        </IconButton>
                      </motion.div>
                    )}
                  </Box>
                </InputAdornment>
              ),
              sx: {
                borderRadius: 3,
                backgroundColor: 'background.paper',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'divider',
                  borderWidth: 2
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                  borderWidth: 2,
                  boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
                },
                transition: 'all 0.2s ease'
              }
            }}
          />
        )}
        PaperComponent={({ children, ...props }) => (
          <Paper
            {...props}
            elevation={8}
            sx={{
              mt: 1,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden',
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              maxHeight: 400,
              overflowY: 'auto'
            }}
          >
            <AnimatePresence mode="wait">
              {children}
            </AnimatePresence>
          </Paper>
        )}
        onInputChange={(event, newValue) => {
          if (event?.type === 'change') {
            setSearchTerm(newValue);
          }
        }}
        onChange={(event, value) => {
          if (value && typeof value === 'object') {
            handleSuggestionClick(value);
          } else if (typeof value === 'string') {
            handleSearch(value);
          }
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.defaultPrevented) {
            handleSearch();
          }
        }}
      />

      {/* Quick Search Chips */}
      {!searchTerm && (recentSearches.length > 0 || trendingSearches.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center', mr: 1 }}>
              Quick searches:
            </Typography>
            
            {[...recentSearches.slice(0, 3), ...trendingSearches.slice(0, 2).map(t => t.query)]
              .slice(0, 5)
              .map((term, index) => (
              <motion.div
                key={term}
                custom={index}
                variants={quickSearchVariants}
                initial="hidden"
                animate="visible"
              >
                <Chip
                  label={term}
                  variant="outlined"
                  size="small"
                  clickable
                  onClick={() => {
                    setSearchTerm(term);
                    handleSearch(term);
                  }}
                  sx={{
                    borderRadius: 3,
                    fontSize: '0.75rem',
                    '&:hover': {
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText',
                      borderColor: 'primary.main'
                    },
                    transition: 'all 0.3s ease'
                  }}
                />
              </motion.div>
            ))}
          </Box>
        </motion.div>
      )}

      {/* Advanced Options */}
      <Collapse in={showAdvancedOptions}>
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <Card sx={{ mt: 2, borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Advanced Search Options
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setShowAdvancedOptions(false)}
                >
                  <CloseIcon />
                </IconButton>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                <TextField
                  label="Category"
                  select
                  size="small"
                  value={searchFilters.category}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, category: e.target.value }))}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Location"
                  size="small"
                  value={searchFilters.location}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Enter city or area"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />

                <TextField
                  label="Min Rating"
                  select
                  size="small"
                  value={searchFilters.minRating}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, minRating: e.target.value }))}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                  <MenuItem value={0}>Any Rating</MenuItem>
                  <MenuItem value={1}>1+ Stars</MenuItem>
                  <MenuItem value={2}>2+ Stars</MenuItem>
                  <MenuItem value={3}>3+ Stars</MenuItem>
                  <MenuItem value={4}>4+ Stars</MenuItem>
                  <MenuItem value={5}>5 Stars</MenuItem>
                </TextField>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Collapse>

      {/* Voice Search Indicator */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 2000,
              marginTop: 8
            }}
          >
            <Paper
              elevation={4}
              sx={{
                p: 3,
                borderRadius: 2,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <MicIcon sx={{ fontSize: 32, mb: 1 }} />
              </motion.div>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Listening...
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Say something like "pizza restaurants near me"
              </Typography>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </motion.div>
  );
};

export default StoreSearch;
