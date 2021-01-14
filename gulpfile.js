// 这个文件里面进行 sdy 项目的打包规则书写(既定程序)
// 导入 gulp
/*
  导入第三方包的时候, 直接写包名就可以了
  会自动去当前文件所在的目录里面的 node_modules 里面查找内容
*/
const gulp = require('gulp')

// 导入 gulp-cssmin
const cssmin = require('gulp-cssmin')

// 导入 gulp-autoprefixer
const autoprefixer = require('gulp-autoprefixer')

// 导入 gulp-sass
const sass = require('gulp-sass')

// 导入 gulp-uglify
const uglify = require('gulp-uglify')

// 导入 gulp-babel(ES6转译ES5)
const babel = require('gulp-babel')

// 导入 gulp-htmlmin
const htmlmin = require('gulp-htmlmin')

// 导入 del
const del = require('del')

// 导入 gulp-webserver
const webserver = require('gulp-webserver')

/*
  1. 配置一个打包 css 文件的任务
    + 需要做的事情, 找到 src 目录下的 css 文件的路径
    + 进行去除空格的操作
    + 放到一个 dist 目录下, 保持和 src 目录下结构一致
    + 有一个叫做 gulp-cssmin 的第三方模块
      => 当你导入这个模块以后得到的就是一个函数
      => 这个函数执行, 能把一个 流 里面的内容按照 css 的规则压缩
    + 下载: $ npm install --save-dev gulp-cssmin
    + 导入: const cssmin = require('gulp-cssmin')
    + 使用
    + 执行我们准备好的任务
      => 打开命令行, 切换目录到 gulpfile.js 文件所在的目录
      => 输入指令 $ gulp 任务名称
    + gulp@4 的语法, 是直接把任务定义成一个函数
      => 在 gulpfile.js 文件里面导出这个你准备好的函数就可以了
    + 给打包 css 文件添加一个功能
      => 自动添加前缀
      => 需要在本身的任务流上加一个环节
        -> 环节加在找到文件之后, 压缩之前
      => 需要一个叫做 gulp-autoprefixer 的第三方包
        -> 这个第三方包导入以后得到的就是一个函数, 直接执行传递一个参数就可以了
      => 下载: $ npm i -D gulp-autoprefixer
      => 导入: const autoprefixer = require('gulp-autoprefixer')
      => 使用: 需要传递一个参数, 是一个对象数据类型
        { browsers: [ '你要兼容的版本', '你要兼容的版本', ... ] }

  2. 配置一个打包 sass 文件的任务
    + 和 css 的任务对比插在哪 ?
      => 差在一个转码, 只要把 sass 转换成 css 的文件
      => 剩下的就一样了
    + 需要用到一个第三方模块叫做 gulp-sass
      => 下载: $ npm i -D gulp-sass
        -> 因为这个 gulp-sass 容易失败
        -> 因为这个 gulp-sass 需要依赖一个叫做 node-sass 的第三方
        -> 会自动下载 node-sass 第三方
        -> 因为 node-sass 第三方位置换了, 不容易成功, 所以会导致 gulp-sass 下载失败
        -> 解决: 我们单独手动配置一下下载 gulp-sass 的地址
        -> 执行指令 $ set SASS_BINARY_SITE=https://npm.taobao.org/mirrors/node-sass/
        -> 执行指令 $ npm i -D node-sass
        -> 执行指令 $ npm i -D gulp-sass
      => 导入: const sass = require('gulp-sass')
      => 使用: 导入以后直接得到一个函数, 我们直接调用就可以了

  3. 配置一个打包 js 文件的任务
    + 压缩 js 代码需要一个第三方包
      => 叫做 gulp-uglify
      => 下载: $ npm i -D gulp-uglify
      => 导入: const uglify = require('gulp-uglify')
      => 使用: 导入以后得到一个函数, 直接调用就可以了
    + 在压缩 js 以前, 最好是转换成 es5 的语法
      => 需要使用一个叫做 gulp-babel 的第三方包
      => 下载:
        -> 因为 gulp-babel 这个包需要依赖另外两个包
          1. @babel/core
          2. @babel/preset-env
        -> 但是 gulp-babel 不会自己下载
        -> 需要我们自己手动下载三个第三方包
          1. $ npm i -D gulp-babel
          2. $ npm i -D @babel/core
          3. $ npm i -D @babel/preset-env
      => 导入:
        -> 我们只需要导入 gulp-babel 这一个包就够了
        -> const babel = require('gulp-babel')
      => 使用
        -> 导入以后得到一个函数, 直接调用
        -> 需要传递一个参数, 参数是一个对象数据类型
        { preset: [ '@babel/preset-env' ] }

  4. 配置一个打包 html 文件的任务
    + 进行 html 的压缩需要一个第三方包叫做 gulp-htmlmin
    + 下载: $ npm i -D gulp-htmlmin
    + 导入: const htmlmin = require('gulp-htmlmin')
    + 使用: 导入以后得到一个函数, 直接调用接可以, 需要传递参数
    + 参数是一个对象数据类型, 对 html 文件的打包选项

  5. 配置一个打包 image 文件的任务
    + 一般前端不进行 image 文件的打包
    + 只是进行文件转移
    + 如果你需要进行无损压缩, 需要一个第三方包, 叫做 gulp-imagemin
      => 这个包一般下载不会成功

  6. 一些不需要压缩的文件直接转移
    + audio 和 video
    + 直接转移就可以了
    + fonts 文件夹直接转移
    + asstes 文件不需要压缩, 直接转移

  7. 配置一个统一管理的任务
    + 就是把其他的任务一次性启动起来
    + gulp.series() 和 gulp.parallel()
      => 因为这些任务没有前后关系
      => 使用 parallel()
    + gulp.parallel() 方法的返回值就是一个函数
    + 说明:
      => 最好是把默认任务导出成 default 这个名字
      => 因为当你在命令行执行 gulp default 的时候, 可以简写成 gulp
      => 我们直接在命令行书写 gulp 就是在运行 default 这个任务

  8. 配置一个删除的任务
    + 因为每次打包, 都是把当前最新的 src 里面的内容
      => 按照我们的规则打包到 dist 里面
      => 并不会管原先 dist 里面有什么
    + 每次打包之前, 只要把 dist 目录删除掉
      => 都按照最新的 src 打包就可以了
    + 需要一个第三方包叫做 del
      => 下载: $ npm i -D del
      => 导入: const del = require('del')
      => 使用: 导入以后就得到一个函数, 直接执行, 传递参数 [ '你要删除的目录' ]
    + 把这个删除的任务合并到统一管理的任务里面
      => 和其他打包的任务需要不需要顺序关系
      => 需要使用 gulp.series()

  9. 配置一个服务器
    + 在开发过程中以 gulp 为基础开启一个服务器
    + 在服务器上运行页面
    + 需要一个叫做 gulp-webserver 的第三方包
      => 下载: $ npm i -D gulp-webserver
      => 导入: const webserver = require('gulp-webserver')
      => 使用: 导入以后就得到一个函数, 直接调用就可以了, 需要传递参数
        -> 参数是一个对象, 对该服务器的一些配置

  10. 配置一个监控任务
    + 当你修改 src 目录下的文件的时候
    + 会自动从新执行打包任务, 把 dist 目录里面的文件修改
    + 此时, 浏览器的自动刷新就好用了
*/

// 1-1. 开启任务
// gulp@3 的语法
// gulp.task('cssHandler', function () {
//   // 函数内执行任务流没有问题
//   // 但是全局 gulp 工具不知道任务流是什么
//   // 当你书写一个 return 以后, 把这个函数内的内容返回出去了
//   // 全局 gulp 工具得到的内容就是这个函数内返回的任务流
//   return gulp
//     .src('./src/css/*.css')         // 1-2. 找到文件
//     .pipe(cssmin())                 // 1-3. 进行去空格的打包操作
//     .pipe(gulp.dest('./dist/css/')) // 1-4. 放在指定目录下
// })

// gulp@4 的语法
const cssHandler = function() {
    return gulp
        .src('./src/css/*.css') // 1-2. 找到文件
        .pipe(autoprefixer()) // 添加前缀
        .pipe(cssmin()) // 1-3. 进行去空格的打包操作
        .pipe(gulp.dest('./dist/css/')) // 1-4. 放在指定目录下
}


// 2. 打包 sass 文件的任务
const sassHandler = function() {
    return gulp
        .src('./src/sass/*.scss') // 找到文件
        .pipe(sass()) // 把 sass 转换成 css
        .pipe(autoprefixer()) // 自动添加前缀
        .pipe(cssmin()) // 压缩 css 代码
        .pipe(gulp.dest('./dist/sass/')) // 放在指定目录下
}

// 3. 打包 js 文件的任务
const jsHandler = function() {
    return gulp
        .src('./src/js/*.js') // 找到文件
        .pipe(babel({ presets: ['@babel/preset-env'] })) // 转换成 ES5 的语法
        .pipe(uglify()) // 执行压缩
        .pipe(gulp.dest('./dist/js/')) // 放到指定目录
}

// 4. 打包 html 文件的任务
const htmlHandler = function() {
    return gulp
        .src('./src/*.html') // 找到文件
        .pipe(htmlmin({
            collapseWhitespace: true, // 去除掉空格
            collapseBooleanAttributes: true, // 简写值为布尔值的属性
            removeAttributeQuotes: true, // 去除属性上的双引号
            removeEmptyAttributes: true, // 去除空属性
            removeStyleLinkTypeAttributes: true, // 移出 style 和 link 标签身上的 type 属性
            removeScriptTypeAttributes: true, // 移出 script 标签身上的 type 属性
            removeComments: true, // 移出注释
            minifyCSS: true, // 会把内嵌式的 css 样式压缩
            minifyJS: true, // 会把内嵌式的 js 代码压缩
        })) // 压缩 html 文件
        .pipe(gulp.dest('./dist/views/')) // 放到指定目录下
}

// 5. 打包 image 文件的任务
const imageHandler = function() {
    return gulp
        .src('./src/images/**.*')
        .pipe(gulp.dest('./dist/images/'))
}

// 6. 打包 audio 文件的任务
const audioHandler = function() {
    return gulp
        .src('./src/audios/**.*')
        .pipe(gulp.dest('./dist/audio/'))
}

// 8. 配置一个删除的任务
const delHandler = function() {
    return del(['./dist/'])
}

// 9. 配置一个开启服务器的任务
/*
  域名位置可以写自定义域名
    + 你写完以后, 去到 hosts 文件里面书写一个 127.0.0.1   你的自定义域名
*/
const webHandler = function() {
    return gulp
        .src('./dist') // 找到要开启的服务器目录
        .pipe(webserver({ // 开启服务器
            host: 'www.guoxiang.com', // 域名
            port: '8080', // 端口号
            livereload: true, // 自动刷新, 当源码改变的时候, 会自动刷新浏览器
            open: './views/test.html', // 自动打开哪一个页面, 从 dist 下面开始书写路径
            proxies: [ // 配置代理
                // 每一个对象就是一个代理配置
                {
                    // 代理标识符
                    source: '/dt',
                    // 代理的目标地址
                    target: 'https://www.duitang.com/napi/blog/list/by_filter_id/'
                }
            ]
        }))
}

// 10. 配置一个监控任务
const watchHandler = function() {
    gulp.watch('./src/views/*.html', htmlHandler)
    gulp.watch('./src/css/*.css', cssHandler)
    gulp.watch('./src/js/*.js', jsHandler)
}

// 7. 配置一个统一管理的任务
const defaultHandler = gulp.series(
    delHandler,
    gulp.parallel(cssHandler, sassHandler, jsHandler, htmlHandler, imageHandler, audioHandler),
    webHandler,
    watchHandler
)








// 把你准备好的函数导出
module.exports.cssHandler = cssHandler
    // 导出 sassHandler
module.exports.sassHandler = sassHandler
    // 导出 jsHandler
module.exports.jsHandler = jsHandler
    // 导出 htmlHandler
module.exports.htmlHandler = htmlHandler
    // 导出 imageHandler
module.exports.imageHandler = imageHandler
    // 导出 audioHandler
module.exports.audioHandler = audioHandler
    // 导出 defaultHandler
module.exports.default = defaultHandler
    // 导出 delHandler
module.exports.delHandler = delHandler