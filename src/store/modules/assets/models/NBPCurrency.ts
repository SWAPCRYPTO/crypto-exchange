export interface ExchangeRate {
    currency: string
    code: string
    bid?: number
    ask?: number
    mid?: number
}

export interface NBPResponse {
    effectiveDate: string
    rates: ExchangeRate[]
    actionDate: string
}

export interface Currencies {
    [currency: string]: number
}
