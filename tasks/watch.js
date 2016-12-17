'use strict';

var gulp = require('gulp');

module.exports = function(options) {

    return function() {
        return function() {
            for (key in $.watch){
                $.gulp.watch($.watch[key], gulp.series(key));
            }
        };
    };

};
