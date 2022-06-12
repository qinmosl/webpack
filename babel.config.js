//主要用于将 ES6 语法编写的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中

//npm i babel-loader @babel/core @babel/preset-env -D

module.exports = {
    // 预设
    presets: ["@babel/preset-env"],
};