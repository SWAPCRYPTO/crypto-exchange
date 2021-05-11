<template>
  <ion-page>
    <ion-header translucent>
      <ion-toolbar mode="ios">
        <ion-title>Market is {{marketChangeStatus}} <span :class="isMarketUp ? 'text-success' : 'text-error'">{{marketChangePercentageText}}</span></ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen>
      <section class="prices container">
        <ion-header class="bg-transparent" collapse="condense">
          <ion-toolbar>
            <div class="header__container flex flex-col lg:flex-row items-center justify-between">
              <div class="header__details flex flex-col">
                <p class="font-medium mb-2">In the past 24 hours</p>
              <h1 class="h1 balance">Market is {{marketChangeStatus}} <span class="text-2xl md:text-3xl" :class="isMarketUp ? 'text-success' : 'text-error'">{{marketChangePercentageText}}</span></h1>
              </div>
              <div class="search__wrapper mt-8 lg:mt-0 w-full md:max-w-xs">
                  <ion-searchbar show-cancel-button="never" debounce="500" placeholder="Find your asset" animated></ion-searchbar>
              </div>
            </div>
          </ion-toolbar>
        </ion-header>
        <AssetsList :assets="assets" />
      </section>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import Asset from '@/store/modules/assets/models/Asset';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar } from '@ionic/vue';
import { starOutline } from 'ionicons/icons'

import { computed, defineComponent, ref, Ref } from "vue"
import { useStore } from "vuex"
import AssetsList from "../components/AssetsList.vue"


export default defineComponent({
    name: "Prices",
    components: { AssetsList, IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonSearchbar },
    setup() {
        const store = useStore()
        const assets: Ref<Asset[]> = computed(() => store.getters.assets)

        const marketChangePercentage = ref(assets.value.reduce((acc, elem) => acc + elem.market_cap_change_percentage_24h, 0) / assets.value.length)
        const isMarketUp = ref(marketChangePercentage.value > 0)
        const marketChangeStatus = ref(isMarketUp.value ? "up" : "down")
        const marketChangePercentageText = ref(`${isMarketUp.value ? '+' : ''}${marketChangePercentage.value.toFixed(2)}%`)

        return { assets, marketChangePercentageText, marketChangeStatus, isMarketUp, starOutline }
    }
})
</script>

<style>
  ion-content ion-toolbar {
    --background: transparent;
  }
</style>