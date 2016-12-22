'use strict';

const gulp = require('gulp');

module.exports = function (options) {
  return function () {
    const watch = function () {
      for (var i in $.watch) {
        gulp.watch($.watch[i], gulp.series(i)); }
    };
    return watch();
  };
};
