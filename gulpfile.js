'use strict'

var gulp = require('gulp')
var del = require('del')
var sass = require('gulp-sass')
var data = require('gulp-data')
var nunjucksRender = require('gulp-nunjucks-render')
var browserSync = require('browser-sync');
var dataset = require('./lab-data.json')

gulp.task('clean', function () {
  del.sync('./dist')
})

gulp.task('nunjucks', function () {
  nunjucksRender.nunjucks.configure(['pages/'], {watch: false, noCache: true})
  gulp.src(['pages/**/*.html', '!pages/**/_*.html'])
    .pipe(data(dataset))
    .pipe(nunjucksRender())
    .pipe(gulp.dest('./dist'))
})

gulp.task('sass', function () {
  // copy bootstrap files
  gulp.src(['node_modules/bootstrap/dist/css/bootstrap-theme.min.css',
    'node_modules/bootstrap/dist/css/bootstrap.min.css',
    'node_modules/swiper/dist/css/swiper.min.css'])
    .pipe(gulp.dest('./dist/css'))

  // compile sass
  gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'))
})

gulp.task('js', function () {
  // copy libraries
  gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js',
    'node_modules/bootstrap/dist/js/npm.js',
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/jquery-smooth-scroll/jquery.smooth-scroll.min.js',
    'node_modules/swiper/dist/js/swiper.min.js'])
    .pipe(gulp.dest('./dist/js'))

  gulp.src('./js/**/*.js')
    .pipe(gulp.dest('./dist/js'))
})

gulp.task('assets', function () {
  gulp.src('./font/**/*')
    .pipe(gulp.dest('./dist/font'))

  gulp.src('./image/**/*')
    .pipe(gulp.dest('./dist/image'))

  gulp.src('./images/**/*')
    .pipe(gulp.dest('./dist/images'))

  gulp.src('./CNAME')
    .pipe(gulp.dest('./dist'))
})

gulp.task('nunjucks:watch', function () {
  gulp.watch(['pages/**/*.html',
              'lab-data.json'], ['nunjucks'])
})

gulp.task('js:watch', function () {
  gulp.watch('./js/**/*.js', ['js'])
})

gulp.task('sass:watch', function () {
  gulp.watch('./sass/**/*.scss', ['sass'])
})

gulp.task('assets:watch', function () {
  gulp.watch(['./font/**/*',
              './image/**/*'], ['assets'])
})

gulp.task('browserSync', function () {
  browserSync({
    files: "dist/**/*",
    server: {
      baseDir: 'dist'
    }
  })
})

gulp.task('build', ['clean', 'nunjucks', 'js', 'sass', 'assets'])
gulp.task('watch', ['build', 'nunjucks:watch', 'js:watch', 'sass:watch', 'assets:watch'])
gulp.task('dev', ['watch', 'browserSync'])
