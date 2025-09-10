import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Button,
  Typography,
  Card,
  IconButton,
  LinearProgress,
  Chip,
  Alert,
  Avatar,
  Fade,
  Tooltip
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  PhotoCamera as CameraIcon,
  Crop as CropIcon,
  ZoomIn as ZoomIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';

const ImageUpload = ({
  onUpload,
  onRemove,
  maxSize = 5 * 1024 * 1024, // 5MB
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp'],
  multiple = false,
  maxFiles = 1,
  initialImages = [],
  uploadText = 'Upload Images',
  dropzoneText = 'Drag & drop images here, or click to browse',
  preview = true,
  circular = false,
  width = '100%',
  height = 200
}) => {
  const [images, setImages] = useState(initialImages);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    const errors = [];

    if (file.size > maxSize) {
      errors.push(`File size must be less than ${formatFileSize(maxSize)}`);
    }

    if (!acceptedFormats.includes(file.type)) {
      errors.push(`File type ${file.type} not supported`);
    }

    return errors;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const uploadToCloudinary = async (file) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'store_rating_preset'); // Replace with your preset
      formData.append('cloud_name', 'your_cloud_name'); // Replace with your cloud name

      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: progress
          }));
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve(response.secure_url);
        } else {
          reject(new Error('Upload failed'));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('POST', 'https://api.cloudinary.com/v1_1/your_cloud_name/image/upload');
      xhr.send(formData);
    });
  };

  const handleFileUpload = async (files) => {
    setUploading(true);
    setErrors([]);
    
    const newImages = [];
    const uploadErrors = [];

    for (const file of files) {
      const validationErrors = validateFile(file);
      
      if (validationErrors.length > 0) {
        uploadErrors.push(...validationErrors);
        continue;
      }

      try {
        const url = await uploadToCloudinary(file);
        const imageData = {
          id: Date.now() + Math.random(),
          url,
          name: file.name,
          size: file.size,
          type: file.type
        };
        
        newImages.push(imageData);
        
        if (onUpload) {
          onUpload(imageData);
        }
      } catch (error) {
        uploadErrors.push(`Failed to upload ${file.name}`);
      }
    }

    if (uploadErrors.length > 0) {
      setErrors(uploadErrors);
    }

    setImages(prev => [...prev, ...newImages]);
    setUploading(false);
    setUploadProgress({});
  };

  const onDrop = useCallback((acceptedFiles) => {
    const filesToUpload = multiple 
      ? acceptedFiles.slice(0, maxFiles - images.length)
      : acceptedFiles.slice(0, 1);
    
    handleFileUpload(filesToUpload);
  }, [images.length, multiple, maxFiles]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': acceptedFormats.map(format => format.replace('image/', '.'))
    },
    multiple,
    maxFiles: maxFiles - images.length,
    disabled: uploading || (!multiple && images.length >= 1)
  });

  const removeImage = (imageId) => {
    const imageToRemove = images.find(img => img.id === imageId);
    setImages(prev => prev.filter(img => img.id !== imageId));
    
    if (onRemove && imageToRemove) {
      onRemove(imageToRemove);
    }
  };

  const dropzoneVariants = {
    idle: { scale: 1, borderColor: '#e0e0e0' },
    active: { 
      scale: 1.02, 
      borderColor: '#667eea',
      backgroundColor: 'rgba(102, 126, 234, 0.04)'
    },
    reject: { 
      scale: 0.98, 
      borderColor: '#ef4444',
      backgroundColor: 'rgba(239, 68, 68, 0.04)'
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -10 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      rotate: 0,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      rotate: 10,
      transition: { duration: 0.2 }
    }
  };

  return (
    <Box sx={{ width }}>
      {/* Upload Dropzone */}
      {(multiple || images.length === 0) && (
        <motion.div
          variants={dropzoneVariants}
          animate={isDragActive ? 'active' : isDragReject ? 'reject' : 'idle'}
          whileHover="active"
        >
          <Card
            {...getRootProps()}
            sx={{
              p: 4,
              textAlign: 'center',
              cursor: uploading ? 'not-allowed' : 'pointer',
              border: '2px dashed',
              borderColor: 'divider',
              borderRadius: 3,
              backgroundColor: 'background.paper',
              height: preview && images.length > 0 ? 'auto' : height,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'action.hover'
              }
            }}
          >
            <input {...getInputProps()} ref={fileInputRef} />
            
            <motion.div
              animate={isDragActive ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <UploadIcon 
                sx={{ 
                  fontSize: 64, 
                  color: isDragActive ? 'primary.main' : 'text.secondary',
                  mb: 2 
                }} 
              />
            </motion.div>

            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              {uploadText}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {isDragActive ? 'Drop files here...' : dropzoneText}
            </Typography>

            <Chip
              label={`Max ${formatFileSize(maxSize)} per file`}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.7rem' }}
            />

            {uploading && (
              <Box sx={{ width: '100%', mt: 2 }}>
                <LinearProgress 
                  sx={{
                    borderRadius: 1,
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    }
                  }}
                />
                <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                  Uploading...
                </Typography>
              </Box>
            )}
          </Card>
        </motion.div>
      )}

      {/* Error Messages */}
      <AnimatePresence>
        {errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert 
              severity="error" 
              sx={{ mt: 2, borderRadius: 2 }}
              onClose={() => setErrors([])}
            >
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Preview Grid */}
      {preview && images.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            Uploaded Images ({images.length})
          </Typography>
          
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: circular 
                ? 'repeat(auto-fill, minmax(120px, 1fr))'
                : 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 2
            }}
          >
            <AnimatePresence>
              {images.map((image, index) => (
                <motion.div
                  key={image.id}
                  variants={imageVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                >
                  <Card
                    sx={{
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: circular ? '50%' : 2,
                      aspectRatio: circular ? '1/1' : '16/10',
                      '&:hover .image-actions': {
                        opacity: 1
                      }
                    }}
                  >
                    <Box
                      component="img"
                      src={image.url}
                      alt={image.name}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />

                    {/* Image Actions Overlay */}
                    <Fade in>
                      <Box
                        className="image-actions"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          p: 1,
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                          background: 'linear-gradient(135deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 100%)'
                        }}
                      >
                        <Tooltip title="Remove">
                          <IconButton
                            size="small"
                            onClick={() => removeImage(image.id)}
                            sx={{
                              color: 'white',
                              backgroundColor: 'rgba(239, 68, 68, 0.8)',
                              '&:hover': {
                                backgroundColor: 'rgba(239, 68, 68, 1)'
                              }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Fade>

                    {/* Upload Progress */}
                    {uploadProgress[image.name] && uploadProgress[image.name] < 100 && (
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          backgroundColor: 'rgba(0,0,0,0.7)',
                          color: 'white',
                          p: 1
                        }}
                      >
                        <Typography variant="caption">
                          {uploadProgress[image.name]}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={uploadProgress[image.name]}
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    )}
                  </Card>
                  
                  {/* Image Info */}
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      mt: 1,
                      textAlign: 'center',
                      color: 'text.secondary',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {image.name} ({formatFileSize(image.size)})
                  </Typography>
                </motion.div>
              ))}
            </AnimatePresence>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ImageUpload;
