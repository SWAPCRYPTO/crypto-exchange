interface PortfolioItem {
    prop: number
}
export default interface UserAccount {
    balance: number
    portfolio: {
        [asset: string]: PortfolioItem
    }
    preferredCurrency: string
    watchedAssets: string[] | null
}
