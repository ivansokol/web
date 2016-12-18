'use strict';

const gulp = require('gulp');
const gulpIf = require('gulp-if');
const notify = require('gulp-notify');
const debug = require('gulp-debug');
const sourcemaps = require('gulp-sourcemaps');
const combine = require('stream-combiner2').obj;
const rename = require('gulp-rename');
const eslint = require('gulp-eslint');
const rulesEslint = require('../.eslintrc.json');

module.exports = function(options) {
  return function() {
    return combine(
      gulp.src(options.src),
      gulpIf(options.debug, debug({ title: 'js debug'})),
      gulpIf(options.debug, sourcemaps.init()),
      eslint(rulesEslint),
      eslint.format(),
      eslint.failAfterError(),
      gulpIf(!options.debug, rename({ suffix: '.min' })),
      gulpIf(options.debug, sourcemaps.write()),
      gulp.dest(options.dst)).on('error', notify.onError({
        message: 'There is a JS error, please look the console for details' }));
  };

};
