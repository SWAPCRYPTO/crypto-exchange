const markets = [
    'BTC-USDT',
    'ETH-USDT',
    'BTC-ETH',
    'BAT-BTC',
    'BTC-EUR',
    'BTC-BTG',
]
const portfolio = ['BTC', 'ETH', 'BAT']

export const findIntersection: any = (a1: any[], a2: any[], ...rest: any[]) => {
    const a12 = a1.filter((value) => a2.includes(value))
    if (rest.length === 0) {
        return a12
    }
    return findIntersection(a12, ...rest)
}
