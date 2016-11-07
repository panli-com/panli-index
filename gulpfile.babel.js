

import conf    from './config.json';


const day           = conf.start;
const title         = conf[day].title;
const description   = conf[day].description;
const keywords      = conf[day].keywords;
const author        = conf[day].author;
const version       = conf[day].version;
const mincss        = conf[day].build.css;
const minjs         = conf[day].build.js;

let cssLoadSrc = conf[day].load.css;
let jsLoadSrc  = conf[day].load.js;
let csssrc = `./${day}/src/scss/main.scss`;
let jssrc = `./${day}/src/js/*.js`;

import pkg          from './package.json';
import gulp         from 'gulp';
import sass         from 'gulp-sass';
import minifycss    from 'gulp-minify-css';
import concat       from 'gulp-concat';
import uglify       from 'gulp-uglify';
import rename       from 'gulp-rename';
import notify       from 'gulp-notify';
import saveLicense  from 'uglify-save-license';
import autoprefixer from 'gulp-autoprefixer';
import ejs          from "gulp-ejs";
import header       from 'gulp-header';
import zip          from 'gulp-zip';




const browserSync = require('browser-sync').create();
const reload      = browserSync.reload;



const banner = [
  '/*! ',
    '<%= pkg.name %> ',
    `v ${version}  | `,
    `(c) ${new Date()}  ${author}  |`,
    ' <%= pkg.homepage %> ',
    ` ${title}`,
  ' */',
  '\n'
].join('');


gulp.task('ejs', () => gulp.src(`./${day}/templates/layout.ejs`)
    .pipe(ejs({
        title: title,
        mincss: mincss,
        minjs:minjs,
        time: new Date().getTime()
    }))
    .pipe(gulp.dest(`./${day}/.__tmp`))
    .pipe(rename('index.html'))
    .pipe(gulp.dest(`./${day}/`))
    .pipe(reload({ stream: true }))
    .pipe(notify({ message: 'ejs task complete' })))

//编译Sass，Autoprefix及缩小化
gulp.task('sass', () => gulp.src(cssLoadSrc)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ['> 1%','Firefox <= 20',''],
        cascade: false
    }))
    .pipe(gulp.dest(`./${day}/.__tmp/css`))
    .pipe(rename(mincss))
    .pipe(minifycss())
    .pipe(header(banner, { pkg }))
    .pipe(gulp.dest(`./${day}/build/css/`))
    .pipe(reload({stream: true}))
    .pipe(notify({ message: 'Styles  task complete' })));


gulp.task('scripts',() => gulp.src(jsLoadSrc)
    .pipe(concat('main.js'))
    .pipe(gulp.dest(`./${day}/.__tmp/js`))
    .pipe(rename(minjs))
    .pipe(uglify())
    .pipe(header(banner, { pkg }))
    .pipe(gulp.dest(`./${day}/build/js/`))
    .pipe(reload({stream: true}))
    .pipe(notify({ message: 'Scripts task complete' })));

gulp.task('html',() => {
    gulp.src(`./${day}/*.html`)
        .pipe(reload({stream: true}))
});


gulp.task('home', () => gulp.src('./home/scss/main.scss')
    .pipe(sass({ style: 'expanded' }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('./home/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('./home/css/'))
    .pipe(reload({stream: true}))
    .pipe(notify({ message: 'home style  task complete' })));


gulp.task('homeHtml',() => {
    gulp.src('./*.html')
        .pipe(reload({stream: true}))
});



// 静态服务器 + 监听 scss/html 文件
gulp.task('dev', ['sass'], () => {

    browserSync.init({
        server: `./${day}/`
    });

    // 看守.scss 档
    gulp.watch(`./${day}/src/scss/**/*.scss`, ['sass']);
    gulp.watch(`./${day}/src/scss/*.scss`, ['sass']);
    gulp.watch('./home/scss/*.scss', ['home']);
    // 看守所有.js档
    gulp.watch(`./${day}/*.js`, ['scripts']);
    gulp.watch(`./${day}/src/js/*.js`, ['html','scripts']);

    // 看守所有.html
    gulp.watch(`./${day}/*.html`).on('change', reload);
    gulp.watch('./*.html').on('change', reload);

    gulp.watch([`./${day}/templates/*.html`, `./${day}/templates/*.ejs` ,`./${day}/templates/module/*.ejs`], ['ejs']);

});


gulp.task('default', ['dev','sass','ejs']);
