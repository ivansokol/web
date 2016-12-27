'use strict';

const gulp = require('gulp');
const revreplace = require('gulp-rev-replace');
const gulpIf = require('gulp-if');
const combine = require('stream-combiner2').obj;
const inject = require('gulp-inject');
const fs = require('fs');

module.exports = function(options) {
  return function() {
    var injectOurOptions = {
      addRootSlash: false,
      ignorePath: ['www'],
      name: 'inject_our'
    };
    var injectVendorOptions = {
      addRootSlash: false,
      ignorePath: ['www'],
      name: 'inject_vendor'
    };

    var ourcss = {}, ourjs = {};

    var ourcssManifest = options.manifestpath.concat('css.json');
    var ourjsManifest = options.manifestpath.concat('js.json');

    try {
      ourcss = JSON.parse(fs.readFileSync(ourcssManifest));
    } catch (e) {
    }

    try {
      ourjs = JSON.parse(fs.readFileSync(ourjsManifest));
    } catch (e) {
    }

    var bower = {};

    var bowerManifest = options.manifestpath.concat('bowerfile.json');

    try {
      bower = JSON.parse(fs.readFileSync(bowerManifest));
    } catch (e) {
    }

    var injectOurFilesPath = (function () {
      var src = [];
      for (var i in ourcss) {
        src.push(options.dst.concat('**/').concat(ourcss[i]));
      }

      for (var j in ourjs) {
        src.push(options.dst.concat('**/').concat(ourjs[j]));
      }
      return gulp.src(src, { read: false });
    })();

    var injectVendorFilesPath = (function () {
      var src = [];
      for (var i in bower) {
        src.push(options.dst.concat('**/').concat(bower[i]));
      }
      return gulp.src(src, { read: false });
    })();

    return combine(
            gulp.src(options.src),
            inject(injectOurFilesPath, injectOurOptions),
            inject(injectVendorFilesPath, injectVendorOptions),
            gulp.dest(options.dst)
          );
  };
};
