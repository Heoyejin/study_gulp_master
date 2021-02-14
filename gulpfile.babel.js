/* 
    Date: 20210214
    Description: src의 *.pug을 이용하여 src 내부 파일들을 build 폴더에 html로 변환 해주는 예제  
*/
import gulp from "gulp";
// https://www.npmjs.com/package/gulp-pug
import gpug from "gulp-pug";
import del from "del";
// 기존 Task와 충돌 할 수 있으므로 build 폴더를 clear 한 뒤에 Task 실행
const routes = {
    pug: {
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
export const dev = gulp.series([prepare, assets]);