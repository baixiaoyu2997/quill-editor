const Path = require("path");
const Webpack = require("webpack");
const { merge } = require("webpack-merge");
const StylelintPlugin = require("stylelint-webpack-plugin");

const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  target:'web',
  devtool: "eval-cheap-module-source-map",
  output: {
    chunkFilename: "js/[name].chunk.js",
  },
  devServer: {
    open: true,
    hot: true,
    host: "0.0.0.0",
    useLocalIp: true,
    stats: "errors-only",
  },
  plugins: [
    new Webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development"),
      'process.env.TEST_ENV': JSON.stringify(process.env.TEST_ENV),
    }),
    // new StylelintPlugin({
    //   files: Path.join('src', '**/*.s?(a|c)ss')
    // })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: Path.resolve(__dirname, "../src"),
        enforce: "pre",
        loader: "eslint-loader",
        options: {
          emitWarning: true,
        },
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.js$/,
        include: Path.resolve(__dirname, "../src"),
        loader: "babel-loader",
      },
      {
        test: /\.s?css/i,
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader",
        ],
      },
    ],
  },
});
