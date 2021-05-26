import AssetModel from './AssetModel'

export default interface PairedOffers {
    fittingOffers: [AssetModel[], AssetModel]
    leftOverOffers: [AssetModel[], AssetModel]
}
