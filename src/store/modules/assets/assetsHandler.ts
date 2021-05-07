import axios from 'axios'
import Asset from './models/Asset'

interface InitialState {
    assets: Asset[]
}

const state: InitialState = {
    assets: [],
}

const mutations = {
    setAssets: (state: InitialState, payload: Asset[]) => {
        state.assets = payload
    },
}

const getters = {
    assets: (state: InitialState) => state.assets,
}

const actions = {
    fetchAssets: async ({
        commit,
        state,
    }: {
        commit: Function
        state: InitialState
    }) => {
        if (state.assets.length <= 0) {
            const preferredCurrency = 'usd'
            const { data } = await axios.get(
                `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${preferredCurrency}&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d%2C30d%2C1y`
            )
            console.log(data)
            commit('setAssets', data)
        }
    },
}

export default { state, mutations, getters, actions }
