// import '@/'    // 282-有提示效果 在jsconfig.json中配置

// 281-配置按需加载
const {  override,  addPostcssPlugins,  addWebpackAlias,  addBabelPlugins } = require('customize-cra')
const pxToViewport = require('postcss-px-to-viewport')
const path = require('path')  //282-webpack在node环境下运行 可以导入node模块
// console.log(path) // 常用属性、resolve、join、dirname、basename、extname、parse
/**css处理器  
 * 1.预处理器：less、sass    
 * 2.后处理器：postcss  
 * 3.脚手架集成autoprefixer:自动添加前缀  -webkit-transform -moz- 
 * pxtorem,
 * pxtoviewport 
  */
/**--- 
 * customize-cra、https://www.jianshu.com/p/568832790592
 */


// 282-配置别名、设置相对路径  
const alias = addWebpackAlias({
  '@': path.resolve(__dirname, 'src'),
  // 公共sass路径
  '@scss': path.resolve(__dirname, 'src', 'assets', 'styles')
})

// 283-移动端布局 - viewportWidth 视口 适配方案
const viewport = pxToViewport({
  viewportWidth: 375
  // 不需要将 px 转 vw 的白名单
  // 说明：该数组中的类名中的 px 不会被转化为 vw。 这些类名可以为任意名称。
  // selectorBlackList: ['.ignore', '.hairlines']
})

module.exports = override(
  addPostcssPlugins([viewport]), //这里addPostcssPlugins代替初始的fixBabelImportsa在customize-cra引入的
  alias,
  ...addBabelPlugins(['import', { libraryName: 'antd-mobile', style: 'css' }])
)