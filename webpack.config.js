const path = require("path");
const buildPath = path.resolve(__dirname, "dist");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = {
  // https://webpack.js.org/concepts/entry-points/#multi-page-application
  entry: {
    index: './src/index.js',
    registration: './src/registration.js',
    landing_page: './src/landing_page.js',
  },
  // https://webpack.js.org/concepts/output/
  output: {
    filename: "[name].[hash:20].js",
    path: buildPath,
  },

  // https://webpack.js.org/configuration/dev-server/
  devServer: {
    port: 8080,
  },

  module: {
    rules: [
      {
        // scss loader
        test: /\.scss$/,
        use: [
          // MINICSSPLUGIN: generate a style.css file inside dist folder with better performance (not through js). I added the public path because of an error
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "./dist",
            },
          },
          {
            loader: "css-loader",
          },
          {
            loader: "sass-loader",
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
        options: {
          attributes: {
            list: [
              {
                tag: "img",
                attribute: "src",
                type: "src",
              },
            ],
          },
        },
      },
      {
        // fonts loader
        test: /\.(woff|woff2|eot|ttf)$/,
        type: "asset/resource",
      },

      // video
      // images asset/resouce: take all the images and put them to destination folder images
      {
        test: /\.(png|svg|jpg|gif|webp|mp4|webp)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              esModule: false,
              name: "[name].[ext]",
              outputPath: "images/",
              publicPath: "images/",
            },
          },
        ],
      },
    ],
  },

  // https://webpack.js.org/concepts/plugins/
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: true,
      chunks: ["index"],
      filename: "index.html",
    }),
    new HtmlWebpackPlugin({
      template: './src/registration.html',

      inject: true,
      chunks: ["registration"],
      filename: "registration.html",
    }),
    new HtmlWebpackPlugin({
        template: './src/landing_page.html',
        inject: true,
        chunks: ['landing_page'],
        filename: 'landing_page.html'

    }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
      chunkFilename: "[id].[contenthash].css",
    }),
  ],
  // https://webpack.js.org/configuration/optimization/
  optimization: {
    minimize: true,
    minimizer: [new OptimizeCssAssetsPlugin({})],
  },
};
