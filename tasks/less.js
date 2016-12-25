'use strict';

const gulp = require('gulp');
const gulpIf = require('gulp-if');
const notify = require('gulp-notify');
const debug = require('gulp-debug');
const sourcemaps = require('gulp-sourcemaps');
const combine = require('stream-combiner2').obj;
const minifyCSS = require('gulp-minify-css');
const less = require('gulp-less');
const assets = require('postcss-assets');
const postcss = require('gulp-postcss');
const reporter = require('postcss-browser-reporter');
const nested = require('postcss-nested');
const short = require('postcss-short');
const sorting = require('postcss-sorting');
const autoprefixer = require('autoprefixer');
const rev = require('gulp-rev');
const revformat = require('gulp-rev-format');

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
        gulpIf(options.debug, debug({ title: 'less debug' })),
        gulpIf(options.debug, sourcemaps.init()),
        less(),
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
        gulpIf(options.debug, sourcemaps.write()),
        gulp.dest(options.dst),
        gulpIf(!options.debug, combine(rev.manifest('css.json'),
                                      gulp.dest(options.manifestpath))))
        .on('error', notify.onError());
  };
};
