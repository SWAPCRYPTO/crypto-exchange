import Big from 'big.js'
import { Transaction } from '../auth/models/UserAccount'
import AssetModel from './models/estimation/AssetModel'

const calculateNettoValue = (currentValue: number, acquisitionCost: number, taxValue: number) => {
    const profit = Big(currentValue).minus(acquisitionCost)
    if (profit > 0) {
        const profitTax = Big(profit).times(taxValue).toNumber()
        const netto = Big(currentValue).minus(profitTax).toNumber()
        return netto
    } else return currentValue
}

export default function findNettoValue(pairedOffers: AssetModel[], transactions: Transaction[], taxValue: number) {
    // past transactions sorted ascending by date
    transactions.sort((a, b) => a.transactionDate.seconds - b.transactionDate.seconds)

    let netValue = 0

    // deep copies
    const pairedOffersQueue: AssetModel[] = []
    const transactionsQueue: Transaction[] = []

    pairedOffers.forEach((offer) => {
        pairedOffersQueue.push({
            quantity: offer.quantity,
            rate: offer.rate,
        })
    })

    transactions.forEach((transaction) => {
        transactionsQueue.push({
            purchasePrice: transaction.purchasePrice,
            quantity: transaction.quantity,
            transactionDate: {
                nanoseconds: transaction.transactionDate.nanoseconds,
                seconds: transaction.transactionDate.seconds,
            },
        })
    })

    while (pairedOffersQueue.length > 0) {
        const currentOffer = pairedOffersQueue[0]
        const currentTransaction = transactionsQueue[0]
        if (currentOffer) {
            if (currentTransaction.quantity >= currentOffer.quantity) {
                const quantity = currentOffer.quantity
                const offersValue = Big(quantity).times(currentOffer.rate).toNumber()
                netValue = Big(netValue)
                    .plus(
                        calculateNettoValue(
                            offersValue,
                            Big(quantity * currentTransaction.purchasePrice).toNumber(),
                            taxValue
                        )
                    )
                    .toNumber()

                currentTransaction.quantity = Big(currentTransaction.quantity).minus(quantity).toNumber()
                pairedOffersQueue.shift()

                if (currentTransaction.quantity === 0) {
                    transactionsQueue.shift()
                }
            } else {
                const quantity = currentTransaction.quantity
                const offersValue = Big(quantity).times(currentOffer.rate).toNumber()

                netValue = Big(netValue)
                    .plus(
                        calculateNettoValue(
                            offersValue,
                            Big(quantity * currentTransaction.purchasePrice).toNumber(),
                            taxValue
                        )
                    )
                    .toNumber()

                currentTransaction.quantity = Big(currentTransaction.quantity).minus(quantity).toNumber()
                if (currentTransaction.quantity === 0) {
                    transactionsQueue.shift()
                }

                currentOffer.quantity = Big(currentOffer.quantity).minus(quantity).toNumber()

                if (currentOffer.quantity === 0) {
                    pairedOffersQueue.shift()
                }
            }
        }
    }

    return netValue
}
