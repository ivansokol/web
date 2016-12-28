'use strict';

const gulp = require('gulp');
const gulpIf = require('gulp-if');
const notify = require('gulp-notify');
const debug = require('gulp-debug');
const sourcemaps = require('gulp-sourcemaps');
const combine = require('stream-combiner2').obj;
const rename = require('gulp-rename');
const eslint = require('gulp-eslint');
const fs = require('fs');
const through2 = require('through2').obj;
const rev = require('gulp-rev');
const revformat = require('gulp-rev-format');
var uglify = require('gulp-uglify');
const filelist = require('gulp-filelist');

const rulesEslint = require('../.eslintrc.json');

module.exports = function (options) {
  return function () {
    var eslintResults = {};

    var cacheFilePath = options.manifestpath.concat('eslintCache.json');

    try {
      eslintResults = JSON.parse(fs.readFileSync(cacheFilePath));
    } catch (e) {
    }

    return combine(
      gulp.src(options.src),
      gulpIf(options.debug, debug({ title: 'js debug' })),
      gulpIf(
        function(file) {
          return eslintResults[file.path] && eslintResults[file.path].mtime == file.stat.mtime.toJSON();
        },
        through2(function(file, enc, callback) {
          file.eslint = eslintResults[file.path].eslint;
          callback(null, file);
        }),
        combine(
          through2(function(file, enc, callback) {
            file.contents = fs.readFileSync(file.path);
            callback(null, file);
          }),
          gulpIf(options.debug, debug({ title: 'js eslint' })),
          eslint(rulesEslint),
          through2(function(file, enc, callback) {
            eslintResults[file.path] = {
              eslint: file.eslint,
              mtime: file.stat.mtime
            };
            callback(null, file);
          })
        )
      ),
      eslint.format(),
      eslint.failAfterError(),
      gulpIf(options.debug, sourcemaps.init()),
      gulpIf(!options.debug, combine(
        uglify(),
        rev(),
        revformat({
          prefix: '.',
          suffix: '.min',
          lastExt: false
        })
      )),
      gulpIf(options.debug, sourcemaps.write('.')),
      gulp.dest(options.dst),
      gulpIf('*.js', filelist('js.json', { flatten: true })),
      gulpIf('*.json', gulp.dest(options.manifestpath))
      )
      .on('end', function() {
        fs.writeFileSync(cacheFilePath, JSON.stringify((eslintResults)));
      })
      .on('error', notify.onError({
        message: 'There is a JS error, please look the console for details' }));
  };
};

