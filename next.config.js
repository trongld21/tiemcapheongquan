/** @type {import('next').NextConfig} */
const webpack = require('webpack');
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: [
            'icons.veryicon.com',
            'static.vecteezy.com',
            'firebasestorage.googleapis.com',
            'img.freepik.com',
            'media.formula1.com',
        ],
    },
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        config.plugins.push(
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                'window.jQuery': 'jquery',
            }),
        );
        return config;
    },
};

module.exports = nextConfig;
