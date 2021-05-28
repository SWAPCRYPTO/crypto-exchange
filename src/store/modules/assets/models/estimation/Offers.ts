import AssetModel from './AssetModel'

export default interface Offers {
    [exchange: string]: {
        [market: string]: {
            ask: AssetModel[]
            bid: AssetModel[]
        }
    }
}
