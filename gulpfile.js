const gulp = require("gulp");
const uglify = require("gulp-uglify");
const clean = require("gulp-clean");
const concat = require("gulp-concat");
const responsive = require("gulp-responsive");

gulp.task("clean", function() {
  return gulp.src("public/*", { read: false }).pipe(clean());
});

gulp.task("minifyJS", function() {
  return gulp
    .src("./src/scripts/client/*.js") // path to your files
    .pipe(concat("index.js"))
    .pipe(uglify())
    .pipe(gulp.dest("public/scripts/"));
});

gulp.task("imageTransformation", function(cb) {
  return gulp
    .src("src/assets/*.{jpg,png,webp}")
    .pipe(
      responsive({
        // Convert all images to JPEG format
        "*": [
          {
            // image-medium.jpg is 375 pixels wide
            width: 375,
            rename: {
              suffix: "-medium",
              extname: ".webp"
            }
          },
          {
            // image-large.webp is 480 pixels wide
            width: 480,
            rename: {
              suffix: "-large",
              extname: ".webp"
            }
          },
          {
            // image-extralarge.webp is 768 pixels wide
            width: 768,
            rename: {
              suffix: "-extralarge",
              extname: ".webp"
            }
          }
        ]
      })
    )
    .pipe(gulp.dest("src/assets"))
    .pipe(gulp.dest("public/assets"));
});

gulp.task("move", function() {
  gulp.src("manifest.json", { base: "./" }).pipe(gulp.dest("public/"));
  gulp.src("service-worker.js", { base: "./" }).pipe(gulp.dest("public/"));
  // gulp.src("./src/assets/*").pipe(gulp.dest("public/assets/"));
  return gulp.src("icons/*", { base: "./" }).pipe(gulp.dest("public/"));
});
