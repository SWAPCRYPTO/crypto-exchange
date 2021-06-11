export interface UtilsState {
    isLoading: boolean
    isPrivacyModeActive: boolean
}

const state: UtilsState = {
    isLoading: false,
    isPrivacyModeActive: false,
}

const mutations = {
    setLoading(state: UtilsState, payload: boolean) {
        state.isLoading = payload
    },
    setPrivacyModeStatus(state: UtilsState, payload: boolean) {
        state.isPrivacyModeActive = payload
    },
}

const getters = {
    isLoading: (state: UtilsState) => state.isLoading,
    isPrivacyModeActive: (state: UtilsState) => state.isPrivacyModeActive,
}

const actions = {}

export default { state, mutations, getters, actions }
