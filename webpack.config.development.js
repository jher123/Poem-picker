const path = require('path')
const { merge } = require('webpack-merge')

const config = require('./webpack.config')

module.exports = merge(config, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, 'public')
    },
    historyApiFallback: true,
    devMiddleware: {
      writeToDisk: true
    },
    client: {
      logging: 'warn'
    },
    headers: { 'Access-Control-Allow-Origin': '*' },
    hot: true
  },
  output: {
    path: path.resolve(__dirname, 'public')
  }
})
