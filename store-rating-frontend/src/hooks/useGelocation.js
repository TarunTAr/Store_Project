import { useState, useEffect, useCallback, useRef } from 'react';

const useGeolocation = (options = {}) => {
  const {
    enableHighAccuracy = false,
    timeout = 10000,
    maximumAge = 300000, // 5 minutes
    watch = false,
    onLocationChange,
    onError,
    retryAttempts = 3,
    retryDelay = 2000
  } = options;

  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    accuracy: null,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null,
    timestamp: null
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permission, setPermission] = useState('prompt');
  const [supported, setSupported] = useState(false);

  const watchIdRef = useRef(null);
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef(null);

  // Check geolocation support
  useEffect(() => {
    setSupported('geolocation' in navigator);
    
    // Check permission status if supported
    if ('permissions' in navigator && 'geolocation' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setPermission(result.state);
        
        result.addEventListener('change', () => {
          setPermission(result.state);
        });
      }).catch(() => {
        // Permissions API not supported
        setPermission('prompt');
      });
    }
  }, []);

  // Format location data
  const formatLocationData = useCallback((position) => {
    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      altitude: position.coords.altitude,
      altitudeAccuracy: position.coords.altitudeAccuracy,
      heading: position.coords.heading,
      speed: position.coords.speed,
      timestamp: position.timestamp
    };
  }, []);

  // Handle successful location retrieval
  const handleSuccess = useCallback((position) => {
    const locationData = formatLocationData(position);
    setLocation(locationData);
    setLoading(false);
    setError(null);
    retryCountRef.current = 0;
    
    onLocationChange?.(locationData);
  }, [formatLocationData, onLocationChange]);

  // Handle geolocation errors with retry logic
  const handleError = useCallback((err) => {
    const errorMessages = {
      1: 'Location access denied by user',
      2: 'Location information unavailable',
      3: 'Location request timeout'
    };

    const errorInfo = {
      code: err.code,
      message: errorMessages[err.code] || 'Unknown location error',
      timestamp: Date.now()
    };

    // Retry logic for timeout and unavailable errors
    if ((err.code === 2 || err.code === 3) && retryCountRef.current < retryAttempts) {
      retryCountRef.current++;
      
      retryTimeoutRef.current = setTimeout(() => {
        getCurrentLocation();
      }, retryDelay * retryCountRef.current);
      
      return;
    }

    setError(errorInfo);
    setLoading(false);
    retryCountRef.current = 0;
    
    onError?.(errorInfo);
  }, [retryAttempts, retryDelay, onError]);

  // Get current location
  const getCurrentLocation = useCallback(() => {
    if (!supported) {
      const error = { code: 0, message: 'Geolocation not supported', timestamp: Date.now() };
      setError(error);
      onError?.(error);
      return Promise.reject(error);
    }

    setLoading(true);
    setError(null);

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          handleSuccess(position);
          resolve(formatLocationData(position));
        },
        (err) => {
          handleError(err);
          reject(err);
        },
        {
          enableHighAccuracy,
          timeout,
          maximumAge
        }
      );
    });
  }, [supported, enableHighAccuracy, timeout, maximumAge, handleSuccess, handleError, formatLocationData, onError]);

  // Start watching position
  const startWatching = useCallback(() => {
    if (!supported || watchIdRef.current) return;

    setLoading(true);
    setError(null);

    watchIdRef.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy,
        timeout,
        maximumAge
      }
    );
  }, [supported, enableHighAccuracy, timeout, maximumAge, handleSuccess, handleError]);

  // Stop watching position
  const stopWatching = useCallback(() => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      setLoading(false);
    }
  }, []);

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = useCallback((lat1, lon1, lat2, lon2, unit = 'km') => {
    const R = unit === 'km' ? 6371 : 3959; // Earth's radius in km or miles
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance * 100) / 100; // Round to 2 decimal places
  }, []);

  // Calculate bearing between two points
  const calculateBearing = useCallback((lat1, lon1, lat2, lon2) => {
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const lat1Rad = lat1 * (Math.PI / 180);
    const lat2Rad = lat2 * (Math.PI / 180);
    
    const y = Math.sin(dLon) * Math.cos(lat2Rad);
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
    
    let bearing = Math.atan2(y, x) * (180 / Math.PI);
    bearing = (bearing + 360) % 360; // Convert to 0-360°
    
    return Math.round(bearing * 100) / 100;
  }, []);

  // Get address from coordinates (reverse geocoding)
  const getAddressFromCoordinates = useCallback(async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=YOUR_API_KEY`
      );
      
      if (!response.ok) throw new Error('Geocoding request failed');
      
      const data = await response.json();
      return data.results[0]?.formatted || 'Address not found';
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      throw error;
    }
  }, []);

  // Get coordinates from address (forward geocoding)
  const getCoordinatesFromAddress = useCallback(async (address) => {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=YOUR_API_KEY`
      );
      
      if (!response.ok) throw new Error('Geocoding request failed');
      
      const data = await response.json();
      const result = data.results[0];
      
      if (!result) throw new Error('Address not found');
      
      return {
        latitude: result.geometry.lat,
        longitude: result.geometry.lng,
        formatted: result.formatted
      };
    } catch (error) {
      console.error('Forward geocoding error:', error);
      throw error;
    }
  }, []);

  // Check if user is within a geofence
  const isWithinGeofence = useCallback((centerLat, centerLon, radiusKm) => {
    if (!location.latitude || !location.longitude) return false;
    
    const distance = calculateDistance(
      location.latitude,
      location.longitude,
      centerLat,
      centerLon
    );
    
    return distance <= radiusKm;
  }, [location.latitude, location.longitude, calculateDistance]);

  // Auto-start watching if enabled
  useEffect(() => {
    if (watch && supported && permission === 'granted') {
      startWatching();
    }
    
    return () => {
      stopWatching();
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [watch, supported, permission, startWatching, stopWatching]);

  // Format coordinates for display
  const formatCoordinates = useCallback((format = 'decimal') => {
    if (!location.latitude || !location.longitude) return null;

    switch (format) {
      case 'dms': // Degrees, Minutes, Seconds
        const formatDMS = (coord, isLat) => {
          const absolute = Math.abs(coord);
          const degrees = Math.floor(absolute);
          const minutes = Math.floor((absolute - degrees) * 60);
          const seconds = Math.round(((absolute - degrees) * 60 - minutes) * 60 * 100) / 100;
          const direction = coord >= 0 ? (isLat ? 'N' : 'E') : (isLat ? 'S' : 'W');
          return `${degrees}°${minutes}'${seconds}"${direction}`;
        };
        
        return {
          latitude: formatDMS(location.latitude, true),
          longitude: formatDMS(location.longitude, false)
        };
      
      case 'decimal':
      default:
        return {
          latitude: Math.round(location.latitude * 1000000) / 1000000,
          longitude: Math.round(location.longitude * 1000000) / 1000000
        };
    }
  }, [location]);

  return {
    // Location state
    location,
    loading,
    error,
    permission,
    supported,
    
    // Actions
    getCurrentLocation,
    startWatching,
    stopWatching,
    
    // Utilities
    calculateDistance,
    calculateBearing,
    getAddressFromCoordinates,
    getCoordinatesFromAddress,
    isWithinGeofence,
    formatCoordinates,
    
    // Computed values
    hasLocation: !!(location.latitude && location.longitude),
    accuracy: location.accuracy ? Math.round(location.accuracy) : null,
    isHighAccuracy: location.accuracy ? location.accuracy < 10 : false,
    
    // Status helpers
    isGranted: permission === 'granted',
    isDenied: permission === 'denied',
    isPrompt: permission === 'prompt',
    
    // Retry info
    retryCount: retryCountRef.current,
    canRetry: retryCountRef.current < retryAttempts && !!error
  };
};

// Hook for location-based features
export const useLocationFeatures = () => {
  const location = useGeolocation({ watch: true });
  const [nearbyStores, setNearbyStores] = useState([]);
  const [loadingStores, setLoadingStores] = useState(false);

  const findNearbyStores = useCallback(async (radius = 5) => {
    if (!location.hasLocation) return;

    setLoadingStores(true);
    try {
      const response = await fetch(`/api/stores/nearby?lat=${location.location.latitude}&lng=${location.location.longitude}&radius=${radius}`);
      const stores = await response.json();
      
      // Add distance to each store
      const storesWithDistance = stores.map(store => ({
        ...store,
        distance: location.calculateDistance(
          location.location.latitude,
          location.location.longitude,
          store.latitude,
          store.longitude
        )
      }));

      setNearbyStores(storesWithDistance);
    } catch (error) {
      console.error('Failed to fetch nearby stores:', error);
    } finally {
      setLoadingStores(false);
    }
  }, [location]);

  useEffect(() => {
    if (location.hasLocation) {
      findNearbyStores();
    }
  }, [location.hasLocation, findNearbyStores]);

  return {
    ...location,
    nearbyStores,
    loadingStores,
    findNearbyStores
  };
};

export default useGeolocation;
