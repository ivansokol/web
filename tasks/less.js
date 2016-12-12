'use strict';

const gulp = require('gulp');
const gulpIf = require('gulp-if');
const notify = require('gulp-notify');
const debug = require('gulp-debug');
const sourcemaps = require('gulp-sourcemaps');
const combine = require('stream-combiner2').obj;
const csslint = require('gulp-csslint');
const autoprefixer = require('gulp-autoprefixer');
const minifyCSS = require('gulp-minify-css');
const rename = require('gulp-rename');
const csscomb = require('gulp-csscomb');
const less = require('gulp-less');



module.exports = function(options) {

  return function() {
    return combine(
        gulp.src(options.src),
        gulpIf(options.debug, debug({title: 'less debug'})),
        gulpIf(options.debug, sourcemaps.init()),
        less(),
        autoprefixer({browsers: ['last 2 versions']}),
        csscomb(),
        csslint(),
        csslint.formatter(),
        //csslint.formatter('fail'),
        gulpIf(!options.debug, minifyCSS('')),
        gulpIf(!options.debug, rename({suffix: '.min'})),
        gulpIf(options.debug, sourcemaps.write()),
        gulp.dest(options.dst)
    ).on('error', notify.onError());
  };

}; 