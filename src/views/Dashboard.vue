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
import { computed, defineComponent, Ref } from 'vue'
import { useRouter } from 'vue-router';
import { useStore } from 'vuex'

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

const sortAssets = (items: any[], key: string, absoluteValues: boolean) => 
  items.sort((a, b) => absoluteValues ? Math.abs(a[key]) - Math.abs(b[key]) : a[key] - b[key])

const findTopMovers = (items: any[], numberOfItems: number) => {
  return items.slice(0, numberOfItems).concat(items.slice(items.length - numberOfItems, items.length))
}

export default defineComponent({
    name: "Dashboard",
    components: { BalanceHeader, AssetsList, IonHeader, IonToolbar, IonTitle, IonContent, IonPage },
    setup() {
        const store = useStore()
        const router = useRouter()
        const isLoading: Ref<boolean> = computed(() => store.getters.isLoading)
        const user: Ref<User> = computed(() => store.getters.user)

        const { preferredCurrency, currencies, currencyRate, baseCurrencyRate } = useCurrency() 

        const assets: Ref<Asset[]> = computed(() => store.getters.assets)
        const fetchData = (forceUpdate: boolean) => store.dispatch('fetchAssets', forceUpdate)
        const fetchCurrencies = () => store.dispatch('fetchCurrencies')
        const updateUserAccount = (preferredCurrency: string) => store.dispatch('updateUserAccount', { ...user.value.account, preferredCurrency })
        
        fetchData(false)
        // this may cause a isLoading = true bug
        setInterval(() => {
          fetchData(true)
        }, 1000 * 1 * 60 * 5) // refresh assets data every 5 mins on client side
        

        fetchCurrencies().then(() => {
          // set bitcoin as a currency
          const additionalCurrency = 'BTC'
          const bitcoinCurrency = assets.value.find((asset: Asset) => asset.symbol === additionalCurrency.toLowerCase())

          if (bitcoinCurrency) {
              store.commit('addNewCurrency', { currencyName: bitcoinCurrency.symbol.toUpperCase(), currencyRate: bitcoinCurrency.current_price * baseCurrencyRate.value })
          }

          if (preferredCurrency.value === 'BTC' && !('BTC' in currencies.value)) {
            updateUserAccount(BASE_CURRENCY)
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