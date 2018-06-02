'use strict';

const gulp = require('gulp');
const runSequence = require('run-sequence');
const gutil = require('gulp-util');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const eslint = require('gulp-eslint');
const plumber = require('gulp-plumber');
const uglify = require('gulp-uglify');
const replace = require('gulp-replace');
const mocha = require('gulp-mocha');
const karmaServer = require('karma').Server;
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('gulp-cssnano');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const spawn = require('child_process').spawn;

let node;
let protractor;

gulp.task('server', () => {
	if (node) node.kill();
	node = spawn('node', ['server.js'], {stdio: 'inherit'});
	node.on('close', (code) => {
		if (code === 8) {
			gulp.log('Error detected, waiting for changes...');
		}
	});
});

gulp.task('server-test', () => {
	return gulp.src(['./test/server/*.js'], { read: false })
		.pipe(mocha({ reporter: 'nyan' }))
		.on('error', gutil.log);
});

let karmaSRV;
gulp.task('client-unit-test-single-run', (done) => {
	if (!karmaSRV) {
		karmaSRV = new karmaServer({
			configFile: require('path').resolve('test/karma.conf.js'),
			singleRun: true
		});

		karmaSRV.on('browser_error', (browser, err) => {
			console.log('=====\nKarma > Run Failed\n=====\n', err);
			throw err;
		});

		karmaSRV.on('run_complete', (browsers, results) => {
			if (results.failed) {
				// throw new Error('=====\nKarma > Tests Failed\n=====\n', results);
				console.log('=====\nKarma > Tests Failed\n=====\n', results);
			} else {
				console.log('=====\nKarma > Complete With No Failures\n=====\n', results);
			}

			done();
		});

		karmaSRV.start();
	} else {
		console.log('<<<<< karmaSRV already running >>>>>');
	}
});

gulp.task('client-e2e-test', () => {
	if (protractor) protractor.kill();
	protractor = spawn('npm', ['run', 'protractor'], {stdio: 'inherit'});
});

gulp.task('clean-build', () => { // clean old files before a new build
	return del(['./public/css/*.css', './public/js/*.js', './public/fonts/*.otf', './public/fonts/*.eot', './public/fonts/*.svg', './public/fonts/*.ttf', './public/fonts/*.woff', './public/fonts/*.woff2']);
});

gulp.task('pack-app-js', () => {
	require('dotenv').load();
	const env = process.env;
	return gulp.src('./public/app/*.js')
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['env']
		}))
		.pipe(concat('packed-app.js'))
		.pipe(replace('soundcloud_client_id', env.SOUNDCLOUD_CLIENT_ID))
		.pipe(replace('firebase_api_key', env.FIREBASE_API_KEY))
		.pipe(replace('firebase_auth_domain', env.FIREBASE_AUTH_DOMAIN))
		.pipe(replace('firebase_database_url', env.FIREBASE_DATABASE_URL))
		.pipe(replace('firebase_project_id', env.FIREBASE_PROJECT_ID))
		.pipe(replace('firebase_storage_bucket', env.FIREBASE_STORAGE_BUCKET))
		.pipe(replace('firebase_messaging_sender_id', env.FIREBASE_MESSAGING_SENDER_ID))
		.pipe(replace('privileged_access_firebase_uid', env.PRIVILEGED_ACCESS_FIREBASE_UID))
		.pipe(replace('google_apis_browser_key', env.GOOGLE_APIS_BROWSER_KEY))
		.pipe(replace('google_apis_client_id', env.GOOGLE_APIS_CLIENT_ID))
		.pipe(uglify())
		.pipe(plumber.stop())
		.pipe(rename('packed-app.min.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./public/js'));
});

gulp.task('pack-app-css', () => {
	return gulp.src('./public/app/scss/*.scss')
		.pipe(plumber())
		.pipe(concat('packed-app.css'))
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(cssnano())
		.pipe(plumber.stop())
		.pipe(rename('packed-app.min.css'))
		.pipe(gulp.dest('./public/css'));
});

gulp.task('pack-vendor-js', () => {
	return gulp.src([
		/*
		*	add third party js files here
		*/
		'./node_modules/jquery/dist/jquery.js',

		'./node_modules/firebase/firebase.js',

		'./node_modules/angular/angular.js',
		'./node_modules/angular-sanitize/angular-sanitize.js',
		'./node_modules/angular-aria/angular-aria.js',
		'./node_modules/angular-messages/angular-messages.js',
		'./node_modules/angular-animate/angular-animate.js',
		'./node_modules/angular-material/angular-material.js',
		'./node_modules/angular-resource/angular-resource.js',
		'./node_modules/angular-route/angular-route.js',
		'./node_modules/angular-mocks/angular-mocks.js',
		'./node_modules/angular-websocket/dist/angular-websocket.js',

		'./node_modules/angular-google-gapi/dist/angular-google-gapi.js'
	])
		.pipe(plumber())
		.pipe(concat('vendor-pack.js'))
		.pipe(uglify())
		.pipe(plumber.stop())
		.pipe(rename('vendor-pack.min.js'))
		.pipe(gulp.dest('./public/js'));
});

gulp.task('pack-vendor-css', () => {
	return gulp.src([
		/*
		*	add third party css files here
		*/
		'./node_modules/font-awesome/css/font-awesome.css',
		
		'./node_modules/angular-material/angular-material.css',
		'./node_modules/angular-material/layouts/angular-material.layouts.css',
		'./node_modules/angular-material/layouts/angular-material.layout-attributes.css'
	])
		.pipe(plumber())
		.pipe(concat('vendor-pack.css'))
		.pipe(cssnano())
		.pipe(plumber.stop())
		.pipe(rename('vendor-pack.min.css'))
		.pipe(gulp.dest('./public/css'));
});

gulp.task('move-vendor-fonts', () => {
	return gulp.src([
		/*
		*	add third party fonts here
		*/
		'./node_modules/font-awesome/fonts/*.*'
	])
		.pipe(gulp.dest('./public/fonts'));
});

gulp.task('lint', () => { // uses ignore list from .eslintignore
	return gulp.src(['./public/app/**', './*.js'])
		.pipe(eslint('./.eslintrc.json'))
		.pipe(eslint.format());
});

gulp.task('watch', () => {
	gulp.watch(['./server.js', './app/**/*.js'], ['server']); // watch server changes and restart server
	gulp.watch(['./public/*.js', './public/app/**/*.js', './*.js', './.eslintignore', './.eslintrc.json'], ['lint']); // watch files to be linted or eslint config files and lint on change
	gulp.watch('./public/app/scss/*.scss', ['pack-app-css']); // watch app css changes, pack css, minify and put in respective folder
	gulp.watch('./public/app/**/*.js', ['pack-app-js', 'client-unit-test-single-run']); // watch app js changes, pack js, minify and put in respective folder
	gulp.watch(['./test/client/unit/*.js', './test/karma.conf.js'], ['client-unit-test-single-run']); //watch unit test changes and run tests
	gulp.watch(['./test/client/e2e/**', './test/protractor.conf.js'], ['client-e2e-test']); // watch client e2e test or protractor config changes and run tests
	gulp.watch(['./server.js', './test/server/test.js'], ['server-test']); // watch server changes and run tests
});

gulp.task('build', (done) => {
	runSequence('lint', 'pack-app-js', 'pack-app-css', 'pack-vendor-js', 'pack-vendor-css', 'move-vendor-fonts', done);
});

gulp.task('test', (done) => {
	runSequence('server-test', 'client-unit-test-single-run', 'client-e2e-test', done);
});

gulp.task('default', (done) => {
	runSequence('build', 'server', 'watch', /*'test',*/ done);
});

gulp.task('bump-version-patch', () => {
	const version = require('gulp-bump');
	return gulp.src(['./package.json'])
		.pipe(version({type: 'patch'}))
		.pipe(gulp.dest('./'));
});

gulp.task('bump-version-minor', () => {
	const version = require('gulp-bump');
	return gulp.src(['./package.json'])
		.pipe(version({type: 'minor'}))
		.pipe(gulp.dest('./'));
});

gulp.task('bump-version-major', () => {
	const version = require('gulp-bump');
	return gulp.src(['./package.json'])
		.pipe(version({type: 'major'}))
		.pipe(gulp.dest('./'));
});

gulp.task('bump-version-prerelease', () => {
	const version = require('gulp-bump');
	return gulp.src(['./package.json'])
		.pipe(version({type: 'prerelease'}))
		.pipe(gulp.dest('./'));
});

process.on('exit', function(code) {
	console.log(`PROCESS EXITED WITH CODE ${code}`);
});
