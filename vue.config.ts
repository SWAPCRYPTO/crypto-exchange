module.exports = {
    chainWebpack: (config) => {
        /* 
       Disable (or customize) prefetch, see:
       https://cli.vuejs.org/guide/html-and-static-assets.html#prefetch
    */
        config.plugins.delete('prefetch')
        config.plugin('preload').tap((options) => {
            options[0].include = 'allChunks'
            return options
        })
    },
    pwa: {
        name: 'CryptoExchange',
        themeColor: '#d0b1fd',
        msTileColor: '#d0b1fd',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: '#d0b1fd',
        workboxPluginMode: 'InjectManifest',
        workboxOptions: {
            swSrc: 'src/service-worker.js',
        },
    },
}
