/** -----------------------------------------------
 * Directory
 * 작업폴더  : ./_workingStage
 * 최종산출물: ./public
 * ------------------------------------------------
 * 최종수정일: 2017.02.18
 * ------------------------------------------------
 */
'use strict';
var gulp	= require('gulp'),
    upmodul	= require('gulp-update-modul'),
    plumber	= require('gulp-plumber'),
    watch	= require('gulp-watch'),
    merge	= require('merge-stream'),
    copy	= require('gulp-contrib-copy'),
    changed	= require('gulp-changed'),
    replace	= require('gulp-replace'),
    cssSass	= require('gulp-sass'),
    cleanCSS	= require('gulp-clean-css'),
    cssComb  	= require('gulp-csscomb'),
    autoprefixer = require('gulp-autoprefixer'),
    concat  	= require('gulp-concat'),
    jshint  	= require('gulp-jshint'),
    htmlhint 	= require('gulp-htmlhint'),
    del     	= require('del'),
    runSequence = require('run-sequence'),
    gcallback	= require('gulp-callback'),
    htmlhintReporter  = require('gulp-htmlhint-html-reporter'),
    jshintXMLReporter = require('gulp-jshint-xml-file-reporter')
;

/** ---------------------------------------------------
 *  Update Modul
 *  ---------------------------------------------------
 */
gulp.task('update-modul', function() {
	return gulp.src('package.json')
		.pipe(upmodul('latest', 'false')); //update all modules latest version.
});

/** ---------------------------------------------------
 *  NodeJs Error solved
 *  Error Message>>
 *  warning: possible EventEmitter memory leak detected. 11 listeners added. Use emitter.setMaxListeners() to increase limit.
 *  ---------------------------------------------------
 */
var events = require('events');
events.EventEmitter.defaultMaxListeners = 100;

/** ---------------------------------------------------
 *  HTML
 *  ---------------------------------------------------
 */
var _htmlSRC  = './public/**/*.{html,jsp}';
gulp.task('htmlHint',function(){
	return gulp.src(_htmlSRC)
		.pipe(htmlhint('.htmlhintrc'))
		.pipe(htmlhint.reporter(htmlhintReporter, {
			 createMissingFolders : 'false'
		}));
});

/** ---------------------------------------------------
 *   Changed, Copy
 *  ---------------------------------------------------
 */
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

var originSRC  = './public/**/*.*';
var copiedDEST = './build';
gulp.task('changedAll', function(){
	return gulp.src(originSRC)
		.pipe(changed(copiedDEST)) // changed since the last time it was run
		.pipe(gulp.dest(copiedDEST));
});

/** ---------------------------------------------------
 *  CSS
 *  ---------------------------------------------------
 */
var _sassSRC  = './_workingStage/sass/**/*.scss';
var _sassDEST = './public/css/';

gulp.task('styleSASS',function(){
	return gulp.src(_sassSRC)
		.pipe(plumber())
		.pipe(cssSass({outputStyle:'expanded'}))
		.pipe(cleanCSS( {format:'keep-breaks'},{compatibility:'ie7'},{level:{ 1:{all:false}, 2:{all:false}}} ))
		.pipe(autoprefixer({
			browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
			cascade: false
		}))
		.pipe(cssComb('csscomb.json'))
		.pipe(replace('/*! -----','\n/*! -----'))
		.pipe(replace(';}}',';}\n}'))
		.pipe(gulp.dest(_sassDEST))
		.pipe(gcallback(function(){
				console.log('** task done : styleSASS');
			})
		);
});

/** ---------------------------------------------------
 *  JavaScript
 *  ---------------------------------------------------
 */
var _jsSRC  = './_workingStage/js/*.js';
var _jsDEST = './public/js/';

// 분리된 파일 전체를 1개 파일로
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

// 파일명 여러개로
gulp.task('jScript',function(){
	var streamJsSRC1 = gulp.src(['./_workingStage/js/file1.js', './_workingStage/js/file2.js'])
		.pipe(jshint({
		//	undef:true, 
		//	unused:true,
			globals: { jQuery: true, console: true, module: true, document: true },
			curly: true,
			eqeqeq: true,
			eqnull: true,
			browser: true }))
		.pipe(concat('common.js'))
		.pipe(gulp.dest(_jsDEST));
	
	var streamJsSRC2 = gulp.src(['./_workingStage/js/file3.js', './_workingStage/js/file4.js'])
		.pipe(jshint({
		//	undef:true, 
		//	unused:true,
			globals: { jQuery: true, console: true, module: true, document: true },
			curly: true,
			eqeqeq: true,
			eqnull: true,
			browser: true }))
		.pipe(concat('module.js'))
		.pipe(gulp.dest(_jsDEST));
	
	return merge(streamJsSRC1, streamJsSRC2);
});

/** ---------------------------------------------------
 *  Build, Watch
 *  ---------------------------------------------------
 */
gulp.task('build-clean', function() {
	// Return the Promise from del()
	// Return is the key here, to make sure asynchronous tasks are done!
	return del(['./public/js/*.js', './public/css/*.css','!public/assets/goat.png']).then(paths => { 
		console.log('Deleted files and folders:\n',paths.join('\n')); 
	});
});
gulp.task('build', function(done) {
	runSequence('build-clean', ['styleSASS', 'jsConcat','jScript'],'htmlHint',['copyJS','copyCSS'],function(){
		console.log('** task build : Build Finished!!');
		done();
	});
});

gulp.slurped = false;
gulp.task('watch', function(){
	if(!gulp.slurped){ //gulpfile.js changed
		gulp.watch(['./Gulpfile.js'],['default']);
		gulp.slurped = true;
	}
	
	//모듈 업데이트 할때만 사용하기로..
	//gulp.start('update-modul');
	gulp.watch(['./_workingStage/sass/**/*.scss'],['styleSASS']);
	gulp.watch(['./_workingStage/js/*.js'],['jsConcat','jScript']);
	gulp.watch(['./public/**/*.{html,jsp}'],['htmlHint']);
});

gulp.task('default', ['styleSASS','jsConcat','jScript','htmlHint','watch'], function(){
});
