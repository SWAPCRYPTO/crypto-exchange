interface InitialState {
    isLoading: boolean
}

const state: InitialState = {
    isLoading: false,
}

const mutations = {
    setLoading(state: InitialState, payload: boolean) {
        state.isLoading = payload
    },
}

const getters = {
    isLoading: (state: InitialState) => state.isLoading,
}

const actions = {}

export default { state, mutations, getters, actions }
