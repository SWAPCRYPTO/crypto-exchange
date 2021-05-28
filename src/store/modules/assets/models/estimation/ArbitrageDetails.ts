import AssetModel from './AssetModel'

export interface ArbitrageDetails {
    market: string
    exchangeMarkets: [string, string]
    totalFee: number
    volumeAfterFees: number
    profit: number
    percentageProfit: number
    bid: AssetModel
    ask: AssetModel
}
