<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Market is {{marketChangeStatus}} <span :class="isMarketUp ? 'text-success' : 'text-error'">{{marketChangePercentageText}}</span></ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <section class="prices container">
        <ion-header collapse="condense">
          <ion-toolbar>
            <p class="font-medium mb-2">In the past 24 hours</p>
            <h1 class="h1 balance">Market is {{marketChangeStatus}} <span class="text-3xl" :class="isMarketUp ? 'text-success' : 'text-error'">{{marketChangePercentageText}}</span></h1>
          </ion-toolbar>
        </ion-header>
        <AssetsList :assets="assets" />
      </section>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import Asset from '@/store/modules/assets/models/Asset';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';

import { computed, defineComponent, ref, Ref } from "vue"
import { useStore } from "vuex"
import AssetsList from "../components/AssetsList.vue"


export default defineComponent({
    name: "Prices",
    components: { AssetsList, IonHeader, IonToolbar, IonTitle, IonContent, IonPage },
    setup() {
        const store = useStore()
        const assets: Ref<Asset[]> = computed(() => store.getters.assets)

        const marketChangePercentage = ref(assets.value.reduce((acc, elem) => acc + elem.market_cap_change_percentage_24h, 0) / assets.value.length)
        const isMarketUp = ref(marketChangePercentage.value > 0)
        const marketChangeStatus = ref(isMarketUp.value ? "up" : "down")
        const marketChangePercentageText = ref(`${isMarketUp.value ? '+' : ''}${marketChangePercentage.value.toFixed(2)}%`)

        return { assets, marketChangePercentageText, marketChangeStatus, isMarketUp }
    }
})
</script>