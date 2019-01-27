/**
 * sffjs
 * https://github.com/dmester/sffjs
 * Copyright © Daniel Mester Pirttijärvi
 */
"use strict";

const gulp       = require("gulp"),
      del        = require("del"),
      fs         = require("fs"),
      rename     = require("gulp-rename"),
      closure    = require('google-closure-compiler').gulp(),
      zip        = require("gulp-zip"),
      merge      = require("merge-stream"),
      replace    = require("gulp-replace"),
      exec       = require("child_process").exec,
      pack       = require("./package.json"),
      sourcemaps = require('gulp-sourcemaps');

function getWrapper(source, placeholder) {
    return fs.readFileSync(source)
        .toString()
        .replace(/<%=contents%>/, placeholder)
        .replace(/\{version\}/g, pack.version)
        .replace(/\{year\}/g, new Date().getFullYear())
        .replace(/\{date\}/g, new Date().toISOString());
}

gulp.task("clean", function () {
    return del(["./out/*.*", "./dist/*.*"]);
});

gulp.task("compile", function () {
    var src = gulp.src("./src/stringformat.js")   
        
        // Replace variables
        .pipe(replace(/\{version\}/g, pack.version))
        .pipe(replace(/\{year\}/g, new Date().getFullYear()))
        .pipe(replace(/\{date\}/g, new Date().toISOString()))
        
        .pipe(rename(function (path) { path.basename = "stringformat"; path.extname = ".js" }))
        .pipe(gulp.dest("dist"))
        
        .pipe(rename(function (path) { path.basename = "stringformat-" + pack.version; path.extname = ".js" }))
        .pipe(gulp.dest("obj"))

        // Prepare for minification
        .pipe(sourcemaps.init())
        
        // Minified file
        .pipe(closure({ 
            compilation_level: "SIMPLE",
            rewritePolyfills: false,
            createSourceMap: true,
            outputWrapper: getWrapper("./src/template.min.js", "%output%"),
            externs: [
                { src: "var module; function define(deps, cb) { }" }
            ],
        }, {
            platform: ['native', 'java', 'javascript']
        }));

    return merge(
        src
        .pipe(rename(function (path) { path.basename = "stringformat"; path.extname = ".min.js" }))
        .pipe(sourcemaps.write('.', { 
            mapSources: (path) => "stringformat.js"
        }))
        .pipe(gulp.dest("dist")),
        
        src
        .pipe(rename(function (path) { path.basename = "stringformat-" + pack.version; path.extname = ".min.js" }))
        .pipe(sourcemaps.write('.', { 
            mapSources: (path) => `stringformat-${pack.version}.js`
        }))
        .pipe(gulp.dest("obj"))
        );
});

gulp.task("preparerelease", function () {
    return gulp.src([
        "./src/license.txt", 
        "./src/readme.txt", 
        "./src/tests.html",
        "./src/stringformat.tests.js"
    ])
        .pipe(replace(/\{version\}/g, pack.version))
        .pipe(replace(/\{year\}/g, new Date().getFullYear()))
        .pipe(replace(/\{date\}/g, new Date().toISOString()))
        .pipe(gulp.dest("dist"))
        .pipe(gulp.dest("obj"));
});

gulp.task("cultures", function () {
    return gulp.src([ "./src/cultures/*.*" ])
        .pipe(gulp.dest("dist/cultures"))
        .pipe(gulp.dest("obj/cultures"));
});

gulp.task("preparenuget", function () {
    return gulp.src(["./src/stringformat.nuspec"])
        .pipe(replace(/\{version\}/g, pack.version))
        .pipe(replace(/\{year\}/g, new Date().getFullYear()))
        .pipe(replace(/\{date\}/g, new Date().toISOString()))
        .pipe(rename(function (path) { path.basename = "~" + path.basename }))
        .pipe(gulp.dest("./"));
});

gulp.task("nuget", function (cb) {
    exec("\"./utils/nuget/nuget.exe\" pack ~stringformat.nuspec -OutputDirectory releases", function (error, stdout, stderr) {
        if (error) {
            cb(error);
        } else {
            del(["./~stringformat.nuspec"]);
            cb();
        }
    });
});

gulp.task("createpackage", function () {
    return gulp.src(["./obj/**"])
        .pipe(zip("sffjs-" + pack.version + ".zip"))
        .pipe(gulp.dest("releases"));
});

gulp.task("build", gulp.series(
    "clean",
    "compile",
    "cultures",
    "preparerelease",
    "preparenuget",
    "nuget",
    "createpackage"
));
