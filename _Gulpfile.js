/** -----------------------------------------------
 * Directory
 * 작업폴더  : ./_workingStage
 * 최종산출물: ./public
 * ------------------------------------------------
 * 최종수정일: 2017.03.04
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
    es      	= require('event-stream'),
    runSequence = require('run-sequence'),
    gcallback	= require('gulp-callback'),
    htmlhintReporter  = require('gulp-htmlhint-html-reporter'),
    jshintXMLReporter = require('gulp-jshint-xml-file-reporter'),
    sassLint	= require('gulp-sass-lint'),
    gutil   	= require('gulp-util'),
    notify  	= require('gulp-notify')
;

/** ---------------------------------------------------
 *  NodeJs Error solved
 *  Error Message>>
 *  warning: possible EventEmitter memory leak detected. 11 listeners added. Use emitter.setMaxListeners() to increase limit.
 *  ---------------------------------------------------
 */
var events = require('events');
events.EventEmitter.defaultMaxListeners = 100;

/** ---------------------------------------------------
 *  Update Modul
 *  ---------------------------------------------------
 */
gulp.task('update-modul', function() {
	return gulp.src('package.json')
		.pipe(upmodul('latest', 'false')); //update all modules latest version.
});

/** ---------------------------------------------------
 *  Bootstrap Copying Files
 *  ---------------------------------------------------
 */
var config = { bowerDir: './bower_components', scssPath: './bower_components/bootstrap/scss', jsPath: './bower_components/bootstrap/js'};

gulp.task('bootstrapCopyingFiles', function() {
	return es.merge(
		/* bootstrap/scss/.scss-lint.yml 
		 * 경로수정해야 하므로, 수동복사
		 */
		gulp.src(config.bowerDir+'/components-font-awesome/scss/**.*').pipe(gulp.dest('./_workingStage/bootstrap/fonts/scss/')),
		gulp.src(config.scssPath+'/**/**.*').pipe(gulp.dest('./_workingStage/bootstrap/scss')),
		gulp.src(config.jsPath+'/**/**.js').pipe(gulp.dest('./_workingStage/bootstrap/js'))
	);
});

gulp.task('awesomeFonts', function(){
	var fontsDEST1 = 
		gulp.src(config.bowerDir + '/components-font-awesome/fonts/**.*')
			.pipe(gulp.dest('./_workingStage/bootstrap/fonts'));
	
	var fontsDEST2 = 
		gulp.src('./_workingStage/bootstrap/fonts/**.*')
			.pipe(gulp.dest('./public/fonts/'));
	
	return merge(fontsDEST1, fontsDEST2);
});

gulp.task('BootstrapFiles', ['bootstrapCopyingFiles','awesomeFonts']);

/** ---------------------------------------------------
 *  Bootstrap CSS
 *  ---------------------------------------------------
 */
var srcBTS = { scssSRC:'./_workingStage/bootstrap/scss', jsSRC:'./_workingStage/bootstrap/js', fontSRC:'./_workingStage/bootstrap/fonts'};

gulp.task('bootstrapCSS', function() {
	return gulp.src('./_workingStage/bootstrap/scss/**/*.scss')
		.pipe(plumber())
		.pipe(cssSass({
				outputStyle: 'expanded',
				loadPath: [srcBTS.scssSRC, srcBTS.fontSRC+'/scss']
			})
			.on("error", notify.onError(function (error){
					return "Error: " + error.message;
			})
		))
		.pipe(sassLint({
				options: {
					configFile:'./_workingStage/bootstrap/scss/.sass-lint.yml',
					formatter :'stylish', 'merge-default-rules': false
				},
				files: {ignore: '**/*.scss'},
				rules: {'no-ids': 1, 'no-mergeable-selectors': 0}
		}))
		.pipe(sassLint.format())
		.pipe(sassLint.failOnError())
		.pipe(cleanCSS( {format:'keep-breaks'},{compatibility:'ie7'},{level:{ 1:{all:false}, 2:{all:false}}} ))
		.pipe(gulp.dest('./public/css/lib/'));
});

// 단독사용시..
//gulp.task('bootstrapWatch', function() {
//	gulp.watch(srcBTS.scssSRC + '/**/*.scss', ['bootstrapCSS']);
//});
//gulp.task('bootstrapRun', ['bootstrapCSS', 'bootstrapWatch']);

/** ---------------------------------------------------
 *  Copy, Changed, Clean
 *  ---------------------------------------------------
 */
var originSRC  = './public/**/*.*';
var copiedDEST = './build';

gulp.task('changedAll', function(){
	return gulp.src(originSRC)
		.pipe(changed(copiedDEST)) // changed since the last time it was run
		.pipe(gulp.dest(copiedDEST));
});

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

gulp.task('cleanDest', function() {
	// Return the Promise from del()
	// Return is the key here, to make sure asynchronous tasks are done!
	return del(['./public/js/**/', './public/css/**/','!public/assets/goat.png'])
			.then( paths => {console.log('Deleted files and folders:\n',paths.join('\n'));} );
});

gulp.task('build-clean', function(done) {
	runSequence('cleanDest',['copyJS','copyCSS'], function(){
		console.log('----- Build-Clean Finished -----');
		done();
	});
});

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
		.pipe(replace('/*! -----','\r\n/*! -----'))
		.pipe(replace(';}}',';}\r\n}'))
		.pipe(gulp.dest(_sassDEST))
		.pipe(gcallback(function(){
				console.log('----- styleSASS Finished -----');
			})
		);
});

/** ---------------------------------------------------
 *  JavaScript
 *  ---------------------------------------------------
 */
var _jsSRC  = './_workingStage/js/*.js';
var _jsDEST = './public/js/';
var JShintOP = { globals: {jQuery:true, console:true, module:true, document:true}, curly:true, eqeqeq:true, eqnull:true, browser:true /*,undef:true, unused:true*/};

// 분리된 파일 전체를 1개 파일로
gulp.task('JSConcat_ONE',function(){
	return gulp.src(_jsSRC)
		.pipe(jshint(JShintOP))
		.pipe(jshint.reporter(jshintXMLReporter))
		.pipe(concat('public.js'))
		.pipe(gulp.dest(_jsDEST))
		.pipe(gcallback(function(){
			console.log('** task done : JSConcat_ONE');
		})
	);
});

// 파일명 여러개로
gulp.task('JSConcat_TWO',function(){
	//기본공통
	var streamJsSRC1 = gulp.src(['./_workingStage/js/file1.js', './_workingStage/js/file2.js','./_workingStage/js/module/tooltip.js'])
		.pipe(concat('common.js'))
		.pipe(gulp.dest(_jsDEST))
		.pipe(gcallback(function(){
			console.log('** task done : JSConcat_SRC1');
		}));
	
	//모듈전용
	var streamJsSRC2 = gulp.src(['./_workingStage/js/module/carousel.js', './_workingStage/js/module/popover.js'])
		.pipe(concat('module.js'))
		.pipe(gulp.dest(_jsDEST))
		.pipe(gcallback(function(){
			console.log('** task done : JSConcat_SRC2');
		}));
	
	return merge(streamJsSRC1, streamJsSRC2);
});

//오류찾기
gulp.task('jsHINT',function(){
	return gulp.src(['./public/js/**/*.js','!./public/js/lib/*.js'])
		.pipe(jshint(JShintOP))
		.pipe(jshint.reporter(jshintXMLReporter))
		.on('end', jshintXMLReporter.writeFile({ format:'checkstyle', alwaysReport: 'true' }))
		.pipe(gcallback(function(){
			console.log('** task done : jsHINT');
		})
	);
});

/** ---------------------------------------------------
 *  Build, Watch
 *  ---------------------------------------------------
 */
gulp.task('build', function(done) {
	runSequence('build-clean', ['styleSASS', 'JSConcat_ONE','JSConcat_TWO'],'htmlHint', function(){
		console.log('** task build : Build Finished!!');
		done();
	});
});

gulp.slurped = false;
gulp.task('watch', function(){
	if(!gulp.slurped){
		gulp.watch(['./Gulpfile.js'],['default']);
		gulp.slurped = true;
	}
	
	//모듈 업데이트 할때만 사용하기로..
	gulp.start('update-modul');
	gulp.watch(['./_workingStage/bootstrap/**/*.scss'],['bootstrapCSS']);
	gulp.watch(['./_workingStage/sass/**/*.scss'],['styleSASS']);
	gulp.watch(['./_workingStage/js/*.js'],['JSConcat_ONE','JSConcat_TWO','jsHINT']);
	gulp.watch(['./public/**/*.{html,jsp}'],['htmlHint']);
});

gulp.task('default', ['styleSASS','bootstrapCSS','JSConcat_ONE','JSConcat_TWO','jsHINT','htmlHint','watch'], function(){
});
