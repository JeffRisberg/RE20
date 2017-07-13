const ExtractTextPlugin = require('extract-text-webpack-plugin');

const paths = require('./paths');
const regex = require('./regex');

module.exports = {
  entry: {
  },

  output: {
    path: paths.staticDir,
    publicPath: paths.publicPath,
  },

  resolve: {
    extensions: ['.js', '.json'],
    modules: [paths.srcDir, paths.node_modules],
  },

  context: paths.srcDir,

  module: {
    rules: [
      {
        test: regex.js,
        use: 'babel-loader',
      },
      {
        test: regex.sass,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: { sourceMap: true },
            },
            'resolve-url-loader',
            {
              loader: 'sass-loader',
              options: { sourceMap: true },
            },
          ],
        }),
      },
      {
        test: regex.svg,
        issuer: regex.js,
        use: 'svg-inline-loader',
      },
      {
        test: regex.svg,
        issuer: regex.sass,
        use: 'url-loader',
      },
      {
        test: regex.image,
        use: 'file-loader',
      },
      {
        test: regex.font,
        use: {
          loader: 'url-loader',
          options: {
            limit: 100000,
          },
        },
      },
    ],
  },
};
