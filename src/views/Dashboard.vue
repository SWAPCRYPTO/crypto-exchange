<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Dashboard</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <section class="home container">
        <div class="home__container">
            <header class="balance__container">
                <p class="font-medium mb-2">Portfolio balance</p>
                <h1 class="h1 balance">{{ currentCurrency }} {{ user.balance }}</h1>
            </header>
            <section class="watchlist__container">
                <h2 class="h2">Watchlist</h2>
                <AssetsList :assets="watchedAssets" />
            </section>
            <section class="topMovers__container">
                <h2 class="h2">Top movers</h2>
                <AssetsList :assets="watchedAssets" />
            </section>
        </div>
      </section>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';

import { computed, defineComponent } from "vue"
import { useStore } from "vuex"
import AssetsList from "../components/AssetsList.vue"
import Asset from "../typings/Asset"

export default defineComponent({
    name: "Dashboard",
    components: { AssetsList, IonHeader, IonToolbar, IonTitle, IonContent, IonPage },
    setup() {
        const user = {
            defaultCurrency: 'PLN',
            balance: 152.32
        }

        const store = useStore()
        const currentCurrency = "USD"
        const assets = computed(() => store.getters.assets)
        const fetchData = () => store.dispatch('fetchAssets')

        // fetchData()

        const watchedAssets: Asset[] = [
            {
                title: "Bitcoin",
                symbol: "BTC",
                iconUrl: ""
            },
            {
                title: "Etherum",
                symbol: "ETH",
                iconUrl: ""
            }
        ]

        return { user, currentCurrency, watchedAssets }
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
  @apply shadow-sm;
}
</style>