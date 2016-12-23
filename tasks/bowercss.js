'use strict';

const gulp = require('gulp');
const mainbowerfiles = require('main-bower-files');

module.exports = function (options) {
  return function () {
    var enviroment = 'debug';
    var filtersetting= /\W(?!min)(\w+)\.css/gi;

    if (!options.debug) {
      enviroment = 'production';
      filtersetting= /.*\.min\.css/gi;
    }

    return gulp.src(
      mainbowerfiles({
        filter: filtersetting,
        env: enviroment,
        overrides: {
          bootstrap: {
            main: {
              debug: ['./dist/**/*.css'],
              production: ['./dist/**/*.css']
            }
          },
          tether: {
            main: {
              debug: ['./dist/**/*.css'],
              production: ['./dist/**/*.css']
            }
          }
        },
        debugging: options.debug
      })).pipe(gulp.dest(options.dst));
  };
};
