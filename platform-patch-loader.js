/**
 * This file patches the React Native Platform module at the module level
 * to prevent the PlatformConstants error
 */

// Load our mock implementation
const PlatformMock = require('./react-native-platform-mock');

// Store the original require function
const originalRequire = module.constructor.prototype.require;

// Override the require function to intercept React Native Platform imports
module.constructor.prototype.require = function(path) {
  // Check if the requested module is the React Native Platform module
  if (path === 'react-native/Libraries/Utilities/Platform' || 
      path === 'react-native/Libraries/Utilities/Platform.js' ||
      path === 'react-native/Libraries/Utilities/PlatformIOS' ||
      path === 'react-native/Libraries/Utilities/PlatformAndroid' ||
      path === 'react-native/Libraries/Components/Touchable/Platform' ||
      path === 'Platform' ||
      path === 'react-native/Libraries/Components/Touchable/Platform.android' ||
      path === 'react-native/Libraries/Components/Touchable/Platform.ios' ||
      path === 'react-native/Libraries/StyleSheet/PlatformColorValueTypes') {
    // Return our mock implementation instead
    return PlatformMock;
  }
  
  // For all other modules, use the original require
  return originalRequire.call(this, path);
};

// Ensure our Platform mock is available globally
global.Platform = PlatformMock;
if (!global.ReactNative) {
  global.ReactNative = {};
}
global.ReactNative.Platform = PlatformMock;

// Log that our patch was applied
console.log('React Native Platform module patched successfully');

// Export our mock for direct use
module.exports = PlatformMock;
