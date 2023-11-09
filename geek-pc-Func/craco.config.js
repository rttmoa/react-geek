const path = require('path')
const { whenProd, getPlugin, pluginByName } = require('@craco/craco')


module.exports = {
  webpack: {
    // 配置别名
    alias: {
      // 约定：使用 @ 表示 src 文件所在路径
      '@': path.resolve(__dirname, 'src')
    },
    configure: (webpackConfig) => {
      // 如何配置 cdn
      let cdn = {
        js: [],
        css: []
      }
      whenProd(() => {
        webpackConfig.externals = {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
        cdn = {
          js: [
            'https://cdn.bootcdn.net/ajax/libs/react/17.0.2/umd/react.production.min.js',
            'https://cdn.bootcdn.net/ajax/libs/react-dom/17.0.2/umd/react-dom.production.min.js',
          ],
          css: []
        }
      })
      const { isFound, match } = getPlugin(
        webpackConfig,
        pluginByName('HtmlWebpackPlugin')
      )
      if (isFound) {
        // 找到了HtmlWebpackPlugin的插件
        match.userOptions.cdn = cdn
      }
      return webpackConfig
    }
  }
}