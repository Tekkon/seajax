var gulp = require('gulp');
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var pump = require("pump");
var fs = require("fs");

var BUILD_SOURCE_PATH = "./v2/build";
var BUILD_TARGET_PATH = "./bin/v2";
var SRC_PATH = "./v2/src"
var SCRIPTS_PATH = './TestWebApplication/Scripts';

var TARGETS = {
    image: getFilesToBuild("image/standalone.txt"),
    zoom: getFilesToBuild("zoom/standalone.txt"),
    zoomimage: getFilesToBuild("zoomimage/standalone.txt"),
    pivot: getFilesToBuild("pivot/standalone.txt"),
    ajax: getFilesToBuild("ajax/standalone.txt"),
    utils: getFilesToBuild("utils/standalone.txt")
}

gulp.task('default', function () {
    Object.getOwnPropertyNames(TARGETS).forEach(function (val, idx, array) {
        buildSpecific(val, TARGETS[val]);
    });
});

function getFilesToBuild(path) {
    var files = fs.readFileSync(BUILD_SOURCE_PATH + "/" + path).toString().split("\n");
    
    files.forEach(function (val, idx, array) {
        array[idx] = getSrcPath(val);
    });

    return files;
}

function getSrcPath(path) {
    return SRC_PATH + '/' + path;
}

function buildSpecific(target, files) {
    gulp
         .src(files)
         .pipe(concat(target + ".js"))
         .pipe(gulp.dest(BUILD_TARGET_PATH))
         .pipe(gulp.dest(SCRIPTS_PATH))
         .pipe(uglify())
         .pipe(rename(target + ".min.js"))
         .pipe(gulp.dest(BUILD_TARGET_PATH))
         .pipe(gulp.dest(SCRIPTS_PATH));
}