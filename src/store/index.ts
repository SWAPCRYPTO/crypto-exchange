import { createStore } from 'vuex'
import utils, { UtilsState } from './modules/utils'
import assetsHandler, { AssetsState } from './modules/assets/assetsHandler'
import authentication, { AuthState } from './modules/auth/authentication'
import VuexPersistence from 'vuex-persist'

export interface RootState {
    utils: UtilsState
    assetsHandler: AssetsState
    authentication: AuthState
}

const vuexLocal = new VuexPersistence<RootState>({
    storage: window.sessionStorage,
    modules: ['assetsHandler'],
})

export default createStore({
    modules: {
        utils,
        assetsHandler,
        authentication,
    },
    plugins: [vuexLocal.plugin],
})
