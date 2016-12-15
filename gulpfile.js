const gulp = require('gulp');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const pug = require('gulp-pug');
const path = require('path');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const watchify = require('watchify');
const babel = require('gulp-babel');

const src = 'src';
const dst = 'dst/';
const scssPath = path.join(src, '*.scss');
const indexjsxPath = path.join(src, 'index.jsx');
const jsxPath = path.join(src, '*.jsx');
const pugPath = path.join(src, '*.pug');

gulp.task('sass', () => {
	gulp.src(scssPath)
		.pipe(plumber({ errorHandler: notify.onError('<%= error.message %>') }))
		.pipe(sass.sync())
		.pipe(gulp.dest(dst));
});

gulp.task('jsx', () => {
	process.env.NODE_ENV = 'production';
	gulp.src(indexjsxPath)
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(babel({
			presets: ['es2015', 'react']
		}))
		.on('error', (err) => console.log(`Error : ${err.message}`))
		.pipe(uglify())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(dst));
});

gulp.task('pug', () => {
	gulp.src(pugPath)
		.pipe(plumber({ errorHandler: notify.onError('<%= error.message %>') }))
		.pipe(pug({}))
		.pipe(gulp.dest(dst));
});

gulp.task('watch', ['sass', 'jsx', 'pug'], () => {
	gulp.watch(scssPath, ['sass']);
	gulp.watch(jsxPath, ['jsx']);
	gulp.watch(pugPath, ['pug']);
});

gulp.task('default', ['sass', 'jsx', 'pug']);