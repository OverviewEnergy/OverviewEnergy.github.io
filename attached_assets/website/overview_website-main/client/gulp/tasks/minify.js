const { src, dest, series } = require('gulp');
const plugins = require('gulp-load-plugins')();
const config = require('../config');


function minifyStyles() {
  return src(`${config.outputPath}/${config.cssDirectory}/*.css`)
    .pipe(dest(`${config.outputPath}/${config.cssDirectory}`));
};

function minifyScripts() {
  return src(`${config.outputPath}/${config.jsDirectory}/${config.jsMainFile}.js`)
    .pipe(plugins.terser({
      format: {
        comments: false,
      }
    }))
    .pipe(dest(`${config.outputPath}/${config.jsDirectory}/`));
}

module.exports = series(minifyStyles, minifyScripts);