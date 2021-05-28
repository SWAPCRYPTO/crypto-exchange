import { fetchAssetsOrders } from './assetsHandler'
import { APIS } from './constants'
import { ArbitrageDetails } from './models/estimation/ArbitrageDetails'
import AssetModel from './models/estimation/AssetModel'
import Offers from './models/estimation/Offers'

interface ArbitrageOffers {
    [key: string]: ArbitrageDetails[]
}

export const findIntersection: any = (a1: any[], a2: any[], ...rest: any[]) => {
    const a12 = a1.filter((value) => a2.includes(value))
    if (rest.length === 0) {
        return a12
    }
    return findIntersection(a12, ...rest)
}

export const collectOffers = async (apiNames: [string, string], markets: string[]) => {
    let offers: Offers = {}
    for (const apiName of apiNames) {
        let apiOffers = {}

        for (const market of markets) {
            const marketSymbol = [...market.split('-')] as [string, string]
            const marketOffers = await fetchAssetsOrders(marketSymbol, apiName)

            apiOffers = {
                ...apiOffers,
                [market]: marketOffers,
            }
        }
        offers = {
            ...offers,
            [apiName]: apiOffers,
        }
    }

    return offers
}

const calculateFees = (takerApi: string, transferApi: string, marketSymbol: [string, string], volume: number) => {
    const takerFee = APIS.find((api) => api.name === takerApi)?.takerFee
    const transferFees = APIS.find((api) => api.name == transferApi)?.transferFee
    const transferFee =
        transferFees && Object.entries(transferFees).find((market: any) => market[0] === marketSymbol[0])?.[1]

    return takerFee && transferFee ? volume * (takerFee as number) + (transferFee as number) : volume
}

const findArbitrage = (
    bid: AssetModel,
    ask: AssetModel,
    apiNames: [string, string],
    marketSymbol: [string, string]
) => {
    const transactionVolume = Math.min(bid.quantity, ask.quantity)
    const totalFee = calculateFees(apiNames[0], apiNames[1], marketSymbol, transactionVolume)
    const volumeAfterFees = transactionVolume - totalFee
    if (volumeAfterFees < 0) {
        // Not enough volume to perform this action - transaction fees are too high
        return {
            volumeAfterFees: 0,
            totalFee: 0,
            profit: 0,
            percentageProfit: 0,
            transactionVolume: 0,
        }
    }

    const rateDifference = bid.rate - ask.rate
    const profit = rateDifference * volumeAfterFees
    const percentageProfit = profit / (transactionVolume * bid.rate)

    return {
        volumeAfterFees,
        totalFee,
        profit,
        percentageProfit,
        transactionVolume,
    }
}

export const findArbitrages = async (apiNames: [string, string], exchangeOffers: Offers) => {
    const arbitrageOffers: ArbitrageOffers = {}

    for (const [marketName, offers] of Object.entries(exchangeOffers[apiNames[0]])) {
        for (const bid of offers.bid) {
            for (const ask of exchangeOffers[apiNames[1]][marketName].ask) {
                try {
                    const marketSymbol = marketName.split('-') as [string, string]
                    const { volumeAfterFees, totalFee, profit, percentageProfit } = findArbitrage(
                        bid,
                        ask,
                        apiNames,
                        marketSymbol
                    )

                    if (profit <= 0) break

                    const arbitrageDetails: ArbitrageDetails = {
                        market: marketName,
                        exchangeMarkets: apiNames,
                        totalFee,
                        volumeAfterFees,
                        profit,
                        percentageProfit,
                        bid,
                        ask,
                    }

                    if (marketName in arbitrageOffers) {
                        arbitrageOffers[marketName].push(arbitrageDetails)
                    } else {
                        arbitrageOffers[marketName] = [arbitrageDetails]
                    }
                    // eslint-disable-next-line no-empty
                } catch (e) {}
            }
        }
    }

    console.log(arbitrageOffers)

    return arbitrageOffers
}

export const sortArbitrages = (...arbitrages: ArbitrageOffers[]) => {
    const listOfArbitrages = [] // ArbitrageDetails[]

    for (const arb of arbitrages) {
        console.log('test')
        console.log(Object.values(arb).flat())
        listOfArbitrages.push(Object.values(arb).flat(2))
    }

    // return listOfArbitrages.sort((a, b) => a)
}
