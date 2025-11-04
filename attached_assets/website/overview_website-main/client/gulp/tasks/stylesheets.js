const { src, dest } = require('gulp');
const config = require('../config');
const plugins = require('gulp-load-plugins')();
const gulpPostcss = require('gulp-postcss');
const scss = require('postcss-scss');
const nested = require('postcss-nested');
const tailwindPostcss = require('@tailwindcss/postcss');
const tailwindNesting = require('@tailwindcss/nesting');

const postcssPlugins = [
  tailwindPostcss(),
  tailwindNesting(nested)
];

const postcssOptions = {
  syntax: scss
}

function stylesheets(cb) {
  return src([`${config.sourcePath}/${config.cssDirectory}/${config.cssMainFile}.postcss`])
    .pipe(plugins.plumber())
    .pipe(gulpPostcss(postcssPlugins, postcssOptions))
    .on('error', cb)
    .pipe(plugins.rename('main.css'))
    .pipe(dest(`${config.outputPath}/${config.cssDirectory}`))
  cb();
}

module.exports = stylesheets;
