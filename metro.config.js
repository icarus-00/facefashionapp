const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);


config.resolver = {
    ...config.resolver,
    unstable_enablePackageExports: true,
    unstable_enablePackageExports: false,
};

module.exports = withNativeWind(config, { input: './global.css' });
>>>>>>> 1f8269efac2356a6a9cf697b823029dd810d29bf
