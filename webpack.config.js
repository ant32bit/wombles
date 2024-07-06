const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        renderer: './build/src/renderer.js' 
    },
    output: {
        path: path.resolve(__dirname, 'build', 'bundles'),
        filename: '[name].js'
    },
    resolve: {
        fallback: {
            path: require.resolve( 'path-browserify' ),
            fs: false,
        },
    },

};