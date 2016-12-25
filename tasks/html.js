'use strict';

const gulp = require('gulp');
const wiredep = require('wiredep').stream;
const revreplace = require('gulp-rev-replace');
const gulpIf = require('gulp-if');
const combine = require('stream-combiner2').obj;
const inject = require('gulp-inject');


module.exports = function(options) {
  return function() {
    var ignore = options.debug ? [ /.*\.min\.css/,  /.*\.min\.js/] : [/\W(?!min)(\w+)\.css/, /\W(?!min)(\w+)\.js/];

    var injectOptions = {
      addRootSlash: false,
      ignorePath: ['www']
    };

    var injectFiles = gulp.src(options.dst.concat('css/*.css'), {read: false});

    return combine(
            gulp.src(options.src),
            inject(injectFiles, injectOptions),
            wiredep({
              exclude: ignore
            }),
            gulpIf(!options.debug, combine(
              revreplace({
              manifest: gulp.src(options.manifestpath.concat('css.json'), {allowEmpty: true }) }),
              revreplace({
                manifest: gulp.src(options.manifestpath.concat('bower-rev.json'), {allowEmpty: true }) })
            )),
            gulp.dest(options.dst)
          );
  };
};
