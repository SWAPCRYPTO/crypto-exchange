import axios from 'axios'
import Asset from './models/Asset'
import ExtendedSparkline from './models/ExtendedSparkline'
import { ExchangeRate, Currencies } from './models/NBPCurrency'
import Sparkline from './models/Sparkline'

const BASE_CURRENCY = 'PLN'
const AVAILABLE_CURRENCIES = ['EUR', 'USD', 'PLN']
const SPARKLINE_KEY_PREFIX = 'sparkline_in_'
const SPARKLINE_KEY_SUFFIX = 'd'
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
    setAssetChart: (
        state: InitialState,
        payload: {
            assetId: string
            sparkline: { key: string; value: Sparkline }
        }
    ) => {
        const asset = state.assets.find((asset) => asset.id == payload.assetId)
        const key =
            SPARKLINE_KEY_PREFIX + payload.sparkline.key + SPARKLINE_KEY_SUFFIX
        if (asset) (asset as any)[key] = payload.sparkline.value
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
            commit('setAssets', data)
        }
    },
    fetchAssetChart: async (
        {
            commit,
            state,
        }: {
            commit: Function
            state: InitialState
        },
        payload: {
            assetId: string
            currency: string
            timeOption: number
        }
    ) => {
        const asset = state.assets.find((asset) => asset.id == payload.assetId)
        const key =
            SPARKLINE_KEY_PREFIX + payload.timeOption + SPARKLINE_KEY_SUFFIX
        // check if asset exists and whether data needs to be fetched
        if (asset && !(asset as any)[key]) {
            const { data }: { data: ExtendedSparkline } = await axios.get(
                `https://api.coingecko.com/api/v3/coins/${payload.assetId}/market_chart?vs_currency=${payload.currency}&days=${payload.timeOption}`
            )

            const prices = data?.prices.map((price) => price[1])
            commit('setAssetChart', {
                assetId: payload.assetId,
                sparkline: {
                    key: payload.timeOption,
                    value: { price: prices },
                },
            })
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
