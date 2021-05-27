/* 
Obliczamy całkowity koszt nabycia zasobu - ilość zasobu * cena za 1 sztuke opłaty transakcyjne

Kazda wykonana przez nas transakcja ma okreslona date zakupu.
Wiec parujemy to ile chcemy sprzedac z transakcjami ktore wykonalismy od najstarszej daty

Do funkcji podajemy calkowity koszt nabycia zasobu (acquisitionCost)
oraz obecną wartość danej ilości zasobu.
Obecna wartość danej ilości zasobu to ilość zasobu * cena za 1 sztukę - za tyle teraz chcemy sprzedać (currentCost)

acquisitionCost = 100
currentCost = 120

zysk = currentCost - acquisitionCost = 20
taskValue = 0.19
podatekOdZysku = zysk * taxValue = 20 * 0.19 = 3.8
netto = currentCost - podatekOdZysku
*/

import { Transaction } from '../auth/models/UserAccount'
import AssetModel from './models/estimation/AssetModel'

const assetQuantity = 120
const offersValue = 100
// const transactions = [
//     {
//         purchasePrice: 0.23,
//         quantity: 70,
//         transactionDate: {
//             nanoseconds: 2,
//             seconds: 0,
//         },
//     },
//     {
//         purchasePrice: 10,
//         quantity: 50,
//         transactionDate: {
//             nanoseconds: 0,
//             seconds: 30000,
//         },
//     },
// ]

const pairedOffers = [
    {
        quantity: 3,
        rate: 3511.848,
    },
    {
        quantity: 101,
        rate: 3516.538,
    },
    {
        quantity: 15,
        rate: 3528.294,
    },
    {
        quantity: 1,
        rate: 3535.524,
    },
]

const transactions = [
    {
        purchasePrice: 4000,
        quantity: 2,
        transactionDate: {
            nanoseconds: 0,
            seconds: 0,
        },
    },
    {
        purchasePrice: 50,
        quantity: 48,
        transactionDate: {
            nanoseconds: 0,
            seconds: 20,
        },
    },
    {
        purchasePrice: 2535.524,
        quantity: 70,
        transactionDate: {
            nanoseconds: 0,
            seconds: 120,
        },
    },
]

const calculateNettoValue = (
    currentValue: number,
    acquisitionCost: number,
    taxValue: number
) => {
    const profit = currentValue - acquisitionCost
    if (profit > 0) {
        const profitTax = profit * taxValue
        const netto = currentValue - profitTax
        return netto
    } else return currentValue
}

function findNettoValue(
    quantity: number,
    pairedOffers: AssetModel[],
    transactions: Transaction[],
    taxValue: number
) {
    // past transactions sorted ascending by date
    transactions.sort(
        (a, b) => a.transactionDate.seconds - b.transactionDate.seconds
    )

    let netValue = 0
    // these are not deeply copied, it's just a ref
    const pairedOffersQueue = pairedOffers
    const transactionsQueue = transactions

    while (pairedOffersQueue.length > 0) {
        const currentOffer = pairedOffersQueue[0]
        const currentTransaction = transactionsQueue[0]
        if (currentOffer) {
            if (currentTransaction.quantity >= currentOffer.quantity) {
                const quantity = currentOffer.quantity
                const offersValue = quantity * currentOffer.rate
                console.log('Netto: ' + netValue)
                console.log('Qty: ' + quantity + ', rate: ' + currentOffer.rate)
                console.log('Current offer value: ' + offersValue)
                console.log(
                    'Current transaction value: ' +
                        currentTransaction.purchasePrice
                )
                netValue += calculateNettoValue(
                    offersValue,
                    quantity * currentTransaction.purchasePrice,
                    taxValue
                )
                currentTransaction.quantity -= quantity
                pairedOffersQueue.shift()

                if (currentTransaction.quantity === 0) {
                    transactionsQueue.shift()
                }
                console.log('Netto: ' + netValue)
                console.log(
                    'Offer netto value: ' +
                        calculateNettoValue(
                            offersValue,
                            quantity * currentTransaction.purchasePrice,
                            taxValue
                        ),
                    'Ilosc: ' + quantity
                )
                console.log('\n')
            } else {
                const quantity = currentTransaction.quantity
                const offersValue = quantity * currentOffer.rate
                console.log('Netto: ' + netValue)
                console.log('Qty: ' + quantity + ', rate: ' + currentOffer.rate)
                console.log('Current offer value: ' + offersValue)
                console.log(
                    'Current transaction value: ' +
                        currentTransaction.purchasePrice
                )

                console.log(
                    'Netto offer value: ' +
                        calculateNettoValue(
                            offersValue,
                            quantity * currentTransaction.purchasePrice,
                            taxValue
                        )
                )

                netValue += calculateNettoValue(
                    offersValue,
                    quantity * currentTransaction.purchasePrice,
                    taxValue
                )

                currentTransaction.quantity -= quantity
                if (currentTransaction.quantity === 0) {
                    transactionsQueue.shift()
                }

                console.log(currentOffer)
                currentOffer.quantity -= quantity
                console.log(currentOffer, 34)
                console.log('\n')

                if (currentOffer.quantity === 0) {
                    pairedOffersQueue.shift()
                }
            }
        }
    }

    return netValue
}

console.log(pairedOffers.reduce((sum, el) => sum + el.quantity * el.rate, 0))
console.log(findNettoValue(assetQuantity, pairedOffers, transactions, 0.19))

// export default
// function findNettoValue(
//     quantity: number,
//     pairedOffers: AssetModel[],
//     transactions: Transaction[],
//     taxValue: number
// ) {
//     // transactions sorted ascending by date
//     const sortedTransactions = transactions.sort(
//         (a, b) => a.transactionDate.seconds - b.transactionDate.seconds
//     )

//     let netValue = 0
//     let availableQuantity = quantity

//     for (let i = 0; i < sortedTransactions.length; i++) {
//         const transaction = sortedTransactions[i]

//         if (transaction.quantity >= availableQuantity) {
//             // transakcja miala tyle jednostek albo wiecej niz to co chcemy sprzedac
//             return (
//                 netValue +
//                 availableQuantity *
//                     calculateNettoValue(
//                         offersValue,
//                         transaction.purchasePrice,
//                         taxValue
//                     )
//             )
//         } else {
//             // chcemy sprzedac 10 jednostek, a w danej transakcji bylo tylko 3 jednostki
//             netValue +=
//                 transaction.quantity *
//                 calculateNettoValue(
//                     offersValue,
//                     transaction.purchasePrice,
//                     taxValue
//                 )
//             availableQuantity -= transaction.quantity
//         }
//     }

//     return Math.min(netValue, offersValue)
// }

// console.log(findNettoValue(12, 50000, transactions, 0.19))
// 10 * (50000 - 0.19 * (50000 - 4000)) + 2 * (50000 - 0.19 * (50000 - 6000))
