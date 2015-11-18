var gulp = require('gulp');
var concat = require('gulp-concat');
var header = require('gulp-header');
var footer = require('gulp-footer');

var img64 = require('./');
var img = require('./config').img64;

gulp.task('images', function() {
    return gulp.src(img.src.globs, img.src.options)
        .pipe(img64(img.transform.options))
        .pipe(header(img.transform.header))
        .pipe(footer(img.transform.footer))
        .pipe(concat(img.dest.filename))
        .pipe(header(img.dest.header))
        .pipe(footer(img.dest.footer))
        .pipe(gulp.dest(img.dest.path, img.dest.options));
});

gulp.task('default', ['images']);