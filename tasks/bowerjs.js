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
        env: enviroment,
        overrides: {
          bootstrap: {
            main: {
              debug: ['./dist/js/bootstrap.js'],
              production: ['./dist/js/bootstrap.min.js']
            }
          },
          jquery: {
            main: {
              debug: ['./dist/jquery.js'],
              production: ['./dist/jquery.min.js']
            }
          },
          angular: {
            main: {
              debug: ['./angular.js'],
              production: ['./angular.min.js']
            }
          },
          'angular-ui-router': {
            main: {
              debug: ['./release/angular-ui-router.js'],
              production: ['./release/angular-ui-router.min.js']
            }
          },
          tether: {
            main: {
              debug: ['./dist/js/tether.js'],
              production: ['./dist/js/tether.min.js']
            }
          }
        },
        debugging: options.debug
      })).pipe(gulp.dest(options.dst));
  };
};
