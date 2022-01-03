module.exports = {
    configureWebpack: {
      devtool: 'source-map'
    },
    pluginOptions: {
      electronBuilder: {
        preload: 'src/preload.js',
        nodeIntegration: false,
        contextBridge: true,
        appId: "com.neat",
        productName: "Neat",
        mac: {
          target: "default",
          icon: "build/icon.icns"
        }
      }
    }
  }