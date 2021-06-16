<template>
    <div class="assetsList" :class="{ 'round': walletMode }">
        <ul class="assetsList__items" v-if="!isLoading">
            <li class="assetsList__item" v-for="asset in filteredAssets" :key="asset.id" @click="selectAsset(asset.symbol)" :class="{ selected: selectedAsset === asset.symbol }">
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
                    <p class="currency__value" v-if="walletMode && +ownedVolume(asset.symbol, portfolio) > 0">{{ isPrivacyModeActive ? PRIVACY_MASK : `${preferredCurrency} ${currentAssetPrice(asset)}` }}</p>
                    <p class="currency__value" v-else>{{ preferredCurrency }} {{ formatValue(convertCurrency(asset.current_price, baseCurrencyRate, currencyRate), 6) }}</p>
                    <p class="uppercase text-sm" v-if="walletMode">{{ ownedVolume(asset.symbol, portfolio) ? isPrivacyModeActive ? PRIVACY_MASK : formatValue(ownedVolume(asset.symbol, portfolio), 6) : "" }} {{ isPrivacyModeActive ? '' : asset.symbol }}</p>
                    <p v-else class="currency__gain" :class="asset.price_change_percentage_24h_in_currency > 0 ? 'text-success' : 'text-error'">{{ formatChange(asset.price_change_percentage_24h_in_currency) }}%</p>                    
                </div>
            </li>
        </ul>
        <ul class="assetsList__items" v-else>
            <li class="assetsList__item" v-for="item in SKELETON_ITEMS" :key="item">
                <ion-skeleton-text animated style="height: 100%; width: 100%; line-height: 2.5rem; min-height: 2.5rem;" />
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import useCurrency from "@/hooks/useCurrency"
import usePrivacyMode from "@/hooks/usePrivacyMode"
import { convertCurrency } from "@/services/ConvertCurrency"
import { displayOnlySignificatDigits, formatValue } from "@/services/FormatValue"
import Asset from "@/store/modules/assets/models/Asset"
import { PortfolioItem } from "@/store/modules/auth/models/UserAccount"
import { IonSkeletonText } from '@ionic/vue';
import { computed, defineComponent, PropType, ref, Ref } from "vue"
import { useRouter } from "vue-router"
import { useStore } from "vuex"

export default defineComponent({
    name: "AssetsList",
    components: { IonSkeletonText },
    props: {
        assets: {
            type: Array as PropType<Asset[]>,
            required: true
        },
        walletMode: {
            type: Boolean,
            required: true
        },
        routableAssets: {
            type: Boolean,
            required: true
        },
        searchQuery: {
            type: String,
            required: false
        },
        allowHistory: {
            type: Boolean,
            required: false
        },
        selectedAssetSymbol: {
            type: String,
            required: false
        }
    },
    emits: ['selectedAsset'],
    setup(props, { emit }) {
        const store = useStore()
        const router = useRouter()
        const isLoading = computed(() => store.getters.isLoading)
        const { preferredCurrency, currencyRate, baseCurrencyRate } = useCurrency()

        const portfolio = computed(() => store.getters.user.account.portfolio)
        const formatChange = (value: number) => (value > 0 ? '+' : '') + value.toFixed(2)

        const ownedVolume = (asset: string, portfolioAssets: PortfolioItem[]) => portfolioAssets.find(portfolioAsset => portfolioAsset.symbol === asset)?.quantity
        const searchQuery = computed(() => props.searchQuery ? props.searchQuery.toLowerCase() : "")
        
        const filteredAssets: Ref<Asset[]> = computed(() => props.assets.filter(asset => asset.symbol.toLowerCase().indexOf(searchQuery.value) > -1 || asset.name.toLowerCase().indexOf(searchQuery.value) > -1))
        const SKELETON_ITEMS = filteredAssets.value.length > 1 ? 5 : 1

        const currentAssetPrice = (asset: Asset) => formatValue(convertCurrency((asset.current_price * (ownedVolume(asset.symbol, portfolio.value) as number)), baseCurrencyRate.value, currencyRate.value), 6)

        const { PRIVACY_MASK, isPrivacyModeActive } = usePrivacyMode()

        const selectedAsset = ref(props.selectedAssetSymbol)

        const selectAsset = (assetSymbol: string) => {
            if (props.routableAssets) {
                router.push(`/tabs/asset/${assetSymbol}${props.allowHistory ? '/history' : ''}`)
            } else {
                selectedAsset.value = assetSymbol
                emit('selectedAsset', selectedAsset.value)
            }
        }
        
        return { isLoading, SKELETON_ITEMS, preferredCurrency, formatChange, portfolio, ownedVolume, filteredAssets, currencyRate, convertCurrency, displayOnlySignificatDigits, baseCurrencyRate, currentAssetPrice, formatValue, PRIVACY_MASK, isPrivacyModeActive, selectAsset, selectedAsset }
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

.assetsList__item.selected {
    color: var(--ion-color-primary);
    @apply rounded-md;
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

.currency__value {
    @apply text-right;
}
</style>