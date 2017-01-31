/**
 * ------------------------------------------------
 * Directory
 * 작업폴더  : ./_workingStage
 * 최종산출물: ./public
 * ------------------------------------------------
 * 최종수정일: 2017.02.01
 * ------------------------------------------------
 */


'use strict';
var gulp  = require('gulp'),
    watch = require('gulp-watch'),
    plumber = require('gulp-plumber'),
    merge = require('merge-stream'),
    cssSass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    csscomb = require('gulp-csscomb'),
    changed = require('gulp-changed'),
    replace = require('gulp-replace'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    htmlhint = require('gulp-htmlhint'),
    htmlhintReporter = require('gulp-htmlhint-html-reporter'),
    jshintXMLReporter = require('gulp-jshint-xml-file-reporter'),
    upmodul = require('gulp-update-modul')
;


/** ----------------------------------------
 * CSS: Sass
 * -----------------------------------------
 */
var _sassSRC = './_workingStage/public/sass/**/*.scss';
var _sassDEST = './public/css/';
var cleanOptions = {keepBreaks:true, keepSpecialComments:'*', restructuring:false, shorthandCompacting:false, compatibility:'ie7,ie8', mediaMerging:true, roundingPrecision:-1, debug:true};

gulp.task('styleSASS',function(){
	return gulp.src(_sassSRC)
		.pipe(plumber())
		.pipe(cssSass({outputStyle:'expanded'}))
		.pipe(autoprefixer({
			browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
			cascade: false
		}))
		.pipe(cleanCSS( cleanOptions ))
		.pipe(replace('/*! -----' , '\n/*! -----'))
		.pipe(replace('/*!' , '/*'))
		.pipe(csscomb( 'csscomb.json' ))
		.pipe(gulp.dest(_sassDEST));
});



/** ----------------------------------------
 * JS: concat,jshint
 * -----------------------------------------
 */
var _jsSRC  = './_workingStage/public/js/*.js';
var _jsDEST = './public/js/';

//분리된 파일 전체를 1개 파일로
gulp.task('jsConcat',function(){
	return gulp.src(_jsSRC)
		.pipe(jshint({
		//	undef:true, 
		//	unused:true,
			globals: { jQuery: true, console: true, module: true, document: true },
			curly: true,
			eqeqeq: true,
			eqnull: true,
			browser: true }))
		.pipe(jshint.reporter(jshintXMLReporter))
		.on('end', jshintXMLReporter.writeFile({ format: 'checkstyle', filePath: './jshint.xml', alwaysReport: 'true' }))
		.pipe(concat('public.js'))
		.pipe(gulp.dest(_jsDEST));
});

//파일명 여러개로
gulp.task('jScript',function(){
	var streamJsSRC1 = gulp.src(['./_workingStage/public/js/file1.js', './_workingStage/public/js/file2.js'])
		.pipe(concat('common.js'))
		.pipe(gulp.dest(_jsDEST));
	
	var streamJsSRC2 = gulp.src(['./_workingStage/public/js/file3.js', './_workingStage/public/js/file4.js'])
		.pipe(concat('module.js'))
		.pipe(gulp.dest(_jsDEST));
	
	return merge(streamJsSRC1, streamJsSRC2);
});


/** ----------------------------------------
 * HTML: htmlhint
 * -----------------------------------------
 */
var _htmlSRC  = './public/**/*.{html,jsp}';
gulp.task('htmlHint',function(){
	return gulp.src(_htmlSRC)
		.pipe(htmlhint('.htmlhintrc'))
		.pipe(htmlhint.reporter(htmlhintReporter, {
			 createMissingFolders : 'false'
		}));
});


/** ----------------------------------------
 * Copy, Clean
 * -----------------------------------------
 */
var del = require('del');
var paths = {
		scripts: ['client/js/**/*.coffee', '!client/external/**/*.coffee'],
		images: 'client/img/**/*'
};
gulp.task('copyLib',function(){
	
});
//gulp.task('copyLib', ['css', 'js', 'imgs']);


gulp.task('clean', function() {
	  // You can use multiple globbing patterns as you would with `gulp.src`
	  return del(['build']);
	});

	gulp.task('scripts', ['clean'], function() {
	  // Minify and copy all JavaScript (except vendor scripts)
	  // with sourcemaps all the way down
	  return gulp.src(paths.scripts)
	    .pipe(sourcemaps.init())
	      .pipe(coffee())
	      .pipe(uglify())
	      .pipe(concat('all.min.js'))
	    .pipe(sourcemaps.write())
	    .pipe(gulp.dest('build/js'));
	});

	// Copy all static images
	gulp.task('images', ['clean'], function() {
	  return gulp.src(paths.images)
	    // Pass in options to the task
	    .pipe(imagemin({optimizationLevel: 5}))
	    .pipe(gulp.dest('build/img'));
	});

	// Rerun the task when a file changes
	gulp.task('watch', function() {
	  gulp.watch(paths.scripts, ['scripts']);
	  gulp.watch(paths.images, ['images']);
	});


/** ----------------------------------------
 * Watch
 * -----------------------------------------
 */
gulp.slurped = false;
gulp.task('watch', function(){
	gulp.watch(['./_workingStage/public/sass/**/*.scss'],['styleSASS']);
	gulp.watch(['./_workingStage/public/js/*.js'],['jsConcat','jScript']);
	gulp.watch(['./public/**/*.{html,jsp}'],['htmlHint']);
	
	//gulpfile.js changed
	if(!gulp.slurped){
		gulp.watch("gulpfile.js", ["default"]);
		gulp.watch(['./_workingStage/public/sass/**/*.scss'],['styleSASS']);
		gulp.watch(['./_workingStage/public/js/*.js'],['jsConcat','jScript']);
		gulp.watch(['./public/**/*.{html,jsp}'],['htmlHint']);
		gulp.slurped = true;
	}
});

gulp.task('default', ['watch'], function(){
	//
});



/** ----------------------------------------
 * Gulp Update
 * -----------------------------------------
 */
gulp.task('update-modul', function() {
	return gulp.src('package.json')
		.pipe(upmodul('latest', 'false')); //update all modules latest version.
});


/** ----------------------------------------
 * Changed
 * -----------------------------------------
 */
var originSRC = './public/**/*.*';
var copiedDEST = './build';

gulp.task('changedAll', function(){
	return gulp.src(originSRC)
		.pipe(changed(copiedDEST)) // changed since the last time it was run
		.pipe(gulp.dest(copiedDEST));
});