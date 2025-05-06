// Custom entry point for RenderWear app
// This file loads polyfills before the main app code

// Load the WebSocket polyfill first
require('./websocket-polyfill');

// Load the global Platform object
require('./global-platform');

// Then load the original entry point
module.exports = require('expo-router/entry');
