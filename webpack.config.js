const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const path = require("path");
const glob = require("glob");

const PATHS = {
  src: path.join(__dirname, "src"),
};

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  target: "web",
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    // contentBase: './dist',
    hot: true,
  },
  externals: {
    Quill: "Quill",
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        exclude: "**/quill.core.js",
        terserOptions: {
          mangle: false,
          compress: {
            drop_console: true,
          },
          output: {
            comments: false,
          },
        },
        extractComments: false,
      }),
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            "advanced",
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
      "...",
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({ template: "./index.html" }),
    new MiniCssExtractPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "./src/assets/js/quill.core.js"),
        }, // 打包后静态文件放置位置
      ],
    }),
  ],
};
