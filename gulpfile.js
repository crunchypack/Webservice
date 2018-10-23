/* Variables */
const gulp      = require("gulp");
const concat    = require("gulp-concat");
const htmlmin   = require("gulp-htmlmin");
const uglify    = require("gulp-uglify");
const sass      = require("gulp-sass");
const cleanCSS  = require("gulp-clean-css");
const sourcemap = require("gulp-sourcemaps");
const imagemin  = require("gulp-imagemin");

/* Move php-files to publication folder*/
gulp.task('copyphp', function(){
  return  gulp.src("src/*.php")
        .pipe(gulp.dest("../../../../../xampp/htdocs/webb"));
});
/* Minify html */
gulp.task('minihtml', function()  {
    return gulp.src("src/*.html")
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(gulp.dest("../../../../../xampp/htdocs/webb"));
  });

/* Minify and concat css */
gulp.task('scss', function(){
    return gulp.src("src/css/*.scss")
        .pipe(sourcemap.init())
        .pipe(sass().on('error',sass.logError))
        .pipe(sourcemap.write())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('../../../../../xampp/htdocs/webb/css'));
});
/* Concat and minify JavaScript files*/
gulp.task('concminjs',function(){
    return gulp.src("src/js/*.js")
        .pipe(concat("main.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest("../../../../../xampp/htdocs/webb/js"));
});
/* Minify images */
gulp.task('mini-img', function(){
    return gulp.src("src/images/*")
        .pipe(imagemin())
        .pipe(gulp.dest("../../../../../xampp/htdocs/webb/images"));
});
/* Check for changes in files */
gulp.task("watcher", function(){
    gulp.watch("src/js/*.js", ['concminjs']);
    gulp.watch("src/*.php", ['copyphp']);
    gulp.watch("src/*.html",["minihtml"]);
    gulp.watch("src/css/*.scss", ['scss']);
    gulp.watch("src/images/*",['mini-img']);
}) ;

/* Run all tasks with default */
gulp.task("default",["copyphp","scss","minihtml", "concminjs","mini-img","watcher"]);