import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useDebounce } from './useDebounce'; // We'll create this utility

// Simple debounce utility if not imported
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const useSearch = (searchFunction, options = {}) => {
  const {
    debounceDelay = 300,
    minQueryLength = 1,
    maxResults = 50,
    initialQuery = '',
    initialFilters = {},
    enabled = true,
    searchOnMount = false,
    cacheResults = true,
    cacheSize = 100,
    transformQuery,
    transformResults,
    onSearch,
    onResults,
    onError
  } = options;

  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState(initialFilters);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const debouncedQuery = useDebounce(query, debounceDelay);
  const debouncedFilters = useDebounce(filters, debounceDelay);
  
  const cacheRef = useRef(new Map());
  const abortControllerRef = useRef();
  const searchIdRef = useRef(0);

  // Generate cache key from query and filters
  const getCacheKey = useCallback((searchQuery, searchFilters) => {
    const normalizedQuery = (searchQuery || '').toLowerCase().trim();
    const normalizedFilters = JSON.stringify(searchFilters || {});
    return `${normalizedQuery}|${normalizedFilters}`;
  }, []);

  // Add to search history
  const addToHistory = useCallback((searchQuery) => {
    if (!searchQuery?.trim()) return;
    
    setSearchHistory(prev => {
      const filtered = prev.filter(item => 
        item.query.toLowerCase() !== searchQuery.toLowerCase()
      );
      const newHistory = [
        { query: searchQuery, timestamp: Date.now() },
        ...filtered
      ].slice(0, 10); // Keep last 10 searches
      
      return newHistory;
    });
  }, []);

  // Main search function
  const performSearch = useCallback(async (searchQuery, searchFilters, isManual = false) => {
    if (!enabled || (!searchQuery?.trim() && Object.keys(searchFilters || {}).length === 0)) {
      if (!isManual) {
        setResults([]);
        setError(null);
      }
      return;
    }

    const trimmedQuery = searchQuery?.trim() || '';
    
    if (trimmedQuery.length > 0 && trimmedQuery.length < minQueryLength) {
      return;
    }

    // Transform query if transformer provided
    const finalQuery = transformQuery ? transformQuery(trimmedQuery) : trimmedQuery;
    const finalFilters = searchFilters || {};

    // Check cache first
    const cacheKey = getCacheKey(finalQuery, finalFilters);
    if (cacheResults && cacheRef.current.has(cacheKey)) {
      const cachedResult = cacheRef.current.get(cacheKey);
      setResults(cachedResult.results);
      setError(null);
      onResults?.(cachedResult.results, finalQuery, finalFilters, true);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const currentSearchId = ++searchIdRef.current;
    
    setLoading(true);
    setError(null);

    try {
      onSearch?.(finalQuery, finalFilters);

      const searchParams = {
        query: finalQuery,
        filters: finalFilters,
        maxResults,
        signal: abortControllerRef.current.signal
      };

      const response = await searchFunction(searchParams);
      
      // Check if this is still the latest search
      if (currentSearchId !== searchIdRef.current) {
        return;
      }

      let searchResults = response;
      
      // Handle different response formats
      if (response && typeof response === 'object') {
        searchResults = response.results || response.data || response.items || response;
      }

      // Ensure results is an array
      if (!Array.isArray(searchResults)) {
        searchResults = [];
      }

      // Transform results if transformer provided
      if (transformResults) {
        searchResults = transformResults(searchResults, finalQuery, finalFilters);
      }

      // Limit results
      if (searchResults.length > maxResults) {
        searchResults = searchResults.slice(0, maxResults);
      }

      setResults(searchResults);
      
      // Cache results
      if (cacheResults && trimmedQuery) {
        // Maintain cache size limit
        if (cacheRef.current.size >= cacheSize) {
          const firstKey = cacheRef.current.keys().next().value;
          cacheRef.current.delete(firstKey);
        }
        
        cacheRef.current.set(cacheKey, {
          results: searchResults,
          timestamp: Date.now()
        });
      }

      // Add to search history for non-empty queries
      if (trimmedQuery && isManual) {
        addToHistory(trimmedQuery);
      }

      onResults?.(searchResults, finalQuery, finalFilters, false);
      
    } catch (err) {
      if (err.name !== 'AbortError' && currentSearchId === searchIdRef.current) {
        setError(err);
        setResults([]);
        onError?.(err, finalQuery, finalFilters);
      }
    } finally {
      if (currentSearchId === searchIdRef.current) {
        setLoading(false);
      }
    }
  }, [
    enabled, minQueryLength, maxResults, transformQuery, transformResults,
    searchFunction, cacheResults, cacheSize, getCacheKey, addToHistory,
    onSearch, onResults, onError
  ]);

  // Auto-search when debounced query or filters change
  useEffect(() => {
    if (enabled && (debouncedQuery || Object.keys(debouncedFilters).length > 0)) {
      performSearch(debouncedQuery, debouncedFilters, false);
    }
  }, [debouncedQuery, debouncedFilters, enabled, performSearch]);

  // Search on mount if enabled
  useEffect(() => {
    if (searchOnMount && (initialQuery || Object.keys(initialFilters).length > 0)) {
      performSearch(initialQuery, initialFilters, false);
    }
  }, [searchOnMount, initialQuery, initialFilters, performSearch]);

  // Manual search function
  const search = useCallback((searchQuery = query, searchFilters = filters) => {
    performSearch(searchQuery, searchFilters, true);
  }, [query, filters, performSearch]);

  // Clear search
  const clear = useCallback(() => {
    setQuery('');
    setFilters({});
    setResults([]);
    setError(null);
    setSuggestions([]);
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Reset to initial state
  const reset = useCallback(() => {
    setQuery(initialQuery);
    setFilters(initialFilters);
    setResults([]);
    setError(null);
    setSuggestions([]);
    setSearchHistory([]);
    cacheRef.current.clear();
  }, [initialQuery, initialFilters]);

  // Update single filter
  const updateFilter = useCallback((key, value) => {
    setFilters(prev => {
      if (value === null || value === undefined || value === '') {
        const { [key]: removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: value };
    });
  }, []);

  // Update multiple filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Remove filter
  const removeFilter = useCallback((key) => {
    setFilters(prev => {
      const { [key]: removed, ...rest } = prev;
      return rest;
    });
  }, []);

  // Clear cache
  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  // Get suggestions based on search history and current query
  const getSuggestions = useCallback((currentQuery = query) => {
    if (!currentQuery?.trim()) {
      return searchHistory.slice(0, 5).map(item => item.query);
    }
    
    const queryLower = currentQuery.toLowerCase();
    return searchHistory
      .filter(item => 
        item.query.toLowerCase().includes(queryLower) && 
        item.query.toLowerCase() !== queryLower
      )
      .slice(0, 5)
      .map(item => item.query);
  }, [query, searchHistory]);

  // Update suggestions when query changes
  useEffect(() => {
    setSuggestions(getSuggestions(query));
  }, [query, getSuggestions]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Computed values
  const hasQuery = useMemo(() => query.trim().length >= minQueryLength, [query, minQueryLength]);
  const hasFilters = useMemo(() => Object.keys(filters).length > 0, [filters]);
  const hasResults = useMemo(() => results.length > 0, [results]);
  const isEmpty = useMemo(() => !loading && !hasResults && (hasQuery || hasFilters), [loading, hasResults, hasQuery, hasFilters]);

  return {
    // State
    query,
    filters,
    results,
    loading,
    error,
    searchHistory,
    suggestions,
    
    // Actions
    setQuery,
    setFilters,
    search,
    clear,
    reset,
    
    // Filter management
    updateFilter,
    updateFilters,
    removeFilter,
    
    // Utilities
    clearCache,
    getSuggestions,
    
    // Computed values
    hasQuery,
    hasFilters,
    hasResults,
    isEmpty,
    isSearching: loading,
    
    // Cache info
    cacheSize: cacheRef.current.size,
    
    // Search statistics
    resultCount: results.length,
    lastSearchTime: searchHistory[0]?.timestamp,
    
    // Quick actions
    searchByHistory: (historyQuery) => {
      setQuery(historyQuery);
      search(historyQuery, filters);
    },
    
    retryLastSearch: () => {
      if (searchHistory.length > 0) {
        const lastQuery = searchHistory[0].query;
        search(lastQuery, filters);
      }
    }
  };
};

// Hook for faceted search (with category-based filtering)
export const useFacetedSearch = (searchFunction, facetConfig, options = {}) => {
  const [activeFacets, setActiveFacets] = useState({});
  const [facetCounts, setFacetCounts] = useState({});

  const search = useSearch(searchFunction, {
    ...options,
    initialFilters: { ...options.initialFilters, ...activeFacets }
  });

  const toggleFacet = useCallback((facetKey, value) => {
    setActiveFacets(prev => {
      const currentValues = prev[facetKey] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      if (newValues.length === 0) {
        const { [facetKey]: removed, ...rest } = prev;
        return rest;
      }
      
      return { ...prev, [facetKey]: newValues };
    });
  }, []);

  const clearFacets = useCallback(() => {
    setActiveFacets({});
  }, []);

  return {
    ...search,
    activeFacets,
    facetCounts,
    toggleFacet,
    clearFacets,
    isFacetActive: (facetKey, value) => {
      return activeFacets[facetKey]?.includes(value) || false;
    }
  };
};

export default useSearch;
