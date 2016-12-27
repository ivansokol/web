'use strict';

const gulp = require('gulp');
const mainbowerfiles = require('main-bower-files');
const gulpIf = require('gulp-if');
const debug = require('gulp-debug');
const combine = require('stream-combiner2').obj;
const rev = require('gulp-rev');
const revformat = require('gulp-rev-format');
const filter = require('gulp-filter');
const filelist = require('gulp-filelist');

module.exports = function (options) {
  return function () {
    var cssjsFilter = !options.debug ? filter("**/*.min.{css,js}") : filter(['**/*.{css,js,map}', '!**/*.min.*']);

    return combine(
      gulp.src( mainbowerfiles({
        path: options.src,
        debugging: options.debug
      })),
      gulpIf(options.debug, debug({ title: 'bower debug' })),
      cssjsFilter,
      gulpIf('*.{js,css}', combine(rev(),
                                  revformat({
                                    prefix: '.',
                                    lastExt: false
                                  }))),
      gulp.dest(function(file){
        if (file.extname == '.js')
          return options.dst.concat('js');

        if (file.extname == '.css')
          return options.dst.concat('css');

        if (file.extname == '.map' && file.stem.slice(-2) == 'js')
          return options.dst.concat('js');

        if (file.extname == '.map' && file.stem.slice(-3) == 'css')
          return options.dst.concat('css');

        return options.dst;
      }),
      gulpIf('*.{js,css}', filelist('bowerfile.json', { flatten: true })),
      gulpIf('*.json', gulp.dest(options.manifestpath))
    )
  };
};
