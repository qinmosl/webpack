//文件路径
const path = require("path")
//eslint插件
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
//处理html
const HtmlWebpackPlugin = require("html-webpack-plugin");
//不把css打包到js中  npm i mini-css-extract-plugin -D
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
//css压缩 npm i css-minimizer-webpack-plugin -D
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");


// 获取处理样式的Loaders  npm i postcss-loader postcss postcss-preset-env -D
const getStyleLoaders = (preProcessor) => {
    return [
        //  "style-loader",
        MiniCssExtractPlugin.loader,    //需要换成这个才能打包成单独，直接使用插件也不行
        "css-loader",
        {
            loader: "postcss-loader",
            options: {
                postcssOptions: {
                    plugins: [
                        "postcss-preset-env", // 能解决大多数样式兼容性问题
                    ],
                },
            },
        },
        preProcessor,
    ].filter(Boolean);  //过滤掉不传的undefined
};

module.exports = {
    //入口
    entry: "./src/main.js",
    //输出
    output: {
        //文件输出目录，必须是绝对路径
        // path.resolve()方法返回一个绝对路径
        // __dirname 当前文件的文件夹绝对路径
        path: path.resolve(__dirname, "../dist"),
        //输出文件名
        filename: "static/js/main.js", // 将 js 文件输出到 static/js 目录中
        clean: true, // 自动将(不是这次)打包的目录资源清空
    },
    //加载器(loader)
    module: {
        rules: [
            {
                oneOf: [
                    {
                        //处理CSS资源  npm i css-loader style-loader -D
                        test: /\.css$/,   //匹配.css结尾文件        不要加引号，否则报错，会报没有合适loader
                        //use数组里面Loader执行顺序为从右到左
                        // use:["style-loader","css-loader",
                        //     {
                        //         loader: "postcss-loader",
                        //         options: {
                        //         postcssOptions: {
                        //             plugins: [
                        //             "postcss-preset-env", // 能解决大多数样式兼容性问题
                        //             ],
                        //         },
                        //         },
                        //     },
                        // ]

                        use: getStyleLoaders(),
                    },
                    {
                        //处理less资源
                        test: /\.less$/,
                        // use: ["style-loader", "css-loader", "less-loader"],
                        use: getStyleLoaders("less-loader"),
                    },
                    {
                        //下载 sass-loader同时下载sass
                        //处理scss/sass资源  
                        test: /\.s[ac]ss$/,
                        // use: ["style-loader", "css-loader", "sass-loader"],
                        use: getStyleLoaders("sass-loader"),
                    },
                    {
                        //stylus-loader：负责将 Styl 文件编译成 Css 文件
                        test: /\.styl$/,
                        // use: ["style-loader", "css-loader", "stylus-loader"],
                        use: getStyleLoaders("stylus-loader"),
                    },
                    {
                        //处理图片资源  Webpack5 已经将两个 Loader（file-loader 和 url-loader） 功能内置到 Webpack 里了
                        test: /\.(png|jpe?g|gif|webp)$/,
                        // 资源模块类型(asset module type)，通过添加 4 种新的模块类型，来替换所有这些 webpack5之前的loader
                        // asset/resource 发送一个单独的文件并导出 URL。之前通过使用 file-loader 实现。
                        // asset/inline 导出一个资源的 data URI。之前通过使用 url-loader 实现。
                        // asset/source 导出资源的源代码。之前通过使用 raw-loader 实现。
                        // asset 在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用 url-loader，并且配置资源体积限制实现。
                        type: "asset",

                        parser: {
                            dataUrlCondition: {
                                maxSize: 10 * 1024 // 小于10kb的图片会被base64处理  base64会把体积变大，所以处理小图
                            }
                        },
                        generator: {
                            // 将图片文件输出到 static/imgs 目录中
                            // 将图片文件命名 [hash:8][ext][query]
                            // [hash:8]: hash值取8位
                            // [ext]: 使用之前的文件扩展名
                            // [query]: 添加之前的query参数
                            filename: "static/imgs/[hash:8][ext][query]",
                        },

                    },
                    {
                        //处理其他资源
                        test: /\.(ttf|woff2?|map4|map3|avi)$/,
                        type: "asset/resource",
                        generator: {
                            filename: "static/media/[hash:8][ext][query]",
                        },
                    },
                    {
                        //使用bable 向下兼容
                        test: /\.js$/,
                        exclude: /node_modules/, // 排除node_modules代码不编译
                        //  include: path.resolve(__dirname, "../src"), // 也可以用包含  src
                        loader: "babel-loader",
                        options: {
                            cacheDirectory: true, // 开启babel编译缓存
                            cacheCompression: false, // 缓存文件不要压缩
                            plugins: ["@babel/plugin-transform-runtime"], // 减少代码体积
                        },
                    },

                ]
            }


        ],
    },
    //插件(plugin)
    plugins: [
        new ESLintWebpackPlugin({
            // 指定检查文件的根目录
            context: path.resolve(__dirname, "../src"),
            cache: true, // 开启缓存
            // 缓存目录
            cacheLocation: path.resolve(
              __dirname,
              "../node_modules/.cache/.eslintcache"
            ),
        }),
        new HtmlWebpackPlugin({
            // 以 public/index.html 为模板创建文件
            // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
            template: path.resolve(__dirname, "../public/index.html"),
        }),
        // 提取css成单独文件
        new MiniCssExtractPlugin({
            // 定义输出文件名和目录
            filename: "static/css/main.css",
        }),
        // css压缩
        new CssMinimizerPlugin(),
    ],

    // 开发服务器  不需要每次写完代码都需要手动输入指令才能编译代码  这样他不会编译到dist,会直接打开浏览器先看看
    // devServer: {
    //     host: "localhost", // 启动服务器域名
    //     port: "3000", // 启动服务器端口号
    //     open: true, // 是否自动打开浏览器
    // },
    //模式  开发模式(自动压缩了html和js,并把css打包到了js文件中去了，会出现闪屏现象，所以我们用插件来弄单独的css文件)
    mode: "production",
    //行列映射
    devtool: "source-map",
}