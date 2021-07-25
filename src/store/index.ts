import { CommitOptions, createStore, DispatchOptions, Store as VuexStore } from 'vuex'
import utils, { UtilsActions, UtilsActionTypes, UtilsGetters, UtilsMutations, UtilsMutationTypes, UtilsState } from './modules/utils'
import assetsHandler, { AssetsActions, AssetsActionTypes, AssetsGetters, AssetsMutations, AssetsMutationTypes, AssetsState } from './modules/assets/assetsHandler'
import authentication, { AuthState, AuthMutations, AuthActions, AuthGetters, AuthMutationTypes, AuthActionTypes } from './modules/auth/authentication'
import VuexPersistence from 'vuex-persist'

export interface RootState {
    utils: UtilsState
    assetsHandler: AssetsState
    authentication: AuthState
}

type Mutations = AuthMutations & UtilsMutations & AssetsMutations
type Actions = AuthActions & UtilsActions & AssetsActions
type Getters = AuthGetters & UtilsGetters & AssetsGetters

export const MutationTypes = { ...AuthMutationTypes, ...UtilsMutationTypes, ...AssetsMutationTypes }
export const ActionTypes = { ...AuthActionTypes, ...UtilsActionTypes, ...AssetsActionTypes }

export type Store = Omit<VuexStore<RootState>, 'getters' | 'commit' | 'dispatch'> & {
    commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(key: K, payload: P, options?: CommitOptions): ReturnType<Mutations[K]>
} & {
    dispatch<K extends keyof Actions>(key: K, payload?: Parameters<Actions[K]>[1], options?: DispatchOptions): ReturnType<Actions[K]>
} & {
    getters: {
        [K in keyof Getters]: ReturnType<Getters[K]>
    }
}

const vuexLocal = new VuexPersistence<RootState>({
    storage: window.sessionStorage,
    modules: ['assetsHandler'],
})

const store = createStore({
    modules: {
        utils,
        assetsHandler,
        authentication,
    },
    plugins: [vuexLocal.plugin],
})

export function useStore(): Store {
    return store as Store
}

export default store
