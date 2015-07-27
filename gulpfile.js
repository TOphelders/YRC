var gulp = require('gulp');

var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');

var source = require('vinyl-source-stream');
var rename = require('gulp-rename');

gulp.task('babelify', function() {
  var args = { entries: './public/jsx/main.jsx', debug: true };
  var bundler = browserify(args).transform(babelify);

  return bundle_js(bundler);
});

gulp.task('watchify', function() {
  var args = { entries: './public/jsx/main.jsx', debug: true };
  var bundler = watchify(browserify(args)).transform(babelify);
  bundle_js(bundler);

  bundler.on('update', function() {
    bundle_js(bundler);
  });
});

function bundle_js(bundler) {
  return bundler.bundle()
    .pipe(source('bundle.js'))
    .pipe(rename({
      basename: 'yrc'
    }))
    .pipe(gulp.dest('./public/build/'));
}
