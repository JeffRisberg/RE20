const nodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

const paths = require('./paths');
const regex = require('./regex');

module.exports = {
  entry: {
    index: paths.serverEntry,
  },

  output: {
    filename: '[name].js',
    path: paths.outputDir,
  },

  resolve: {
    extensions: ['.js', '.json'],
    modules: [paths.srcDir, paths.node_modules],
  },

  context: paths.srcDir,

  target: 'node',

  externals: [nodeExternals({
    whitelist: [
      // Modules that should be transpiled by Webpack
      /^@jg\/(icons|components|styles)/,

      // Modules that need to run inside of the Webpack context
      /react-loadable/,
      /webpack-flush-chunks/,
    ],
  })],

  node: {
    console: false,
    global: false,
    process: false,
    __filename: false,
    __dirname: false,
    Buffer: false,
    setImmediate: false,
  },

  module: {
    rules: [
      {
        test: regex.js,
        use: 'babel-loader',
      },
      {
        test: regex.svg,
        use: 'svg-inline-loader',
      },
    ],
  },

  plugins: [
    new CopyWebpackPlugin([
      { from: paths.publicDir, to: paths.staticDir, toType: 'dir' },
    ]),
    new webpack.DefinePlugin({
      __SERVER__: true,
    }),
    new webpack.IgnorePlugin(/dev-server/),
    new webpack.IgnorePlugin(regex.image),
    new webpack.IgnorePlugin(regex.font),
  ],
};
