const gulp = require('gulp');
const webpack = require('webpack');
const plugins = require('gulp-load-plugins')();
const webpackConfig = require('../webpack-main.config');
const log = require('fancy-log');

function webpackMain(cb) {
  webpack(webpackConfig, (err, stats) => {
    if (err) {
      throw new plugins.util.PluginError('webpack', err);
    }

    log('[webpack]', stats.toString({
      colors: true,
      builtAt: false,
      version: false,
      chunks: false,
      assets: false,
      hash: false,
      modules: false,
      entrypoints: false
    }));

    cb();
  })
}

module.exports = webpackMain;