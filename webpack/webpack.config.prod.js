const Webpack = require('webpack')
const Path = require('path')
const { merge } = require('webpack-merge')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HTMLInlineCSSWebpackPlugin = require('html-inline-css-webpack-plugin')
  .default
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const common = require('./webpack.common.js')
module.exports = merge(common, {
  mode: 'production',
  devtool: 'cheap-module-source-map',
  stats: 'errors-only',
  bail: true,
  entry: {
    light: '/entry/light.js',
    dark: '/entry/dark.js'
  },
  output: {
    filename: 'js/[name].[chunkhash:8].js',
    chunkFilename: 'js/[name].[chunkhash:8].chunk.js'
  },
  plugins: [
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.TEST_ENV': JSON.stringify(process.env.TEST_ENV)
    }),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      filename: 'light.html',
      chunks: ['light'],
      inlineSource: '.(js)$',
      template: Path.resolve(__dirname, '../src/index.html')
    }),
    new HtmlWebpackPlugin({
      filename: 'dark.html',
      chunks: ['dark'],
      inlineSource: '.(js)$',
      template: Path.resolve(__dirname, '../src/index.html')
    }),
    new HTMLInlineCSSWebpackPlugin(),
    new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin)
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.s?css/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true }
            }
          ]
        }
      }),
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false
          }
        },
        extractComments: false
      })
    ]
  }
})
