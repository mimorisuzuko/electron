const gulp = require('gulp');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const pug = require('gulp-pug');
const path = require('path');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const buffer = require('vinyl-buffer');
const watchify = require('watchify');
const minimist = require('minimist');
const _ = require('lodash');
const {server} = require('electron-connect');

const electron = server.create();
const {argv} = process;
const src = 'src';
const dst = 'dst/';
const scssPath = path.join(src, '*.scss');
const indexjsxPath = path.join(src, 'index.jsx');
const jsxPath = path.join(src, '*.jsx');
const pugPath = path.join(src, '*.pug');
const locals = { code: '' };
const {_: [taskName]} = minimist(_.slice(argv, 2));
let bundler = browserify({
	entries: [indexjsxPath],
	debug: true,
	transform: [
		[babelify, { presets: ['es2015', 'react'] }]
	]
});
bundler = taskName === 'watch' ? watchify(bundler) : bundler;

gulp.task('electron', () => {
	electron.start();
	gulp.watch(['./app/**/*.js'], electron.restart);
	gulp.watch(['src/**/*'], electron.reload);
	locals.code = `const {client} = require('electron-connect');\nclient.create();`;
});

gulp.task('sass', () => {
	gulp.src(scssPath)
		.pipe(plumber({ errorHandler: notify.onError('<%= error.message %>') }))
		.pipe(sass.sync())
		.pipe(gulp.dest(dst));
});

gulp.task('jsx', () => {
	process.env.NODE_ENV = 'production';
	bundler
		.bundle()
		.on('error', (err) => console.log(`Error : ${err.message}`))
		.pipe(source('index.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(uglify())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(dst));
});

gulp.task('pug', () => {
	gulp.src(pugPath)
		.pipe(plumber({ errorHandler: notify.onError('<%= error.message %>') }))
		.pipe(pug({ locals }))
		.pipe(gulp.dest(dst));
});

gulp.task('watch', ['electron', 'sass', 'jsx', 'pug'], () => {
	gulp.watch(scssPath, ['sass']);
	gulp.watch(jsxPath, ['jsx']);
	gulp.watch(pugPath, ['pug']);
});

gulp.task('default', ['sass', 'jsx', 'pug']);