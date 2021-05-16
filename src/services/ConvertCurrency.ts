export function convertCurrency(value: number, preferedCurrencyRate: number) {
    return (value / preferedCurrencyRate).toFixed(2)
}
