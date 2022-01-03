module.exports = {
    configureWebpack: {
      devtool: 'source-map'
    },
    pluginOptions: {
      electronBuilder: {
        preload: 'src/preload.js',
        nodeIntegration: false,
        contextBridge: true,
        publish: ['github'],
        appId: "com.neat",
        productName: "Neat",
        mac: {
          target: "default",
          icon: "build/icon.icns"
        }
      }
    }
  }