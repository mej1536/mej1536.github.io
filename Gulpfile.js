/* ------------------------------------------------
 * Directory
 * 작업폴더  : ./_workingStage
 * 최종산출물: ./public
 * ------------------------------------------------
 * 최종수정일: 2017.02.07
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
	htmlhintReporter = require('gulp-htmlhint-html-reporter'),
	del = require('del'),
	runSequence = require('run-sequence'),
	gcallback = require('gulp-callback')
;

/* -----------------------------------------
 * CSS: Sass
 * ----------------------------------------- */
var _sassSRC  = './_workingStage/sass/**/*.scss';
var _sassDEST = './public/css/';
var cleanOptions = new cleanCSS( {format:'keep-breaks'},{compatibility:'ie7'},{level:{ 1:{all:false}, 2:{all:false}} });

gulp.task('styleSASS',function(){
	return gulp.src(_sassSRC)
		.pipe(plumber())
		.pipe(cssSass({outputStyle:'expanded'}))
		.pipe(autoprefixer({
			browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
			cascade: false
		}))
		.pipe(cleanOptions)
		.pipe(cssComb( 'csscomb.json' ))
		.pipe(replace('/*! -----' , '\n/*! -----'))
		//.pipe(replace('/*!' , '/*'))
		.pipe(gulp.dest(_sassDEST))
		.pipe(gcallback(function(){
				console.log('** task done : styleSASS');
			})
		);
});

/* -----------------------------------------
 * JS: jshint, concat
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
		.pipe(gulp.dest(_jsDEST))
		.pipe(gcallback(function(){
			console.log('** task done : jsConcat');
		})
	);
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
 * Copy
 * ----------------------------------------- */
gulp.task('copyJS', function() {
	return gulp.src(['./_workingStage/js/lib/*.js'])
		.pipe(copy())
		.pipe(gulp.dest('./public/js/lib/'));
});
gulp.task('copyCSS', function() {
	return gulp.src(['./_workingStage/css/**/*.css'])
		.pipe(copy())
		.pipe(gulp.dest('./public/css/'));
});

//
//gulp.task('copy2', function () {
//	return gulp.src(['some/other/folders/src/public/**/*', 'some/other/folders/src/vendor/**/*'],{base: 'other'})
//		.pipe(gulp.dest('build'));
//});


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

gulp.task('build-clean', function() {
	// Return the Promise from del()
	return del(['./public/js/*.js', './public/css/*.css','!public/assets/goat.png']).then(paths =>{ console.log('Deleted files and folders:\n',paths.join('\n')); });
	// 'return' is the key here, to make sure asynchronous tasks are done!
});
gulp.task('build', function(callback) {
	runSequence('build-clean', ['styleSASS', 'jsConcat','jScript'],'htmlHint','copyJS','copyCSS', callback);
});
gulp.task('default', ['watch','copyLib','styleSASS','jsConcat','jScript'], function(){
	//
});

