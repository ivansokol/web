'use strict';

const gulp = require('gulp');

module.exports = function(options) {

    return function() {
             var watch = function() {
            	 for (var i in $.watch)
            	 gulp.watch($.watch[i], gulp.series(i));          	 
             	};
             return watch();
            };
           
};
