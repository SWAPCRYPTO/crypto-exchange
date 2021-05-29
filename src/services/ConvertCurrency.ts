export function convertCurrency(value: number, currentCurrencyRate: number, preferedCurrencyRate: number) {
    return (value * currentCurrencyRate) / preferedCurrencyRate
}
