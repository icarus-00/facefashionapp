const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);


config.resolver = {
    ...config.resolver,
    unstable_enablePackageExports: true,
    unstable_enablePackageExports: false,
};

module.exports = withNativeWind(config, { input: './global.css' });
