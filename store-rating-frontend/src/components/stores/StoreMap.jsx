import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Button,
  Card,
  CardContent,
  Rating,
  Chip,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Fab,
  Dialog,
  DialogContent,
  Slide
} from '@mui/material';
import {
  MyLocation as LocationIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Layers as LayersIcon,
  Fullscreen as FullscreenIcon,
  Close as CloseIcon,
  Directions as DirectionsIcon,
  Store as StoreIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StoreMap = ({
  stores = [],
  selectedStore = null,
  onStoreSelect,
  center = { lat: 40.7128, lng: -74.0060 }, // New York City default
  zoom = 12,
  height = 400,
  interactive = true,
  showControls = true,
  showFilters = true,
  fullscreenEnabled = true
}) => {
  const [mapInstance, setMapInstance] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [mapStyle, setMapStyle] = useState('roadmap');
  const [showTraffic, setShowTraffic] = useState(false);
  const [clusteredStores, setClustered] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [selectedMapStore, setSelectedMapStore] = useState(selectedStore);
  
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowRef = useRef(null);

  const { categories } = useSelector((state) => state.stores);

  // Initialize map
  useEffect(() => {
    if (!window.google) {
      // Load Google Maps API
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places,geometry`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    } else {
      initializeMap();
    }
  }, []);

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center,
      zoom,
      mapTypeId: mapStyle,
      disableDefaultUI: !showControls,
      zoomControl: showControls,
      mapTypeControl: showControls,
      streetViewControl: showControls,
      fullscreenControl: false, // We'll use our custom fullscreen
      gestureHandling: interactive ? 'auto' : 'none',
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    setMapInstance(map);

    // Create info window
    infoWindowRef.current = new window.google.maps.InfoWindow();

    // Add stores to map
    addStoreMarkers(map);

    // Get user location
    getCurrentLocation();
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }
  };

  const addStoreMarkers = (map) => {
    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    stores.forEach(store => {
      if (!store.coordinates) return;

      const marker = new window.google.maps.Marker({
        position: store.coordinates,
        map,
        title: store.name,
        icon: {
          url: getMarkerIcon(store),
          scaledSize: new window.google.maps.Size(40, 40),
          origin: new window.google.maps.Point(0, 0),
          anchor: new window.google.maps.Point(20, 40)
        },
        animation: window.google.maps.Animation.DROP
      });

      marker.addListener('click', () => {
        showStoreInfo(store, marker);
        setSelectedMapStore(store);
        if (onStoreSelect) {
          onStoreSelect(store);
        }
      });

      markersRef.current.push(marker);
    });
  };

  const getMarkerIcon = (store) => {
    const color = store.rating >= 4 ? '4CAF50' : store.rating >= 3 ? 'FF9800' : 'F44336';
    return `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24'%3E%3Cpath fill='%23${color}' d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E`;
  };

  const showStoreInfo = (store, marker) => {
    const content = `
      <div style="max-width: 300px; padding: 16px;">
        <div style="display: flex; align-items: center; margin-bottom: 12px;">
          <img src="${store.image || '/api/placeholder/80/80'}" 
               alt="${store.name}" 
               style="width: 60px; height: 60px; border-radius: 8px; margin-right: 12px; object-fit: cover;">
          <div>
            <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600;">${store.name}</h3>
            <div style="display: flex; align-items: center; margin-bottom: 4px;">
              <span style="color: #f59e0b;">★★★★★</span>
              <span style="margin-left: 4px; color: #666;">${store.rating.toFixed(1)} (${store.reviewCount} reviews)</span>
            </div>
          </div>
        </div>
        <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">${store.address}</p>
        <p style="margin: 0 0 12px 0; color: #888; font-size: 12px;">${store.category?.name || ''}</p>
        <div style="display: flex; gap: 8px;">
          <button onclick="window.openStoreDetails('${store.id}')" 
                  style="padding: 6px 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
            View Details
          </button>
          <button onclick="window.getDirections(${store.coordinates.lat}, ${store.coordinates.lng})" 
                  style="padding: 6px 12px; background: white; color: #667eea; border: 1px solid #667eea; border-radius: 4px; cursor: pointer; font-size: 12px;">
            Directions
          </button>
        </div>
      </div>
    `;

    infoWindowRef.current.setContent(content);
    infoWindowRef.current.open(mapInstance, marker);

    // Add global functions for buttons
    window.openStoreDetails = (storeId) => {
      if (onStoreSelect) {
        const store = stores.find(s => s.id === storeId);
        if (store) onStoreSelect(store);
      }
    };

    window.getDirections = (lat, lng) => {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      window.open(url, '_blank');
    };
  };

  const handleZoomIn = () => {
    if (mapInstance) {
      mapInstance.setZoom(mapInstance.getZoom() + 1);
    }
  };

  const handleZoomOut = () => {
    if (mapInstance) {
      mapInstance.setZoom(mapInstance.getZoom() - 1);
    }
  };

  const handleMyLocation = () => {
    if (userLocation && mapInstance) {
      mapInstance.panTo(userLocation);
      mapInstance.setZoom(15);
    } else {
      getCurrentLocation();
    }
  };

  const handleMapStyleChange = (style) => {
    setMapStyle(style);
    if (mapInstance) {
      mapInstance.setMapTypeId(style);
    }
  };

  const handleFullscreen = () => {
    setFullscreen(true);
  };

  const mapContainerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 }
    }
  };

  const controlVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const MapControls = () => (
    <motion.div
      variants={controlVariants}
      initial="hidden"
      animate="visible"
    >
      <Paper
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          p: 2,
          borderRadius: 2,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          zIndex: 1000
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {/* Zoom Controls */}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Tooltip title="Zoom In">
              <IconButton size="small" onClick={handleZoomIn}>
                <ZoomInIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Zoom Out">
              <IconButton size="small" onClick={handleZoomOut}>
                <ZoomOutIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {/* My Location */}
          <Tooltip title="My Location">
            <IconButton 
              size="small" 
              onClick={handleMyLocation}
              sx={{ 
                color: userLocation ? 'primary.main' : 'text.secondary',
                '&:hover': { color: 'primary.main' }
              }}
            >
              <LocationIcon />
            </IconButton>
          </Tooltip>

          {/* Layer Controls */}
          <Tooltip title="Map Layers">
            <IconButton size="small">
              <LayersIcon />
            </IconButton>
          </Tooltip>

          {/* Fullscreen */}
          {fullscreenEnabled && (
            <Tooltip title="Fullscreen">
              <IconButton size="small" onClick={handleFullscreen}>
                <FullscreenIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Paper>
    </motion.div>
  );

  const MapFilters = () => (
    showFilters && (
      <motion.div
        variants={controlVariants}
        initial="hidden"
        animate="visible"
      >
        <Paper
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            p: 2,
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            zIndex: 1000,
            minWidth: 200
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            Map Options
          </Typography>

          <FormControl size="small" fullWidth sx={{ mb: 2 }}>
            <InputLabel>Map Style</InputLabel>
            <Select
              value={mapStyle}
              onChange={(e) => handleMapStyleChange(e.target.value)}
              label="Map Style"
            >
              <MenuItem value="roadmap">Roadmap</MenuItem>
              <MenuItem value="satellite">Satellite</MenuItem>
              <MenuItem value="hybrid">Hybrid</MenuItem>
              <MenuItem value="terrain">Terrain</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={showTraffic}
                onChange={(e) => setShowTraffic(e.target.checked)}
                size="small"
              />
            }
            label="Traffic"
            sx={{ fontSize: '0.875rem' }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={clusteredStores}
                onChange={(e) => setClustered(e.target.checked)}
                size="small"
              />
            }
            label="Cluster Stores"
            sx={{ fontSize: '0.875rem' }}
          />
        </Paper>
      </motion.div>
    )
  );

  const SelectedStoreCard = () => (
    selectedMapStore && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <Paper
          sx={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            right: 16,
            borderRadius: 3,
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            zIndex: 1000,
            maxWidth: 400,
            mx: 'auto'
          }}
        >
          <Card elevation={0}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <img
                  src={selectedMapStore.image || '/api/placeholder/80/80'}
                  alt={selectedMapStore.name}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 8,
                    objectFit: 'cover'
                  }}
                />
                
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {selectedMapStore.name}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={selectedMapStore.rating} readOnly size="small" />
                    <Typography variant="caption" sx={{ ml: 1 }}>
                      {selectedMapStore.rating.toFixed(1)} ({selectedMapStore.reviewCount})
                    </Typography>
                  </Box>

                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    {selectedMapStore.address}
                  </Typography>

                  {selectedMapStore.category && (
                    <Chip
                      label={selectedMapStore.category.name}
                      size="small"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  )}
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={() => setSelectedMapStore(null)}
                  >
                    <CloseIcon />
                  </IconButton>
                  
                  <Tooltip title="Get Directions">
                    <IconButton
                      size="small"
                      onClick={() => {
                        const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedMapStore.coordinates.lat},${selectedMapStore.coordinates.lng}`;
                        window.open(url, '_blank');
                      }}
                    >
                      <DirectionsIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Paper>
      </motion.div>
    )
  );

  return (
    <>
      <motion.div
        variants={mapContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <Paper
          sx={{
            position: 'relative',
            borderRadius: 3,
            overflow: 'hidden',
            height,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <div
            ref={mapRef}
            style={{
              width: '100%',
              height: '100%'
            }}
          />

          {/* Loading State */}
          {!mapInstance && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'grey.100'
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <StoreIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                </motion.div>
                <Typography variant="h6" color="text.secondary">
                  Loading Map...
                </Typography>
              </Box>
            </Box>
          )}

          {/* Map Controls */}
          {mapInstance && showControls && <MapControls />}
          
          {/* Map Filters */}
          {mapInstance && <MapFilters />}

          {/* Selected Store Card */}
          <AnimatePresence>
            {mapInstance && <SelectedStoreCard />}
          </AnimatePresence>
        </Paper>
      </motion.div>

      {/* Fullscreen Dialog */}
      <Dialog
        fullScreen
        open={fullscreen}
        onClose={() => setFullscreen(false)}
        TransitionComponent={Transition}
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <div
            ref={mapRef}
            style={{
              width: '100%',
              height: '100vh'
            }}
          />

          <Fab
            onClick={() => setFullscreen(false)}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: 'rgba(255, 255, 255, 0.9)'
            }}
          >
            <CloseIcon />
          </Fab>

          {showControls && <MapControls />}
          <MapFilters />
          
          <AnimatePresence>
            <SelectedStoreCard />
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StoreMap;
