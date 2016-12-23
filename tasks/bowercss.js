'use strict';

const gulp = require('gulp');
const mainbowerfiles = require('main-bower-files');

module.exports = function (options) {
  return function () {
    var enviroment = 'debug';

    if (!options.debug) {
      enviroment = 'production';
    }

    return gulp.src(
      mainbowerfiles({
        filter: '**/*.css',
        env: enviroment,
        overrides: {
          bootstrap: {
            main: {
              debug: ['./dist/**/bootstrap.css'],
              production: ['./dist/**/bootstrap.min.css']
            }
          }
        },
        debugging: options.debug
      })).pipe(gulp.dest(options.dst));
  };
};
