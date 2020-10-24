const Webpack = require('webpack');
const Path = require("path");
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default;
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  // devtool: 'source-map',
  stats: 'errors-only',
  bail: true,
  output: {
    filename: 'js/[name].[chunkhash:8].js',
    chunkFilename: 'js/[name].[chunkhash:8].chunk.js',
  },
  plugins: [
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new MiniCssExtractPlugin({
      filename: 'bundle.css',
    }),
    new HtmlWebpackPlugin({
      inlineSource: ".(js)$",
      template: Path.resolve(__dirname, "../src/index.html"),
    }),
    new HTMLInlineCSSWebpackPlugin(),
    new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin)
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.s?css/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
      },
    ],
  },
});
