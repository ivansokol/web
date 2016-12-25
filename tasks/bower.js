'use strict';

const gulp = require('gulp');
const mainbowerfiles = require('main-bower-files');
const gulpIf = require('gulp-if');
const debug = require('gulp-debug');
const combine = require('stream-combiner2').obj;
const rev = require('gulp-rev');
const revformat = require('gulp-rev-format');
const filter = require('gulp-filter');

module.exports = function (options) {
  return function () {
    var cssjsFilter = !options.debug ? filter("**/*.min.{css,js}") : filter(['**/*.{css,js,map}', '!**/*.min.*']);
    var cssFilter = filter("**/*.css", {restore: true});

    return combine(
      gulp.src( mainbowerfiles({
        path: options.src,
        debugging: options.debug
      })),
      gulpIf(options.debug, debug({ title: 'bower debug' })),
      cssjsFilter,
      gulpIf(!options.debug, combine(
        cssFilter,
        rev(),
        revformat({
          prefix: '.',
          lastExt: false
        }),
        cssFilter.restore
      )),
      gulp.dest(function(file){
        return file.extname == '.js' ? options.dst.concat('js') : options.dst.concat('css');
      }),
      gulpIf(!options.debug, combine(rev.manifest('bower-rev.json'),
                                    gulp.dest(options.manifestpath)))
    )
  };
};
