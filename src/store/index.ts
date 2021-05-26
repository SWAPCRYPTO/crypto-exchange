import { createStore } from 'vuex'
import utils, { UtilsState } from './modules/utils'
import assetsHandler, { AssetsState } from './modules/assets/assetsHandler'
import authentication, { AuthState } from './modules/auth/authentication'

export interface RootState {
    utils: UtilsState
    assetsHandler: AssetsState
    authentication: AuthState
}

export default createStore({
    modules: {
        utils,
        assetsHandler,
        authentication,
    },
})
