'use strict';

const browserSync = require('browser-sync').create();

module.exports = function(options) {

  return function() {

    browserSync.init(options.config);

    browserSync.watch(`${options.config.server.baseDir}/**/*.*`).on('change', browserSync.reload);
  };

};