const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add node module polyfills
config.resolver.extraNodeModules = {
  stream: require.resolve('stream-browserify'),
  _stream_duplex: require.resolve('readable-stream/lib/_stream_duplex'),
  _stream_passthrough: require.resolve('readable-stream/lib/_stream_passthrough'),
  _stream_readable: require.resolve('readable-stream/lib/_stream_readable'),
  _stream_transform: require.resolve('readable-stream/lib/_stream_transform'),
  _stream_writable: require.resolve('readable-stream/lib/_stream_writable'),
  https: require.resolve('https-browserify'),
  http: require.resolve('stream-http'),
  fs: require.resolve('empty-module'), // Safe alternative - won't try to access the filesystem
  net: require.resolve('react-native-tcp'),
  tls: require.resolve('tls-browserify'),
  crypto: require.resolve('react-native-crypto'),
  url: require.resolve('react-native-url-polyfill'),
  zlib: require.resolve('browserify-zlib'),
  assert: require.resolve('assert'),
  os: require.resolve('os-browserify/browser'),
  // Use our custom WebSocket polyfill instead of ws
  ws: path.resolve(__dirname, 'websocket-polyfill.js'),
};

module.exports = withNativeWind(config, { input: './global.css' });
