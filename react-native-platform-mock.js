/**
 * Complete mock implementation for React Native's Platform module
 * This will replace the native Platform module that's causing the PlatformConstants error
 */

// Detect environment
const isWeb = typeof window !== 'undefined';
const isAndroid = typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent);
const isIOS = typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent);

// Define OS
const OS = isWeb ? 'web' : (isIOS ? 'ios' : 'android');

// Create a comprehensive mock Platform implementation
const Platform = {
  // Basic platform detection
  OS: OS,
  
  // Version information
  Version: isWeb ? (typeof navigator !== 'undefined' ? parseInt(navigator.appVersion, 10) : 1) : 1,
  
  // Device type detection
  isPad: isIOS && typeof navigator !== 'undefined' && navigator.userAgent.includes('iPad'),
  isTV: false,
  
  // Testing flag
  isTesting: false,
  
  // Select method for platform-specific code
  select: function(obj) {
    if (!obj) return null;
    
    // Check for exact platform match
    if (obj[Platform.OS]) {
      return obj[Platform.OS];
    }
    
    // Check for 'native' key if on a native platform
    if ((Platform.OS === 'ios' || Platform.OS === 'android') && obj.native) {
      return obj.native;
    }
    
    // Fall back to 'default' or first available option
    return obj.default || obj.web || Object.values(obj)[0];
  },
  
  // Constants that would normally come from native code
  constants: {
    isTesting: false,
    reactNativeVersion: {
      major: 0,
      minor: 72,
      patch: 0,
    },
    Version: 1,
    Release: '1.0',
    Serial: '1',
    Manufacturer: 'unknown',
    Model: 'unknown',
    Brand: 'unknown',
    uiMode: 'normal',
    forceTouchAvailable: false,
    osVersion: '1.0',
    systemName: OS,
    interfaceIdiom: isWeb ? 'web' : 'phone',
  },
  
  // PlatformConstants mock to prevent the error
  PlatformConstants: {
    isTesting: false,
    reactNativeVersion: {
      major: 0,
      minor: 72,
      patch: 0,
    },
    forceTouchAvailable: false,
    osVersion: '1.0',
    systemName: isWeb ? 'web' : (isIOS ? 'iOS' : 'Android'),
    interfaceIdiom: isWeb ? 'web' : 'phone',
  }
};

// Export the mock Platform
module.exports = Platform;

// If we're in a global context, attach to global/window
if (typeof global !== 'undefined') {
  if (!global.ReactNative) {
    global.ReactNative = {};
  }
  global.ReactNative.Platform = Platform;
  global.Platform = Platform;
}

if (typeof window !== 'undefined') {
  window.Platform = Platform;
}
