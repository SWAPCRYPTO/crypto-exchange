<template>
  <ion-page>
    <ion-header translucent>
      <ion-toolbar mode="ios">
        <ion-title v-if="!isLoading">{{ isPrivacyModeActive ? PRIVACY_MASK : `${preferredCurrency} ${formatValue(convertCurrency(balance, baseCurrencyRate, currencyRate), 2)}` }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen>
      <section class="home container md:max-w-screen-md">
        <div class="home__container">
            <BalanceHeader />
            <section class="watchlist__container" v-if="watchedAssets.length > 0">
                <h2 class="h2">Watchlist</h2>
                <AssetsList :assets="watchedAssets" :walletMode="false" :allowHistory="false" routableAssets />
            </section>
            <section class="topMovers__container">
                <h2 class="h2">Top movers</h2>
                <AssetsList :assets="topMovers" :walletMode="false" :allowHistory="false" routableAssets />
            </section>
        </div>
      </section>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, Ref } from 'vue'
import { useRouter } from 'vue-router';
import { MutationTypes, useStore } from '@/store'

import BalanceHeader from '@/components/BalanceHeader.vue'
import AssetsList from '../components/AssetsList.vue'
import Asset from '@/store/modules/assets/models/Asset'
import User from '@/store/modules/auth/models/User'
import { convertCurrency } from "@/services/ConvertCurrency"
import { formatValue } from "@/services/FormatValue"
import { BASE_CURRENCY } from '@/store/modules/assets/assetsHandler'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue'
import useBalance from "@/hooks/useBalance"
import usePrivacyMode from "@/hooks/usePrivacyMode"
import useCurrency from "@/hooks/useCurrency"

import { ActionTypes } from "@/store"

const sortAssets = (items: Asset[], key: string, absoluteValues: boolean) => 
  items.sort((a, b) => absoluteValues ? Math.abs((a as any)[key]) - Math.abs((b as any)[key]) : (a as any)[key] - (b as any)[key])

const findTopMovers = <T extends unknown>(items: T[], numberOfItems: number) => 
  items.slice(0, numberOfItems).concat(items.slice(items.length - numberOfItems, items.length))

export default defineComponent({
    name: "Dashboard",
    components: { BalanceHeader, AssetsList, IonHeader, IonToolbar, IonTitle, IonContent, IonPage },
    setup() {
        const store = useStore()
        store.getters
        const router = useRouter()
        const isLoading: ComputedRef<boolean> = computed(() => store.getters.isLoading)
        const user = computed(() => store.getters.user) as ComputedRef<User>
        
        const { preferredCurrency, currencies, currencyRate, baseCurrencyRate } = useCurrency() 
        const assets: ComputedRef<Asset[]> = computed(() => store.getters.assets)
        
        const fetchData = (forceUpdate: boolean) => store.dispatch(ActionTypes.fetchAssets, forceUpdate)
        const fetchCurrencies = () => store.dispatch(ActionTypes.fetchCurrencies)
        const updateUserAccount = (preferredCurrency: string) => store.dispatch(ActionTypes.updateUserAccount, { ...user.value.account, preferredCurrency })
        
        fetchData(false)
        // this may cause a isLoading = true bug

        const refreshPeriod = 1000 * 1 * 60 * 5 // refresh assets data every 5 mins on client side
        setInterval(() => {
          fetchData(true)
        }, refreshPeriod) 
        

        fetchCurrencies().then(() => {
          const cryptosAsCurrencies = ['BTC', 'ETH']

          for (const currentCurrency of cryptosAsCurrencies) {
            const foundAsset = assets.value.find((asset: Asset) => asset.symbol === currentCurrency.toLowerCase())

            if (foundAsset) {
              store.commit(MutationTypes.addNewCurrency, { currencyName: foundAsset.symbol.toUpperCase(), currencyRate: foundAsset.current_price * baseCurrencyRate.value })
            }

            if (preferredCurrency.value === currentCurrency && !(currentCurrency in currencies.value)) {
              updateUserAccount(BASE_CURRENCY)
            }
          }
        })

        const balance = useBalance()
        
        const PRICE_CHANGE_PERCENTAGE_KEY = "price_change_percentage_24h_in_currency"
        const NUMBER_OF_TOP_MOVING_ASSETS = 5

        const watchedAssets: Ref<Asset[]> = computed(() => assets.value.filter(asset => user.value.account.watchedAssets?.includes(asset.symbol)))
        const sortedAssets: Ref<Asset[]> = computed(() => sortAssets(assets.value.slice(), PRICE_CHANGE_PERCENTAGE_KEY, false))

        const topMovingAssets = computed(() => findTopMovers(sortedAssets.value, NUMBER_OF_TOP_MOVING_ASSETS))
        const topMovers: Ref<Asset[]> = computed(() => sortAssets(topMovingAssets.value, PRICE_CHANGE_PERCENTAGE_KEY, true).reverse())

        const { PRIVACY_MASK, isPrivacyModeActive } = usePrivacyMode()

        return { isLoading, currencies, currencyRate, router, user, assets, preferredCurrency, watchedAssets, topMovers, balance, formatValue, baseCurrencyRate, convertCurrency, PRIVACY_MASK, isPrivacyModeActive }
    }
})
</script>

<style>
.balance {
  @apply text-4xl;
}
.watchlist__container, .topMovers__container {
  @apply mt-8;
}
.assetsList {
  @apply shadow-md;
}

.header-ios ion-toolbar {
  --border-width: 0 !important
}
</style>