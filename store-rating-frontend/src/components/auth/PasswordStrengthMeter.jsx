import React, { useMemo } from 'react';
import { Box, Typography, LinearProgress, Chip } from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const PasswordStrengthMeter = ({ password = '', sx = {} }) => {
  const passwordAnalysis = useMemo(() => {
    if (!password) {
      return {
        score: 0,
        strength: 'none',
        color: '#e0e0e0',
        checks: {
          length: false,
          uppercase: false,
          lowercase: false,
          number: false,
          special: false,
          common: true
        },
        suggestions: []
      };
    }

    const checks = {
      length: password.length >= 8 && password.length <= 16,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      common: !isCommonPassword(password)
    };

    const passedChecks = Object.values(checks).filter(Boolean).length;
    let score = (passedChecks / 6) * 100;
    
    // Bonus points for length
    if (password.length >= 12) score += 10;
    if (password.length >= 14) score += 10;
    
    // Penalty for common patterns
    if (hasCommonPatterns(password)) score -= 20;
    
    score = Math.max(0, Math.min(100, score));

    let strength, color;
    if (score < 30) {
      strength = 'weak';
      color = '#ef4444';
    } else if (score < 60) {
      strength = 'fair';
      color = '#f59e0b';
    } else if (score < 80) {
      strength = 'good';
      color = '#10b981';
    } else {
      strength = 'strong';
      color = '#059669';
    }

    const suggestions = generateSuggestions(checks, password);

    return { score, strength, color, checks, suggestions };
  }, [password]);

  const isCommonPassword = (pwd) => {
    const commonPasswords = [
      'password', '123456', '123456789', 'qwerty', 'abc123',
      'password123', 'admin', 'letmein', 'welcome', '12345678'
    ];
    return commonPasswords.some(common => 
      pwd.toLowerCase().includes(common.toLowerCase())
    );
  };

  const hasCommonPatterns = (pwd) => {
    // Check for keyboard patterns, repeated characters, etc.
    const patterns = [
      /(.)\1{2,}/, // 3+ repeated characters
      /123|234|345|456|567|678|789/, // sequential numbers
      /abc|bcd|cde|def|efg|fgh|ghi/, // sequential letters
      /qwe|asd|zxc/, // keyboard patterns
    ];
    return patterns.some(pattern => pattern.test(pwd.toLowerCase()));
  };

  const generateSuggestions = (checks, pwd) => {
    const suggestions = [];
    
    if (!checks.length) {
      if (pwd.length < 8) suggestions.push('Add more characters (minimum 8)');
      if (pwd.length > 16) suggestions.push('Reduce to maximum 16 characters');
    }
    if (!checks.uppercase) suggestions.push('Add an uppercase letter');
    if (!checks.lowercase) suggestions.push('Add a lowercase letter');
    if (!checks.number) suggestions.push('Add a number');
    if (!checks.special) suggestions.push('Add a special character (!@#$%^&*)');
    if (!checks.common) suggestions.push('Avoid common passwords');
    
    if (hasCommonPatterns(pwd)) {
      suggestions.push('Avoid keyboard patterns and repeated characters');
    }
    
    return suggestions;
  };

  const containerVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: {
        duration: 0.3,
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.2 }
    }
  };

  const progressVariants = {
    hidden: { scaleX: 0 },
    visible: { 
      scaleX: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const strengthLabels = {
    none: 'Enter a password',
    weak: 'Weak',
    fair: 'Fair',
    good: 'Good',
    strong: 'Strong'
  };

  const strengthIcons = {
    none: <SecurityIcon sx={{ fontSize: 16, color: 'text.disabled' }} />,
    weak: <CancelIcon sx={{ fontSize: 16, color: '#ef4444' }} />,
    fair: <SecurityIcon sx={{ fontSize: 16, color: '#f59e0b' }} />,
    good: <CheckIcon sx={{ fontSize: 16, color: '#10b981' }} />,
    strong: <CheckIcon sx={{ fontSize: 16, color: '#059669' }} />
  };

  if (!password) {
    return (
      <Box sx={{ ...sx }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          {strengthIcons.none}
          <Typography variant="body2" color="text.disabled">
            {strengthLabels.none}
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={0} 
          sx={{ 
            height: 8, 
            borderRadius: 4,
            backgroundColor: 'rgba(0, 0, 0, 0.06)'
          }} 
        />
      </Box>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ ...sx }}
      >
        <Box sx={{ mb: 2 }}>
          {/* Strength Indicator */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <motion.div
                animate={{ 
                  scale: passwordAnalysis.strength === 'strong' ? [1, 1.2, 1] : 1,
                  rotate: passwordAnalysis.strength === 'strong' ? [0, 10, -10, 0] : 0
                }}
                transition={{ duration: 0.5 }}
              >
                {strengthIcons[passwordAnalysis.strength]}
              </motion.div>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: passwordAnalysis.color,
                  fontWeight: 600
                }}
              >
                {strengthLabels[passwordAnalysis.strength]}
              </Typography>
            </Box>
            
            <Typography variant="caption" color="text.secondary">
              {Math.round(passwordAnalysis.score)}%
            </Typography>
          </Box>

          {/* Progress Bar */}
          <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: 4 }}>
            <LinearProgress 
              variant="determinate" 
              value={100}
              sx={{ 
                height: 8,
                backgroundColor: 'rgba(0, 0, 0, 0.06)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: 'rgba(0, 0, 0, 0.06)'
                }
              }} 
            />
            <motion.div
              variants={progressVariants}
              initial="hidden"
              animate="visible"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: `${passwordAnalysis.score}%`,
                background: `linear-gradient(90deg, ${passwordAnalysis.color}, ${passwordAnalysis.color}dd)`,
                borderRadius: 4,
                transformOrigin: 'left'
              }}
            />
          </Box>
        </Box>

        {/* Requirements Checklist */}
        <motion.div variants={itemVariants}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Password requirements:
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
            {[
              { key: 'length', label: '8-16 chars', check: passwordAnalysis.checks.length },
              { key: 'uppercase', label: 'Uppercase', check: passwordAnalysis.checks.uppercase },
              { key: 'special', label: 'Special char', check: passwordAnalysis.checks.special }
            ].map((requirement) => (
              <motion.div
                key={requirement.key}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <Chip
                  size="small"
                  label={requirement.label}
                  icon={requirement.check ? <CheckIcon /> : <CancelIcon />}
                  sx={{
                    fontSize: '0.7rem',
                    height: 24,
                    backgroundColor: requirement.check ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: requirement.check ? '#10b981' : '#ef4444',
                    '& .MuiChip-icon': {
                      fontSize: 14,
                      color: requirement.check ? '#10b981' : '#ef4444'
                    },
                    transition: 'all 0.3s ease'
                  }}
                />
              </motion.div>
            ))}
          </Box>
        </motion.div>

        {/* Suggestions */}
        <AnimatePresence>
          {passwordAnalysis.suggestions.length > 0 && (
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Suggestions:
              </Typography>
              <Box component="ul" sx={{ m: 0, pl: 2, listStyle: 'none' }}>
                {passwordAnalysis.suggestions.slice(0, 3).map((suggestion, index) => (
                  <motion.li
                    key={index}
                    variants={itemVariants}
                    style={{ marginBottom: 4 }}
                  >
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ 
                        fontSize: '0.7rem',
                        '&:before': {
                          content: '"•"',
                          color: 'primary.main',
                          marginRight: 1,
                          fontWeight: 'bold'
                        }
                      }}
                    >
                      {suggestion}
                    </Typography>
                  </motion.li>
                ))}
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Security Tips */}
        {passwordAnalysis.strength === 'strong' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Box
              sx={{
                mt: 2,
                p: 2,
                backgroundColor: 'rgba(16, 185, 129, 0.05)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: 2
              }}
            >
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#10b981',
                  fontWeight: 600,
                  fontSize: '0.75rem'
                }}
              >
                🎉 Excellent! Your password is strong and secure.
              </Typography>
            </Box>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default PasswordStrengthMeter;
