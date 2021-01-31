const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require('path');

const config = {
    entry: './public/assets/js/index.js',
    output: {
        path: __dirname + '/public/dist',
        filename: 'bundle.js'
    },
    mode: 'production',
    module: {
        rules: [{
            test: /\.m?js$/,
            exclude: /(node_modules)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        }]
    },
    plugins: [
        new WebpackPwaManifest({
            publicPath: '/dist',
            filename: 'manifest.webmanifest',
            inject: false,
            fingerprints: false,
            name: 'Follow Your Money',
            short_name: 'Follow Your Money',
            theme_color: '#bcb8b1',
            background_color: '#bcb8b1',
            start_url: '/',
            display: 'standalone',
            icons: [
                {
                    src: path.resolve(
                        __dirname,
                        'public/assets/images/icons/icon-512x512.png'
                    ),
                    size: [72, 96, 128, 144, 152, 192, 384, 512]
                }
            ]
        })
    ]
};
module.exports = config;