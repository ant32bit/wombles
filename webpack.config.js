const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        internal: './dist/transpiled/src/internal.js',
        console: './dist/transpiled/src/console.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    }
};
