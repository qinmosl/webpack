//配置eslint
// npm i eslint-webpack-plugin eslint -D
module.exports = {
    // 解析选项
    parserOptions: { 
        ecmaVersion: 6, // ES 语法版本  es6
        sourceType: "module", // ES 模块化
        ecmaFeatures: { // ES 其他特性
            // jsx: true // 如果是 React 项目，就需要开启 jsx 语法
        }
    },
    // 具体检查规则   这里的规则会覆盖掉 extends的规则
    rules: {
        "no-var": 2, // 不能使用 var 定义变量
        // semi: "error", // 必须使用分号   off/0 关闭规则  warn/1 开启使用警告  error/2 开启使用错误
    },
    // 继承其他规则  如react官方的规则(react-app)
    // extends: ["eslint:recommended"],
    // ...
    // 其他规则详见：https://eslint.bootcss.com/docs/user-guide/configuring
};