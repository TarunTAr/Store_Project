// ==========================================================================
// CLOUDINARY CONFIGURATION - Store Rating Platform
// Complete image/video upload and management setup
// ==========================================================================

// Environment detection
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// Cloudinary Configuration
export const cloudinaryConfig = {
  // Basic configuration
  cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.REACT_APP_CLOUDINARY_API_KEY,
  apiSecret: process.env.REACT_APP_CLOUDINARY_API_SECRET, // Should only be used server-side
  
  // Upload configuration
  upload: {
    // Default upload preset (configure in Cloudinary dashboard)
    uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'store_rating_uploads',
    
    // Signed uploads (more secure, requires backend)
    signed: isProduction,
    
    // Upload folder structure
    folders: {
      stores: 'stores',           // Store images
      avatars: 'avatars',         // User profile pictures
      categories: 'categories',   // Category icons
      system: 'system',          // System/app images
      temp: 'temp',              // Temporary uploads
    },
    
    // File size limits (in bytes)
    maxFileSize: {
      image: 10 * 1024 * 1024,    // 10MB for images
      video: 100 * 1024 * 1024,   // 100MB for videos
      document: 5 * 1024 * 1024,   // 5MB for documents
    },
    
    // Allowed formats
    allowedFormats: {
      image: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
      video: ['mp4', 'webm', 'mov', 'avi'],
      document: ['pdf', 'doc', 'docx'],
    },
    
    // Upload parameters
    params: {
      image: {
        resource_type: 'image',
        quality: 'auto:good',
        fetch_format: 'auto',
        flags: 'progressive',
        crop: 'limit',
        max_bytes: 10485760, // 10MB
      },
      video: {
        resource_type: 'video',
        quality: 'auto',
        fetch_format: 'auto',
        max_bytes: 104857600, // 100MB
      },
      avatar: {
        resource_type: 'image',
        quality: 'auto:good',
        fetch_format: 'auto',
        crop: 'fill',
        gravity: 'face',
        max_bytes: 2097152, // 2MB
      },
    },
  },
  
  // Transformation presets
  transformations: {
    // Store images
    store: {
      thumbnail: {
        width: 300,
        height: 200,
        crop: 'fill',
        quality: 'auto:good',
        fetch_format: 'auto',
      },
      medium: {
        width: 600,
        height: 400,
        crop: 'fill',
        quality: 'auto:good',
        fetch_format: 'auto',
      },
      large: {
        width: 1200,
        height: 800,
        crop: 'fill',
        quality: 'auto:good',
        fetch_format: 'auto',
      },
      hero: {
        width: 1920,
        height: 600,
        crop: 'fill',
        quality: 'auto:good',
        fetch_format: 'auto',
      },
    },
    
    // User avatars
    avatar: {
      small: {
        width: 40,
        height: 40,
        crop: 'fill',
        gravity: 'face',
        radius: 'max',
        quality: 'auto:good',
        fetch_format: 'auto',
      },
      medium: {
        width: 80,
        height: 80,
        crop: 'fill',
        gravity: 'face',
        radius: 'max',
        quality: 'auto:good',
        fetch_format: 'auto',
      },
      large: {
        width: 200,
        height: 200,
        crop: 'fill',
        gravity: 'face',
        radius: 'max',
        quality: 'auto:good',
        fetch_format: 'auto',
      },
    },
    
    // Category icons
    category: {
      icon: {
        width: 64,
        height: 64,
        crop: 'fit',
        quality: 'auto:good',
        fetch_format: 'auto',
        background: 'transparent',
      },
      card: {
        width: 200,
        height: 150,
        crop: 'fill',
        quality: 'auto:good',
        fetch_format: 'auto',
      },
    },
    
    // Responsive images
    responsive: {
      mobile: {
        width: 480,
        quality: 'auto:low',
        fetch_format: 'auto',
        dpr: 'auto',
      },
      tablet: {
        width: 768,
        quality: 'auto:good',
        fetch_format: 'auto',
        dpr: 'auto',
      },
      desktop: {
        width: 1200,
        quality: 'auto:good',
        fetch_format: 'auto',
        dpr: 'auto',
      },
    },
    
    // Special effects
    effects: {
      blur: {
        effect: 'blur:300',
        quality: 'auto:low',
      },
      sepia: {
        effect: 'sepia',
        quality: 'auto:good',
      },
      grayscale: {
        effect: 'grayscale',
        quality: 'auto:good',
      },
      brightness: {
        effect: 'brightness:20',
        quality: 'auto:good',
      },
    },
  },
  
  // Security settings
  security: {
    // Enable signed URLs for sensitive content
    signedUrls: isProduction,
    
    // URL expiration time (in seconds)
    urlExpiration: 3600, // 1 hour
    
    // Access control
    accessControl: {
      // Allowed domains for image delivery
      allowedDomains: isProduction 
        ? [process.env.REACT_APP_DOMAIN]
        : ['localhost', '127.0.0.1'],
      
      // Referrer policy
      allowedReferrers: isProduction
        ? [process.env.REACT_APP_DOMAIN]
        : ['*'],
    },
    
    // Content moderation
    moderation: {
      // Enable automatic moderation
      enabled: isProduction,
      
      // Moderation add-ons
      addons: ['aws_rek', 'google_vision', 'azure_vision'],
      
      // Rejection threshold
      threshold: 0.7,
    },
  },
  
  // Optimization settings
  optimization: {
    // Auto-optimize images
    autoOptimize: true,
    
    // WebP support
    webpSupport: true,
    
    // AVIF support
    avifSupport: true,
    
    // Progressive JPEG
    progressiveJpeg: true,
    
    // Lazy loading
    lazyLoading: true,
    
    // Responsive breakpoints
    responsiveBreakpoints: {
      enabled: true,
      maxImages: 5,
      minWidth: 200,
      maxWidth: 1200,
      bytesStep: 20000,
    },
  },
  
  // Analytics and monitoring
  analytics: {
    // Enable analytics
    enabled: isProduction,
    
    // Track image views
    trackViews: true,
    
    // Track transformations
    trackTransformations: true,
    
    // Custom analytics events
    customEvents: {
      upload: 'image_upload',
      view: 'image_view',
      transformation: 'image_transformation',
      error: 'image_error',
    },
  },
  
  // Caching configuration
  cache: {
    // Browser cache duration
    browserCache: 86400, // 24 hours
    
    // CDN cache duration
    cdnCache: 31536000, // 1 year
    
    // Cache busting
    cacheBusting: true,
    
    // Preload images
    preloadImages: [
      'placeholder.jpg',
      'default-avatar.png',
      'default-store.jpg',
    ],
  },
  
  // Webhook configuration
  webhooks: {
    // Notification URL for upload completion
    notificationUrl: process.env.REACT_APP_CLOUDINARY_WEBHOOK_URL,
    
    // Events to listen for
    events: [
      'upload',
      'delete',
      'transformation',
      'moderation',
    ],
    
    // Webhook authentication
    auth: {
      enabled: isProduction,
      secret: process.env.REACT_APP_CLOUDINARY_WEBHOOK_SECRET,
    },
  },
};

// Helper functions for building Cloudinary URLs
export const cloudinaryHelpers = {
  // Build image URL with transformations
  buildImageUrl: (publicId, transformations = {}) => {
    if (!publicId || !cloudinaryConfig.cloudName) return '';
    
    const baseUrl = `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload`;
    const transformString = buildTransformationString(transformations);
    
    return transformString
      ? `${baseUrl}/${transformString}/${publicId}`
      : `${baseUrl}/${publicId}`;
  },
  
  // Build video URL
  buildVideoUrl: (publicId, transformations = {}) => {
    if (!publicId || !cloudinaryConfig.cloudName) return '';
    
    const baseUrl = `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/video/upload`;
    const transformString = buildTransformationString(transformations);
    
    return transformString
      ? `${baseUrl}/${transformString}/${publicId}`
      : `${baseUrl}/${publicId}`;
  },
  
  // Build upload URL
  buildUploadUrl: () => {
    return `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/upload`;
  },
  
  // Get transformation preset
  getTransformation: (type, size) => {
    return cloudinaryConfig.transformations[type]?.[size] || {};
  },
  
  // Generate responsive image srcset
  buildSrcSet: (publicId, sizes = ['mobile', 'tablet', 'desktop']) => {
    if (!publicId) return '';
    
    return sizes
      .map(size => {
        const transformation = cloudinaryConfig.transformations.responsive[size];
        const url = cloudinaryHelpers.buildImageUrl(publicId, transformation);
        return `${url} ${transformation.width}w`;
      })
      .join(', ');
  },
  
  // Generate placeholder image
  buildPlaceholder: (width, height, color = 'e5e7eb') => {
    const transformations = {
      width,
      height,
      crop: 'fill',
      background: `rgb:${color}`,
      quality: 'auto:low',
      fetch_format: 'auto',
    };
    
    return cloudinaryHelpers.buildImageUrl('placeholder', transformations);
  },
  
  // Extract public ID from Cloudinary URL
  extractPublicId: (url) => {
    if (!url) return null;
    
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
    return match ? match[1] : null;
  },
  
  // Validate file before upload
  validateFile: (file, type = 'image') => {
    const config = cloudinaryConfig.upload;
    const errors = [];
    
    // Check file size
    if (file.size > config.maxFileSize[type]) {
      errors.push(`File size exceeds ${config.maxFileSize[type] / 1024 / 1024}MB limit`);
    }
    
    // Check file format
    const extension = file.name.split('.').pop().toLowerCase();
    if (!config.allowedFormats[type].includes(extension)) {
      errors.push(`File format ${extension} is not allowed`);
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

// Build transformation string from object
const buildTransformationString = (transformations) => {
  if (!transformations || typeof transformations !== 'object') return '';
  
  const params = [];
  
  Object.entries(transformations).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.push(`${key}_${value}`);
    }
  });
  
  return params.join(',');
};

// Cloudinary Upload Widget Configuration
export const uploadWidgetConfig = {
  cloudName: cloudinaryConfig.cloudName,
  uploadPreset: cloudinaryConfig.upload.uploadPreset,
  
  // Widget appearance
  theme: 'minimal',
  cropping: true,
  croppingAspectRatio: 16/9,
  croppingDefaultSelectionRatio: 0.8,
  
  // Sources
  sources: [
    'local',
    'url',
    'camera',
    'dropbox',
    'google_drive',
    'instagram',
    'facebook',
  ],
  
  // Upload options
  multiple: false,
  maxFiles: 5,
  maxFileSize: 10000000, // 10MB
  maxImageFileSize: 10000000,
  maxVideoFileSize: 100000000,
  maxImageWidth: 2000,
  maxImageHeight: 2000,
  
  // UI customization
  text: {
    en: {
      'menu.files': 'Upload Images',
      'local.browse': 'Select Files',
      'local.dd_title_single': 'Drag & Drop Image Here',
      'local.dd_title_multi': 'Drag & Drop Images Here',
      'queue.title': 'Upload Queue',
      'queue.title_uploading_with_counter': 'Uploading {{num}} Files',
      'queue.mini_title': 'Uploaded',
      'queue.mini_title_uploading': 'Uploading',
    },
  },
  
  // Styling
  styles: {
    palette: {
      window: '#FFFFFF',
      windowBorder: '#90A0B3',
      tabIcon: '#0078FF',
      menuIcons: '#5A616A',
      textDark: '#000000',
      textLight: '#FFFFFF',
      link: '#0078FF',
      action: '#FF620C',
      inactiveTabIcon: '#0E2F5A',
      error: '#F44235',
      inProgress: '#0078FF',
      complete: '#20B832',
      sourceBg: '#E4EBF1',
    },
    fonts: {
      default: null,
      "'Fira Sans', sans-serif": {
        url: 'https://fonts.googleapis.com/css?family=Fira+Sans',
        active: true,
      },
    },
  },
  
  // Callbacks
  preBatch: (cb, data) => {
    console.log('Upload starting:', data);
    cb(data);
  },
  
  batchCancelled: (data) => {
    console.log('Upload cancelled:', data);
  },
  
  success: (result, options) => {
    console.log('Upload successful:', result);
    return result;
  },
  
  error: (error, options) => {
    console.error('Upload error:', error);
    return error;
  },
};

// React component helper for Cloudinary images
export const CloudinaryImage = ({
  publicId,
  transformation = {},
  alt = '',
  className = '',
  responsive = false,
  placeholder = true,
  lazy = true,
  ...props
}) => {
  if (!publicId) {
    return placeholder ? (
      <img
        src={cloudinaryHelpers.buildPlaceholder(400, 300)}
        alt={alt}
        className={className}
        {...props}
      />
    ) : null;
  }
  
  const src = cloudinaryHelpers.buildImageUrl(publicId, transformation);
  
  const imageProps = {
    src,
    alt,
    className,
    loading: lazy ? 'lazy' : 'eager',
    ...props,
  };
  
  if (responsive) {
    imageProps.srcSet = cloudinaryHelpers.buildSrcSet(publicId);
    imageProps.sizes = '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw';
  }
  
  return <img {...imageProps} />;
};

// Default export
export default {
  config: cloudinaryConfig,
  helpers: cloudinaryHelpers,
  uploadWidget: uploadWidgetConfig,
  CloudinaryImage,
};

// Environment validation
if (isDevelopment) {
  console.log('☁️ Cloudinary Configuration:', {
    cloudName: cloudinaryConfig.cloudName,
    uploadPreset: cloudinaryConfig.upload.uploadPreset,
    signed: cloudinaryConfig.upload.signed,
  });
}

// Validate required configuration
if (!cloudinaryConfig.cloudName) {
  console.warn('⚠️ Cloudinary cloud name is not configured');
}

if (!cloudinaryConfig.upload.uploadPreset) {
  console.warn('⚠️ Cloudinary upload preset is not configured');
}
