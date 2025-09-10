import { useState, useEffect, useCallback } from 'react';

const useLocalStorage = (key, initialValue, options = {}) => {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    syncAcrossTabs = true,
    removeOnPageUnload = false,
    errorOnParseFailure = false
  } = options;

  // Get value from localStorage or return initial value
  const getStoredValue = useCallback(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      
      if (item === null) {
        return initialValue;
      }
      
      return deserialize(item);
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      
      if (errorOnParseFailure) {
        throw error;
      }
      
      return initialValue;
    }
  }, [key, initialValue, deserialize, errorOnParseFailure]);

  const [storedValue, setStoredValue] = useState(getStoredValue);
  const [error, setError] = useState(null);

  // Set value in localStorage
  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      setError(null);
      
      if (typeof window !== 'undefined') {
        if (valueToStore === undefined) {
          window.localStorage.removeItem(key);
        } else {
          window.localStorage.setItem(key, serialize(valueToStore));
        }
        
        // Dispatch custom event for cross-tab synchronization
        if (syncAcrossTabs) {
          window.dispatchEvent(new CustomEvent('localStorage-change', {
            detail: { key, value: valueToStore }
          }));
        }
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
      setError(error);
    }
  }, [key, serialize, storedValue, syncAcrossTabs]);

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      setError(null);
      
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
        
        if (syncAcrossTabs) {
          window.dispatchEvent(new CustomEvent('localStorage-change', {
            detail: { key, value: undefined }
          }));
        }
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
      setError(error);
    }
  }, [key, initialValue, syncAcrossTabs]);

  // Check if value exists in localStorage
  const hasValue = useCallback(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    
    return window.localStorage.getItem(key) !== null;
  }, [key]);

  // Get raw value (without deserializing)
  const getRawValue = useCallback(() => {
    if (typeof window === 'undefined') {
      return null;
    }
    
    return window.localStorage.getItem(key);
  }, [key]);

  // Update value without triggering re-render
  const setValueSilent = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(getStoredValue()) : value;
      
      if (typeof window !== 'undefined') {
        if (valueToStore === undefined) {
          window.localStorage.removeItem(key);
        } else {
          window.localStorage.setItem(key, serialize(valueToStore));
        }
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}" silently:`, error);
    }
  }, [key, serialize, getStoredValue]);

  // Merge object values (useful for settings/preferences)
  const mergeValue = useCallback((partialValue) => {
    setValue(prevValue => {
      if (typeof prevValue === 'object' && prevValue !== null && !Array.isArray(prevValue)) {
        return { ...prevValue, ...partialValue };
      }
      return partialValue;
    });
  }, [setValue]);

  // Reset to initial value
  const resetValue = useCallback(() => {
    setValue(initialValue);
  }, [setValue, initialValue]);

  // Listen for storage changes from other tabs
  useEffect(() => {
    if (!syncAcrossTabs || typeof window === 'undefined') {
      return;
    }

    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== serialize(storedValue)) {
        try {
          const newValue = e.newValue === null ? initialValue : deserialize(e.newValue);
          setStoredValue(newValue);
          setError(null);
        } catch (error) {
          console.warn(`Error syncing localStorage key "${key}" across tabs:`, error);
          if (errorOnParseFailure) {
            setError(error);
          }
        }
      }
    };

    const handleCustomStorageChange = (e) => {
      if (e.detail.key === key) {
        setStoredValue(e.detail.value);
        setError(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorage-change', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorage-change', handleCustomStorageChange);
    };
  }, [key, serialize, deserialize, storedValue, initialValue, syncAcrossTabs, errorOnParseFailure]);

  // Remove on page unload if specified
  useEffect(() => {
    if (!removeOnPageUnload) {
      return;
    }

    const handleBeforeUnload = () => {
      removeValue();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [removeOnPageUnload, removeValue]);

  // Sync with localStorage on mount
  useEffect(() => {
    const currentValue = getStoredValue();
    if (currentValue !== storedValue) {
      setStoredValue(currentValue);
    }
  }, [getStoredValue, storedValue]);

  return {
    value: storedValue,
    setValue,
    removeValue,
    hasValue,
    getRawValue,
    setValueSilent,
    mergeValue,
    resetValue,
    error,
    isLoading: storedValue === undefined,
    // Utility methods
    size: getRawValue()?.length || 0,
    isEmpty: !hasValue() || storedValue === null || storedValue === undefined
  };
};

// Hook for managing multiple localStorage keys as a group
export const useLocalStorageState = (keys, initialValues = {}) => {
  const storageHooks = {};
  
  keys.forEach(key => {
    storageHooks[key] = useLocalStorage(key, initialValues[key]);
  });

  const setAll = useCallback((values) => {
    Object.entries(values).forEach(([key, value]) => {
      if (storageHooks[key]) {
        storageHooks[key].setValue(value);
      }
    });
  }, [storageHooks]);

  const removeAll = useCallback(() => {
    Object.values(storageHooks).forEach(hook => {
      hook.removeValue();
    });
  }, [storageHooks]);

  const getAllValues = useCallback(() => {
    const values = {};
    Object.entries(storageHooks).forEach(([key, hook]) => {
      values[key] = hook.value;
    });
    return values;
  }, [storageHooks]);

  return {
    ...storageHooks,
    setAll,
    removeAll,
    getAllValues
  };
};

export default useLocalStorage;
