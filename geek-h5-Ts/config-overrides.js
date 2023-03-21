// 用于覆盖webpack的配置
const { override, fixBabelImports, addWebpackAlias, addPostcssPlugins, addWebpackExternals } = require('customize-cra');
const px2viewport = require('postcss-px-to-viewport');
const path = require('path');

/* 
  css处理器
    预处理器：less sass stylus
    后处理器：postcss (js中的babel)
      autoprefixer : 自动添加前缀  tranform:
      pxtorem :px 转成rem
      pxtoviewport px转成vw
*/
// antd 的按需加载
const babelPlugin = fixBabelImports('import', {
  libraryName: 'antd-mobile',
  style: 'css',
})

// 配置别名
const alias = addWebpackAlias({
  '@': path.join(__dirname, 'src'),
  '@scss': path.join(__dirname, 'src/assets/styles'),
})

const postcssPlugins = addPostcssPlugins([
  px2viewport({ viewportWidth: 375 })
])

// 排除第三方的依赖包 - 打包 上线 
const obj = process.env.NODE_ENV === 'production' ? { react: 'React', 'react-dom': 'ReactDOM' } : {};

const externals = addWebpackExternals(obj);

module.exports = override(externals, babelPlugin, alias, postcssPlugins)
