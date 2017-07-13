const webpack = require('webpack');
const Merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
//const StatsPlugin = require('stats-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');

const paths = require('./paths');
const CommonConfig = require('./webpack.common.js');

module.exports = Merge(CommonConfig, {

    entry: {
        main: paths.clientEntry,
    },

    output: {
        filename: 'js/[name].[chunkhash].bundle.js',
    },

    devtool: 'source-map',

    // TODO remove this later
    // Mocked for jsonwebtoken package client-side
    node: {
        dns: 'mock',
        net: 'mock',
    },

    plugins: [
        new webpack.NamedModulesPlugin(),

        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
        }),

        new webpack.DefinePlugin({
            __SERVER__: false,
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
            },
        }),

        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            beautify: false,
            mangle: {
                screw_ie8: true,
                keep_fnames: true,
            },
            compress: {
                screw_ie8: true,
                warnings: false,
            },
            comments: false,
        }),

        new ExtractTextPlugin('css/[name].[chunkhash].css'),

        // implicit commons `vendor` chunk
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            // this assumes your vendor imports exist in the node_modules directory
            minChunks: (module) => module.context && module.context.includes('node_modules'),
        }),

        // CommonChunksPlugin will now extract all the common modules from vendor and main bundles
        new webpack.optimize.CommonsChunkPlugin({
            // but since there are no more common modules between them we end up with just the runtime
            // code included in the bootstrap file
            name: 'bootstrap',
            minChunks: Infinity,
        }),

        //new StatsPlugin('../stats.json'),

        new BundleAnalyzerPlugin({
            analyzerMode: 'disabled',
        }),

        new DuplicatePackageCheckerPlugin(),

        // Ignore server logger
        new webpack.IgnorePlugin(/server/, /logger/),
    ],
});
