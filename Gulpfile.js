var gulp = require('gulp');
var notify = require('gulp-notify');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var header = require('gulp-header');
var pkg = require('./package.json');

/**
 * Base Configuration
 * @type {{src: string}}
 */
var js = {
    'buildName' : 'rkit.js',
    'suffix' : '.min',
    'dest' : 'js/dest',
    'src' : [
        'js/src/core.js',
        'js/src/utility.js',
        'js/src/yoga.js',
        'js/src/media.js',
        'js/src/app.js'
    ],
    'banner' : [
        '/**',
        ' * ${name} - ${description}',
        ' * @version ${version}',
        ' * @date ${date}',
        ' */ ',
        '\r\n'
    ].join('\n')
};

var bannerData = {
    'name' : pkg.name,
    'version' : pkg.version,
    'description' : pkg.description,
    'date' : new Date()
};

/**
 * Describe tasks
 */
gulp.task('js', function() {
   gulp.src(js.src)
       .pipe(concat(js.buildName))
       .pipe(header(js.banner, bannerData))
       .pipe(gulp.dest(js.dest))
       .pipe(rename({
           'suffix' : js.suffix
       }))
       .pipe(uglify())
       .pipe(header(js.banner, bannerData))
       .pipe(gulp.dest(js.dest))
       .pipe(notify('Js files were concatenated and compressed'));
});

/**
 * Watching for files
 */
gulp.watch(js.src, ['js']);

/**
 * Default task
 */
gulp.task('default', ['js']);
