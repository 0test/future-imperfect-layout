var gulp = require('gulp'),
    sass = require('gulp-sass')(require('sass')),
    browserSync = require('browser-sync'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    gcmq = require('gulp-group-css-media-queries'),
    fileinclude = require('gulp-file-include'),
    minify = require('gulp-minify');

gulp.task('browser-sync', function() { // Создаем таск browser-sync
    browserSync({ // Выполняем browserSync
        server: { // Определяем параметры сервера
            baseDir: 'dist', // Директория для сервера
            index: "index.html"
        },
        online: true,
        notify: true // Отключаем уведомления
    });
});

gulp.task('img', function() {
    return gulp.src('app/images/*')
        .pipe(gulp.dest('dist/images'))
        .pipe(browserSync.reload({ stream: true }))
});

gulp.task('html', function() {
    return gulp.src('app/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({ stream: true }))
});
gulp.task('fonts', function() {
    return gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
        .pipe(browserSync.reload({ stream: true }))
});

gulp.task('css', function() {
    return gulp.src('app/css/*.css')
        .pipe(sass())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gcmq())
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/css/'))
        .pipe(browserSync.reload({ stream: true }))
});

gulp.task('scss', function() {
    return gulp.src(['app/scss/*.*'], ['app/scss/*.scss'])
        .pipe(sass())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gcmq())
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/css/'))
        .pipe(browserSync.reload({ stream: true }))
});


gulp.task('js', function() {
    gulp.src([
            'app/js/jquery.js',
            'app/js/browser.js',
            'app/js/breakpoints.js',
            'app/js/util.js',
            'app/js/main.js'
        ])
        .pipe(concat('all.js'))
        .pipe(minify({
            noSource: true,
            ext: {
                src: '',
                min: '.min.js'
            },
            ignoreFiles: ['-min.js']
        }))
        .pipe(gulp.dest('dist/js/'))
        .pipe(browserSync.reload({ stream: true }))
});

gulp.task('fileinclude', function() {
    gulp.src(['app/*.html'], ['app/parts/*.*'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('watch', function() {
    gulp.watch('app/css/*.css', gulp.parallel('css'));

    gulp.watch('app/scss/**/*', gulp.parallel('scss'));
    gulp.watch(['app/*.html', 'app/parts/*'], gulp.parallel('html'));
    gulp.watch('app/js/*.js', gulp.parallel('js'));
    gulp.watch('app/img/*', gulp.parallel('img'));
});

gulp.task('default', gulp.parallel('browser-sync', 'watch'));