const path = require('path')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css', 'json', 'txt', 'html', 'ico', 'svg']
function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: './',
  productionSourceMap:false,
  lintOnSave: false,
  devServer: { // 配置代理服务器
    proxy: {
      '/tj': {
        target: 'http://ustbhuangyi.com', // 目标地址
        changeOrigin: true,
        pathRewrite: {
          '^/tj': ''
        }
      },
      '/song': {
        target: 'http://47.95.207.1:3000', // 目标地址
        changeOrigin: true,
        pathRewrite: {
          '^/song': ''
        }
      }
    }
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('./src')) // src的绝对路径起别名为@
      .set('api', resolve('./src/api'))
      .set('style', resolve('./src/style'))
      .set('components', resolve('./src/components'))
  },
  configureWebpack: { // Gzip压缩
    plugins: [
      new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      })
    ]
  }
}