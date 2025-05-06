// platform-polyfill.js
// This file provides a mock implementation for React Native's Platform module
// to fix the PlatformConstants error

// Mock OS information
const OS = {
  ios: false,
  android: false,
  web: true,
  windows: false,
  macos: false,
  native: false
};

// Detect platform if possible
if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
  OS.native = true;
  
  // Try to detect platform from user agent or other means
  if (typeof navigator.userAgent === 'string') {
    if (navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad')) {
      OS.ios = true;
    } else if (navigator.userAgent.includes('Android')) {
      OS.android = true;
    }
  }
} else if (typeof window !== 'undefined') {
  OS.web = true;
}

// Mock Platform module
const Platform = {
  OS: 'web', // Default to web
  Version: 1,
  isPad: false,
  isTV: false,
  isTesting: false,
  select: function(obj) {
    const keys = Object.keys(obj);
    
    // Check for exact platform match
    if (obj[Platform.OS]) {
      return obj[Platform.OS];
    }
    
    // Check for 'native' key if on a native platform
    if ((OS.ios || OS.android) && obj.native) {
      return obj.native;
    }
    
    // Fall back to 'default' or first available option
    return obj.default || obj[keys[0]];
  }
};

// Export the mock Platform module
module.exports = Platform;
