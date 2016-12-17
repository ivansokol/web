'use strict';

const gulp = require('gulp');

const isDebug = !process.env.NODE_ENV || process.env.NODE_ENV == 'debug';

///////////////////////////////////////////////////////////////////////////////
global.$ = {
    dst: { //Тут мы укажем куда складывать готовые после сборки файлы
        html:  'www/',
        js:    'www/js/',
        css:   'www/css/',
        img:   'www/img/',
        fonts: 'www/fonts/',
        clean: 'www'
    },

    src: { //Пути откуда брать исходники
        html:  'app/**/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js:    'app/js/main.js',//В стилях и скриптах нам понадобятся только main файлы
        css:   'app/less/main.less',
        img:   'app/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'app/fonts/**/*.*'
    },
    
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html:  'app/**/*.html',
        js:    'app/js/**/*.js',
        css:   'app/less/**/*.less',
        img:   'app/img/**/*.*',
        fonts: 'app/fonts/**/*.*'
    },


    task: { //Тут мы укажем какие задаичм будем выполнять
        clean:  './tasks/clean',
        css:   './tasks/less',
        html:   './tasks/html',
        fonts:  './tasks/fonts',
        browsersync: './tasks/browsersync',
        watch: './tasks/watch'
    }
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

for (var key in $.task) {
    lazyRequireTask(key, $.task[key], {
        src: $.src[key],
        dst: $.dst[key],
        debug: isDebug,
        config: config
    });
}


gulp.task('build', gulp.series(
    'clean', gulp.parallel('css', 'html', 'fonts'))
);

gulp.task('debug',
    gulp.series('build', gulp.parallel('watch', 'browsersync'))
);