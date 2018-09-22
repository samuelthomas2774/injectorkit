import gulp from 'gulp';
import pump from 'pump';
import babel from 'gulp-babel';
import archiver from 'gulp-archiver';
import rename from 'gulp-rename';

gulp.task('build', function () {
    return pump([
        gulp.src('src/**/*.js'),
        babel(),
        gulp.dest('dist'),
    ]);
});

gulp.task('watch', gulp.series('build', function () {
    return gulp.watch('src/**/*.js', gulp.series('build'));
}));

gulp.task('build-bdv2-extmodule', function () {
    return pump([
        gulp.src('src/**/*.js', {base: '.'}),
        babel(),
        rename(path => path.dirname = 'dist' + path.dirname.substr(3)),
        gulp.src('elements/discord.js', {base: '.'}),
        gulp.src('config.json'),
        gulp.src('package.json'),
        gulp.src('README.md'),
        archiver('bdv2-extmodule.zip'),
        gulp.dest('.'),
    ]);
});
