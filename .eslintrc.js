// http://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module'
    },
    env: {
        browser: false,
        node: true,
        es6: true
    },
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    extends: 'standard',
    // required to lint *.vue files
    plugins: [
        'html'
    ],
    // add your custom rules here
    'rules': {
        // allow paren-less arrow functions
        'arrow-parens': 0,
        // allow async-await
        'generator-star-spacing': 0,
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        //定义数组或对象最后多余的逗号
        "comma-dangle": [0, "never"],
        "camelcase": 0,
        // 通用空格一致
        'comma-spacing': 0,
        //方法前空格允许
        'space-before-function-paren': 0,
        // 限制使用单引号,
        'quotes': 0,
        //不允许行尾有空格
        'no-trailing-spaces': 0,
        'no-unused-vars': 0,
        // 关闭语句强制分号结尾
        'semi': 0,
        //空行最多不能超过100行
        'no-multiple-empty-lines': [0, { 'max': 100 }],
        //关闭禁止混用tab和空格
        'no-mixed-spaces-and-tabs': [0],
        'no-tabs': 0,
        // 'indent': ['error', 'tab'],
        'indent': [2, 4],//缩进风格
        //注释空格
        'spaced-comment': 0,
        //判断无等号
        'padded-blocks': 0,
        'no-useless-escape': 0
    },
    globals: {
        App: true,
        Page: true,
        wx: true,
        swan: true,
        tt: true,
        my: true,
        getApp: true,
        getPage: true,
        requirePlugin: true,
        mpvue: true,
        mpvuePlatform: true
    }
}
