const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const config = {
    resolver: {
        extraNodeModules: {
            crypto: require.resolve('react-native-crypto'),
            process: require.resolve('process/browser'),
            stream: require.resolve('stream-browserify'),
            buffer: require.resolve('buffer'),
            'readable-stream': require.resolve('readable-stream'),
        },
    },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
