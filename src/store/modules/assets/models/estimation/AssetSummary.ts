import { ArbitrageDetails } from './ArbitrageDetails'

export default interface AssetSummary {
    name: string
    quantity: number
    price: number
    value: number
    nettoValue: number
    percentageValue: number
    percentageNettoValue: number
    exchangeName: string
    arbitrage: ArbitrageDetails | {}
}
