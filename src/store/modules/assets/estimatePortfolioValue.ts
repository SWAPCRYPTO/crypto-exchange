import { PortfolioItem } from '../auth/models/UserAccount'
import { data, portfolio } from './mockData'
import AssetModel from './models/estimation/AssetModel'
import AssetSummary from './models/estimation/AssetSummary'
import PairedOffers from './models/estimation/PairedOffers'

const NUMBER_OF_ATTEMPTS = 1000

const sumOffersQuantities = (values: AssetModel[]) =>
    values.reduce((a, b) => a + b.quantity, 0)

const closestOfferValue = (values: AssetModel[], goal: number) =>
    values.reduce((prev, curr) =>
        Math.abs(curr.quantity - goal) < Math.abs(prev.quantity - goal)
            ? curr
            : prev
    )

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
    const combinedOffers: Array<[AssetModel[], AssetModel]> = [] // sums
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

    // no need to further look for the closest value
    // if the precision is satisfied (for instance 1.1291 is close enough to 1.13)
    const maxPrecision = 4
    let closest = bid[0].quantity
    let chosenIndex = 0
    for (let i = 0; i < combinedOffers.length; i++) {
        const sumValue = combinedOffers[i][1].quantity
        if (Math.abs(sumValue - n) < Math.abs(closest - n)) {
            closest = sumValue
            chosenIndex = i
            if (n - closest <= Math.pow(10, -maxPrecision)) {
                // console.log('The approx quantity is good enough', n - closest)
                break
            }
        }
    }

    const leftOver = n - closest
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

    const fittingOffers = combinedOffers[chosenIndex]

    return { fittingOffers, leftOverOffers: leftOverOffer }
}

// const goal = 1.23
// pairOffers(data.btcusd, goal, NUMBER_OF_ATTEMPTS)

export const calculateValue = (pairedOffers: PairedOffers): number => {
    const offers = pairedOffers.fittingOffers[0].concat(
        pairedOffers.leftOverOffers[1]
    )

    return offers.reduce((cost, offer) => cost + offer.quantity * offer.rate, 0)
}

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
