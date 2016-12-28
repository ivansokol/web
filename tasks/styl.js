'use strict';

const gulp = require('gulp');
const gulpIf = require('gulp-if');
const notify = require('gulp-notify');
const debug = require('gulp-debug');
const sourcemaps = require('gulp-sourcemaps');
const combine = require('stream-combiner2').obj;
const minifyCSS = require('gulp-minify-css');
const stylus = require('gulp-stylus');
const postcss = require('gulp-postcss');
const assets = require('postcss-assets');
const reporter = require('postcss-browser-reporter');
const nested = require('postcss-nested');
const short = require('postcss-short');
const sorting = require('postcss-sorting');
const autoprefixer = require('autoprefixer');
const rev = require('gulp-rev');
const revformat = require('gulp-rev-format');
const filelist = require('gulp-filelist');

//  const stylelint = require('stylelint');
//  const rulesStyles = require('../.stylelintrc.json');


module.exports = function (options) {
  return function () {
    const processors = [
      nested,
      assets,
      short,
      autoprefixer({ browsers: ['last 2 versions'] }),
      sorting({ 'sort-order': 'default' }),
      //  stylelint(rulesStyles),
      reporter({
        selector: 'body:before' })];

    return combine(
        gulp.src(options.src),
        gulpIf(options.debug, debug({ title: 'stylus debug' })),
        gulpIf(options.debug, sourcemaps.init()),
        stylus(),
        postcss(processors),
        gulpIf(!options.debug, combine(
                                      minifyCSS(''),
                                      rev(),
                                      revformat({
                                        prefix: '.',
                                        suffix: '.min',
                                        lastExt: false
                                      })
                                      )),
        gulpIf(options.debug, sourcemaps.write('.')),
        gulpIf(options.debug, debug({ title: 'stylus end' })),
        gulp.dest(options.dst),
        gulpIf('*.css', filelist('css.json', { flatten: true })),
        gulpIf('*.json', gulp.dest(options.manifestpath)))
        .on('error', notify.onError());
  };
};
