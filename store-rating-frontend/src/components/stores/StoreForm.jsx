import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Switch,
  FormControlLabel,
  InputAdornment,
  Collapse,
  Divider
} from '@mui/material';
import {
  Store as StoreIcon,
  LocationOn as LocationIcon,
  Category as CategoryIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Language as WebsiteIcon,
  Schedule as ScheduleIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  CloudUpload as UploadIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { createStore, updateStore, fetchCategories } from '../../store/storeSlice';
import ImageUpload from '../common/ImageUpload';
import StoreCategorySelector from './StoreCategorySelector';

const schema = yup.object({
  name: yup
    .string()
    .min(3, 'Store name must be at least 3 characters')
    .max(100, 'Store name cannot exceed 100 characters')
    .required('Store name is required'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  address: yup
    .string()
    .max(400, 'Address cannot exceed 400 characters')
    .required('Address is required'),
  phone: yup
    .string()
    .matches(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
    .optional(),
  website: yup
    .string()
    .url('Please enter a valid website URL')
    .optional(),
  description: yup
    .string()
    .max(1000, 'Description cannot exceed 1000 characters')
    .optional(),
  category: yup
    .string()
    .required('Category is required')
});

const steps = ['Basic Info', 'Contact Details', 'Additional Info', 'Media & Review'];

const StoreForm = ({ 
  store = null, 
  onSuccess, 
  onCancel,
  embedded = false 
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [uploadedImages, setUploadedImages] = useState(store?.images || []);
  const [businessHours, setBusinessHours] = useState(
    store?.businessHours || {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '10:00', close: '16:00', closed: false },
      sunday: { open: '10:00', close: '16:00', closed: true }
    }
  );

  const dispatch = useDispatch();
  const { loading, error, categories } = useSelector((state) => state.stores);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    trigger,
    setValue,
    reset
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: store?.name || '',
      email: store?.email || '',
      address: store?.address || '',
      phone: store?.phone || '',
      website: store?.website || '',
      description: store?.description || '',
      category: store?.category?.id || '',
      amenities: store?.amenities || [],
      tags: store?.tags || []
    }
  });

  const { fields: amenityFields, append: appendAmenity, remove: removeAmenity } = useFieldArray({
    control,
    name: 'amenities'
  });

  const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray({
    control,
    name: 'tags'
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (store) {
      reset({
        name: store.name,
        email: store.email,
        address: store.address,
        phone: store.phone || '',
        website: store.website || '',
        description: store.description || '',
        category: store.category?.id || '',
        amenities: store.amenities || [],
        tags: store.tags || []
      });
      setUploadedImages(store.images || []);
    }
  }, [store, reset]);

  const handleNext = async () => {
    const fieldsToValidate = {
      0: ['name', 'category'],
      1: ['email', 'address', 'phone'],
      2: ['website', 'description'],
      3: []
    };

    const isStepValid = await trigger(fieldsToValidate[activeStep]);
    
    if (isStepValid) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const onSubmit = async (data) => {
    try {
      const storeData = {
        ...data,
        images: uploadedImages,
        businessHours
      };

      let result;
      if (store) {
        result = await dispatch(updateStore({ id: store.id, ...storeData })).unwrap();
      } else {
        result = await dispatch(createStore(storeData)).unwrap();
      }

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      console.error('Failed to save store:', error);
    }
  };

  const handleAddAmenity = () => {
    appendAmenity('');
  };

  const handleAddTag = () => {
    appendTag('');
  };

  const handleBusinessHoursChange = (day, field, value) => {
    setBusinessHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 }
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: { duration: 0.3 }
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <motion.div
            key="step-0"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Store Name"
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <StoreIcon color={errors.name ? 'error' : 'action'} />
                          </InputAdornment>
                        ),
                        sx: { borderRadius: 2 }
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <StoreCategorySelector
                  value={watch('category')}
                  onChange={(categoryId) => setValue('category', categoryId)}
                  error={!!errors.category}
                  helperText={errors.category?.message}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Store Description"
                      multiline
                      rows={4}
                      fullWidth
                      error={!!errors.description}
                      helperText={errors.description?.message || `${field.value?.length || 0}/1000 characters`}
                      placeholder="Tell customers about your store..."
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            key="step-1"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Email Address"
                      type="email"
                      fullWidth
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color={errors.email ? 'error' : 'action'} />
                          </InputAdornment>
                        ),
                        sx: { borderRadius: 2 }
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Phone Number"
                      fullWidth
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon color={errors.phone ? 'error' : 'action'} />
                          </InputAdornment>
                        ),
                        sx: { borderRadius: 2 }
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Store Address"
                      multiline
                      rows={3}
                      fullWidth
                      error={!!errors.address}
                      helperText={errors.address?.message || `${field.value?.length || 0}/400 characters`}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                            <LocationIcon color={errors.address ? 'error' : 'action'} />
                          </InputAdornment>
                        ),
                        sx: { borderRadius: 2 }
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="website"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Website URL (Optional)"
                      fullWidth
                      error={!!errors.website}
                      helperText={errors.website?.message}
                      placeholder="https://yourstore.com"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <WebsiteIcon color={errors.website ? 'error' : 'action'} />
                          </InputAdornment>
                        ),
                        sx: { borderRadius: 2 }
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step-2"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Grid container spacing={3}>
              {/* Business Hours */}
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Business Hours
                  </Typography>

                  {Object.entries(businessHours).map(([day, hours]) => (
                    <Box key={day} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography
                        sx={{
                          minWidth: 100,
                          textTransform: 'capitalize',
                          fontWeight: 500
                        }}
                      >
                        {day}:
                      </Typography>

                      <FormControlLabel
                        control={
                          <Switch
                            checked={!hours.closed}
                            onChange={(e) =>
                              handleBusinessHoursChange(day, 'closed', !e.target.checked)
                            }
                            color="primary"
                          />
                        }
                        label="Open"
                        sx={{ mr: 2 }}
                      />

                      {!hours.closed && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TextField
                            type="time"
                            value={hours.open}
                            onChange={(e) =>
                              handleBusinessHoursChange(day, 'open', e.target.value)
                            }
                            size="small"
                            sx={{ width: 120 }}
                          />
                          <Typography color="text.secondary">to</Typography>
                          <TextField
                            type="time"
                            value={hours.close}
                            onChange={(e) =>
                              handleBusinessHoursChange(day, 'close', e.target.value)
                            }
                            size="small"
                            sx={{ width: 120 }}
                          />
                        </Box>
                      )}

                      {hours.closed && (
                        <Typography color="text.disabled" sx={{ ml: 2 }}>
                          Closed
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Paper>
              </Grid>

              {/* Amenities */}
              <Grid item xs={12} md={6}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Amenities
                    </Typography>
                    <Button
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={handleAddAmenity}
                      sx={{ borderRadius: 2 }}
                    >
                      Add
                    </Button>
                  </Box>

                  <AnimatePresence>
                    {amenityFields.map((field, index) => (
                      <motion.div
                        key={field.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <Controller
                            name={`amenities.${index}`}
                            control={control}
                            render={({ field: inputField }) => (
                              <TextField
                                {...inputField}
                                size="small"
                                placeholder="e.g., WiFi, Parking"
                                fullWidth
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                              />
                            )}
                          />
                          <IconButton
                            onClick={() => removeAmenity(index)}
                            size="small"
                            color="error"
                          >
                            <RemoveIcon />
                          </IconButton>
                        </Box>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </Paper>
              </Grid>

              {/* Tags */}
              <Grid item xs={12} md={6}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Tags
                    </Typography>
                    <Button
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={handleAddTag}
                      sx={{ borderRadius: 2 }}
                    >
                      Add
                    </Button>
                  </Box>

                  <AnimatePresence>
                    {tagFields.map((field, index) => (
                      <motion.div
                        key={field.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <Controller
                            name={`tags.${index}`}
                            control={control}
                            render={({ field: inputField }) => (
                              <TextField
                                {...inputField}
                                size="small"
                                placeholder="e.g., Fast Food, Delivery"
                                fullWidth
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                              />
                            )}
                          />
                          <IconButton
                            onClick={() => removeTag(index)}
                            size="small"
                            color="error"
                          >
                            <RemoveIcon />
                          </IconButton>
                        </Box>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </Paper>
              </Grid>
            </Grid>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step-3"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Store Images
                  </Typography>
                  <ImageUpload
                    onUpload={(images) => setUploadedImages(prev => [...prev, ...images])}
                    onRemove={(image) =>
                      setUploadedImages(prev => prev.filter(img => img.id !== image.id))
                    }
                    initialImages={uploadedImages}
                    multiple
                    maxFiles={10}
                    preview
                    uploadText="Upload Store Images"
                    dropzoneText="Add photos to showcase your store"
                  />
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    background: 'rgba(102, 126, 234, 0.05)'
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Review Your Information
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Store Name:</strong> {watch('name')}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Category:</strong> {
                          categories.find(cat => cat.id === watch('category'))?.name || 'Not selected'
                        }
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Email:</strong> {watch('email')}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Phone:</strong> {watch('phone') || 'Not provided'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Address:</strong> {watch('address')}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Website:</strong> {watch('website') || 'Not provided'}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Images:</strong> {uploadedImages.length} uploaded
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card
        sx={{
          maxWidth: embedded ? '100%' : 800,
          mx: embedded ? 0 : 'auto',
          borderRadius: 4,
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
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
            p: 4,
            textAlign: 'center'
          }}
        >
          <motion.div variants={itemVariants}>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{ display: 'inline-block', marginBottom: 16 }}
            >
              {store ? <EditIcon sx={{ fontSize: 48 }} /> : <StoreIcon sx={{ fontSize: 48 }} />}
            </motion.div>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              {store ? 'Edit Store' : 'Add New Store'}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              {store ? 'Update your store information' : 'Create a new store listing'}
            </Typography>
          </motion.div>
        </Box>

        <CardContent sx={{ p: 4 }}>
          {/* Stepper */}
          <motion.div variants={itemVariants}>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </motion.div>

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

          {/* Form Content */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {renderStepContent(activeStep)}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Box>
                {onCancel && (
                  <Button
                    onClick={onCancel}
                    startIcon={<CancelIcon />}
                    sx={{ borderRadius: 2, mr: 2 }}
                  >
                    Cancel
                  </Button>
                )}
                
                <Button
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  sx={{ borderRadius: 2 }}
                >
                  Back
                </Button>
              </Box>

              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || !isValid}
                  sx={{
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    px: 4
                  }}
                  startIcon={loading ? null : <SaveIcon />}
                >
                  {loading ? 'Saving...' : store ? 'Update Store' : 'Create Store'}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  variant="contained"
                  sx={{
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}
                >
                  Next
                </Button>
              )}
            </Box>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StoreForm;
