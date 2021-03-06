import axios from 'axios'
import { RootState } from '@/store'
import { ActionContext, ActionTree, GetterTree, MutationTree } from 'vuex'
import { collectOffers, findArbitrages, findIntersection, sortArbitrages } from './arbitrage'
import findNettoValue from './calculateNettoValue'
import { APIS, CORS_PREFIX } from './constants'
import { calculateValue, pairOffers } from './estimatePortfolioValue'
import { PortfolioItem } from '../auth/models/UserAccount'
import { ArbitrageDetails } from './models/estimation/ArbitrageDetails'
import { ExchangeRate, Currencies } from './models/NBPCurrency'
import Asset from './models/Asset'
import AssetModel from './models/estimation/AssetModel'
import AssetSummary from './models/estimation/AssetSummary'
import ExtendedSparkline from './models/ExtendedSparkline'
import Sparkline from './models/Sparkline'

export const BASE_CURRENCY = 'USD'
const AVAILABLE_CURRENCIES = ['EUR', 'USD', 'PLN']
const SPARKLINE_KEY_PREFIX = 'sparkline_in_'
const SPARKLINE_KEY_SUFFIX = 'd'
const TAX_PERCENTAGE = 0.19
const COINGECKO_API = 'https://api.coingecko.com/api/v3'
const NBP_URL = 'https://api.nbp.pl/api/'

export const fetchAssetsOrders = async (marketSymbols: [string, string], apiName: string) => {
    const apiObject = APIS.find((api) => api.name === apiName)
    if (!apiObject) throw new Error('Invalid api name.')

    const url = apiObject?.urlFormatFunction(apiObject.baseUrl, [marketSymbols[0].toUpperCase(), marketSymbols[1].toUpperCase()], apiObject.orderBookEndpoint) as string

    const { data } = await axios.get(url)
    let ordersData = JSON.parse(data.contents)

    // format data structure and convert string to number
    if (ordersData?.bids && ordersData?.asks) {
        const newOrdersData = { bid: [], ask: [] }
        for (const order in ordersData) {
            const propKey = order.slice(0, -1) as 'bid' | 'ask'
            newOrdersData[propKey] = ordersData[order].map((order: [string, string]) => ({
                quantity: +order[1],
                rate: +order[0],
            }))
        }
        ordersData = newOrdersData
    } else if (ordersData?.bid && ordersData?.ask) {
        for (const order in ordersData) {
            ordersData[order] = ordersData[order].map((offer: AssetModel) => ({
                quantity: +offer.quantity,
                rate: +offer.rate,
            }))
        }
    }

    return ordersData
}

export interface AssetsState {
    assets: Asset[]
    assetsOrders: any
    currencies: Currencies
    assetsSummary: AssetSummary[]
    isEstimationLoading: boolean
}

const state: AssetsState = {
    assets: [],
    assetsOrders: {},
    currencies: {},
    assetsSummary: [],
    isEstimationLoading: false,
}

export enum AssetsMutationTypes {
    setAssets = 'setAssets',
    setAssetsOrders = 'setAssetsOrders',
    setAssetChart = 'setAssetChart',
    setCurrencies = 'setCurrencies',
    setAssetsSummary = 'setAssetsSummary',
    setEstimationLoading = 'setEstimationLoading',
    addNewCurrency = 'addNewCurrency',
}

export type AssetsMutations<S = AssetsState> = {
    [AssetsMutationTypes.setAssets](state: S, payload: Asset[]): void
    [AssetsMutationTypes.setAssetsOrders](state: S, payload: Asset[]): void
    [AssetsMutationTypes.setAssetChart](state: S, payload: { assetId: string; sparkline: { key: string | number; value: Sparkline } }): void
    [AssetsMutationTypes.setCurrencies](state: S, payload: Currencies): void
    [AssetsMutationTypes.setAssetsSummary](state: S, payload: AssetSummary[]): void
    [AssetsMutationTypes.setEstimationLoading](state: S, payload: boolean): void
    [AssetsMutationTypes.addNewCurrency](state: S, payload: { currencyName: string; currencyRate: number }): void
}

const mutations: MutationTree<AssetsState> & AssetsMutations = {
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
        const key = SPARKLINE_KEY_PREFIX + payload.sparkline.key + SPARKLINE_KEY_SUFFIX
        if (asset) (asset as any)[key] = payload.sparkline.value
    },
    setCurrencies: (state: AssetsState, payload: Currencies) => {
        state.currencies = payload
    },
    setAssetsSummary: (state: AssetsState, payload: AssetSummary[]) => {
        state.assetsSummary = payload
    },
    setEstimationLoading: (state: AssetsState, payload: boolean) => {
        state.isEstimationLoading = payload
    },
    addNewCurrency: (state: AssetsState, payload: { currencyName: string; currencyRate: number }) => {
        state.currencies[payload.currencyName] = payload.currencyRate
    },
}

export type AssetsGetters = {
    assets: (state: AssetsState) => Asset[]
    assetsOrders: (state: AssetsState) => any
    asset: (state: AssetsState) => (symbol: string) => Asset | undefined
    currencies: (state: AssetsState) => Currencies
    baseCurrencyRate: (state: AssetsState) => number
    assetsSummary: (state: AssetsState) => AssetSummary[]
    isEstimationLoading: (state: AssetsState) => boolean
}

const getters: GetterTree<AssetsState, RootState> & AssetsGetters = {
    assets: (state) => state.assets,
    assetsOrders: (state) => state.assetsOrders,
    asset: (state) => (symbol) => state.assets.find((asset) => asset.symbol === symbol),
    currencies: (state) => state.currencies,
    baseCurrencyRate: (state) => state.currencies[BASE_CURRENCY],
    assetsSummary: (state) => state.assetsSummary,
    isEstimationLoading: (state) => state.isEstimationLoading,
}

export enum AssetsActionTypes {
    fetchAssets = 'fetchAssets',
    fetchAssetChart = 'fetchAssetChart',
    collectAssetsOrders = 'collectAssetsOrders',
    fetchCurrencies = 'fetchCurrencies',
    fetchMarketsIntersection = 'fetchMarketsIntersection',
    estimatePortfolioValue = 'estimatePortfolioValue',
}

type AugmentedActionContext = {
    commit<K extends keyof AssetsMutations>(key: K, payload?: Parameters<AssetsMutations[K]>[1]): ReturnType<AssetsMutations[K]>
} & Omit<ActionContext<AssetsState, RootState>, 'commit'>

export interface AssetsActions {
    // maybe use { commit, state }: AugmentedActionContext
    [AssetsActionTypes.fetchAssets]({ commit, state }: AugmentedActionContext, forceUpdate: boolean): void
    [AssetsActionTypes.fetchAssetChart]({ commit, state }: AugmentedActionContext, payload: { assetId: string; timeOption: number }): void
    [AssetsActionTypes.collectAssetsOrders]({ commit, state }: AugmentedActionContext, payload: { apiName: string; marketSymbols: [string, string] }): void
    [AssetsActionTypes.fetchCurrencies]({ commit }: AugmentedActionContext): Promise<void>
    [AssetsActionTypes.fetchMarketsIntersection]({ commit }: AugmentedActionContext, payload: string[]): any
    [AssetsActionTypes.estimatePortfolioValue](
        { commit, dispatch, getters }: AugmentedActionContext,
        payload: {
            portfolio: PortfolioItem[]
            percentageOfPortfolio: number
            checkArbitrage: boolean
        }
    ): void
}

const actions: ActionTree<AssetsState, RootState> & AssetsActions = {
    fetchAssets: async ({ commit, state }: { commit: Function; state: AssetsState }, forceUpdate: boolean) => {
        if (state.assets.length <= 0 || forceUpdate) {
            commit('setLoading', true)
            const { data } = await axios.get(
                `${COINGECKO_API}/coins/markets?vs_currency=${BASE_CURRENCY}&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d%2C30d%2C1y`
            )
            commit(AssetsMutationTypes.setAssets, data)
            commit('setLoading', false)
        }
    },
    fetchAssetChart: async (
        { commit, state },
        payload: {
            assetId: string
            timeOption: number
        }
    ) => {
        const asset = state.assets.find((asset) => asset.id == payload.assetId)
        const key = SPARKLINE_KEY_PREFIX + payload.timeOption + SPARKLINE_KEY_SUFFIX
        // check if asset exists and whether data needs to be fetched
        if (asset && !(asset as any)[key]) {
            const { data }: { data: ExtendedSparkline } = await axios.get(
                `${COINGECKO_API}/coins/${payload.assetId}/market_chart?vs_currency=${BASE_CURRENCY.toLowerCase()}&days=${payload.timeOption}`
            )
            const splitEveryNth = 4
            let prices = data?.prices.map((price) => price[1])
            prices = prices.filter((_, index) => (index + 1) % splitEveryNth !== 0)
            commit(AssetsMutationTypes.setAssetChart, {
                assetId: payload.assetId,
                sparkline: {
                    key: payload.timeOption,
                    value: { price: prices },
                },
            })
        }
    },
    collectAssetsOrders: async (
        { commit, state },
        payload: {
            apiName: string
            marketSymbols: [string, string]
        }
    ) => {
        const { apiName, marketSymbols } = payload
        const ordersData = await fetchAssetsOrders(marketSymbols, apiName)

        const assetsOrders = {
            ...state.assetsOrders,
            [marketSymbols[0]]: ordersData,
        }

        commit(AssetsMutationTypes.setAssetsOrders, assetsOrders)
    },
    fetchCurrencies: async ({ commit }: { commit: Function }) => {
        commit('setLoading', true)
        const rateTable = 'A'

        const { data } = await axios.get(`${NBP_URL}exchangerates/tables/${rateTable}`)

        const currencies: Currencies = {
            PLN: 1,
            USD: 3.65,
            EUR: 4.6,
        }

        data[0]?.rates.forEach((item: ExchangeRate) => {
            if (item.mid) {
                currencies[item.code] = item.mid
            }
        })

        commit(AssetsMutationTypes.setCurrencies, currencies)
        commit('setLoading', false)
    },
    fetchMarketsIntersection: async ({ commit }: { commit: Function }, payload: string[]) => {
        const availableMarkets: string[][] = []
        for (const apiObject of APIS) {
            const url = apiObject.marketsUrl

            const { data } = await axios.get(`${CORS_PREFIX}${url}`)
            const marketsData = JSON.parse(data.contents)

            let marketNames = []
            if (typeof marketsData === 'object' && !(marketsData instanceof Array)) {
                marketNames = Object.keys(marketsData.items)
            } else if (marketsData instanceof Array) {
                marketNames = marketsData.map((market) => market.symbol)
            }

            const matchingMarkets = marketNames.filter((market) => {
                const marketPair = market.split('-') as [string, string]
                return payload.includes(marketPair[0]) && payload.includes(marketPair[1])
            })
            availableMarkets.push(matchingMarkets)
        }

        const marketsIntersection = findIntersection(...availableMarkets)
        return marketsIntersection
    },
    estimatePortfolioValue: async (
        { commit, dispatch, getters },
        payload: {
            portfolio: PortfolioItem[]
            percentageOfPortfolio: number
            checkArbitrage: boolean
        }
    ) => {
        const { portfolio, percentageOfPortfolio, checkArbitrage } = payload

        try {
            commit(AssetsMutationTypes.setEstimationLoading, true)

            // arbitrages
            let sortedArbitrages: ArbitrageDetails[] = []
            if (checkArbitrage) {
                const userPortfolioAssets: string[] = getters.user.account.portfolio.map((asset: { symbol: string }) => asset.symbol.toUpperCase())
                const marketsIntersection: string[] = await dispatch(AssetsActionTypes.fetchMarketsIntersection, userPortfolioAssets)
                const exchanges = [APIS[0].name, APIS[1].name] as [string, string]
                const allOffers = await collectOffers(exchanges, marketsIntersection)

                const arbitrages1 = await findArbitrages(exchanges, allOffers)
                const arbitrages2 = await findArbitrages([exchanges[1], exchanges[0]], allOffers)
                sortedArbitrages = sortArbitrages(arbitrages1, arbitrages2)
            }

            const assetsSummary: AssetSummary[] = []
            Object.values(portfolio).forEach(async (asset) => {
                const assetSymbol = asset.symbol
                const preferredCurrency = BASE_CURRENCY

                // cannot estimate the value of an asset as it is the main currency
                // for example if BTC is the main currency instead of fiat currency
                if (assetSymbol === preferredCurrency) {
                    return
                }

                const sameAssetSummaries = []
                for (const { name } of APIS) {
                    await dispatch(AssetsActionTypes.collectAssetsOrders, {
                        apiName: name,
                        marketSymbols: [assetSymbol, preferredCurrency],
                    })

                    const assetsOrders = getters.assetsOrders
                    const assetData: { bid: AssetModel[]; ask: AssetModel[] } = assetsOrders[assetSymbol]
                    const assetQuantity = asset.quantity

                    // if there's no bid/ask data for this asset, use basic data from charts api
                    const assetDetails: Asset = getters.asset(asset.symbol)

                    // for normal currencies
                    if (!assetData.bid && !assetDetails) break

                    const pairedOffers =
                        assetData.bid && !(assetData as any).code
                            ? pairOffers(assetData.bid, assetQuantity)
                            : [{ quantity: assetQuantity, rate: assetDetails?.current_price }]

                    const offersValue = calculateValue(pairedOffers)
                    const nettoValue = findNettoValue(pairedOffers, asset.transactions, TAX_PERCENTAGE)

                    // percentageOfPortfolio
                    const pairedPercentageOffers =
                        assetData.bid && !(assetData as any)
                            ? pairOffers(assetData.bid, assetQuantity * percentageOfPortfolio)
                            : [{ quantity: assetQuantity * percentageOfPortfolio, rate: assetDetails?.current_price }]

                    const percentageOffersValue = calculateValue(pairedPercentageOffers)

                    const percentageNettoValue = findNettoValue(pairedPercentageOffers, asset.transactions, TAX_PERCENTAGE)

                    // check if arbitrage is available for this asset
                    const matchingArbitrages = checkArbitrage ? sortedArbitrages.filter((arbitrage) => arbitrage.market.split('-')[0] === assetSymbol.toUpperCase()) : []
                    let mostProfitableArbitrage = {}
                    if (matchingArbitrages.length > 0) {
                        matchingArbitrages.sort((a, b) => b.profit - a.profit)
                        mostProfitableArbitrage = matchingArbitrages[0]
                    }

                    const assetSummary: AssetSummary = {
                        name: asset.name,
                        quantity: assetQuantity,
                        price: offersValue / assetQuantity,
                        value: offersValue,
                        nettoValue,
                        percentageValue: percentageOffersValue,
                        percentageNettoValue,
                        exchangeName: name,
                        arbitrage: mostProfitableArbitrage,
                    }

                    // add asset summary to the list of summaries of the same asset
                    sameAssetSummaries.push(assetSummary)
                }

                // check which exchange market has the most valuable prices
                // find the summary with the greatest netto value
                if (sameAssetSummaries.length > 0) {
                    const mostValuableSummary = sameAssetSummaries.reduce((prevSummary, currSummary) =>
                        prevSummary.nettoValue < currSummary.nettoValue ? currSummary : prevSummary
                    )
                    assetsSummary.push(mostValuableSummary)
                }
            })

            commit(AssetsMutationTypes.setAssetsSummary, assetsSummary)

            // helps to properly render a modal component with data
            setTimeout(() => {
                commit(AssetsMutationTypes.setEstimationLoading, false)
            }, 2500)
        } catch (e) {
            console.log(e.message)
        }
    },
}

export default { state, mutations, getters, actions }
