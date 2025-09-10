import { useState, useCallback, useRef } from 'react';
import { useNotification } from './useNotifications';

const useImageUpload = (options = {}) => {
  const {
    maxFiles = 10,
    maxFileSize = 5 * 1024 * 1024, // 5MB
    acceptedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    autoUpload = true,
    uploadUrl = '/api/upload',
    onUploadStart,
    onUploadProgress,
    onUploadComplete,
    onUploadError,
    resizeImages = true,
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
    generateThumbnails = true,
    thumbnailSize = 150
  } = options;

  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState([]);

  const fileInputRef = useRef(null);
  const abortControllerRef = useRef(null);
  const notification = useNotification();

  // Generate unique file ID
  const generateFileId = useCallback(() => {
    return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Validate file
  const validateFile = useCallback((file) => {
    const errors = [];

    if (!acceptedFormats.includes(file.type)) {
      errors.push(`Unsupported file format: ${file.type}`);
    }

    if (file.size > maxFileSize) {
      const sizeMB = Math.round(file.size / 1024 / 1024 * 100) / 100;
      const maxSizeMB = Math.round(maxFileSize / 1024 / 1024 * 100) / 100;
      errors.push(`File too large: ${sizeMB}MB (max: ${maxSizeMB}MB)`);
    }

    return errors;
  }, [acceptedFormats, maxFileSize]);

  // Resize image using canvas
  const resizeImage = useCallback((file, maxW, maxH, qual) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > maxW || height > maxH) {
          const ratio = Math.min(maxW / width, maxH / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(resizedFile);
          },
          file.type,
          qual
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }, []);

  // Generate thumbnail
  const generateThumbnail = useCallback((file) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        const size = Math.min(img.width, img.height);
        const startX = (img.width - size) / 2;
        const startY = (img.height - size) / 2;

        canvas.width = thumbnailSize;
        canvas.height = thumbnailSize;

        ctx.drawImage(
          img,
          startX, startY, size, size,
          0, 0, thumbnailSize, thumbnailSize
        );

        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };

      img.src = URL.createObjectURL(file);
    });
  }, [thumbnailSize]);

  // Process single file
  const processFile = useCallback(async (file) => {
    const fileId = generateFileId();
    const validationErrors = validateFile(file);

    if (validationErrors.length > 0) {
      return {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        errors: validationErrors,
        status: 'error'
      };
    }

    try {
      // Resize image if enabled
      let processedFile = file;
      if (resizeImages && file.type.startsWith('image/')) {
        processedFile = await resizeImage(file, maxWidth, maxHeight, quality);
      }

      // Generate thumbnail if enabled
      let thumbnail = null;
      if (generateThumbnails && file.type.startsWith('image/')) {
        thumbnail = await generateThumbnail(file);
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(processedFile);

      return {
        id: fileId,
        name: file.name,
        size: processedFile.size,
        type: file.type,
        file: processedFile,
        originalFile: file,
        previewUrl,
        thumbnail,
        progress: 0,
        status: 'ready',
        errors: []
      };
    } catch (error) {
      return {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        errors: [error.message],
        status: 'error'
      };
    }
  }, [generateFileId, validateFile, resizeImages, resizeImage, maxWidth, maxHeight, quality, generateThumbnails, generateThumbnail]);

  // Add files to queue
  const addFiles = useCallback(async (newFiles) => {
    const fileArray = Array.from(newFiles);
    
    if (files.length + fileArray.length > maxFiles) {
      notification.showWarning(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setUploading(true);
    
    try {
      const processedFiles = await Promise.all(
        fileArray.map(file => processFile(file))
      );

      setFiles(prev => [...prev, ...processedFiles]);
      
      // Auto-upload if enabled
      if (autoUpload) {
        uploadFiles(processedFiles.filter(f => f.status === 'ready'));
      }
    } catch (error) {
      notification.showError('Failed to process files');
    } finally {
      setUploading(false);
    }
  }, [files.length, maxFiles, processFile, autoUpload, notification]);

  // Upload single file
  const uploadFile = useCallback(async (fileData) => {
    if (!fileData.file) return null;

    const formData = new FormData();
    formData.append('file', fileData.file);
    formData.append('originalName', fileData.name);
    formData.append('fileId', fileData.id);

    try {
      abortControllerRef.current = new AbortController();
      
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
        signal: abortControllerRef.current.signal,
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          
          setFiles(prev => prev.map(f => 
            f.id === fileData.id ? { ...f, progress } : f
          ));
          
          onUploadProgress?.(fileData.id, progress);
        }
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      setFiles(prev => prev.map(f => 
        f.id === fileData.id 
          ? { ...f, status: 'uploaded', uploadedUrl: result.url, progress: 100 }
          : f
      ));

      onUploadComplete?.(fileData.id, result);
      return result;
      
    } catch (error) {
      if (error.name !== 'AbortError') {
        setFiles(prev => prev.map(f => 
          f.id === fileData.id 
            ? { ...f, status: 'error', errors: [error.message] }
            : f
        ));
        
        onUploadError?.(fileData.id, error);
      }
      throw error;
    }
  }, [uploadUrl, onUploadProgress, onUploadComplete, onUploadError]);

  // Upload multiple files
  const uploadFiles = useCallback(async (filesToUpload = null) => {
    const targetFiles = filesToUpload || files.filter(f => f.status === 'ready');
    
    if (targetFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);
    setErrors([]);
    
    onUploadStart?.(targetFiles);

    try {
      const results = [];
      
      for (let i = 0; i < targetFiles.length; i++) {
        const file = targetFiles[i];
        
        try {
          const result = await uploadFile(file);
          results.push(result);
          
          const progress = Math.round(((i + 1) / targetFiles.length) * 100);
          setUploadProgress(progress);
          
        } catch (error) {
          setErrors(prev => [...prev, { fileId: file.id, error: error.message }]);
        }
      }
      
      notification.showSuccess(`Successfully uploaded ${results.length} file(s)`);
      return results;
      
    } catch (error) {
      notification.showError('Upload failed');
      throw error;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [files, uploadFile, onUploadStart, notification]);

  // Remove file from queue
  const removeFile = useCallback((fileId) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === fileId);
      if (file?.previewUrl) {
        URL.revokeObjectURL(file.previewUrl);
      }
      return prev.filter(f => f.id !== fileId);
    });
  }, []);

  // Clear all files
  const clearFiles = useCallback(() => {
    files.forEach(file => {
      if (file.previewUrl) {
        URL.revokeObjectURL(file.previewUrl);
      }
    });
    setFiles([]);
    setErrors([]);
    setUploadProgress(0);
  }, [files]);

  // Cancel upload
  const cancelUpload = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setUploading(false);
    setUploadProgress(0);
  }, []);

  // Open file dialog
  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Handle file input change
  const handleFileInput = useCallback((event) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      addFiles(selectedFiles);
    }
    // Reset input value to allow selecting the same files again
    event.target.value = '';
  }, [addFiles]);

  // Handle drag and drop
  const handleDrop = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const droppedFiles = Array.from(event.dataTransfer.files);
    if (droppedFiles.length > 0) {
      addFiles(droppedFiles);
    }
  }, [addFiles]);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.previewUrl) {
          URL.revokeObjectURL(file.previewUrl);
        }
      });
    };
  }, [files]);

  // Calculate statistics
  const stats = React.useMemo(() => {
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const uploadedCount = files.filter(f => f.status === 'uploaded').length;
    const errorCount = files.filter(f => f.status === 'error').length;
    
    return {
      totalFiles: files.length,
      totalSize,
      uploadedCount,
      errorCount,
      readyCount: files.filter(f => f.status === 'ready').length,
      formattedTotalSize: formatFileSize(totalSize)
    };
  }, [files]);

  // Format file size utility
  const formatFileSize = useCallback((bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  return {
    // State
    files,
    uploading,
    uploadProgress,
    errors,
    
    // Actions
    addFiles,
    uploadFiles,
    removeFile,
    clearFiles,
    cancelUpload,
    openFileDialog,
    
    // Event handlers
    handleFileInput,
    handleDrop,
    handleDragOver,
    
    // Utilities
    formatFileSize,
    stats,
    
    // Computed values
    hasFiles: files.length > 0,
    hasErrors: errors.length > 0,
    canUpload: files.some(f => f.status === 'ready') && !uploading,
    
    // Refs
    fileInputRef,
    
    // File input props
    fileInputProps: {
      ref: fileInputRef,
      type: 'file',
      multiple: maxFiles > 1,
      accept: acceptedFormats.join(','),
      onChange: handleFileInput,
      style: { display: 'none' }
    },
    
    // Drop zone props
    dropZoneProps: {
      onDrop: handleDrop,
      onDragOver: handleDragOver,
      onDragEnter: handleDragOver
    }
  };
};

export default useImageUpload;
