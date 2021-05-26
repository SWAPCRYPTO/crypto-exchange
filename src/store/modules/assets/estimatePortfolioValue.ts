import { PortfolioItem } from '../auth/models/UserAccount'
import AssetModel from './models/estimation/AssetModel'
import AssetSummary from './models/estimation/AssetSummary'
import PairedOffers from './models/estimation/PairedOffers'

const ethusd: any = {
    bid: [
        {
            quantity: 0.00431681,
            rate: 3470.038,
        },
        {
            quantity: 0.31222387,
            rate: 3467.439,
        },
        {
            quantity: 0.0018034,
            rate: 3467.438,
        },
        {
            quantity: 1.19,
            rate: 3463.07,
        },
        {
            quantity: 0.01999696,
            rate: 3463.069,
        },
        {
            quantity: 3.51,
            rate: 3462.183,
        },
        {
            quantity: 0.01618554,
            rate: 3462.182,
        },
        {
            quantity: 0.043,
            rate: 3462.104,
        },
        {
            quantity: 12.06,
            rate: 3455.412,
        },
        {
            quantity: 0.00388934,
            rate: 3455.411,
        },
        {
            quantity: 0.0051,
            rate: 3455.0,
        },
        {
            quantity: 0.01447411,
            rate: 3454.443,
        },
        {
            quantity: 5.37675694,
            rate: 3450.0,
        },
        {
            quantity: 120.25,
            rate: 3446.959,
        },
        {
            quantity: 0.01618554,
            rate: 3445.515,
        },
        {
            quantity: 0.00181521,
            rate: 3444.889,
        },
        {
            quantity: 0.00183977,
            rate: 3440.509,
        },
        {
            quantity: 0.00512,
            rate: 3438.0,
        },
        {
            quantity: 13.80749478,
            rate: 3433.551,
        },
        {
            quantity: 47.25,
            rate: 3433.55,
        },
        {
            quantity: 0.00927701,
            rate: 3432.0,
        },
        {
            quantity: 0.00652305,
            rate: 3431.43,
        },
        {
            quantity: 0.00391821,
            rate: 3429.948,
        },
        {
            quantity: 0.00728058,
            rate: 3429.0,
        },
        {
            quantity: 0.01618554,
            rate: 3428.928,
        },
    ],
    ask: [
        {
            quantity: 0.86347662,
            rate: 3472.877,
        },
        {
            quantity: 0.86364352,
            rate: 3472.903,
        },
        {
            quantity: 0.9942,
            rate: 3473.05,
        },
        {
            quantity: 0.86347662,
            rate: 3473.224,
        },
        {
            quantity: 1.21431632,
            rate: 3473.466,
        },
        {
            quantity: 1.43940587,
            rate: 3473.596,
        },
        {
            quantity: 0.292,
            rate: 3474.479,
        },
        {
            quantity: 1.43904075,
            rate: 3474.48,
        },
        {
            quantity: 3.06122607,
            rate: 3476.236,
        },
        {
            quantity: 0.43181621,
            rate: 3476.237,
        },
        {
            quantity: 0.425,
            rate: 3477.041,
        },
        {
            quantity: 0.8461,
            rate: 3477.046,
        },
        {
            quantity: 25.96954405,
            rate: 3477.096,
        },
        {
            quantity: 14.60249473,
            rate: 3489.974,
        },
        {
            quantity: 5.68265716,
            rate: 3490.025,
        },
        {
            quantity: 12.06,
            rate: 3490.867,
        },
        {
            quantity: 4.7,
            rate: 3490.875,
        },
        {
            quantity: 8.62424645,
            rate: 3493.844,
        },
        {
            quantity: 5.61804844,
            rate: 3501.116,
        },
        {
            quantity: 0.04640344,
            rate: 3502.173,
        },
        {
            quantity: 33.98054923,
            rate: 3511.847,
        },
        {
            quantity: 117.77,
            rate: 3511.848,
        },
        {
            quantity: 0.12178513,
            rate: 3516.538,
        },
        {
            quantity: 9.03288233,
            rate: 3528.294,
        },
        {
            quantity: 46.85,
            rate: 3535.524,
        },
    ],
}

const btcusd: any = {
    bid: [
        {
            quantity: 0.08043206,
            rate: 37293.728,
        },
        {
            quantity: 0.08044304,
            rate: 37288.835,
        },
        {
            quantity: 0.08044811,
            rate: 37286.821,
        },
        {
            quantity: 0.00007678,
            rate: 37282.205,
        },
        {
            quantity: 1.58191,
            rate: 37281.912,
        },
        {
            quantity: 0.13405794,
            rate: 37277.683,
        },
        {
            quantity: 0.0025,
            rate: 37277.63,
        },
        {
            quantity: 0.63162,
            rate: 37277.113,
        },
        {
            quantity: 0.04021123,
            rate: 37270.002,
        },
        {
            quantity: 0.28409701,
            rate: 37270.001,
        },
        {
            quantity: 0.0001422,
            rate: 37270.0,
        },
        {
            quantity: 0.13408834,
            rate: 37269.443,
        },
        {
            quantity: 0.39968655,
            rate: 37257.556,
        },
        {
            quantity: 0.03383578,
            rate: 37240.001,
        },
        {
            quantity: 0.074,
            rate: 37227.415,
        },
        {
            quantity: 0.00007689,
            rate: 37227.414,
        },
        {
            quantity: 0.00013,
            rate: 37210.0,
        },
        {
            quantity: 0.20253783,
            rate: 37200.0,
        },
        {
            quantity: 0.222,
            rate: 37188.594,
        },
        {
            quantity: 0.000077,
            rate: 37172.703,
        },
        {
            quantity: 0.751,
            rate: 37164.294,
        },
        {
            quantity: 0.20253783,
            rate: 37160.0,
        },
        {
            quantity: 0.00009147,
            rate: 37142.363,
        },
        {
            quantity: 0.00014269,
            rate: 37140.0,
        },
        {
            quantity: 0.20253783,
            rate: 37120.0,
        },
    ],
    ask: [
        {
            quantity: 0.08043977,
            rate: 37310.198,
        },
        {
            quantity: 0.08044811,
            rate: 37310.238,
        },
        {
            quantity: 0.08043476,
            rate: 37312.852,
        },
        {
            quantity: 0.53608,
            rate: 37318.346,
        },
        {
            quantity: 1.33925,
            rate: 37320.565,
        },
        {
            quantity: 0.01544706,
            rate: 37320.66,
        },
        {
            quantity: 0.13406628,
            rate: 37325.49,
        },
        {
            quantity: 0.1668,
            rate: 37327.478,
        },
        {
            quantity: 0.008,
            rate: 37333.689,
        },
        {
            quantity: 0.025,
            rate: 37333.693,
        },
        {
            quantity: 0.13403535,
            rate: 37335.138,
        },
        {
            quantity: 0.1668,
            rate: 37339.515,
        },
        {
            quantity: 0.09207445,
            rate: 37339.835,
        },
        {
            quantity: 0.1640994,
            rate: 37344.113,
        },
        {
            quantity: 0.21272362,
            rate: 37355.059,
        },
        {
            quantity: 0.16409486,
            rate: 37358.245,
        },
        {
            quantity: 0.074,
            rate: 37358.246,
        },
        {
            quantity: 0.40988896,
            rate: 37388.414,
        },
        {
            quantity: 0.222,
            rate: 37388.416,
        },
        {
            quantity: 0.751,
            rate: 37402.986,
        },
        {
            quantity: 0.0053978,
            rate: 37558.337,
        },
        {
            quantity: 0.04020167,
            rate: 37559.999,
        },
        {
            quantity: 0.20253783,
            rate: 37560.0,
        },
        {
            quantity: 7.191,
            rate: 37586.247,
        },
        {
            quantity: 0.25013783,
            rate: 37600.0,
        },
    ],
}

const ltcusd: any = {
    bid: [
        {
            quantity: 14.25,
            rate: 287.056,
        },
        {
            quantity: 0.859,
            rate: 287.055,
        },
        {
            quantity: 9.34937449,
            rate: 287.053,
        },
        {
            quantity: 2.0,
            rate: 287.052,
        },
        {
            quantity: 1.63795848,
            rate: 287.048,
        },
        {
            quantity: 0.83139524,
            rate: 287.046,
        },
        {
            quantity: 5.1,
            rate: 287.023,
        },
        {
            quantity: 0.31074739,
            rate: 287.022,
        },
        {
            quantity: 1.7,
            rate: 286.984,
        },
        {
            quantity: 17.6,
            rate: 285.66,
        },
        {
            quantity: 0.6770446,
            rate: 285.659,
        },
        {
            quantity: 0.61274758,
            rate: 285.641,
        },
        {
            quantity: 166.85333198,
            rate: 285.146,
        },
        {
            quantity: 2.17,
            rate: 285.145,
        },
        {
            quantity: 173.0,
            rate: 285.141,
        },
        {
            quantity: 0.35365441,
            rate: 285.0,
        },
        {
            quantity: 0.08080536,
            rate: 283.8,
        },
        {
            quantity: 0.0172,
            rate: 283.787,
        },
        {
            quantity: 69.2,
            rate: 283.672,
        },
        {
            quantity: 0.08688576,
            rate: 283.4,
        },
        {
            quantity: 0.05317866,
            rate: 282.068,
        },
        {
            quantity: 0.09807658,
            rate: 281.6,
        },
        {
            quantity: 35.0,
            rate: 281.393,
        },
        {
            quantity: 17.3,
            rate: 281.058,
        },
        {
            quantity: 0.03320943,
            rate: 280.247,
        },
    ],
    ask: [
        {
            quantity: 0.17707,
            rate: 288.807,
        },
        {
            quantity: 17.32317264,
            rate: 288.857,
        },
        {
            quantity: 17.31599305,
            rate: 288.986,
        },
        {
            quantity: 17.31375861,
            rate: 289.041,
        },
        {
            quantity: 48.46538814,
            rate: 289.241,
        },
        {
            quantity: 42.1036878,
            rate: 289.242,
        },
        {
            quantity: 1.7,
            rate: 289.243,
        },
        {
            quantity: 5.1,
            rate: 289.683,
        },
        {
            quantity: 0.54963373,
            rate: 289.684,
        },
        {
            quantity: 17.6,
            rate: 289.999,
        },
        {
            quantity: 0.47237013,
            rate: 290.0,
        },
        {
            quantity: 0.05227938,
            rate: 290.562,
        },
        {
            quantity: 71.1,
            rate: 290.98,
        },
        {
            quantity: 464.59903444,
            rate: 290.981,
        },
        {
            quantity: 0.03453695,
            rate: 291.0,
        },
        {
            quantity: 57.57268273,
            rate: 291.429,
        },
        {
            quantity: 0.19824133,
            rate: 291.43,
        },
        {
            quantity: 0.02290979,
            rate: 291.809,
        },
        {
            quantity: 0.05209129,
            rate: 291.859,
        },
        {
            quantity: 0.0173,
            rate: 292.251,
        },
        {
            quantity: 0.03464307,
            rate: 292.626,
        },
        {
            quantity: 33.9,
            rate: 292.976,
        },
        {
            quantity: 0.0233088,
            rate: 292.988,
        },
        {
            quantity: 0.02021295,
            rate: 293.737,
        },
        {
            quantity: 0.79916821,
            rate: 293.878,
        },
    ],
}

const NUMBER_OF_ATTEMPTS = 1000
const MAX_PRECISION = 4

const sumOffersQuantities = (values: AssetModel[]) =>
    values.reduce((a, b) => a + b.quantity, 0)

const closestOfferValue = (values: AssetModel[], goal: number) =>
    values.reduce((prev, curr) =>
        Math.abs(curr.quantity - goal) < Math.abs(prev.quantity - goal)
            ? curr
            : prev
    )

const test: [AssetModel[], AssetModel][] = [
    [
        [
            { quantity: 1, rate: 1 },
            { quantity: 13, rate: 1 },
            { quantity: 6, rate: 1 },
            { quantity: 1, rate: 1 },
        ],
        { quantity: 21, rate: 1 },
    ],
    [
        [
            { quantity: 14, rate: 1 },
            { quantity: 6, rate: 1 },
        ],
        { quantity: 20, rate: 1 },
    ],
]

const findClosestSmallerValue = (
    offers: [AssetModel[], AssetModel][],
    goal: number
) =>
    offers.reduce((prev, curr) => {
        // no need to further look for the closest value
        // if the precision is satisfied (for instance 1.1291 is close enough to 1.13)
        // The approx quantity is good enough
        if (goal - prev[1].quantity <= Math.pow(10, -MAX_PRECISION)) {
            return prev
        }

        return goal >= curr[1].quantity ? curr : prev
    })

// console.log(findClosestSmallerValue(test, 20))
/*

Przekazujemy wszystkie dostępne kursy w ramach danego rynku np. BTC-USD
oraz liczbę n = ilość zasobu

Sparowujemy ilosc zasobu z ofertami kursów, tak zeby wyprzedac cala ilosc zasobu.
Jesi sie uda - sukces.
Jesli sie nie uda, to dopasowujemy do ofert, za ktore sprzedamy
jak najwiecej sie da z tego co mamy.

A resztkę wrzucamy na rynek (ask) po najnizszym kursie i chcemy sprzedac, wiec bedziemy czekac az ktos kupi.
Do tego dochodzi fee makerFee.

*/
export const pairOffers = (
    offers: { bid: AssetModel[]; ask: AssetModel[] },
    n: number,
    numberOfAttempts: number
): PairedOffers => {
    const combinedOffers: [AssetModel[], AssetModel][] = [] // sums
    const { bid, ask } = offers
    for (let i = 0; i < bid.length; i++) {
        const offer = bid[i]
        if (offer.quantity === n)
            return {
                fittingOffers: [
                    [offer],
                    { quantity: n, rate: 0 } as AssetModel,
                ],
                leftOverOffers: [[], { quantity: 0, rate: 0 }],
            }

        const offersCopy = combinedOffers.slice()
        for (let j = 0; j < offersCopy.length; j++) {
            if (j > numberOfAttempts) break
            const item = offersCopy[j]
            const sumItems = [...item[0], offer]
            const sum = sumOffersQuantities(sumItems)

            if (sum == n) {
                return {
                    fittingOffers: [
                        sumItems,
                        { quantity: sum, rate: 0 } as AssetModel,
                    ],
                    leftOverOffers: [[], { quantity: 0, rate: 0 }],
                }
            } else if (sum < n)
                combinedOffers.push([
                    sumItems,
                    { quantity: sum, rate: 0 } as AssetModel,
                ])
        }
        combinedOffers.push([[offer], offer])
    }

    // didn't find the ideal offer matches
    // pick the closest offer to the volume
    console.log('Didnt find a perfect match')
    console.log('AssetValue: ' + n)

    combinedOffers.sort((a, b) => a[1].quantity - b[1].quantity)
    const closestOffer = findClosestSmallerValue(combinedOffers, n)
    console.log(closestOffer)
    console.log('Closest new: ' + closestOffer[1].quantity)

    const leftOver = n - closestOffer[1].quantity
    if (leftOver < 0) throw new Error("Couldn't match offers")
    // now we need to put the leftover value on the market as ask so we pick the ask offer with the lowest rate
    // const lowestRateOffer = ask.reduce((prevOffer, currOffer) =>
    //     prevOffer.rate < currOffer.rate ? prevOffer : currOffer
    // )

    // or find the offer with quantity a bit above the needed
    const leftOverClosestOffer = closestOfferValue(bid, leftOver)

    const leftOverOffer: [AssetModel[], AssetModel] = [
        [leftOverClosestOffer],
        { quantity: leftOver, rate: leftOverClosestOffer.rate } as AssetModel,
    ]

    return { fittingOffers: closestOffer, leftOverOffers: leftOverOffer }
}

const goal = 8
const result = pairOffers(btcusd, goal, NUMBER_OF_ATTEMPTS)
console.log(result.fittingOffers)
console.log(result.leftOverOffers)

export const calculateValue = (pairedOffers: PairedOffers): number => {
    const offers = pairedOffers.fittingOffers[0].concat(
        pairedOffers.leftOverOffers[1]
    )

    return offers.reduce((cost, offer) => cost + offer.quantity * offer.rate, 0)
}

// export const calculateValue = (pairedOffers: PairedOffers): number => {
//     const offers = pairedOffers.fittingOffers[0].concat(
//         pairedOffers.leftOverOffers[1]
//     )

//     return offers.reduce((cost, offer) => cost + offer.quantity * offer.rate, 0)
// }

// const displayOffersDetails = (pairedOffers: PairedOffers, goal: number) => {
//     console.log(goal)
//     console.log(pairedOffers.fittingOffers)
//     console.log(pairedOffers.leftOverOffers)
//     console.log(
//         pairedOffers.fittingOffers[1].quantity +
//             pairedOffers.leftOverOffers[1].quantity,
//         goal
//     )
// }

// const estimatePortfolioValue = (
//     portfolio: PortfolioItem[],
//     percentageOfPortfolio = 1
// ) => {
//     try {
//         const assetsSummary: AssetSummary[] = []
//         Object.entries(portfolio).forEach((asset) => {
//             // console.log(asset[0], asset[1])
//             const assetData = data.btcusd
//             const assetQuantity = asset[1].quantity * percentageOfPortfolio
//             const pairedOffers = pairOffers(
//                 assetData,
//                 assetQuantity,
//                 NUMBER_OF_ATTEMPTS
//             )
//             const offersValue = calculateValue(pairedOffers)
//             // displayOffersDetails(pairedOffers, assetQuantity)
//             // console.log(offersValue)

//             const assetSummary: AssetSummary = {
//                 name: asset[0],
//                 quantity: assetQuantity,
//                 price: offersValue / assetQuantity,
//                 value: offersValue,
//                 nettoValue: 0,
//             }
//             assetsSummary.push(assetSummary)
//         })

//         return assetsSummary
//     } catch (e) {
//         console.log(e.message)
//     }
// }
