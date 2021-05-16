import axios from 'axios'
import Asset from './models/Asset'
import { ExchangeRate, Currencies } from './models/NBPCurrency'

const BASE_CURRENCY = 'PLN'
const AVAILABLE_CURRENCIES = ['EUR', 'USD', 'PLN']
interface InitialState {
    assets: Asset[]
    currencies: Currencies
}

const state: InitialState = {
    assets: [],
    currencies: {},
}

const mutations = {
    setAssets: (state: InitialState, payload: Asset[]) => {
        state.assets = payload
    },
    setCurrencies: (state: InitialState, payload: Currencies) => {
        state.currencies = payload
    },
}

const getters = {
    assets: (state: InitialState) => state.assets,
    asset: (state: InitialState) => (symbol: string) =>
        state.assets.find((asset) => asset.symbol === symbol),
    currencies: (state: InitialState) => state.currencies,
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
            const { data } = await axios.get(
                `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${BASE_CURRENCY}&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d%2C30d%2C1y`
            )
            console.log(data)
            commit('setAssets', data)
        }
    },
    fetchCurrencies: async ({
        commit,
        state,
    }: {
        commit: Function
        state: InitialState
    }) => {
        if (state.currencies.length <= 0) {
            const rateTable = 'A'
            const { data } = await axios.get(
                `https://api.nbp.pl/api/exchangerates/tables/${rateTable}`
            )
            const currencies: Currencies = {
                PLN: 1,
            }

            data[0].rates.forEach((item: ExchangeRate) => {
                console.log(item)
                if (AVAILABLE_CURRENCIES.includes(item.code) && item.mid) {
                    currencies[item.code] = item.mid
                }
            })

            commit('setCurrencies', currencies)
        }
    },
}

export default { state, mutations, getters, actions }
