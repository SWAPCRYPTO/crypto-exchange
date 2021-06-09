import { computed, Ref } from 'vue'
import { useStore } from 'vuex'

import Asset from '@/store/modules/assets/models/Asset'
import User from '@/store/modules/auth/models/User'

export default function useBalance() {
    const store = useStore()
    const assets: Ref<Asset[]> = computed(() => store.getters.assets)
    const findAssetRate = (assetSymbol: string, assets: Asset[]) =>
        assets.find((asset) => asset.symbol == assetSymbol)?.current_price as number

    const user: Ref<User> = computed(() => store.getters.user)
    const balance = computed(() => {
        let portfolioSum = 0

        user.value.account.portfolio.forEach((portfolioAsset) => {
            const assetRate = findAssetRate(portfolioAsset.symbol, assets.value)
            const assetValue = (assetRate ? assetRate : 0) * portfolioAsset.quantity

            portfolioSum += assetValue
        })

        return portfolioSum
    })

    return balance
}
