export interface Transaction {
    purchasePrice: number
    quantity: number
    transactionDate: {
        nanoseconds: number
        seconds: number
    }
}

export interface PortfolioItem {
    name: string
    symbol: string
    quantity: number
    transactions: Transaction[]
}

export default interface UserAccount {
    balance: number
    portfolio: PortfolioItem[]
    preferredCurrency: string
    watchedAssets: string[] | null
}
