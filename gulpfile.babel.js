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
// 기존 Task와 충돌 할 수 있으므로 build 폴더를 clear 한 뒤에 Task 실행
const routes = {
    pug: {
        watchSrc: "src/**/*.pug",
        src: "src/*.pug",
        dest:"build"
    },
}
const pug = () => 
    gulp
        .src(routes.pug.src)
        .pipe(gpug())
        .pipe(gulp.dest(routes.pug.dest)); 

const clean = () => del(["build"]);

const prepare = gulp.series([clean]);

const assets = gulp.series([pug]);

const webserver = () => gulp.src("build").pipe(ws({port: 8088, livereload: true, open: true}))

const watch = () => {
    gulp.watch(routes.pug.watchSrc, pug);
}
const postDev = gulp.parallel([webserver, watch]);

// export는 package.json에서 사용할 때 쓰면 댐
export const dev = gulp.series([prepare, assets, postDev]);