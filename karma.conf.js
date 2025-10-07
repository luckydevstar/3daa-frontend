/* eslint-disable global-require */
require('./test/unit/config/setup');
const webpack = require('webpack');
const path = require('path');

const env = process.env.NODE_ENV || 'development';
const brand = process.env.WEB_APP_BRAND || 'wla';
const __DEV__ = env === 'development';
const __TEST__ = env === 'test';
const __STAGING__ = env === 'staging';

module.exports = config => {
  config.set({
    basePath: '',
    frameworks: ['mocha'],
    files: [
      'test/unit/test_index.js',
      {
        pattern: 'test/unit/**/*-test.*',
        included: false,
        served: false
      }
    ],
    plugins: [
      require('karma-babel-preprocessor'),
      require('karma-chrome-launcher'),
      require('karma-mocha'),
      require('karma-mocha-reporter'),
      require('karma-sourcemap-loader'),
      require('karma-webpack'),
      require('karma-phantomjs-launcher'),
      require('karma-teamcity-reporter')
    ],
    preprocessors: {
      'src/**/*.spec.js': ['webpack', 'sourcemap'],
      'test/unit/test_index.js': ['webpack', 'sourcemap'],
      'test/unit/config/setup.js': ['webpack', 'sourcemap']
    },
    webpack: {
      externals: {
        'react/addons': true,
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true
      },
      resolve: {
        alias: {
          app: path.resolve(__dirname, './src/app/'),
          images: path.resolve(__dirname, './src/assets/images/'),
          videos: path.resolve(__dirname, './src/assets/videos/'),
          brand: path.resolve(__dirname, `./src/brands/${brand}`)
        }
      },
      module: {
        loaders: [
          {
            test: /\.jsx?$/,
            exclude: /(node_modules|public)/,
            loader: 'babel-loader'
          },
          {
            test: /\.mp4?$/,
            exclude: /(node_modules|public)/,
            loader: 'file-loader'
          },
          {
            test: /\.json$/,
            loader: 'json-loader'
          },
          {
            test: /\.(css|scss|md)$/,
            loader: 'ignore-loader'
          },
          {
            test: /\.svg$/,
            loader: 'svg-inline-loader'
          }
        ],
        noParse: [/.+zone\.js\/dist\/.+/]
      },
      devtool: config.singleRun ? null : 'inline-source-map',
      plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(env),
          __DEV__,
          __TEST__,
          __STAGING__
        })
      ]
    },
    browserConsoleLogOptions: {
      terminal: true,
      level: ''
    },
    phantomjsLauncher: {
      // Have phantomjs exit if a ResourceError is encountered (useful if karma exits without killing phantom)
      exitOnResourceError: true
    },
    singleRun: true,
    reporters: ['teamcity'],
    port: 9876,
    colors: true,
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,
    browsers: ['PhantomJS'],
    concurrency: Infinity
  });
};
