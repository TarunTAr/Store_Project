import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Avatar,
  Chip,
  FormControlLabel,
  Checkbox,
  Alert,
  Collapse,
  Divider,
  Paper,
  IconButton,
  Tooltip,
  LinearProgress
} from '@mui/material';
import {
  Star as StarIcon,
  Photo as PhotoIcon,
  Send as SendIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as SuccessIcon,
  Mood as MoodIcon,
  MoodBad as MoodBadIcon,
  Close as CloseIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { submitRating, updateRating, deleteRating } from '../../store/ratingSlice';
import StarRating from './StarRating';
import ImageUpload from '../common/ImageUpload';

const schema = yup.object({
  rating: yup
    .number()
    .min(1, 'Please select a rating')
    .max(5, 'Rating cannot exceed 5 stars')
    .required('Rating is required'),
  comment: yup
    .string()
    .max(1000, 'Comment cannot exceed 1000 characters')
    .optional(),
  recommend: yup
    .boolean()
    .optional()
});

const RatingForm = ({
  storeId,
  existingRating = null,
  onSuccess,
  onCancel,
  showPhotos = true,
  showRecommendation = true,
  showTags = true,
  embedded = false,
  autoFocus = false
}) => {
  const [step, setStep] = useState(1);
  const [selectedImages, setSelectedImages] = useState(existingRating?.images || []);
  const [selectedTags, setSelectedTags] = useState(existingRating?.tags || []);
  const [showSuccess, setShowSuccess] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.ratings);
  const { user } = useSelector((state) => state.auth);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    setValue,
    reset
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      rating: existingRating?.rating || 0,
      comment: existingRating?.comment || '',
      recommend: existingRating?.recommend ?? true
    }
  });

  const watchedRating = watch('rating');
  const watchedComment = watch('comment');
  const watchedRecommend = watch('recommend');

  useEffect(() => {
    if (existingRating) {
      reset({
        rating: existingRating.rating,
        comment: existingRating.comment || '',
        recommend: existingRating.recommend ?? true
      });
      setSelectedImages(existingRating.images || []);
      setSelectedTags(existingRating.tags || []);
    }
  }, [existingRating, reset]);

  const availableTags = [
    'Great Service', 'Good Value', 'Clean', 'Fast Service', 'Friendly Staff',
    'High Quality', 'Convenient Location', 'Good Atmosphere', 'Recommended',
    'Will Return', 'Fresh Products', 'Professional', 'Excellent Experience'
  ];

  const onSubmit = async (data) => {
    try {
      const ratingData = {
        storeId,
        rating: data.rating,
        comment: data.comment,
        recommend: data.recommend,
        images: selectedImages,
        tags: selectedTags
      };

      let result;
      if (existingRating) {
        result = await dispatch(updateRating({
          id: existingRating.id,
          ...ratingData
        })).unwrap();
      } else {
        result = await dispatch(submitRating(ratingData)).unwrap();
      }

      setShowSuccess(true);
      
      setTimeout(() => {
        if (onSuccess) {
          onSuccess(result);
        }
      }, 1500);

    } catch (error) {
      console.error('Failed to submit rating:', error);
    }
  };

  const handleDeleteRating = async () => {
    if (window.confirm('Are you sure you want to delete your rating?')) {
      try {
        await dispatch(deleteRating(existingRating.id)).unwrap();
        if (onSuccess) {
          onSuccess(null);
        }
      } catch (error) {
        console.error('Failed to delete rating:', error);
      }
    }
  };

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const getRatingEmoji = (rating) => {
    if (rating >= 5) return '🤩';
    if (rating >= 4) return '😊';
    if (rating >= 3) return '😐';
    if (rating >= 2) return '😕';
    if (rating >= 1) return '😞';
    return '❓';
  };

  const getRatingText = (rating) => {
    if (rating >= 5) return 'Excellent!';
    if (rating >= 4) return 'Very Good';
    if (rating >= 3) return 'Good';
    if (rating >= 2) return 'Fair';
    if (rating >= 1) return 'Poor';
    return 'Select Rating';
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const successVariants = {
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
    }
  };

  if (showSuccess) {
    return (
      <motion.div
        variants={successVariants}
        initial="hidden"
        animate="visible"
      >
        <Card
          sx={{
            maxWidth: 400,
            mx: 'auto',
            borderRadius: 4,
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(102, 187, 106, 0.1) 100%)'
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 0.8 }}
            >
              <SuccessIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            </motion.div>
            
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: 'success.main' }}>
              {existingRating ? 'Rating Updated!' : 'Thank You!'}
            </Typography>
            
            <Typography variant="body1" color="text.secondary">
              Your {watchedRating}-star rating has been {existingRating ? 'updated' : 'submitted'} successfully.
            </Typography>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card
        sx={{
          maxWidth: embedded ? '100%' : 600,
          mx: embedded ? 0 : 'auto',
          borderRadius: 4,
          boxShadow: embedded ? 'none' : '0 20px 40px rgba(0,0,0,0.1)',
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            p: 3,
            position: 'relative'
          }}
        >
          <motion.div variants={itemVariants}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {existingRating ? 'Edit Your Rating' : 'Rate This Store'}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Share your experience with other customers
                </Typography>
              </Box>

              {onCancel && (
                <IconButton
                  onClick={onCancel}
                  sx={{ color: 'rgba(255,255,255,0.8)' }}
                >
                  <CloseIcon />
                </IconButton>
              )}
            </Box>
          </motion.div>

          {/* Progress Bar */}
          <Box sx={{ mt: 2 }}>
            <LinearProgress
              variant="determinate"
              value={(step / 3) * 100}
              sx={{
                height: 4,
                borderRadius: 2,
                backgroundColor: 'rgba(255,255,255,0.2)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: 'rgba(255,255,255,0.8)',
                  borderRadius: 2
                }
              }}
            />
          </Box>
        </Box>

        <CardContent sx={{ p: 4 }}>
          {/* Error Alert */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 1: Rating */}
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step-1"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                      How would you rate your experience?
                    </Typography>

                    <Box sx={{ mb: 3 }}>
                      <Controller
                        name="rating"
                        control={control}
                        render={({ field }) => (
                          <StarRating
                            value={field.value}
                            onChange={field.onChange}
                            size="xl"
                            showValue={false}
                            labels={['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']}
                            animated={true}
                            spacing={3}
                          />
                        )}
                      />
                    </Box>

                    <AnimatePresence>
                      {watchedRating > 0 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 2,
                              p: 2,
                              backgroundColor: 'rgba(102, 126, 234, 0.1)',
                              borderRadius: 3,
                              border: '1px solid rgba(102, 126, 234, 0.2)'
                            }}
                          >
                            <Typography variant="h4">
                              {getRatingEmoji(watchedRating)}
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                              {getRatingText(watchedRating)}
                            </Typography>
                          </Box>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {errors.rating && (
                      <Typography variant="caption" color="error" sx={{ mt: 2, display: 'block' }}>
                        {errors.rating.message}
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                      onClick={() => setStep(2)}
                      disabled={!watchedRating}
                      variant="contained"
                      size="large"
                      sx={{
                        borderRadius: 3,
                        px: 4,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      }}
                    >
                      Continue
                    </Button>
                  </Box>
                </motion.div>
              )}

              {/* Step 2: Comment & Details */}
              {step === 2 && (
                <motion.div
                  key="step-2"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Tell us more about your experience
                  </Typography>

                  <Controller
                    name="comment"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Your Review (Optional)"
                        multiline
                        rows={4}
                        fullWidth
                        placeholder="Share details about your experience..."
                        error={!!errors.comment}
                        helperText={errors.comment?.message || `${field.value?.length || 0}/1000 characters`}
                        sx={{
                          mb: 3,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      />
                    )}
                  />

                  {/* Tags */}
                  {showTags && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                        Add tags to describe your experience:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {availableTags.map((tag) => (
                          <motion.div
                            key={tag}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Chip
                              label={tag}
                              clickable
                              color={selectedTags.includes(tag) ? 'primary' : 'default'}
                              onClick={() => handleTagToggle(tag)}
                              sx={{
                                borderRadius: 2,
                                fontSize: '0.75rem',
                                '&:hover': {
                                  transform: 'translateY(-2px)',
                                  boxShadow: 2
                                },
                                transition: 'all 0.2s ease'
                              }}
                            />
                          </motion.div>
                        ))}
                      </Box>
                    </Box>
                  )}

                  {/* Recommendation */}
                  {showRecommendation && (
                    <Box sx={{ mb: 3 }}>
                      <Controller
                        name="recommend"
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            control={
                              <Checkbox
                                {...field}
                                checked={field.value}
                                color="primary"
                                icon={<MoodBadIcon />}
                                checkedIcon={<MoodIcon />}
                              />
                            }
                            label="I would recommend this store to others"
                            sx={{ color: 'text.primary' }}
                          />
                        )}
                      />
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button
                      onClick={() => setStep(1)}
                      variant="outlined"
                      sx={{ borderRadius: 2, px: 3 }}
                    >
                      Back
                    </Button>
                    <Button
                      onClick={() => setStep(3)}
                      variant="contained"
                      sx={{
                        borderRadius: 2,
                        px: 3,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      }}
                    >
                      {showPhotos ? 'Add Photos' : 'Review'}
                    </Button>
                  </Box>
                </motion.div>
              )}

              {/* Step 3: Photos & Review */}
              {step === 3 && (
                <motion.div
                  key="step-3"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  {showPhotos && (
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        Add Photos (Optional)
                      </Typography>
                      <ImageUpload
                        onUpload={(images) => setSelectedImages(prev => [...prev, ...images])}
                        onRemove={(image) => setSelectedImages(prev => prev.filter(img => img.id !== image.id))}
                        initialImages={selectedImages}
                        multiple
                        maxFiles={5}
                        preview
                        uploadText="Upload Photos"
                        dropzoneText="Share photos of your experience"
                      />
                    </Box>
                  )}

                  {/* Review Summary */}
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: 'divider',
                      background: 'rgba(102, 126, 234, 0.05)',
                      mb: 4
                    }}
                  >
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Review Summary
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <StarRating value={watchedRating} readOnly size="small" />
                      <Typography variant="body2" sx={{ ml: 1, fontWeight: 600 }}>
                        {getRatingText(watchedRating)}
                      </Typography>
                    </Box>

                    {watchedComment && (
                      <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic' }}>
                        "{watchedComment}"
                      </Typography>
                    )}

                    {selectedTags.length > 0 && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                        {selectedTags.slice(0, 3).map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                        {selectedTags.length > 3 && (
                          <Chip
                            label={`+${selectedTags.length - 3} more`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    )}

                    {watchedRecommend && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <MoodIcon sx={{ color: 'success.main', mr: 1 }} />
                        <Typography variant="body2" color="success.main">
                          Recommends this store
                        </Typography>
                      </Box>
                    )}
                  </Paper>

                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button
                      onClick={() => setStep(2)}
                      variant="outlined"
                      sx={{ borderRadius: 2, px: 3 }}
                    >
                      Back
                    </Button>
                    
                    {existingRating && (
                      <Button
                        onClick={handleDeleteRating}
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        sx={{ borderRadius: 2 }}
                      >
                        Delete
                      </Button>
                    )}
                    
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      startIcon={loading ? null : existingRating ? <EditIcon /> : <SendIcon />}
                      sx={{
                        borderRadius: 2,
                        px: 4,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      }}
                    >
                      {loading ? 'Submitting...' : existingRating ? 'Update Rating' : 'Submit Rating'}
                    </Button>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RatingForm;
