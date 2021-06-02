import AssetModel from './models/estimation/AssetModel'
/*
Przekazujemy wszystkie dostępne kursy w ramach danego rynku np. BTC-USD
oraz liczbę n = ilość zasobu

Sparowujemy ilosc zasobu z ofertami kursów, tak zeby wyprzedac cala ilosc zasobu.
Od góry są oferty z najlepszymi kursami. Dopasowuję 
Jesi sie uda - sukces.
Jesli sie nie uda, to dopasowujemy do ofert, za ktore sprzedamy
jak najwiecej sie da z tego co mamy.
*/

export const pairOffers = (offers: AssetModel[], givenQuantity: number, transferFee: number) => {
    const sortedOffers = offers.sort((a, b) => b.rate - a.rate)
    let availableQuantity = givenQuantity
    let currentOfferIndex = 0

    const chosenOffers: AssetModel[] = []

    while (availableQuantity > 0) {
        let tradeQuantity = availableQuantity
        let rate = 0

        // if there's not enough offers to buy, pick the offer
        // with the lowest rate and simulate the transaction or throw an exception
        // as the operation is not possible
        if (currentOfferIndex == sortedOffers.length) {
            const lowestRateOffer = sortedOffers.reduce((prevOffer, currOffer) =>
                prevOffer.rate < currOffer.rate ? prevOffer : currOffer
            )
            rate = lowestRateOffer.rate
        } else {
            const offerQuantity = sortedOffers[currentOfferIndex].quantity
            tradeQuantity = Math.min(availableQuantity, offerQuantity) // - transferFee
            rate = sortedOffers[currentOfferIndex].rate
            currentOfferIndex++
        }

        const offer = {
            quantity: tradeQuantity,
            rate,
        }

        chosenOffers.push(offer)
        availableQuantity -= tradeQuantity
    }

    return chosenOffers
}

export const calculateValue = (pairedOffers: AssetModel[]): number =>
    pairedOffers.reduce((cost, offer) => cost + offer.quantity * offer.rate, 0)
