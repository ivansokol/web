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
        filter: '**/*.js',
        env: enviroment,
        overrides: {
          bootstrap: {
            main: {
              debug: ['./dist/**/bootstrap.js'],
              production: ['./dist/**/bootstrap.min.js']
            }
          }
        },
        debugging: options.debug
      })).pipe(gulp.dest(options.dst));
  };
};
