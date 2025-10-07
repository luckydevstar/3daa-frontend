const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const SRC = path.resolve(__dirname, 'src');
const OUTPUT = path.resolve(__dirname, 'www');

const env = process.env.NODE_ENV || 'development';
const brand = process.env.WEB_APP_BRAND || 'wla';

const extractSass = new ExtractTextPlugin({
  filename: 'assets/styles.css',
  disable: env === 'development'
});

const __DEV__ = env === 'development';
const __TEST__ = env === 'test';
const __STAGING__ = env === 'staging';
const __PROD__ = env === 'production';

module.exports = {
  watch: __DEV__,
  devtool: __DEV__ ? 'cheap-module-source-map' : false,
  cache: true,
  entry: {
    main: ['./src/main']
  },
  output: {
    path: OUTPUT,
    publicPath: '/',
    filename: 'assets/js/[name].bundle.js',
    chunkFilename: 'assets/js/[id].bundle.js'
  },
  resolve: {
    alias: {
      app: path.resolve(__dirname, './src/app/'),
      images: path.resolve(__dirname, './src/assets/images/'),
      videos: path.resolve(__dirname, './src/assets/videos/'),
      brand: path.resolve(__dirname, `./src/brands/${brand}`)
    },
    extensions: ['.js']
  },
  externals: {
    cheerio: 'window',
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true
  },
  /**
   * Plugins
   */
  plugins: [
    extractSass,
    /**
     * Uncomment for module overview.
     */
    // new BundleAnalyzerPlugin(),
    new CopyWebpackPlugin(
      [
        {
          from: 'src/assets/images/illustrations',
          to: 'assets/images/illustrations'
        },
        {
          from: `src/brands/${brand}/images`,
          to: 'assets/images'
        },
        {
          from: `src/brands/${brand}/videos`,
          to: 'assets/videos'
        },
        {
          from: `src/.htaccess`,
          to: '.htaccess',
          toType: 'file'
        }
      ],
      {
        copyUnmodified: true
      }
    ),

    new HtmlWebpackPlugin({
      template: `${SRC}/index.html`,
      filename: 'index.html',
      inject: 'body'
    }),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
      __DEV__,
      __TEST__,
      __STAGING__,
      __PROD__
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'assets/js/vendor.bundle.js'
    }),

    ...(__PROD__
      ? [
          // new webpack.optimize.UglifyJsPlugin({
          //   compress: {
          //     warnings: false,
          //     screw_ie8: true
          //   },
          //   comments: false,
          //   sourceMap: false
          // })
          new UglifyJsPlugin({
            sourceMap: false,
            extractComments: true,
            uglifyOptions: {
              ie8: false
            }
          })
        ]
      : [])
  ],
  /**
   * DEV SERVER SETUP
   */
  devServer: {
    contentBase: OUTPUT,
    historyApiFallback: true,
    noInfo: true,
    port: process.env.PORT || '3000',
    host: process.env.HOST || '127.0.0.1'
  },
  module: {
    /**
     * LOADERS
     */
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|public)/,
        loader: 'babel-loader'
      },
      { test: /\.json$/, loader: 'json-loader' },
      {
        test: /\.scss$/,
        loader: extractSass.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true
              }
            },
            {
              loader: 'postcss-loader'
            },
            {
              loader: 'sass-loader'
            }
          ],
          // use style-loader in development
          fallback: 'style-loader'
        })
      },
      {
        test: /\.css$/,
        loader: extractSass.extract({
          use: [
            {
              loader: 'css-loader'
            },
            {
              loader: 'postcss-loader'
            }
          ],
          // use style-loader in development
          fallback: 'style-loader'
        })
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&minetype=application/font-woff'
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        exclude: /node_modules/,
        loader: 'file-loader?name=assets/styles/[name].[ext]'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        exclude: /node_modules/,
        loader:
          'url-loader?limit=10000&name=assets/styles/[name].[ext]&mimetype=application/octet-stream'
      },
      {
        test: /\.otf(\?v=\d+\.\d+\.\d+)?$/,
        exclude: /node_modules/,
        loader:
          'url-loader?limit=10000&name=assets/styles/[name].[ext]&mimetype=application/octet-stream'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        exclude: /node_modules/,
        loader:
          'url-loader?limit=10000&name=assets/styles/[name].[ext]&mimetype=image/svg+xml'
      },
      {
        test: /\.gif/,
        exclude: /node_modules/,
        loader:
          'url-loader?limit=10000&name=assets/styles/[name].[ext]&mimetype=image/gif'
      },
      {
        test: /\.jpg/,
        exclude: /node_modules/,
        loader:
          'url-loader?limit=10000&name=assets/styles/[name].[ext]&mimetype=image/jpg'
      },
      {
        test: /\.mp4/,
        exclude: /node_modules/,
        loader:
          'url-loader?limit=10000&name=assets/styles/[name].[ext]&mimetype=video/mp4'
      },
      {
        test: /\.png/,
        exclude: /node_modules/,
        loader:
          'url-loader?limit=10000&name=assets/styles/[name].[ext]&mimetype=image/png'
      },
      {
        test: /\.html$/,
        loader: 'raw-loader?minimize=false'
      }
    ],
    noParse: [/.+zone\.js\/dist\/.+/]
  },
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};
