<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ preferedCurrency }} {{ user.account.balance }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <section class="home container">
        <div class="home__container">
            <header class="balance__container">
                <p class="font-medium mb-2">Portfolio balance</p>
                <h1 class="h1 balance">{{ preferedCurrency }} {{ user.account.balance }}</h1>
            </header>
            <section class="watchlist__container">
                <h2 class="h2">Watchlist</h2>
                <AssetsList :assets="watchedAssets" />
            </section>
            <section class="topMovers__container">
                <h2 class="h2">Top movers</h2>
                <AssetsList :assets="topMovers" />
            </section>
        </div>
      </section>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import Asset from '@/store/modules/assets/models/Asset';
import User from '@/store/modules/auth/models/User';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';

import { computed, defineComponent, Ref } from "vue"
import { useStore } from "vuex"
import AssetsList from "../components/AssetsList.vue"

// const sortAssets = (items: any[], key: string) => items.slice().sort((a, b) => a[key] - b[key])
const sortAssets = (items: any[], key: string, absoluteValues: boolean) => 
  items.sort((a, b) => absoluteValues ? Math.abs(a[key]) - Math.abs(b[key]) : a[key] - b[key])

const findTopMovers = (items: any[], numberOfItems: number) => {
  return items.slice(0, numberOfItems).concat(items.slice(items.length - numberOfItems, items.length))
}

export default defineComponent({
    name: "Dashboard",
    components: { AssetsList, IonHeader, IonToolbar, IonTitle, IonContent, IonPage },
    setup() {
        const store = useStore()
        const user: Ref<User> = computed(() => store.getters.user)
        const preferedCurrency = computed(() => user.value.account.preferredCurrency)
        const assets: Ref<Asset[]> = computed(() => store.getters.assets)
        const fetchData = () => store.dispatch('fetchAssets')

        fetchData()
        const watchedAssets: Ref<Asset[]> = computed(() => assets.value.slice(0, 10))
        const sortedAssets: Asset[] = sortAssets(assets.value.slice(), "price_change_percentage_1h_in_currency", false)
        const topMovingAssets = findTopMovers(sortedAssets, 10)
        
        const topMovers: Ref<Asset[]> = computed(() => sortAssets(topMovingAssets, "price_change_percentage_1h_in_currency", true).reverse())

        return { user, assets, preferedCurrency, watchedAssets, topMovers }
    },
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
</style>