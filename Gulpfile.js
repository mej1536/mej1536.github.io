/* ------------------------------------------------
 * Directory
 * 작업폴더  : ./_workingStage
 * 최종산출물: ./public
 * ------------------------------------------------
 * 최종수정일: 2017.02.02
 * ------------------------------------------------ */

'use strict';
var gulp  = require('gulp'),
	upmodul = require('gulp-update-modul'),
	plumber = require('gulp-plumber'),
	watch = require('gulp-watch'),
	merge = require('merge-stream'),
	copy  = require('gulp-contrib-copy'),
	changed = require('gulp-changed'),
	replace = require('gulp-replace'),
	cssSass = require('gulp-sass'),
	cleanCSS = require('gulp-clean-css'),
	cssComb  = require('gulp-csscomb'),
	autoprefixer = require('gulp-autoprefixer'),
	concat = require('gulp-concat'),
	jshint = require('gulp-jshint'),
	htmlhint = require('gulp-htmlhint'),
	jshintXMLReporter = require('gulp-jshint-xml-file-reporter'),
	htmlhintReporter = require('gulp-htmlhint-html-reporter')
;

/* -----------------------------------------
 * CSS: Sass
 * ----------------------------------------- */
var _sassSRC  = './_workingStage/sass/**/*.scss';
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
		.pipe(cssComb( 'csscomb.json' ))
		.pipe(replace('/*! -----' , '\n/*! -----'))
		.pipe(replace('/*!' , '/*'))
		.pipe(gulp.dest(_sassDEST));
});

/* -----------------------------------------
 * JS: concat,jshint
 * ----------------------------------------- */
var _jsSRC  = './_workingStage/js/*.js';
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
	var streamJsSRC1 = gulp.src(['./_workingStage/js/file1.js', './_workingStage/js/file2.js'])
		.pipe(concat('common.js'))
		.pipe(gulp.dest(_jsDEST));
	
	var streamJsSRC2 = gulp.src(['./_workingStage/js/file3.js', './_workingStage/js/file4.js'])
		.pipe(concat('module.js'))
		.pipe(gulp.dest(_jsDEST));
	
	return merge(streamJsSRC1, streamJsSRC2);
});

/* -----------------------------------------
 * HTML: htmlhint
 * ----------------------------------------- */
var _htmlSRC  = './public/**/*.{html,jsp}';
gulp.task('htmlHint',function(){
	return gulp.src(_htmlSRC)
		.pipe(htmlhint('.htmlhintrc'))
		.pipe(htmlhint.reporter(htmlhintReporter, {
			 createMissingFolders : 'false'
		}));
});

/* -----------------------------------------
 * Copy, Clean
 * ----------------------------------------- */
var _copySRC = {
		scripts:['./_workingStage/js/lib/*.js']
		,css   :['./_workingStage/css/*.css']
		//,images :['./public/img/**/*']
};

gulp.task('copyLib', function() {
	gulp.src(_copySRC.css)
		.pipe(copy())
		.pipe(gulp.dest('./public/'));
});

/*
var otherGulpFunction = require('gulp-other-function');
var sourceFiles = [ 'source1/*', 'source2/*.txt' ];
var destination = 'dest/';

return gulp.src(sourceFiles)
	.pipe(gulpCopy(outputPath, options))
	.pipe(otherGulpFunction())
	.dest(destination);

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.images, ['images']);
});*/

/* -----------------------------------------
 * Gulp Update
 * ----------------------------------------- */
gulp.task('update-modul', function() {
	return gulp.src('package.json')
		.pipe(upmodul('latest', 'false')); //update all modules latest version.
});

/* -----------------------------------------
 * Changed
 * ----------------------------------------- */
var originSRC  = './public/**/*.*';
var copiedDEST = './build';

gulp.task('changedAll', function(){
	return gulp.src(originSRC)
		.pipe(changed(copiedDEST)) // changed since the last time it was run
		.pipe(gulp.dest(copiedDEST));
});

/* -----------------------------------------
 * Watch
 * ----------------------------------------- */
gulp.slurped = false;
gulp.task('watch', function(){
	gulp.start('update-modul');
	gulp.watch(['./_workingStage/sass/**/*.scss'],['styleSASS']);
	gulp.watch(['./_workingStage/js/*.js'],['jsConcat','jScript']);
	gulp.watch(['./public/**/*.{html,jsp}'],['htmlHint']);
	
	//gulpfile.js changed
	if(!gulp.slurped){
		gulp.watch("gulpfile.js", ["default"]);
		gulp.watch(['./_workingStage/sass/**/*.scss'],['styleSASS']);
		gulp.watch(['./_workingStage/js/*.js'],['jsConcat','jScript']);
		gulp.watch(['./public/**/*.{html,jsp}'],['htmlHint']);
		gulp.slurped = true;
	}
});

gulp.task('default', ['watch'], function(){
	//
});

