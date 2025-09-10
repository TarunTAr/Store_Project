import { useState, useEffect, useCallback, useRef } from 'react';

const useInfiniteScroll = (
  fetchFunction,
  options = {}
) => {
  const {
    initialPage = 1,
    pageSize = 10,
    threshold = 100,
    rootMargin = '0px',
    enabled = true,
    hasMore: initialHasMore = true,
    dependencies = [],
    onError,
    onSuccess,
    resetOnDepsChange = true
  } = options;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(initialPage);
  const [totalCount, setTotalCount] = useState(0);

  const observerRef = useRef();
  const lastElementRef = useRef();
  const isInitialLoad = useRef(true);
  const abortControllerRef = useRef();

  // Reset state when dependencies change
  useEffect(() => {
    if (resetOnDepsChange && !isInitialLoad.current) {
      reset();
    }
    isInitialLoad.current = false;
  }, dependencies);

  // Fetch data function
  const fetchData = useCallback(async (pageNumber, isRefresh = false) => {
    if (!enabled || loading) return;

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFunction({
        page: pageNumber,
        limit: pageSize,
        offset: (pageNumber - 1) * pageSize,
        signal: abortControllerRef.current.signal
      });

      const {
        data: newData = [],
        hasMore: moreAvailable = false,
        totalCount: total = 0,
        nextPage,
        pagination
      } = result;

      // Handle different response formats
      const items = Array.isArray(newData) ? newData : newData.items || [];
      const hasMoreData = moreAvailable || 
                         (pagination?.hasNextPage) || 
                         (nextPage !== null && nextPage !== undefined) ||
                         (total > (pageNumber * pageSize));

      if (isRefresh || pageNumber === initialPage) {
        setData(items);
      } else {
        setData(prevData => [...prevData, ...items]);
      }

      setHasMore(hasMoreData);
      setTotalCount(total || data.length + items.length);
      setPage(pageNumber);

      onSuccess?.(result, pageNumber);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err);
        onError?.(err, pageNumber);
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [fetchFunction, pageSize, enabled, loading, initialPage, data.length, onSuccess, onError]);

  // Load next page
  const loadMore = useCallback(() => {
    if (hasMore && !loading && enabled) {
      fetchData(page + 1);
    }
  }, [hasMore, loading, enabled, page, fetchData]);

  // Refresh data (reset to first page)
  const refresh = useCallback(() => {
    if (enabled) {
      fetchData(initialPage, true);
    }
  }, [enabled, initialPage, fetchData]);

  // Reset all state
  const reset = useCallback(() => {
    setData([]);
    setPage(initialPage);
    setHasMore(initialHasMore);
    setError(null);
    setLoading(false);
    setTotalCount(0);
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, [initialPage, initialHasMore]);

  // Intersection Observer for automatic loading
  const lastElementCallbackRef = useCallback((node) => {
    if (loading) return;
    
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin
      }
    );
    
    if (node) {
      observerRef.current.observe(node);
    }
    
    lastElementRef.current = node;
  }, [loading, hasMore, loadMore, rootMargin]);

  // Manual scroll detection (fallback)
  const handleScroll = useCallback(() => {
    if (!enabled || loading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - threshold;

    if (isNearBottom) {
      loadMore();
    }
  }, [enabled, loading, hasMore, threshold, loadMore]);

  // Add scroll listener as fallback
  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll, enabled]);

  // Initial data load
  useEffect(() => {
    if (enabled && data.length === 0 && !loading) {
      fetchData(initialPage, true);
    }
  }, [enabled, data.length, loading, fetchData, initialPage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Load specific page (useful for "Load More" buttons)
  const loadPage = useCallback((pageNumber) => {
    if (enabled && !loading) {
      fetchData(pageNumber);
    }
  }, [enabled, loading, fetchData]);

  // Remove item from data
  const removeItem = useCallback((predicate) => {
    setData(prevData => {
      const newData = typeof predicate === 'function' 
        ? prevData.filter(item => !predicate(item))
        : prevData.filter(item => item.id !== predicate);
      
      setTotalCount(prev => Math.max(0, prev - (prevData.length - newData.length)));
      return newData;
    });
  }, []);

  // Update specific item
  const updateItem = useCallback((predicate, updater) => {
    setData(prevData => {
      return prevData.map(item => {
        const shouldUpdate = typeof predicate === 'function' 
          ? predicate(item)
          : item.id === predicate;
        
        if (shouldUpdate) {
          return typeof updater === 'function' ? updater(item) : updater;
        }
        return item;
      });
    });
  }, []);

  // Add item to data
  const addItem = useCallback((newItem, position = 'end') => {
    setData(prevData => {
      const newData = position === 'start' 
        ? [newItem, ...prevData]
        : [...prevData, newItem];
      
      setTotalCount(prev => prev + 1);
      return newData;
    });
  }, []);

  return {
    // State
    data,
    loading,
    error,
    hasMore,
    page,
    totalCount,
    
    // Actions
    loadMore,
    refresh,
    reset,
    loadPage,
    
    // Data manipulation
    removeItem,
    updateItem,
    addItem,
    
    // Refs for manual implementation
    lastElementRef: lastElementCallbackRef,
    
    // Computed values
    isEmpty: data.length === 0 && !loading,
    isFirstPage: page === initialPage,
    totalPages: Math.ceil(totalCount / pageSize),
    loadedCount: data.length,
    
    // Utilities
    canLoadMore: hasMore && !loading,
    isLoadingFirstPage: loading && page === initialPage,
    isLoadingMore: loading && page > initialPage
  };
};

// Hook for virtualized infinite scroll (for large datasets)
export const useVirtualizedInfiniteScroll = (
  fetchFunction,
  itemHeight,
  containerHeight,
  options = {}
) => {
  const {
    overscan = 5,
    estimatedItemHeight = itemHeight,
    ...infiniteScrollOptions
  } = options;

  const infiniteScroll = useInfiniteScroll(fetchFunction, infiniteScrollOptions);
  const [scrollTop, setScrollTop] = useState(0);

  const visibleItemCount = Math.ceil(containerHeight / estimatedItemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / estimatedItemHeight) - overscan);
  const endIndex = Math.min(
    infiniteScroll.data.length - 1,
    startIndex + visibleItemCount + 2 * overscan
  );

  const visibleItems = infiniteScroll.data.slice(startIndex, endIndex + 1);
  const totalHeight = infiniteScroll.data.length * estimatedItemHeight;
  const offsetY = startIndex * estimatedItemHeight;

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
    
    // Load more when near bottom
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop - clientHeight < estimatedItemHeight * 3) {
      infiniteScroll.loadMore();
    }
  }, [infiniteScroll.loadMore, estimatedItemHeight]);

  return {
    ...infiniteScroll,
    visibleItems,
    startIndex,
    endIndex,
    totalHeight,
    offsetY,
    handleScroll,
    scrollToIndex: (index) => {
      setScrollTop(index * estimatedItemHeight);
    }
  };
};

export default useInfiniteScroll;
