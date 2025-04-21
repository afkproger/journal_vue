const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/media': {
        target: 'http://localhost:8000',  // адрес бэкенда
        changeOrigin: true,
        pathRewrite: { '^/media': '/media' },  // чтобы оставался правильный путь
      },
    },
  },
})
