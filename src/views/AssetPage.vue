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
                <h1 class="h1 balance">{{ preferredCurrency }} {{ asset.current_price.toFixed(2) }}</h1>
                <h2 class="text-base mt-1" :class="asset.price_change_24h > 0 ? 'text-success' : 'text-error'">{{ preferredCurrency }} {{asset.price_change_24h > 0 ? '+' : ''}}{{ asset.price_change_24h.toFixed(2) }} ({{ asset.price_change_percentage_24h.toFixed(2) }}%)</h2>
              </div>
              <div class="icon__wrapper">
                <ion-icon @click="toggleFavourite" size="large" :icon="isFavourite ? star : starOutline"></ion-icon>
              </div>
            </div>
          </ion-toolbar>
        </ion-header>
        <div class="graph__container my-4">
          <ChartComponent :symbol="asset.symbol" :data="chartData" :currency="preferredCurrency" />
          <div class="time__options w-full flex justify-between mt-4">
            <ion-chip @click="changeActiveTimeOption(option)" v-model="activeTimeOption" v-for="option in Object.keys(timeOptions)" :key="option" :class="{ active: option == activeTimeOption }">
              <ion-label class="uppercase">{{ option }}</ion-label>
            </ion-chip>
          </div>
        </div>
        <div class="wallet__container">
          <div class="wallet">
            <AssetsList :assets="[asset]" :walletMode="true" />
            <ion-button @click="presentActionSheet" expand="block" class="text-lg text-white font-bold">Trade</ion-button>
          </div>
        </div>
        <ion-modal
            :is-open="isActive"
            css-class="transaction-modal"
            @didDismiss="setOpen(false)"
            mode="ios"
            swipeToClose
          >
            <TransactionModal @onDismiss="setOpen(false)" :title="`${chosenTransactionType} ${asset.symbol.toUpperCase()}`" :asset="asset" :transactionType="chosenTransactionType" />
          </ion-modal>
      </section>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonModal, IonIcon, IonButton, actionSheetController, IonChip, IonLabel, onIonViewWillEnter } from '@ionic/vue';
import AssetsList from "../components/AssetsList.vue"
import TransactionModal from "../components/TransactionModal.vue"
import ChartComponent from "../components/charts/ChartComponent.vue"
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { computed, ref, Ref } from 'vue';
import { starOutline, star, addOutline, removeOutline, repeatOutline, close } from 'ionicons/icons'
import User from '@/store/modules/auth/models/User';

type TimeOption = '1d' | '1w' | '1m' | '1y'

interface TimeOptions {
    '1d': 1;
    '1w': 7;
    '1m': 30;
    '1y': 365;
}

export default  {
  name: 'Asset',
  components: { AssetsList, TransactionModal, ChartComponent, IonHeader, IonTitle, IonToolbar, IonContent, IonPage, IonButtons, IonBackButton, IonModal, IonIcon, IonButton, IonChip, IonLabel },
  setup() {
      const store = useStore()
      const route = useRoute()

      const watchedAssets = computed(() => store.getters.watchedAssets)
      const preferredCurrency = computed(() => store.getters.preferredCurrency)
      const asset = ref(store.getters.asset(route.params.symbol))
      const isFavourite = computed(() => watchedAssets.value.includes(route.params.symbol))
      const user: Ref<User> = computed(() => store.getters.user)

      // components are preserved so as not to reload them
      // in case the route changes, component data may not change
      // so if the route symbol doesnt match the asset symbol, reload the asset
      onIonViewWillEnter(() => {
        if(route.params.symbol !== asset.value.symbol) {
          asset.value = store.getters.asset(route.params.symbol)
        }
      })

      const toggleFavourite = () => {
        const isWatched = watchedAssets.value.includes(route.params.symbol)
        let filteredAssets = []
        if(isWatched) { 
          filteredAssets = watchedAssets.value.filter((asset: string) => asset != route.params.symbol)
        } else {
          watchedAssets.value.push(route.params.symbol)
          filteredAssets = watchedAssets.value
        }
        store.dispatch('updateUserAccount', { ...user.value.account, watchedAssets: filteredAssets })
      }

      const transactionType = ['Buy', 'Sell', 'Convert']
      const chosenTransactionType = ref(transactionType[0])
      const isActive = ref(false);
      const setOpen = (state: boolean) => isActive.value = state;

      const presentActionSheet = async () => {
        const actionSheet = await actionSheetController
        .create({
          header: 'Trade',
          cssClass: 'trade',
          buttons: [
            {
              text: `Buy ${asset.value.symbol.toUpperCase()}`,
              icon: addOutline,
              handler: () => {
                chosenTransactionType.value = transactionType[0]
                setOpen(true)
              },
            },
            {
              text: `Sell ${asset.value.symbol.toUpperCase()}`,
              icon: removeOutline,
              handler: () => {
                chosenTransactionType.value = transactionType[1]
                setOpen(true)
              },
            },
            {
              text: `Convert ${asset.value.symbol.toUpperCase()}`,
              icon: repeatOutline,
              handler: () => {
                chosenTransactionType.value = transactionType[1]
                setOpen(true)
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

      const chartData = ref(asset.value.sparkline_in_7d.price)
      const timeOptions: TimeOptions = { '1d': 1, '1w': 7, '1m': 30, '1y': 365 }
      const activeTimeOption: Ref<TimeOption> = ref(Object.keys(timeOptions)[1] as TimeOption)

      const fetchAssetChart = (assetId: string, currency: string, timeOption: number) => store.dispatch('fetchAssetChart', { assetId, currency, timeOption })

      const changeActiveTimeOption = async (option: TimeOption) => {
        activeTimeOption.value = option
        const numberOfDays = timeOptions[activeTimeOption.value]
        await fetchAssetChart(asset.value.id, preferredCurrency.value.toLowerCase(), numberOfDays)
        chartData.value = asset.value[`sparkline_in_${numberOfDays}d`].price
      }

      return { route, asset, preferredCurrency, starOutline, star, isFavourite, presentActionSheet, toggleFavourite, chartData, timeOptions, activeTimeOption, changeActiveTimeOption, isActive, setOpen, chosenTransactionType }
  }
}
</script>

<style>
.time__options ion-chip.active {
  --background: var(--ion-color-primary);
  --color: var(--ion-text-color);
}
</style>