import { ActionContext, ActionTree, GetterTree, MutationTree } from 'vuex'
import { RootState } from '..'

export interface UtilsState {
    isLoading: boolean
    isPrivacyModeActive: boolean
}

const state: UtilsState = {
    isLoading: false,
    isPrivacyModeActive: false,
}

export enum UtilsMutationTypes {
    setLoading = 'setLoading',
    setPrivacyModeStatus = 'setPrivacyModeStatus',
}

export type UtilsMutations<S = UtilsState> = {
    [UtilsMutationTypes.setLoading](state: S, payload: boolean): void
    [UtilsMutationTypes.setPrivacyModeStatus](state: S, payload: boolean): void
}

const mutations: MutationTree<UtilsState> & UtilsMutations = {
    setLoading(state: UtilsState, payload: boolean) {
        state.isLoading = payload
    },
    setPrivacyModeStatus(state: UtilsState, payload: boolean) {
        state.isPrivacyModeActive = payload
    },
}

export type UtilsGetters = {
    isLoading: (state: UtilsState) => boolean
    isPrivacyModeActive: (state: UtilsState) => boolean
}

const getters: GetterTree<UtilsState, RootState> & UtilsGetters = {
    isLoading: (state) => state.isLoading,
    isPrivacyModeActive: (state) => state.isPrivacyModeActive,
}

export enum UtilsActionTypes {}

type AugmentedActionContext = {
    commit<K extends keyof UtilsMutations>(key: K, payload?: Parameters<UtilsMutations[K]>[1]): ReturnType<UtilsMutations[K]>
} & Omit<ActionContext<UtilsState, RootState>, 'commit'>

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UtilsActions {}

const actions: ActionTree<UtilsState, RootState> & UtilsActions = {}

export default { state, mutations, getters, actions }
