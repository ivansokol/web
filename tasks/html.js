'use strict';

const gulp = require('gulp');
const wiredep = require('wiredep').stream;

module.exports = function(options) {
  return function() {
    var min = '.min';
    if (options.debug) {
      min = '';
    }
    return gulp.src(options.src)
        .pipe(wiredep({
          'overrides': {
            'bootstrap': {
              'main': ['./dist/css/*'.concat(min).concat('.css')]
            }
            }
        }))
        .pipe(gulp.dest(options.dst));
  };
};
