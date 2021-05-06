interface InitialState {
    isLoading: boolean
    currentCurrency: string
}

const state: InitialState = {
    isLoading: false,
    currentCurrency: 'USD',
}

const mutations = {
    setLoading(state: InitialState, payload: boolean) {
        console.log(payload)
        state.isLoading = payload
    },
    setCurrentCurrency(state: InitialState, payload: string) {
        state.currentCurrency = payload
    },
}

const getters = {
    isLoading: (state: InitialState) => state.isLoading,
    currentCurrency: (state: InitialState) => state.currentCurrency,
}

const actions = {}

export default { state, mutations, getters, actions }
