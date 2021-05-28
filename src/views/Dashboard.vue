<template>
  <ion-page>
    <ion-header translucent>
      <ion-toolbar mode="ios">
        <ion-title v-if="!isLoading">{{ preferredCurrency }} {{ formatValue(balance, 2) }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen>
      <section class="home container">
        <div class="home__container">
            <header class="balance__container">
              <ion-header collapse="condense">
                <ion-toolbar>
                  <p class="font-medium mb-2">Portfolio balance</p>
                  <h1 v-if="!isLoading" class="h1 balance cursor-pointer" @click="router.push('/tabs/portfolio')">{{ preferredCurrency }} {{ formatValue(balance, 2) }}</h1>
                  <ion-skeleton-text v-else animated style="height: 100%; width: 80%; line-height: 2.5rem;" />
                </ion-toolbar>
              </ion-header>
            </header>
            <section class="watchlist__container">
                <h2 class="h2">Watchlist</h2>
                <AssetsList :assets="watchedAssets" :walletMode="false" />
            </section>
            <section class="topMovers__container">
                <h2 class="h2">Top movers</h2>
                <AssetsList :assets="topMovers" :walletMode="false" />
            </section>
        </div>
      </section>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import Asset from '@/store/modules/assets/models/Asset';
import { convertCurrency } from "@/services/ConvertCurrency"
import { formatValue } from "@/services/FormatValue"
import User from '@/store/modules/auth/models/User';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSkeletonText } from '@ionic/vue';

import { computed, defineComponent, Ref } from "vue"
import { useRouter } from 'vue-router';
import { useStore } from "vuex"
import AssetsList from "../components/AssetsList.vue"
import { Currencies } from '@/store/modules/assets/models/NBPCurrency';

const sortAssets = (items: any[], key: string, absoluteValues: boolean) => 
  items.sort((a, b) => absoluteValues ? Math.abs(a[key]) - Math.abs(b[key]) : a[key] - b[key])

const findTopMovers = (items: any[], numberOfItems: number) => {
  return items.slice(0, numberOfItems).concat(items.slice(items.length - numberOfItems, items.length))
}

export default defineComponent({
    name: "Dashboard",
    components: { AssetsList, IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonSkeletonText },
    setup() {
        const store = useStore()
        const router = useRouter()
        const isLoading: Ref<boolean> = computed(() => store.getters.isLoading)
        const user: Ref<User> = computed(() => store.getters.user)
        const preferredCurrency = computed(() => user.value.account.preferredCurrency)
        const assets: Ref<Asset[]> = computed(() => store.getters.assets)
        const fetchData = () => store.dispatch('fetchAssets')
        const fetchCurrencies = () => store.dispatch('fetchCurrencies')

        store.dispatch('fetchAvailableMarkets', user.value.account.portfolio.map(asset => asset.symbol.toUpperCase()))
        
        fetchData()
        fetchCurrencies()

        const currencies: Ref<Currencies> = computed(() => store.getters.currencies)
        const currencyRate = preferredCurrency.value in currencies.value ? currencies.value[preferredCurrency.value] : 1
        const balance = computed(() => convertCurrency(user.value.account.balance, currencyRate))
        
        const watchedAssets: Ref<Asset[]> = computed(() => assets.value.filter(asset => user.value.account.watchedAssets?.includes(asset.symbol)))
        const sortedAssets: Ref<Asset[]> = computed(() => sortAssets(assets.value.slice(), "price_change_percentage_24h_in_currency", false))
        const NUMBER_OF_TOP_MOVING_ASSETS = 5
        const topMovingAssets = computed(() => findTopMovers(sortedAssets.value, NUMBER_OF_TOP_MOVING_ASSETS))
        
        const topMovers: Ref<Asset[]> = computed(() => sortAssets(topMovingAssets.value, "price_change_percentage_24h_in_currency", true).reverse())

        return { isLoading, currencies, router, user, assets, preferredCurrency, watchedAssets, topMovers, balance, formatValue }
    }
})
</script>

<style>
.balance {
  @apply text-4xl;
}
.watchlist__container {
  @apply my-8;
}
.assetsList {
  @apply shadow-md;
}

.header-ios ion-toolbar {
  --border-width: 0 !important
}
</style>