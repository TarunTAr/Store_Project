import { api, handleApiError, handleApiSuccess } from './api';
import authService from './auth.service';

class CloudinaryService {
  constructor() {
    this.cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    this.uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
    this.apiKey = process.env.REACT_APP_CLOUDINARY_API_KEY;
    
    // Image transformation presets
    this.presets = {
      avatar: 'w_200,h_200,c_fill,g_face,r_max',
      thumbnail: 'w_150,h_150,c_fill',
      medium: 'w_400,h_300,c_fill',
      large: 'w_800,h_600,c_fill',
      banner: 'w_1200,h_400,c_fill',
      storeLogo: 'w_300,h_300,c_fit,bg_white',
      storeGallery: 'w_600,h_400,c_fill,q_auto',
      categoryIcon: 'w_100,h_100,c_fit,bg_white'
    };

    // Quality settings
    this.quality = {
      auto: 'q_auto',
      low: 'q_30',
      medium: 'q_60',
      high: 'q_80',
      best: 'q_100'
    };
  }

  // Upload single image to Cloudinary
  async uploadImage(file, options = {}) {
    try {
      const {
        folder = 'store-rating-app',
        preset = 'medium',
        quality = 'auto',
        publicId = null,
        tags = [],
        context = {},
        eager = []
      } = options;

      if (!file) {
        throw new Error('File is required for upload');
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Only image files are allowed');
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('File size must not exceed 10MB');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', this.uploadPreset);
      formData.append('cloud_name', this.cloudName);
      
      if (folder) {
        formData.append('folder', folder);
      }
      
      if (publicId) {
        formData.append('public_id', publicId);
      }
      
      if (tags.length > 0) {
        formData.append('tags', tags.join(','));
      }

      if (Object.keys(context).length > 0) {
        formData.append('context', Object.entries(context).map(([k, v]) => `${k}=${v}`).join('|'));
      }

      // Add eager transformations
      if (eager.length > 0) {
        eager.forEach((transform, index) => {
          formData.append(`eager[${index}]`, transform);
        });
      }

      const response = await fetch(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();

      return {
        success: true,
        data: {
          publicId: result.public_id,
          url: result.secure_url,
          width: result.width,
          height: result.height,
          format: result.format,
          size: result.bytes,
          thumbnailUrl: this.getTransformedUrl(result.public_id, 'thumbnail'),
          mediumUrl: this.getTransformedUrl(result.public_id, 'medium'),
          largeUrl: this.getTransformedUrl(result.public_id, 'large'),
          eager: result.eager || []
        }
      };
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Failed to upload image',
        error
      };
    }
  }

  // Upload multiple images
  async uploadMultipleImages(files, options = {}) {
    try {
      if (!files || files.length === 0) {
        throw new Error('Files are required for upload');
      }

      const uploadPromises = Array.from(files).map((file, index) => 
        this.uploadImage(file, {
          ...options,
          publicId: options.publicId ? `${options.publicId}_${index}` : null
        })
      );

      const results = await Promise.allSettled(uploadPromises);
      
      const successful = results.filter(result => result.status === 'fulfilled').map(result => result.value);
      const failed = results.filter(result => result.status === 'rejected').map(result => result.reason);

      return {
        success: true,
        data: {
          successful,
          failed,
          totalUploaded: successful.length,
          totalFailed: failed.length
        }
      };
    } catch (error) {
      throw {
        success: false,
        message: error.message || 'Failed to upload images',
        error
      };
    }
  }

  // Delete image from Cloudinary
  async deleteImage(publicId) {
    try {
      if (!publicId) {
        throw new Error('Public ID is required for deletion');
      }

      const user = authService.getCurrentUser();
      if (!user) {
        throw new Error('Authentication required');
      }

      // Use backend API to delete (for security)
      const response = await api.delete('/images/cloudinary', {
        data: { publicId }
      });

      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Delete multiple images
  async deleteMultipleImages(publicIds) {
    try {
      if (!Array.isArray(publicIds) || publicIds.length === 0) {
        throw new Error('Public IDs array is required for deletion');
      }

      const user = authService.getCurrentUser();
      if (!user) {
        throw new Error('Authentication required');
      }

      const response = await api.delete('/images/cloudinary/bulk', {
        data: { publicIds }
      });

      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get transformed image URL
  getTransformedUrl(publicId, preset = 'medium', customTransform = null) {
    if (!publicId) return null;

    let transformation = customTransform || this.presets[preset] || this.presets.medium;
    transformation += `,${this.quality.auto}`;

    return `https://res.cloudinary.com/${this.cloudName}/image/upload/${transformation}/${publicId}`;
  }

  // Get multiple transformed URLs
  getTransformedUrls(publicId, presets = ['thumbnail', 'medium', 'large']) {
    if (!publicId) return {};

    const urls = {};
    presets.forEach(preset => {
      urls[preset] = this.getTransformedUrl(publicId, preset);
    });

    return urls;
  }

  // Upload store logo
  async uploadStoreLogo(file, storeId) {
    try {
      const user = authService.getCurrentUser();
      if (!user || (!authService.isAdmin() && !authService.isStoreOwner())) {
        throw new Error('Store owner or admin access required');
      }

      const options = {
        folder: 'store-rating-app/stores/logos',
        preset: 'storeLogo',
        publicId: `store_logo_${storeId}`,
        tags: ['store', 'logo', storeId],
        context: {
          store_id: storeId,
          type: 'logo',
          uploaded_by: user.id
        },
        eager: [
          this.presets.thumbnail,
          this.presets.medium
        ]
      };

      const result = await this.uploadImage(file, options);

      // Update store logo in database
      if (result.success) {
        await api.put(`/stores/${storeId}/logo`, {
          logoUrl: result.data.url,
          logoPublicId: result.data.publicId
        });
      }

      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Upload store gallery images
  async uploadStoreGallery(files, storeId) {
    try {
      const user = authService.getCurrentUser();
      if (!user || (!authService.isAdmin() && !authService.isStoreOwner())) {
        throw new Error('Store owner or admin access required');
      }

      const options = {
        folder: 'store-rating-app/stores/gallery',
        preset: 'storeGallery',
        tags: ['store', 'gallery', storeId],
        context: {
          store_id: storeId,
          type: 'gallery',
          uploaded_by: user.id
        },
        eager: [
          this.presets.thumbnail,
          this.presets.medium
        ]
      };

      const result = await this.uploadMultipleImages(files, options);

      // Update store gallery in database
      if (result.success && result.data.successful.length > 0) {
        const galleryImages = result.data.successful.map(img => ({
          url: img.data.url,
          publicId: img.data.publicId,
          thumbnailUrl: img.data.thumbnailUrl
        }));

        await api.post(`/stores/${storeId}/gallery`, {
          images: galleryImages
        });
      }

      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Upload user avatar
  async uploadUserAvatar(file, userId = null) {
    try {
      const user = authService.getCurrentUser();
      if (!user) {
        throw new Error('Authentication required');
      }

      const targetUserId = userId || user.id;

      // Users can only upload their own avatar, admins can upload any
      if (user.id !== targetUserId && !authService.isAdmin()) {
        throw new Error('Access denied');
      }

      const options = {
        folder: 'store-rating-app/users/avatars',
        preset: 'avatar',
        publicId: `user_avatar_${targetUserId}`,
        tags: ['user', 'avatar', targetUserId],
        context: {
          user_id: targetUserId,
          type: 'avatar',
          uploaded_by: user.id
        }
      };

      const result = await this.uploadImage(file, options);

      // Update user avatar in database
      if (result.success) {
        await api.put(`/users/${targetUserId}/avatar`, {
          avatarUrl: result.data.url,
          avatarPublicId: result.data.publicId
        });
      }

      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Upload category icon
  async uploadCategoryIcon(file, categoryId) {
    try {
      const user = authService.getCurrentUser();
      if (!user || !authService.isAdmin()) {
        throw new Error('Admin access required');
      }

      const options = {
        folder: 'store-rating-app/categories/icons',
        preset: 'categoryIcon',
        publicId: `category_icon_${categoryId}`,
        tags: ['category', 'icon', categoryId],
        context: {
          category_id: categoryId,
          type: 'icon',
          uploaded_by: user.id
        }
      };

      const result = await this.uploadImage(file, options);

      // Update category icon in database
      if (result.success) {
        await api.put(`/categories/${categoryId}/icon`, {
          iconUrl: result.data.url,
          iconPublicId: result.data.publicId
        });
      }

      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Generate upload signature (for client-side uploads)
  async generateUploadSignature(params = {}) {
    try {
      const user = authService.getCurrentUser();
      if (!user) {
        throw new Error('Authentication required');
      }

      const response = await api.post('/images/cloudinary/signature', params);
      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get image info from Cloudinary
  async getImageInfo(publicId) {
    try {
      if (!publicId) {
        throw new Error('Public ID is required');
      }

      const response = await fetch(
        `https://res.cloudinary.com/${this.cloudName}/image/upload/${publicId}.json`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch image info');
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      throw { success: false, message: error.message, error };
    }
  }

  // Get folder contents
  async getFolderContents(folder, options = {}) {
    try {
      const user = authService.getCurrentUser();
      if (!user || !authService.isAdmin()) {
        throw new Error('Admin access required');
      }

      const { maxResults = 50, nextCursor = null } = options;

      const response = await api.get('/images/cloudinary/folder', {
        params: { folder, maxResults, nextCursor }
      });

      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Search images
  async searchImages(query, options = {}) {
    try {
      const user = authService.getCurrentUser();
      if (!user || !authService.isAdmin()) {
        throw new Error('Admin access required');
      }

      const { maxResults = 50, nextCursor = null, sortBy = 'created_at' } = options;

      const response = await api.get('/images/cloudinary/search', {
        params: { query, maxResults, nextCursor, sortBy }
      });

      return handleApiSuccess(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Auto-optimize image URL
  optimizeImageUrl(url, options = {}) {
    if (!url || !url.includes('cloudinary.com')) {
      return url;
    }

    const { format = 'auto', quality = 'auto', width, height, crop = 'fill' } = options;

    // Extract public ID from URL
    const match = url.match(/\/image\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
    if (!match) return url;

    const publicId = match[1];
    
    let transformation = `f_${format},q_${quality}`;
    if (width || height) {
      transformation += `,w_${width || 'auto'},h_${height || 'auto'},c_${crop}`;
    }

    return `https://res.cloudinary.com/${this.cloudName}/image/upload/${transformation}/${publicId}`;
  }

  // Create responsive image srcset
  createResponsiveSrcSet(publicId, breakpoints = [480, 768, 1024, 1440]) {
    if (!publicId) return '';

    return breakpoints
      .map(width => `${this.getTransformedUrl(publicId, null, `w_${width},c_scale,q_auto`)} ${width}w`)
      .join(', ');
  }

  // Validate Cloudinary configuration
  validateConfiguration() {
    const missingConfig = [];

    if (!this.cloudName) missingConfig.push('REACT_APP_CLOUDINARY_CLOUD_NAME');
    if (!this.uploadPreset) missingConfig.push('REACT_APP_CLOUDINARY_UPLOAD_PRESET');
    if (!this.apiKey) missingConfig.push('REACT_APP_CLOUDINARY_API_KEY');

    if (missingConfig.length > 0) {
      throw new Error(`Missing Cloudinary configuration: ${missingConfig.join(', ')}`);
    }

    return true;
  }
}

// Create singleton instance
const cloudinaryService = new CloudinaryService();

export default cloudinaryService;
