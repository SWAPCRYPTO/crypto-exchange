import axios from 'axios'
import { PortfolioItem } from '../auth/models/UserAccount'
import calculateNettoValue from './calculateNettoValue'
import { calculateValue, pairOffers } from './estimatePortfolioValue'
import { data } from './mockData'
import Asset from './models/Asset'
import AssetModel from './models/estimation/AssetModel'
import AssetSummary from './models/estimation/AssetSummary'
import ExtendedSparkline from './models/ExtendedSparkline'
import { ExchangeRate, Currencies } from './models/NBPCurrency'
import Sparkline from './models/Sparkline'

const BASE_CURRENCY = 'USD'
const AVAILABLE_CURRENCIES = ['EUR', 'USD', 'PLN']
const SPARKLINE_KEY_PREFIX = 'sparkline_in_'
const SPARKLINE_KEY_SUFFIX = 'd'
const NUMBER_OF_ATTEMPTS = 1000
const TAX_PERCENTAGE = 0.19
export interface AssetsState {
    assets: Asset[]
    assetsOrders: any
    currencies: Currencies
    assetsSummary: Asset[]
}

const state: AssetsState = {
    assets: [],
    assetsOrders: {},
    currencies: {},
    assetsSummary: [],
}

const mutations = {
    setAssets: (state: AssetsState, payload: Asset[]) => {
        state.assets = payload
    },
    setAssetsOrders: (state: AssetsState, payload: Asset[]) => {
        state.assetsOrders = payload
    },
    setAssetChart: (
        state: AssetsState,
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
    setCurrencies: (state: AssetsState, payload: Currencies) => {
        state.currencies = payload
    },
    setAssetsSummary: (state: AssetsState, payload: Asset[]) => {
        state.assetsSummary = payload
    },
}

const getters = {
    assets: (state: AssetsState) => state.assets,
    assetsOrders: (state: AssetsState) => state.assetsOrders,
    asset: (state: AssetsState) => (symbol: string) =>
        state.assets.find((asset) => asset.symbol === symbol),
    currencies: (state: AssetsState) => state.currencies,
    assetsSummary: (state: AssetsState) => state.assetsSummary,
}

const actions = {
    fetchAssets: async ({
        commit,
        state,
    }: {
        commit: Function
        state: AssetsState
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
            state: AssetsState
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
            const splitEveryNth = 4
            let prices = data?.prices.map((price) => price[1])
            prices = prices.filter(
                (_, index) => (index + 1) % splitEveryNth !== 0
            )
            commit('setAssetChart', {
                assetId: payload.assetId,
                sparkline: {
                    key: payload.timeOption,
                    value: { price: prices },
                },
            })
        }
    },
    fetchAssetsOrders: async (
        {
            commit,
            state,
        }: {
            commit: Function
            state: AssetsState
        },
        payload: { symbol: string; currency: string }
    ) => {
        const { symbol, currency } = payload
        const corsPrefix = 'https://api.allorigins.win/get?url='
        const url = `${corsPrefix}https://api.bittrex.com/v3/markets/${symbol.toUpperCase()}-${currency}/orderbook`
        const { data } = await axios.get(url)
        const ordersData = JSON.parse(data.contents)

        // convert string to number
        for (const order in ordersData) {
            ordersData[order] = ordersData[order].map((offer: AssetModel) => ({
                quantity: +offer.quantity,
                rate: +offer.rate,
            }))
        }

        const assetsOrders = {
            ...state.assetsOrders,
            [symbol]: ordersData,
        }
        commit('setAssetsOrders', assetsOrders)
    },
    fetchCurrencies: async ({
        commit,
        state,
    }: {
        commit: Function
        state: AssetsState
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
    estimatePortfolioValue: async (
        {
            commit,
            dispatch,
            getters,
            rootGetters,
        }: {
            commit: Function
            dispatch: any
            getters: any
            rootGetters: any
        },
        payload: {
            portfolio: PortfolioItem[]
            percentageOfPortfolio: number
        }
    ) => {
        const { portfolio, percentageOfPortfolio } = payload

        try {
            const assetsSummary: AssetSummary[] = []
            Object.values(portfolio).forEach(async (asset) => {
                const assetSymbol = asset.symbol
                const preferredCurrency = rootGetters.preferredCurrency

                await dispatch('fetchAssetsOrders', {
                    symbol: assetSymbol,
                    currency: preferredCurrency,
                })

                const assetsOrders = getters.assetsOrders
                const assetData = assetsOrders[assetSymbol]
                const assetQuantity = asset.quantity * percentageOfPortfolio

                const pairedOffers = pairOffers(
                    assetData,
                    assetQuantity,
                    NUMBER_OF_ATTEMPTS
                )
                const offersValue = calculateValue(pairedOffers)
                const nettoValue = calculateNettoValue(
                    offersValue,
                    asset.purchasePrice,
                    TAX_PERCENTAGE
                )

                const assetSummary: AssetSummary = {
                    name: asset.name,
                    quantity: assetQuantity,
                    price: offersValue / assetQuantity,
                    value: offersValue,
                    nettoValue,
                }
                assetsSummary.push(assetSummary)
            })

            commit('setAssetsSummary', assetsSummary)
        } catch (e) {
            console.log(e.message)
        }
    },
}

export default { state, mutations, getters, actions }
