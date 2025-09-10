import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Autocomplete,
  TextField,
  Box,
  Chip,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Avatar,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Fade
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  History as HistoryIcon,
  TrendingUp as TrendingIcon,
  Store as StoreIcon,
  Category as CategoryIcon,
  FilterList as FilterIcon,
  Mic as MicIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { debounce } from 'lodash';
import { useQuery } from '@tanstack/react-query';

const SearchBar = ({ 
  onSearch, 
  onFilterChange, 
  placeholder = "Search stores, categories...",
  showFilters = true,
  showVoiceSearch = false,
  maxSuggestions = 8 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [focusedSuggestion, setFocusedSuggestion] = useState(-1);
  
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

  // Load recent searches
  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setRecentSearches(recent.slice(0, 5));
  }, []);

  // Debounced search suggestions
  const debouncedGetSuggestions = useMemo(
    () => debounce(async (term) => {
      if (term.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        // Mock API call - replace with your actual search service
        const mockSuggestions = [
          { id: 1, type: 'store', title: 'Amazing Coffee Shop', subtitle: 'Coffee & Bakery', rating: 4.5 },
          { id: 2, type: 'category', title: 'Restaurants', subtitle: '234 stores' },
          { id: 3, type: 'store', title: 'Tech Store Plus', subtitle: 'Electronics', rating: 4.2 },
          { id: 4, type: 'category', title: 'Shopping', subtitle: '156 stores' }
        ].filter(item => 
          item.title.toLowerCase().includes(term.toLowerCase())
        ).slice(0, maxSuggestions);

        setSuggestions(mockSuggestions);
      } catch (error) {
        console.error('Search suggestions error:', error);
        setSuggestions([]);
      }
    }, 300),
    [maxSuggestions]
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
    localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));

    if (onSearch) {
      onSearch(value, selectedFilters);
    }
  };

  const handleVoiceSearch = () => {
    if (recognition.current && !isListening) {
      setIsListening(true);
      recognition.current.start();
    }
  };

  const handleFilterAdd = (filter) => {
    const newFilters = [...selectedFilters, filter];
    setSelectedFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const handleFilterRemove = (filterToRemove) => {
    const newFilters = selectedFilters.filter(f => f.id !== filterToRemove.id);
    setSelectedFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSuggestions([]);
    if (onSearch) {
      onSearch('', selectedFilters);
    }
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

  const filterChipVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", stiffness: 300 }
    },
    exit: { opacity: 0, scale: 0.8 }
  };

  const allSuggestions = [
    ...recentSearches.map(term => ({
      id: `recent-${term}`,
      type: 'recent',
      title: term,
      value: term
    })),
    ...suggestions
  ];

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      {/* Main Search Input */}
      <Autocomplete
        freeSolo
        options={allSuggestions}
        groupBy={(option) => {
          if (option.type === 'recent') return 'Recent Searches';
          if (option.type === 'store') return 'Stores';
          if (option.type === 'category') return 'Categories';
          return 'Suggestions';
        }}
        getOptionLabel={(option) => 
          typeof option === 'string' ? option : option.title || option.value || ''
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
          >
            <ListItem sx={{ p: 0 }}>
              <ListItemAvatar sx={{ minWidth: 40 }}>
                <Avatar sx={{ 
                  width: 32, 
                  height: 32, 
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText'
                }}>
                  {getSuggestionIcon(option.type)}
                </Avatar>
              </ListItemAvatar>
              
              <ListItemText
                primary={
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {option.title}
                  </Typography>
                }
                secondary={
                  option.subtitle && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {option.subtitle}
                      </Typography>
                      {option.rating && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="caption" sx={{ ml: 1 }}>
                            ⭐ {option.rating}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  )
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
            fullWidth
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <motion.div
                    animate={searchTerm ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SearchIcon color="action" />
                  </motion.div>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {showVoiceSearch && (
                      <IconButton
                        onClick={handleVoiceSearch}
                        size="small"
                        disabled={isListening}
                        sx={{
                          color: isListening ? 'error.main' : 'action.active',
                          animation: isListening ? 'pulse 1s infinite' : 'none',
                          '@keyframes pulse': {
                            '0%': { opacity: 1 },
                            '50%': { opacity: 0.5 },
                            '100%': { opacity: 1 }
                          }
                        }}
                      >
                        <MicIcon />
                      </IconButton>
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
                  borderColor: 'primary.main',
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
              backgroundColor: 'rgba(255, 255, 255, 0.95)'
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
            handleSearch(value.value || value.title);
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

      {/* Active Filters */}
      <AnimatePresence>
        {selectedFilters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center', mr: 1 }}>
                Filters:
              </Typography>
              
              {selectedFilters.map((filter, index) => (
                <motion.div
                  key={filter.id}
                  variants={filterChipVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                >
                  <Chip
                    label={filter.label}
                    onDelete={() => handleFilterRemove(filter)}
                    color="primary"
                    variant="outlined"
                    size="small"
                    sx={{
                      borderRadius: 3,
                      '&:hover': {
                        backgroundColor: 'primary.light',
                        color: 'primary.contrastText',
                        '& .MuiChip-deleteIcon': {
                          color: 'primary.contrastText'
                        }
                      },
                      transition: 'all 0.3s ease'
                    }}
                  />
                </motion.div>
              ))}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

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
              zIndex: 1000
            }}
          >
            <Paper
              elevation={4}
              sx={{
                p: 2,
                mt: 1,
                borderRadius: 2,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <MicIcon sx={{ fontSize: 24, mb: 1 }} />
              </motion.div>
              <Typography variant="body2">
                Listening... Speak now
              </Typography>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default SearchBar;
