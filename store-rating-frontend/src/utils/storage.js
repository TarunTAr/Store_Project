import { STORAGE_KEYS, TIME_CONSTANTS } from './constants';

// Storage types
export const STORAGE_TYPES = {
  LOCAL: 'localStorage',
  SESSION: 'sessionStorage',
  MEMORY: 'memory',
};

// Storage quota information
export const getStorageQuota = async () => {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    try {
      const estimate = await navigator.storage.estimate();
      return {
        quota: estimate.quota,
        usage: estimate.usage,
        available: estimate.quota - estimate.usage,
        usagePercentage: (estimate.usage / estimate.quota) * 100,
      };
    } catch (error) {
      console.error('Failed to get storage quota:', error);
    }
  }
  
  return null;
};

// Enhanced storage class
export class EnhancedStorage {
  constructor(storageType = STORAGE_TYPES.LOCAL, options = {}) {
    this.storageType = storageType;
    this.prefix = options.prefix || 'app_';
    this.encryption = options.encryption || false;
    this.compression = options.compression || false;
    this.ttl = options.defaultTtl || null;
    this.maxSize = options.maxSize || 5 * 1024 * 1024; // 5MB
    
    // Initialize storage backend
    this.initStorage();
    
    // Track storage usage
    this.usage = new Map();
  }

  initStorage() {
    switch (this.storageType) {
      case STORAGE_TYPES.LOCAL:
        this.storage = typeof window !== 'undefined' ? window.localStorage : null;
        break;
      case STORAGE_TYPES.SESSION:
        this.storage = typeof window !== 'undefined' ? window.sessionStorage : null;
        break;
      case STORAGE_TYPES.MEMORY:
        this.storage = new Map();
        break;
      default:
        throw new Error(`Unsupported storage type: ${this.storageType}`);
    }
  }

  // Generate storage key with prefix
  getKey(key) {
    return `${this.prefix}${key}`;
  }

  // Serialize data with compression and encryption
  serialize(data, options = {}) {
    let serialized = JSON.stringify({
      value: data,
      timestamp: Date.now(),
      ttl: options.ttl || this.ttl,
      version: '1.0',
    });

    // Compress data if enabled
    if (this.compression || options.compress) {
      serialized = this.compress(serialized);
    }

    // Encrypt data if enabled
    if (this.encryption || options.encrypt) {
      serialized = this.encrypt(serialized);
    }

    return serialized;
  }

  // Deserialize data with decompression and decryption
  deserialize(serializedData, options = {}) {
    try {
      let data = serializedData;

      // Decrypt data if needed
      if (this.encryption || options.encrypt) {
        data = this.decrypt(data);
      }

      // Decompress data if needed
      if (this.compression || options.compress) {
        data = this.decompress(data);
      }

      const parsed = JSON.parse(data);
      
      // Check TTL
      if (parsed.ttl && parsed.timestamp) {
        const age = Date.now() - parsed.timestamp;
        if (age > parsed.ttl) {
          return null; // Expired
        }
      }

      return parsed.value;
    } catch (error) {
      console.error('Failed to deserialize data:', error);
      return null;
    }
  }

  // Simple compression (base64 encoding - in real app, use proper compression)
  compress(data) {
    try {
      return btoa(data);
    } catch (error) {
      console.error('Compression failed:', error);
      return data;
    }
  }

  // Simple decompression
  decompress(data) {
    try {
      return atob(data);
    } catch (error) {
      console.error('Decompression failed:', error);
      return data;
    }
  }

  // Simple encryption (XOR cipher - in real app, use proper encryption)
  encrypt(data) {
    const key = 'store-rating-key'; // In real app, use proper key management
    let encrypted = '';
    
    for (let i = 0; i < data.length; i++) {
      encrypted += String.fromCharCode(
        data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    
    return btoa(encrypted);
  }

  // Simple decryption
  decrypt(encryptedData) {
    try {
      const key = 'store-rating-key';
      const encrypted = atob(encryptedData);
      let decrypted = '';
      
      for (let i = 0; i < encrypted.length; i++) {
        decrypted += String.fromCharCode(
          encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        );
      }
      
      return decrypted;
    } catch (error) {
      console.error('Decryption failed:', error);
      return encryptedData;
    }
  }

  // Set item in storage
  setItem(key, value, options = {}) {
    try {
      const storageKey = this.getKey(key);
      const serialized = this.serialize(value, options);
      
      // Check size limit
      if (serialized.length > this.maxSize) {
        throw new Error(`Data too large: ${serialized.length} bytes`);
      }

      if (this.storageType === STORAGE_TYPES.MEMORY) {
        this.storage.set(storageKey, serialized);
      } else if (this.storage) {
        this.storage.setItem(storageKey, serialized);
      }

      // Track usage
      this.usage.set(key, {
        size: serialized.length,
        timestamp: Date.now(),
        accessCount: 1,
      });

      return true;
    } catch (error) {
      console.error('Failed to set storage item:', error);
      
      // Try to free up space
      if (error.name === 'QuotaExceededError') {
        this.cleanup();
        // Retry once
        try {
          const storageKey = this.getKey(key);
          const serialized = this.serialize(value, options);
          
          if (this.storageType === STORAGE_TYPES.MEMORY) {
            this.storage.set(storageKey, serialized);
          } else if (this.storage) {
            this.storage.setItem(storageKey, serialized);
          }
          
          return true;
        } catch (retryError) {
          console.error('Retry failed:', retryError);
        }
      }
      
      return false;
    }
  }

  // Get item from storage
  getItem(key, defaultValue = null, options = {}) {
    try {
      const storageKey = this.getKey(key);
      let serialized;

      if (this.storageType === STORAGE_TYPES.MEMORY) {
        serialized = this.storage.get(storageKey);
      } else if (this.storage) {
        serialized = this.storage.getItem(storageKey);
      }

      if (serialized === null || serialized === undefined) {
        return defaultValue;
      }

      const value = this.deserialize(serialized, options);
      
      if (value === null) {
        // Item expired or corrupted, remove it
        this.removeItem(key);
        return defaultValue;
      }

      // Update access tracking
      const usage = this.usage.get(key);
      if (usage) {
        usage.accessCount++;
        usage.lastAccess = Date.now();
      }

      return value;
    } catch (error) {
      console.error('Failed to get storage item:', error);
      return defaultValue;
    }
  }

  // Remove item from storage
  removeItem(key) {
    try {
      const storageKey = this.getKey(key);

      if (this.storageType === STORAGE_TYPES.MEMORY) {
        this.storage.delete(storageKey);
      } else if (this.storage) {
        this.storage.removeItem(storageKey);
      }

      this.usage.delete(key);
      return true;
    } catch (error) {
      console.error('Failed to remove storage item:', error);
      return false;
    }
  }

  // Check if item exists
  hasItem(key) {
    const storageKey = this.getKey(key);

    if (this.storageType === STORAGE_TYPES.MEMORY) {
      return this.storage.has(storageKey);
    } else if (this.storage) {
      return this.storage.getItem(storageKey) !== null;
    }

    return false;
  }

  // Get all keys with prefix
  getKeys() {
    const keys = [];

    if (this.storageType === STORAGE_TYPES.MEMORY) {
      for (const key of this.storage.keys()) {
        if (key.startsWith(this.prefix)) {
          keys.push(key.substring(this.prefix.length));
        }
      }
    } else if (this.storage) {
      for (let i = 0; i < this.storage.length; i++) {
        const key = this.storage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keys.push(key.substring(this.prefix.length));
        }
      }
    }

    return keys;
  }

  // Clear all items with prefix
  clear() {
    const keys = this.getKeys();
    keys.forEach(key => this.removeItem(key));
    this.usage.clear();
  }

  // Get storage usage statistics
  getUsageStats() {
    const stats = {
      totalItems: this.usage.size,
      totalSize: 0,
      averageSize: 0,
      oldestItem: null,
      newestItem: null,
      mostAccessed: null,
    };

    let oldestTimestamp = Date.now();
    let newestTimestamp = 0;
    let maxAccessCount = 0;

    for (const [key, usage] of this.usage.entries()) {
      stats.totalSize += usage.size;

      if (usage.timestamp < oldestTimestamp) {
        oldestTimestamp = usage.timestamp;
        stats.oldestItem = key;
      }

      if (usage.timestamp > newestTimestamp) {
        newestTimestamp = usage.timestamp;
        stats.newestItem = key;
      }

      if (usage.accessCount > maxAccessCount) {
        maxAccessCount = usage.accessCount;
        stats.mostAccessed = key;
      }
    }

    stats.averageSize = stats.totalItems > 0 ? stats.totalSize / stats.totalItems : 0;

    return stats;
  }

  // Cleanup expired and least used items
  cleanup(maxAge = 7 * TIME_CONSTANTS.DAY) {
    const now = Date.now();
    const itemsToRemove = [];

    // Find expired and old items
    for (const [key, usage] of this.usage.entries()) {
      const age = now - usage.timestamp;
      const lastAccess = usage.lastAccess || usage.timestamp;
      const timeSinceAccess = now - lastAccess;

      // Remove if expired or not accessed recently
      if (age > maxAge || timeSinceAccess > maxAge) {
        itemsToRemove.push(key);
      }
    }

    // Remove least accessed items if still over capacity
    if (itemsToRemove.length === 0 && this.usage.size > 100) {
      const sortedByAccess = Array.from(this.usage.entries())
        .sort((a, b) => a[1].accessCount - b[1].accessCount)
        .slice(0, Math.floor(this.usage.size * 0.2)); // Remove 20%

      itemsToRemove.push(...sortedByAccess.map(([key]) => key));
    }

    // Remove items
    itemsToRemove.forEach(key => this.removeItem(key));

    return itemsToRemove.length;
  }

  // Export data for backup
  export(keys = null) {
    const exportData = {
      timestamp: Date.now(),
      storageType: this.storageType,
      data: {},
    };

    const keysToExport = keys || this.getKeys();

    keysToExport.forEach(key => {
      const value = this.getItem(key);
      if (value !== null) {
        exportData.data[key] = value;
      }
    });

    return exportData;
  }

  // Import data from backup
  import(exportData, options = {}) {
    const { overwrite = false, ttl = null } = options;
    
    if (!exportData || !exportData.data) {
      throw new Error('Invalid export data');
    }

    const results = {
      imported: 0,
      skipped: 0,
      errors: 0,
    };

    for (const [key, value] of Object.entries(exportData.data)) {
      try {
        // Skip if exists and overwrite is false
        if (!overwrite && this.hasItem(key)) {
          results.skipped++;
          continue;
        }

        this.setItem(key, value, { ttl });
        results.imported++;
      } catch (error) {
        console.error(`Failed to import key ${key}:`, error);
        results.errors++;
      }
    }

    return results;
  }

  // Migration utility
  migrate(fromVersion, toVersion, migrationMap) {
    const keys = this.getKeys();
    let migratedCount = 0;

    keys.forEach(key => {
      const value = this.getItem(key);
      if (value && migrationMap[key]) {
        try {
          const migratedValue = migrationMap[key](value, fromVersion, toVersion);
          this.setItem(key, migratedValue);
          migratedCount++;
        } catch (error) {
          console.error(`Migration failed for key ${key}:`, error);
        }
      }
    });

    return migratedCount;
  }
}

// Storage factory
export const createStorage = (type = STORAGE_TYPES.LOCAL, options = {}) => {
  return new EnhancedStorage(type, options);
};

// Default storage instances for different use cases
export const authStorage = createStorage(STORAGE_TYPES.LOCAL, {
  prefix: 'auth_',
  encryption: true, // Encrypt sensitive auth data
});

export const userStorage = createStorage(STORAGE_TYPES.LOCAL, {
  prefix: 'user_',
  compression: true,
  defaultTtl: 24 * TIME_CONSTANTS.HOUR,
});

export const appStorage = createStorage(STORAGE_TYPES.LOCAL, {
  prefix: 'app_',
  compression: true,
});

export const sessionStorage = createStorage(STORAGE_TYPES.SESSION, {
  prefix: 'session_',
});

export const tempStorage = createStorage(STORAGE_TYPES.MEMORY, {
  prefix: 'temp_',
  defaultTtl: TIME_CONSTANTS.HOUR,
});

// Storage utilities
export const storageUtils = {
  // Check storage availability
  isAvailable: (type = STORAGE_TYPES.LOCAL) => {
    try {
      const storage = type === STORAGE_TYPES.LOCAL ? localStorage : sessionStorage;
      const testKey = '__storage_test__';
      storage.setItem(testKey, 'test');
      storage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  },

  // Get storage size
  getSize: (type = STORAGE_TYPES.LOCAL) => {
    try {
      const storage = type === STORAGE_TYPES.LOCAL ? localStorage : sessionStorage;
      let total = 0;
      
      for (let key in storage) {
        if (storage.hasOwnProperty(key)) {
          total += storage[key].length + key.length;
        }
      }
      
      return total;
    } catch (error) {
      return 0;
    }
  },

  // Format storage size
  formatSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Clear expired items across all storages
  globalCleanup: () => {
    const storages = [authStorage, userStorage, appStorage, sessionStorage];
    let totalCleaned = 0;
    
    storages.forEach(storage => {
      totalCleaned += storage.cleanup();
    });
    
    return totalCleaned;
  },

  // Get global storage statistics
  getGlobalStats: async () => {
    const quota = await getStorageQuota();
    const localSize = storageUtils.getSize(STORAGE_TYPES.LOCAL);
    const sessionSize = storageUtils.getSize(STORAGE_TYPES.SESSION);
    
    return {
      quota,
      localStorage: {
        size: localSize,
        formatted: storageUtils.formatSize(localSize),
      },
      sessionStorage: {
        size: sessionSize,
        formatted: storageUtils.formatSize(sessionSize),
      },
      total: {
        size: localSize + sessionSize,
        formatted: storageUtils.formatSize(localSize + sessionSize),
      },
    };
  },
};

export default {
  EnhancedStorage,
  createStorage,
  authStorage,
  userStorage,
  appStorage,
  sessionStorage,
  tempStorage,
  storageUtils,
  getStorageQuota,
  STORAGE_TYPES,
};
