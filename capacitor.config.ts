import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
    appId: 'com.cryptoExchange',
    appName: 'CryptoExchange',
    webDir: 'dist',
    plugins: {
        SplashScreen: {
            launchAutoHide: false,
            launchShowDuration: 5,
        },
        LocalNotifications: {
            smallIcon: 'ic_stat_icon_config_sample',
            iconColor: '#d0b1fd',
        },
        PushNotifications: {
            presentationOptions: ['alert', 'sound'],
        },
    },
}

export default config
