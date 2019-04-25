const path = require('path');
const htmlPlugin = require('html-webpack-plugin');

const outPath = path.join(__dirname, '/out');

module.exports = {
    mode: 'development',
    entry: {
        main: './src/index.js'
    },
    output: {
        filename: 'bundle.js',
        sourceMapFilename: 'bundle.js.map',
        path: outPath
    },
    resolve: {
        modules: [path.resolve('./src'), path.resolve('./node_modules')]
    },
    module: {
        rules: [
            {
                test: /\.worker\.js$/,
                use: {loader: 'worker-loader'}
            },
            {
                test: /\.glsl/,
                use: 'raw-loader'
            }
        ]
    },
    plugins: [new htmlPlugin({template: 'index.html'})]
};
