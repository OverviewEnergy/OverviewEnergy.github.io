// NPM
const { series, parallel, watch, src } = require('gulp');
const browserSync = require('browser-sync').create();

// Config
const config = require('./client/gulp/config');

// Tasks
const stylesheets = require('./client/gulp/tasks/stylesheets');
const webpackMain = require('./client/gulp/tasks/webpackMain');
const minify = require('./client/gulp/tasks/minify');

function watchers(cb) {
  browserSync.init({
    proxy: 'overview.ddev.site',
    https: false,
    open: false,
    ghostMode: false,
    notify: false
  });

  // Watch Styles and compile
  watch(`${config.sourcePath}/${config.cssDirectory}/**/*.{styl,sass,scss,css,postcss}`, series(stylesheets));

  // Watch JS and compile. JS only, not JSX (React)
  watch(`${config.sourcePath}/${config.jsDirectory}/**/*.js`, { cwd: './' }, series(webpackMain));

  // Reload JS in browser... only for main.js
  watch(`${config.publicPath}/assets/js/main.js`, { cwd: './' }).on('change', browserSync.reload);

  // Recompile Styles when saving JSX
  watch(`${config.sourcePath}/${config.jsDirectory}/**/*.jsx`, { cwd: './' }).on('change', () => {
    // Run stylesheets so Tailwind can grab new classes from templates
    series(stylesheets)();
  });

  // Reload templates in browser
  watch('templates/**/*', { cwd: './' }).on('change', () => {
    // Run stylesheets so Tailwind can grab new classes from templates
    series(stylesheets)();

    // Reload the browser
    browserSync.reload();
  });

  watch(`${config.publicPath}/assets/**/*.css`, { cwd: './' }).on('change', (x) => {
    src(`./${config.publicPath}/assets/**/*.css`).pipe(browserSync.stream());
  });

  cb();
}

const dev = series(stylesheets, webpackMain, parallel(watchers));
const build = series(stylesheets, webpackMain, minify);

exports.dev = dev;
exports.stylesheets = stylesheets;
exports.webpackMain = webpackMain;
exports.build = build;
exports.default = dev;