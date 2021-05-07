import { createStore } from 'vuex'
import utils from './modules/utils'
import assetsHandler from './modules/assets/assetsHandler'
import authentication from './modules/auth/authentication'

export default createStore({
    modules: {
        utils,
        assetsHandler,
        authentication,
    },
})
