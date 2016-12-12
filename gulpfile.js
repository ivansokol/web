'use strict';

const gulp = require('gulp');

const isDebug = !process.env.NODE_ENV || process.env.NODE_ENV == 'debug';

///////////////////////////////////////////////////////////////////////////////
var path = {
    dst: { //Тут мы укажем куда складывать готовые после сборки файлы
        html:  'www/',
        js:    'www/js/',
        css:   'www/css/',
        img:   'www/img/',
        fonts: 'www/fonts/'
    },

    src: { //Пути откуда брать исходники
        html:  'app/**/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js:    'app/js/main.js',//В стилях и скриптах нам понадобятся только main файлы
        less:  'app/less/main.less',
        img:   'app/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'app/fonts/**/*.*'
    },
    
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html:  'app/**/*.html',
        js:    'app/js/**/*.js',
        less:  'app/less/**/*.less',
        img:   'app/img/**/*.*',
        fonts: 'app/fonts/**/*.*'
    },

    clean: 'www'
};


var config = {
    server: {
        baseDir: "www"
    },
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend_Devil"
};

/////////////////////////////////////////////////////////////////////////////////

function lazyRequireTask(taskName, path, options) {
  options = options || {};
  options.taskName = taskName;
  gulp.task(taskName, function(callback) {
    let task = require(path).call(this, options);

    return task(callback);
  });
}


lazyRequireTask('clean', './tasks/clean', {
  dst: path.clean
});


lazyRequireTask('less', './tasks/less', {
  src: path.src.less,
  dst: path.dst.css,
  debug: isDebug
});

lazyRequireTask('html', './tasks/html', {
  src: path.src.html, 
  dst: path.dst.html
});

lazyRequireTask('fonts', './tasks/fonts', {
  src: path.src.fonts, 
  dst: path.dst.fonts
});

lazyRequireTask('browsersync', './tasks/browsersync.js', config);

gulp.task('build', gulp.series(
    'clean', gulp.parallel('less', 'html', 'fonts'))
);

gulp.task('watch', function() {
  gulp.watch(path.watch.less, gulp.series('less'));
  gulp.watch(path.watch.html, gulp.series('html'));
});
 

gulp.task('debug',
    gulp.series('build', gulp.parallel('watch', 'browsersync'))
);