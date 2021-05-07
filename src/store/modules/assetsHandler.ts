import axios from 'axios'
import firebase from '../../firebase'

interface InitialState {
    assets: any[]
}

const state: InitialState = {
    assets: [],
}

const mutations = {
    setAssets: (state: InitialState, payload: boolean) => {
        state.assets = []
    },
}

const getters = {
    assets: (state: InitialState) => state.assets,
}

const actions = {
    fetchAssets: async ({ commit }: any) => {
        console.log('t')
    },
}

export default { state, mutations, getters, actions }
