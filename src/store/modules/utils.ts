export interface UtilsState {
    isLoading: boolean
}

const state: UtilsState = {
    isLoading: false,
}

const mutations = {
    setLoading(state: UtilsState, payload: boolean) {
        state.isLoading = payload
    },
}

const getters = {
    isLoading: (state: UtilsState) => state.isLoading,
}

const actions = {}

export default { state, mutations, getters, actions }
