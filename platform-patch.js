// platform-patch.js
// This file provides a global patch for React Native's Platform module
// to fix the PlatformConstants error

// Detect if we're in a web environment
const isWeb = typeof window !== 'undefined' && typeof navigator !== 'undefined';
const isNative = typeof navigator !== 'undefined' && navigator.product === 'ReactNative';

// Create a simple Platform object that can be used throughout the app
const Platform = {
  OS: isWeb ? 'web' : (isNative ? (typeof navigator.userAgent === 'string' && navigator.userAgent.includes('iPhone') ? 'ios' : 'android') : 'web'),
  select: function(obj) {
    if (obj[this.OS]) {
      return obj[this.OS];
    }
    
    if ((this.OS === 'ios' || this.OS === 'android') && obj.native) {
      return obj.native;
    }
    
    return obj.default || obj.web || Object.values(obj)[0];
  }
};

// Apply the patch globally
if (typeof global !== 'undefined') {
  // For React Native environments
  if (!global.ReactNative) {
    global.ReactNative = {};
  }
  
  if (!global.ReactNative.Platform) {
    global.ReactNative.Platform = Platform;
  }
  
  // Ensure Platform is available globally
  global.Platform = Platform;
}

// For web environments
if (typeof window !== 'undefined') {
  window.Platform = Platform;
}

// Export the Platform object
module.exports = Platform;
