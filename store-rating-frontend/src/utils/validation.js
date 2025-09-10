import { VALIDATION_RULES, REGEX_PATTERNS } from './constants';

// Validation error class
export class ValidationError extends Error {
  constructor(message, field = null) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

// Base validation function
const createValidator = (validationFn, errorMessage) => {
  return (value, customMessage = null) => {
    const isValid = validationFn(value);
    if (!isValid) {
      throw new ValidationError(customMessage || errorMessage);
    }
    return true;
  };
};

// Required field validation
export const required = createValidator(
  (value) => value != null && value !== '' && (!Array.isArray(value) || value.length > 0),
  'This field is required'
);

// Email validation (as per challenge requirements)
export const email = createValidator(
  (value) => !value || REGEX_PATTERNS.EMAIL.test(value),
  'Please enter a valid email address'
);

// Name validation (as per challenge requirements: Min 20 characters, Max 60 characters)
export const name = createValidator(
  (value) => {
    if (!value) return false;
    const length = value.trim().length;
    return length >= VALIDATION_RULES.NAME.MIN_LENGTH && length <= VALIDATION_RULES.NAME.MAX_LENGTH;
  },
  `Name must be between ${VALIDATION_RULES.NAME.MIN_LENGTH} and ${VALIDATION_RULES.NAME.MAX_LENGTH} characters`
);

// Address validation (as per challenge requirements: Max 400 characters)
export const address = createValidator(
  (value) => {
    if (!value) return false;
    return value.trim().length <= VALIDATION_RULES.ADDRESS.MAX_LENGTH;
  },
  `Address must not exceed ${VALIDATION_RULES.ADDRESS.MAX_LENGTH} characters`
);

// Password validation (as per challenge requirements: 8-16 characters, uppercase + special char)
export const password = createValidator(
  (value) => {
    if (!value) return false;
    const length = value.length;
    const hasUppercase = /[A-Z]/.test(value);
    const hasSpecialChar = /[!@#$%^&*]/.test(value);
    
    return length >= VALIDATION_RULES.PASSWORD.MIN_LENGTH && 
           length <= VALIDATION_RULES.PASSWORD.MAX_LENGTH &&
           hasUppercase && 
           hasSpecialChar;
  },
  VALIDATION_RULES.PASSWORD.DESCRIPTION
);

// Rating validation (as per challenge requirements: 1 to 5)
export const rating = createValidator(
  (value) => {
    const numValue = Number(value);
    return Number.isInteger(numValue) && numValue >= VALIDATION_RULES.RATING.MIN && numValue <= VALIDATION_RULES.RATING.MAX;
  },
  `Rating must be a whole number between ${VALIDATION_RULES.RATING.MIN} and ${VALIDATION_RULES.RATING.MAX}`
);

// Generic length validation
export const length = (min = 0, max = Infinity) => createValidator(
  (value) => {
    if (value == null) return min === 0;
    const len = typeof value === 'string' ? value.trim().length : value.length || 0;
    return len >= min && len <= max;
  },
  max === Infinity 
    ? `Must be at least ${min} characters long`
    : min === 0 
      ? `Must not exceed ${max} characters`
      : `Must be between ${min} and ${max} characters long`
);

// Minimum length validation
export const minLength = (min) => length(min);

// Maximum length validation
export const maxLength = (max) => length(0, max);

// Pattern validation
export const pattern = (regex, message = 'Invalid format') => createValidator(
  (value) => !value || regex.test(value),
  message
);

// URL validation
export const url = createValidator(
  (value) => !value || REGEX_PATTERNS.URL.test(value),
  'Please enter a valid URL'
);

// Phone validation
export const phone = createValidator(
  (value) => !value || REGEX_PATTERNS.PHONE.test(value),
  'Please enter a valid phone number'
);

// Number validation
export const number = createValidator(
  (value) => value === '' || value == null || (!isNaN(value) && !isNaN(parseFloat(value))),
  'Must be a valid number'
);

// Integer validation
export const integer = createValidator(
  (value) => value === '' || value == null || (Number.isInteger(Number(value))),
  'Must be a whole number'
);

// Range validation
export const range = (min = -Infinity, max = Infinity) => createValidator(
  (value) => {
    if (value === '' || value == null) return true;
    const num = Number(value);
    return !isNaN(num) && num >= min && num <= max;
  },
  `Must be between ${min} and ${max}`
);

// Positive number validation
export const positive = createValidator(
  (value) => value === '' || value == null || (Number(value) > 0),
  'Must be a positive number'
);

// Date validation
export const date = createValidator(
  (value) => !value || !isNaN(Date.parse(value)),
  'Please enter a valid date'
);

// Future date validation
export const futureDate = createValidator(
  (value) => !value || new Date(value) > new Date(),
  'Date must be in the future'
);

// Past date validation
export const pastDate = createValidator(
  (value) => !value || new Date(value) < new Date(),
  'Date must be in the past'
);

// File validation
export const file = (options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif'],
    required = false
  } = options;
  
  return (value) => {
    if (!required && !value) return true;
    if (required && !value) {
      throw new ValidationError('Please select a file');
    }
    
    if (value.size > maxSize) {
      const sizeMB = Math.round(maxSize / 1024 / 1024);
      throw new ValidationError(`File size must not exceed ${sizeMB}MB`);
    }
    
    if (allowedTypes.length > 0 && !allowedTypes.includes(value.type)) {
      throw new ValidationError(`File type must be one of: ${allowedTypes.join(', ')}`);
    }
    
    return true;
  };
};

// Custom validation
export const custom = (validatorFn, message = 'Invalid value') => createValidator(
  validatorFn,
  message
);

// Confirmation validation (for password confirmation)
export const confirmation = (originalValue, confirmationValue) => {
  if (originalValue !== confirmationValue) {
    throw new ValidationError('Values do not match');
  }
  return true;
};

// Array validation
export const array = (options = {}) => {
  const { minItems = 0, maxItems = Infinity, itemValidator = null } = options;
  
  return (value) => {
    if (!Array.isArray(value)) {
      throw new ValidationError('Must be an array');
    }
    
    if (value.length < minItems) {
      throw new ValidationError(`Must have at least ${minItems} items`);
    }
    
    if (value.length > maxItems) {
      throw new ValidationError(`Must have no more than ${maxItems} items`);
    }
    
    if (itemValidator) {
      value.forEach((item, index) => {
        try {
          itemValidator(item);
        } catch (error) {
          throw new ValidationError(`Item ${index + 1}: ${error.message}`);
        }
      });
    }
    
    return true;
  };
};

// Validate single field
export const validateField = (value, validators) => {
  const errors = [];
  
  if (!Array.isArray(validators)) {
    validators = [validators];
  }
  
  for (const validator of validators) {
    try {
      validator(value);
    } catch (error) {
      if (error instanceof ValidationError) {
        errors.push(error.message);
      } else {
        errors.push(error.message || 'Validation error');
      }
    }
  }
  
  return errors;
};

// Validate object with rules
export const validateObject = (data, rules) => {
  const errors = {};
  let isValid = true;
  
  Object.keys(rules).forEach(field => {
    const value = data[field];
    const validators = Array.isArray(rules[field]) ? rules[field] : [rules[field]];
    
    const fieldErrors = validateField(value, validators);
    
    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors;
      isValid = false;
    }
  });
  
  return { isValid, errors };
};

// Validation rules for different forms based on challenge requirements
export const validationRules = {
  // User registration form (as per challenge requirements)
  userRegistration: {
    name: [required, name],
    email: [required, email],
    password: [required, password],
    address: [required, address],
  },
  
  // User login form
  userLogin: {
    email: [required, email],
    password: [required],
  },
  
  // Password change form
  passwordChange: {
    currentPassword: [required],
    newPassword: [required, password],
    confirmPassword: [required],
  },
  
  // Store creation form (Admin)
  storeCreation: {
    name: [required, minLength(2), maxLength(100)],
    email: [required, email],
    address: [required, address],
    category: [required],
  },
  
  // Rating submission form (as per challenge requirements)
  ratingSubmission: {
    rating: [required, rating],
    review: [maxLength(2000)], // Optional review text
  },
  
  // User creation form (Admin)
  userCreation: {
    name: [required, name],
    email: [required, email],
    password: [required, password],
    address: [required, address],
    role: [required],
  },
  
  // Profile update form
  profileUpdate: {
    name: [name], // Optional but if provided must meet requirements
    email: [email], // Optional but if provided must be valid
    address: [address], // Optional but if provided must meet requirements
  },
  
  // Store search form
  storeSearch: {
    query: [minLength(1)],
    location: [maxLength(200)],
  },
};

// Validate form based on predefined rules
export const validateForm = (formName, data) => {
  const rules = validationRules[formName];
  
  if (!rules) {
    throw new Error(`Unknown form validation rules: ${formName}`);
  }
  
  return validateObject(data, rules);
};

// Real-time validation helper
export const createFieldValidator = (fieldRules) => {
  return (value) => {
    const validators = Array.isArray(fieldRules) ? fieldRules : [fieldRules];
    return validateField(value, validators);
  };
};

// Validation utilities
export const validationUtils = {
  // Check if value is empty for validation purposes
  isEmpty: (value) => {
    if (value == null) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  },
  
  // Get first error message from validation result
  getFirstError: (errors) => {
    if (typeof errors === 'object' && errors !== null) {
      for (const field in errors) {
        if (Array.isArray(errors[field]) && errors[field].length > 0) {
          return errors[field][0];
        }
      }
    }
    return null;
  },
  
  // Check if validation result has errors
  hasErrors: (validationResult) => {
    return validationResult && !validationResult.isValid;
  },
  
  // Merge validation results
  mergeValidationResults: (...results) => {
    const merged = { isValid: true, errors: {} };
    
    results.forEach(result => {
      if (result && !result.isValid) {
        merged.isValid = false;
        Object.assign(merged.errors, result.errors);
      }
    });
    
    return merged;
  },
};

export default {
  ValidationError,
  required,
  email,
  name,
  address,
  password,
  rating,
  length,
  minLength,
  maxLength,
  pattern,
  url,
  phone,
  number,
  integer,
  range,
  positive,
  date,
  futureDate,
  pastDate,
  file,
  custom,
  confirmation,
  array,
  validateField,
  validateObject,
  validateForm,
  validationRules,
  createFieldValidator,
  validationUtils,
};
