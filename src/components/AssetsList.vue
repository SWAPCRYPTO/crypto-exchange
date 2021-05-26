<template>
    <div class="assetsList" :class="{ 'round': walletMode }">
        <ul class="assetsList__items">
            <li class="assetsList__item" v-for="asset in filteredAssets" :key="asset.id" @click="router.push(`/tabs/asset/${asset.symbol}`)">
                <div class="currency__title">
                    <div class="currency__icon">
                        <img :src="asset.image" class="currency__icon" alt="currency icon">
                    </div>
                    <div class="currency__name">
                        <p>{{ asset.name }}</p>
                        <span class="symbol">{{ asset.symbol }}</span>
                    </div>
                </div>
                <div class="sparkline">
                </div>
                <div class="currency__details">
                    <p class="currency__value">{{ preferredCurrency }} {{ convertCurrency(asset.current_price, currencyRate) }}</p>
                    <p class="uppercase text-sm" v-if="walletMode">{{ ownedVolume(asset.symbol, portfolio) }} {{ asset.symbol }}</p>
                    <p v-else class="currency__gain" :class="asset.price_change_percentage_24h_in_currency > 0 ? 'text-success' : 'text-error'">{{ formatChange(asset.price_change_percentage_24h_in_currency) }}%</p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { convertCurrency } from "@/services/ConvertCurrency"
import Asset from "@/store/modules/assets/models/Asset"
import { Currencies } from "@/store/modules/assets/models/NBPCurrency"
import { PortfolioItem } from "@/store/modules/auth/models/UserAccount"
import { computed, defineComponent, Ref } from "vue"
import { useRouter } from "vue-router"
import { useStore } from "vuex"

export default defineComponent({
    name: "AssetsList",
    props: ['assets', 'walletMode', 'searchQuery'],
    setup(props) {
        const store = useStore()
        const router = useRouter()
        const preferredCurrency = computed(() => store.getters.user.account.preferredCurrency)
        const portfolio = computed(() => store.getters.user.account.portfolio)
        const formatChange = (value: number) => (value > 0 ? '+' : '') + value.toFixed(2)

        const ownedVolume = (asset: string, portfolioAssets: PortfolioItem[]) => portfolioAssets.find(portfolioAsset => portfolioAsset.symbol === asset)?.quantity
        const searchQuery = computed(() => props.searchQuery ? props.searchQuery.toLowerCase() : "")
        
        const filteredAssets: Ref<Asset[]> = computed(() => props.assets.filter((asset: Asset) => asset.symbol.toLowerCase().indexOf(searchQuery.value) > -1 || asset.name.toLowerCase().indexOf(searchQuery.value) > -1))
        
        const currencies: Ref<Currencies> = computed(() => store.getters.currencies)
        const currencyRate = preferredCurrency.value in currencies.value ? currencies.value[preferredCurrency.value] : 1

        return { preferredCurrency, formatChange, router, portfolio, ownedVolume, filteredAssets, currencyRate, convertCurrency }
    },
})
</script>

<style>
.assetsList {
    @apply p-4 my-4;
}

.assetsList.round {
    border-radius: 10px;
}

.assetsList__items {
    @apply flex flex-col;
}

.assetsList__item {
    @apply flex items-center justify-between my-3 cursor-pointer;
}


.assetsList__item:first-of-type {
    @apply mt-0;
}

.assetsList__item:last-of-type {
    @apply mb-0;
}

.currency__title {
    @apply flex items-center justify-between;
}

.currency__icon {
    max-width: 32px;
    @apply w-8 h-full mr-4;
}

.currency__icon img {
    @apply w-full h-full object-contain;
}

.currency__name {
    @apply flex flex-col;
}

.currency__name p {
    @apply text-lg;
}

.currency__name .symbol {
    @apply uppercase;
}

.currency__details {
    @apply flex flex-col items-end;
}
</style>