import React from 'react';
import {
  Box,
  Skeleton,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Stack,
  Avatar
} from '@mui/material';
import { motion } from 'framer-motion';

const SkeletonLoader = ({ 
  type = 'card',
  count = 1,
  animation = 'wave', // wave, pulse, none
  variant = 'default'
}) => {
  const getSkeletonVariant = () => {
    switch (animation) {
      case 'pulse':
        return {
          animate: {
            opacity: [0.4, 1, 0.4],
          },
          transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }
        };
      case 'wave':
        return {};
      case 'none':
        return {
          animate: { opacity: 0.6 }
        };
      default:
        return {};
    }
  };

  const MotionSkeleton = motion(Skeleton);
  const skeletonProps = {
    animation: animation === 'none' ? false : animation,
    ...getSkeletonVariant()
  };

  // Store Card Skeleton
  const StoreCardSkeleton = () => (
    <Card sx={{ height: 300, borderRadius: 3 }}>
      <CardHeader
        avatar={<Skeleton variant="circular" width={40} height={40} />}
        title={<Skeleton variant="text" width="70%" />}
        subheader={<Skeleton variant="text" width="50%" />}
        action={<Skeleton variant="rectangular" width={60} height={24} />}
      />
      <Skeleton variant="rectangular" height={150} sx={{ mx: 2 }} />
      <CardContent>
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="80%" />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Skeleton variant="text" width="30%" />
          <Skeleton variant="text" width="40%" />
        </Box>
      </CardContent>
    </Card>
  );

  // User List Item Skeleton
  const UserListSkeleton = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', p: 2, gap: 2 }}>
      <Skeleton variant="circular" width={48} height={48} />
      <Box sx={{ flex: 1 }}>
        <Skeleton variant="text" width="60%" height={24} />
        <Skeleton variant="text" width="40%" height={20} />
        <Skeleton variant="text" width="80%" height={16} />
      </Box>
      <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 1 }} />
    </Box>
  );

  // Dashboard Card Skeleton
  const DashboardCardSkeleton = () => (
    <Card sx={{ p: 3, borderRadius: 3, height: 150 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Skeleton variant="circular" width={48} height={48} />
        <Skeleton variant="text" width={80} height={24} />
      </Box>
      <Skeleton variant="text" width="100%" height={32} />
      <Skeleton variant="text" width="60%" height={20} />
    </Card>
  );

  // Table Row Skeleton
  const TableRowSkeleton = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', p: 2, gap: 3 }}>
      <Skeleton variant="rectangular" width={24} height={24} />
      <Skeleton variant="circular" width={32} height={32} />
      <Skeleton variant="text" width="25%" />
      <Skeleton variant="text" width="20%" />
      <Skeleton variant="text" width="15%" />
      <Skeleton variant="text" width="10%" />
      <Skeleton variant="rectangular" width={80} height={28} sx={{ borderRadius: 1 }} />
    </Box>
  );

  // Rating Item Skeleton
  const RatingItemSkeleton = () => (
    <Card sx={{ p: 3, borderRadius: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Skeleton variant="circular" width={48} height={48} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="40%" height={24} />
          <Skeleton variant="text" width="60%" height={20} />
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} variant="circular" width={16} height={16} />
          ))}
        </Box>
      </Box>
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="60%" />
    </Card>
  );

  // Form Skeleton
  const FormSkeleton = () => (
    <Card sx={{ p: 4, borderRadius: 3 }}>
      <Skeleton variant="text" width="40%" height={36} sx={{ mb: 3 }} />
      
      <Stack spacing={3}>
        {[...Array(5)].map((_, i) => (
          <Box key={i}>
            <Skeleton variant="text" width="25%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" width="100%" height={48} sx={{ borderRadius: 1 }} />
          </Box>
        ))}
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
          <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 2 }} />
          <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 2 }} />
        </Box>
      </Stack>
    </Card>
  );

  // Chart Skeleton
  const ChartSkeleton = () => (
    <Card sx={{ p: 3, borderRadius: 3, height: 300 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Skeleton variant="text" width="30%" height={28} />
        <Skeleton variant="rectangular" width={100} height={28} sx={{ borderRadius: 1 }} />
      </Box>
      
      <Box sx={{ height: 200, display: 'flex', alignItems: 'end', gap: 1 }}>
        {[...Array(8)].map((_, i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            width="12%"
            height={`${Math.random() * 80 + 20}%`}
            sx={{ borderRadius: '4px 4px 0 0' }}
          />
        ))}
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} variant="text" width="15%" />
        ))}
      </Box>
    </Card>
  );

  // Navigation Skeleton
  const NavigationSkeleton = () => (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Skeleton variant="rectangular" width={40} height={40} sx={{ borderRadius: 1 }} />
        <Skeleton variant="text" width={120} height={24} />
      </Box>
      
      <Stack spacing={1}>
        {[...Array(6)].map((_, i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1 }}>
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="text" width="70%" />
          </Box>
        ))}
      </Stack>
    </Box>
  );

  // Content based on type
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
      case 'store-card':
        return <StoreCardSkeleton />;
      
      case 'user-list':
        return <UserListSkeleton />;
      
      case 'dashboard-card':
        return <DashboardCardSkeleton />;
      
      case 'table-row':
        return <TableRowSkeleton />;
      
      case 'rating':
        return <RatingItemSkeleton />;
      
      case 'form':
        return <FormSkeleton />;
      
      case 'chart':
        return <ChartSkeleton />;
      
      case 'navigation':
        return <NavigationSkeleton />;
      
      case 'text':
        return (
          <Stack spacing={1}>
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="60%" />
          </Stack>
        );
      
      case 'image':
        return <Skeleton variant="rectangular" width="100%" height={200} />;
      
      default:
        return (
          <Card sx={{ p: 2 }}>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="rectangular" width="100%" height={100} sx={{ mt: 1 }} />
          </Card>
        );
    }
  };

  // Grid layout for multiple items
  const getGridProps = () => {
    switch (type) {
      case 'card':
      case 'store-card':
      case 'dashboard-card':
        return { xs: 12, sm: 6, md: 4, lg: 3 };
      case 'chart':
        return { xs: 12, md: 6 };
      default:
        return { xs: 12 };
    }
  };

  if (count === 1) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {renderSkeleton()}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Grid container spacing={2}>
        {[...Array(count)].map((_, index) => (
          <Grid key={index} item {...getGridProps()}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
            >
              {renderSkeleton()}
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </motion.div>
  );
};

export default SkeletonLoader;
