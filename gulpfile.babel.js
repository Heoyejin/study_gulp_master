/* 
    Date: 20210214
    Description: src의 *.pug을 이용하여 src 내부 파일들을 build 폴더에 html로 변환 해주는 예제  
*/
import gulp from "gulp";
// https://www.npmjs.com/package/gulp-pug
import gpug from "gulp-pug";
import del from "del";
// https://www.npmjs.com/package/gulp-webserver
import ws from "gulp-webserver";
import image from "gulp-image";
// https://www.npmjs.com/package/gulp-sass
import sass from "gulp-sass";
// https://www.npmjs.com/package/gulp-autoprefixer
import autop from "gulp-autoprefixer"
// https://www.npmjs.com/package/gulp-csso
import miniCSS from "gulp-csso";

sass.compiler = require("node-sass");

// 기존 Task와 충돌 할 수 있으므로 build 폴더를 clear 한 뒤에 Task 실행
const routes = {
    pug: {
        watchSrc: "src/**/*.pug",
        src: "src/*.pug",
        dest:"build"
    },
    img:{
        src: "src/img/*",
        dest: "build/img"
    },
    scss: {
        watchSrc: "src/scss/**/*.scss",
        src: "src/scss/styles.scss",
        dest: "build/css"
    }
}

const pug = () => 
    gulp
        .src(routes.pug.src)
        .pipe(gpug())
        .pipe(gulp.dest(routes.pug.dest)); 

const img = () => 
    gulp
        .src(routes.img.src)
        .pipe(image())
        .pipe(gulp.dest(routes.img.dest));

const styles = () => 
    gulp
        .src(routes.scss.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(autop({
            // 지원할 브라우저 범위를 지정하는 옵션, 필요한 css속성들이 자동으로 추가 된다.
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(miniCSS())
        .pipe(gulp.dest(routes.scss.dest));
    
const clean = () => del(["build"]);

const prepare = gulp.series([clean, img]);

const assets = gulp.series([pug, styles]);

const webserver = () => gulp.src("build").pipe(ws({port: 8088, livereload: true, open: true}))

const watch = () => {
    gulp.watch(routes.pug.watchSrc, pug);
    gulp.watch(routes.img.src, img);
    gulp.watch(routes.scss.watchSrc, styles);
}
const postDev = gulp.parallel([webserver, watch]);

// export는 package.json에서 사용할 때 쓰면 댐
export const dev = gulp.series([prepare, assets, postDev]);