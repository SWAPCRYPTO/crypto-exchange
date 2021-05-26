export interface PortfolioItem {
    name: string
    symbol: string
    quantity: number
    purchasePrice: number
}
export default interface UserAccount {
    balance: number
    portfolio: PortfolioItem[]
    preferredCurrency: string
    watchedAssets: string[] | null
}
