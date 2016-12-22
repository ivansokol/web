'use strict';

const browserSync = require('browser-sync').create();

module.exports = function (options) {
  return function () {
    const path = options.config.server.baseDir.concat('/**/*.*');

    browserSync.init(options.config);
    browserSync.watch(path).on('change', browserSync.reload);
  };
};
