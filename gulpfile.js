// include gulp
var gulp = require('gulp'); 
 
// include plug-ins
var jshint = require('gulp-jshint');
var changed = require('gulp-changed');
var imagemin = require('gulp-imagemin');
var minifyHTML = require('gulp-minify-html');
var concat = require('gulp-concat');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify'); 
var autoprefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var compass = require('gulp-compass');
var webserver = require('gulp-webserver');
var rimraf = require('gulp-rimraf');

// JS hint task
gulp.task('jshint', function() {
  return gulp.src('./src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// minify new images
gulp.task('imagemin', function() {
  var imgSrc = './src/img/**/*',
      imgDst = './build/img';
 
  return gulp.src(imgSrc)
    .pipe(changed(imgDst))
    .pipe(imagemin())
    .pipe(gulp.dest(imgDst));
});

// minify new or changed HTML pages
gulp.task('htmlpage', function() {
  var htmlSrc = './src/*.html',
      htmlDst = './build';
 
  return gulp.src(htmlSrc)
    .pipe(changed(htmlDst))
    .pipe(minifyHTML())
    .pipe(gulp.dest(htmlDst));
});

// JS concat, strip debugging and minify
gulp.task('scripts', function() {
  return gulp.src(['./src/js/lib.js','./src/js/*.js'])
    .pipe(concat('script.js'))
    .pipe(stripDebug())
    .pipe(uglify())
    .pipe(gulp.dest('./build/js/'));
});


//Include Compass
gulp.task('css', function() {
  return gulp.src('./src/sass/*.scss')
    .pipe(compass({
      css: 'src/css',
      sass: 'src/sass',
      image: 'src/img'
    }))
    .pipe(concat('styles.css'))
    .pipe(autoprefix('last 2 versions'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('build/css/'));
});


// Gulp Webserver with LiveReload
gulp.task('server', function() {
  return gulp.src('./build/')
    .pipe(webserver({
      host: 'localhost',
      port: 8000,
      livereload: true,
      directoryListing: false,
      open: true
    }));
});

// Clean the build directory
gulp.task('clean', function() {
  return gulp.src('./build/*', { read: false })
    .pipe(rimraf());
});


// Copy other files
gulp.task('copy', function() {
  var video = gulp.src(['./src/video/*.mp4', './src/video/*.webm'])
    .pipe(gulp.dest('./build/video'));

  var other = gulp.src(['./src/.htaccess'])
    .pipe(gulp.dest('./build/'));
});

// Build task for deployment
gulp.task('build', ['imagemin', 'htmlpage', 'scripts', 'css', 'copy']);

// default gulp task
gulp.task('default', ['imagemin', 'htmlpage', 'scripts', 'css', 'server'], function() {

    // watch for HTML changes
  gulp.watch('./src/*.html', function() {
    gulp.run('htmlpage');
  });
 
  // watch for JS changes
  gulp.watch('./src/js/*.js', function() {
    gulp.run('jshint', 'scripts');
  });
 
  // watch for CSS changes
  gulp.watch('./src/sass/*.scss', function() {
    gulp.run('css');
  });

});

