var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var prefix = require('gulp-autoprefixer');
var concat = require("gulp-concat");
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var postcss = require('gulp-postcss');
var reporter = require('postcss-reporter');
var syntax_scss = require('postcss-scss');
var stylelint = require('stylelint');
var newer = require('gulp-newer');
var del = require('del');
var path = require('path');
var cache = require('gulp-cache');


/**
 * Launch the Server
 */
gulp.task('browser-sync', ['sync'], function () {
  browserSync.init({
    // Change as required
    server: {
      baseDir: "./public/"
    }
  });
});

/**
 * Compile files from scss after lint
 */
gulp.task("scss-lint", function() {
  
  /**
   * SCSS stylelint
   * refer to article "http://www.creativenightly.com/2016/02/How-to-lint-your-css-with-stylelint/"
   * https://gist.github.com/KingScooty/fa4aab7852dd30feb573#file-gulpfile-js
   */

  // Stylelint config rules
  var stylelintConfig = {
    "rules": {
      "block-no-empty": true,
      "color-no-invalid-hex": true,
      "declaration-colon-space-after": "always",
      "declaration-colon-space-before": "never",
      "function-comma-space-after": "always",
      "function-url-quotes": "always",
      "media-feature-colon-space-after": "always",
      "media-feature-colon-space-before": "never",
      "media-feature-name-no-vendor-prefix": true,
      "max-empty-lines": 5,
      "number-no-trailing-zeros": true,
      "property-no-vendor-prefix": true,
      "block-opening-brace-newline-after": "always",
      "block-closing-brace-newline-before": "always",
      "declaration-block-trailing-semicolon": "always",
      "selector-list-comma-space-before": "never",
      "string-quotes": "double",
      "value-no-vendor-prefix": true
    }
  }

  var processors = [
    stylelint(stylelintConfig),
    reporter({
      clearMessages: true,
      throwError: true
    })
  ];

  return gulp.src(
      ['dev/sass/*.scss', 'dev/sass/**/*.scss',
      // Ignore linting vendor assets
      // Useful if you have bower components
      '!dev/sass/_settings.scss', '!dev/sass/_components.shame.scss', '!dev/sass/_tools.scss', '!dev/sass/lib/*.scss']
    )
    .pipe(postcss(processors, {syntax: syntax_scss}));
});

/**
 * Compile files from scss
 */
gulp.task('sass', function () {
  return gulp.src(['dev/sass/styles.scss'])
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: ['scss', 'node_modules/susy/sass'],
      onError: browserSync.notify
    }))
    .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/css/'));
});

gulp.task('sass-prod', function () {
  return gulp.src(['dev/sass/styles.scss'])
    .pipe(sass({
      includePaths: ['scss']
    }))
    .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
    .pipe(gulp.dest('public/css/'));
});

/**
 * Minify custom js scripts
 */
gulp.task('scripts', function () {
  return gulp.src(['dev/js/lib/rem.js', 'dev/js/init.js'])
    .pipe(concat('app.js'))
    .pipe(gulp.dest('public/js/'));
});

gulp.task('scripts-prod', function () {
  return gulp.src('dev/js/app.min.js')
    .pipe(uglify())
    .pipe(gulp.dest('public/js/app.min.js'));
});

/**
 * Reload page when views change
 */
gulp.task('views', function () {
  browserSync.reload();
  console.log('Refresh');
});

gulp.task('copy-files', function() {  
  gulp.src(['dev/**/*', '!dev/{sass,sass/**}'])
    .pipe(gulp.dest('public/'));
});

gulp.task('sync', function() {
  gulp.src(['dev/**/*', '!dev/{sass,sass/**}', '!dev/js/{init.js,lib,lib/**}'])
    .pipe(newer('public/'))
    .pipe(gulp.dest('public/'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('cache:clear', function (callback) {
  return cache.clearAll(callback)
})

/**
 * Watch scss files for changes & recompile
 * Watch views folder for changes and reload BrowserSync
 */
gulp.task('watch', function () {
  gulp.watch(['dev/sass/*.scss', 'dev/sass/**/*.scss'], ['scss-lint', 'sass']);
  gulp.watch(['dev/js/**'], ['scripts']);
  gulp.watch(['dev/images/*', 'dev/images/**/*'], ['sync']);

  var watcher = gulp.watch(['dev/**/*', '!dev/{sass,sass/**}', '!dev/js/{init.js,lib,lib/**}'], ['sync']);
  watcher.on('change', function(ev) {
         if(ev.type === 'deleted') {
          /**
           * Sync up deleted files between 2 folder on harddisk
           * refer to article "https://fettblog.eu/gulp-recipes-part-2/#sync-directories-on-your-harddisk"
           */
          
          //console.log('file deleted');
          //console.log(path.relative('./', ev.path).replace('app\\assets\\','public\\'));
          del(path.relative('./', ev.path).replace('dev\\','public\\'));
         }
    });
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the scripts, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);