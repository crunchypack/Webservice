/* Variables */
const gulp      = require("gulp");
const concat    = require("gulp-concat");
const uglify    = require("gulp-uglify");
const sass      = require("gulp-sass");
const cleanCSS  = require("gulp-clean-css");
const sourcemap = require("gulp-sourcemaps");
const imagemin  = require("gulp-imagemin");

/* Move html-files to publication folder*/
gulp.task('copyhtmlphp', function(){
  return  gulp.src("src/*.{html,php}")
        .pipe(gulp.dest("pub/"));
});

/* Minify and concat css */
gulp.task('scss', function(){
    return gulp.src("src/css/*.scss")
        .pipe(sourcemap.init())
        .pipe(sass().on('error',sass.logError))
        .pipe(sourcemap.write())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('pub/css'));
});
/* Concat and minify JavaScript files*/
gulp.task('concminjs',function(){
    return gulp.src("src/js/*.js")
        .pipe(concat("main.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest("pub/js"));
});
/* Minify images */
gulp.task('mini-img', function(){
    return gulp.src("src/images/*")
        .pipe(imagemin())
        .pipe(gulp.dest("pub/images"));
});
/* Check for changes in files */
gulp.task("watcher", function(){
    gulp.watch("src/js/*.js", ['concminjs']);
    gulp.watch("src/*.{html,php}", ['copyhtmlphp']);
    gulp.watch("src/css/*.scss", ['scss']);
    gulp.watch("src/images/*",['mini-img']);
}) ;

/* Run all tasks with default */
gulp.task("default",["copyhtmlphp","scss", "concminjs","mini-img","watcher"]);