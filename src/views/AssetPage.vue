<template>
  <ion-page>
    <ion-header translucent>
        <ion-toolbar mode="ios">
            <ion-buttons slot="start">
                <ion-back-button default-href="/tabs" text=""></ion-back-button>
            </ion-buttons>
            <ion-title class="uppercase">{{ route.params.symbol }}</ion-title>
        </ion-toolbar>
    </ion-header>
    <ion-content fullscreen>
      <section class="prices container">
        <ion-header collapse="condense">
          <ion-toolbar>
            <div class="header__container flex flex-row items-center justify-between">
              <div class="asset__details">
                <p class="font-medium mb-2">{{ asset.name }} price</p>
                <h1 class="h1 balance">{{ preferredCurrency }} {{ asset.current_price }}</h1>
                <h2 class="text-base mt-1" :class="asset.price_change_24h > 0 ? 'text-success' : 'text-error'">{{ preferredCurrency }} {{asset.price_change_24h > 0 ? '+' : ''}}{{ asset.price_change_24h.toFixed(2) }} ({{ asset.price_change_percentage_24h.toFixed(2) }}%)</h2>
              </div>
              <div class="icon__wrapper">
                <ion-icon @click="isFavourite = !isFavourite" size="large" :icon="isFavourite ? star : starOutline"></ion-icon>
              </div>
            </div>
          </ion-toolbar>
        </ion-header>
        <div class="graph__container"></div>
        <div class="wallet__container">
          <div class="wallet">
            <AssetsList :assets="[asset]" :walletMode="true" />
            <ion-button @click="presentActionSheet" expand="block" class="text-lg text-white font-bold">Trade</ion-button>
          </div>
        </div>
      </section>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonIcon, IonButton, actionSheetController } from '@ionic/vue';
import AssetsList from "../components/AssetsList.vue"
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import { starOutline, star, addOutline, removeOutline, repeatOutline, close } from 'ionicons/icons'

export default  {
  name: 'Asset',
  components: { AssetsList, IonHeader, IonTitle, IonToolbar, IonContent, IonPage, IonButtons, IonBackButton, IonIcon, IonButton },
  setup() {
      const store = useStore()
      const route = useRoute()
      const preferredCurrency = computed(() => store.getters.preferredCurrency)
      const asset = store.getters.asset(route.params.symbol)
      const isFavourite = ref(false)


      const presentActionSheet = async () => {
        const actionSheet = await actionSheetController
        .create({
          header: 'Trade',
          cssClass: 'trade',
          buttons: [
            {
              text: `Buy ${asset.symbol.toUpperCase()}`,
              icon: addOutline,
              handler: () => {
                console.log('Delete clicked')
              },
            },
            {
              text: `Sell ${asset.symbol.toUpperCase()}`,
              icon: removeOutline,
              handler: () => {
                console.log('Share clicked')
              },
            },
            {
              text: `Convert ${asset.symbol.toUpperCase()}`,
              icon: repeatOutline,
              handler: () => {
                console.log('Play clicked')
              },
            },
            {
              text: 'Cancel',
              icon: close,
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked')
              },
            },
          ],
        });
        await actionSheet.present();

        const { role } = await actionSheet.onDidDismiss();
        console.log('onDidDismiss resolved with role', role);
      }

      return { route, asset, preferredCurrency, starOutline, star, isFavourite, presentActionSheet }
  }
}
</script>