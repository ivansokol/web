'use strict';

const browserSync = require('browser-sync').create();

module.exports = function(options) {

  return function() {

    browserSync.init(options);

    browserSync.watch(`${options.server.baseDir}/**/*.*`).on('change', browserSync.reload);
  };

};