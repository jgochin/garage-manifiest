const path = require('path');

module.exports = {
    webpack: {
        alias: {
            '@app': path.resolve(__dirname, 'src/components'),
            // '@shared': path.resolve(__dirname, 'src/components/shared'),
            // '@api': path.resolve(__dirname, 'src/api'),
            // '@css': path.resolve(__dirname, 'src/rta-scss'),
            // '@auth': path.resolve(__dirname, 'src/components/AuthProvider'),
            // Add any other aliases you need here
        },
    },
};
