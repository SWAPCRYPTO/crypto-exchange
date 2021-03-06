<template>
  <ion-page>
    <ion-header translucent>
        <ion-toolbar mode="ios">
            <ion-buttons slot="start">
                <ion-back-button default-href="/tabs" text=""></ion-back-button>
            </ion-buttons>
            <ion-title>{{ preferredCurrency }} {{ formatValue(convertCurrency(asset.current_price, baseCurrencyRate, currencyRate), 2) }}</ion-title>
        </ion-toolbar>
    </ion-header>
    <ion-content>
      <section class="prices container md:max-w-screen-md">
        <ion-header collapse="condense">
          <ion-toolbar>
            <div class="header__container flex flex-row items-center justify-between">
              <div class="asset__details">
                <p class="font-medium mb-2">{{ asset.name }} price</p>
                <h1 class="h1 balance">{{ preferredCurrency }} {{ formatValue(convertCurrency(asset.current_price, baseCurrencyRate, currencyRate), 2) }}</h1>
                <h2 class="text-base mt-1" :class="asset.price_change_24h > 0 ? 'text-success' : 'text-error'">{{ preferredCurrency }} {{asset.price_change_24h > 0 ? '+' : ''}}{{ convertCurrency(asset.price_change_24h, baseCurrencyRate, currencyRate).toFixed(4) }} ({{ asset.price_change_percentage_24h.toFixed(2) }}%)</h2>
              </div>
              <div class="icon__wrapper">
                <ion-icon class="cursor-pointer" @click="toggleFavourite" size="large" :icon="isFavourite ? star : starOutline"></ion-icon>
              </div>
            </div>
          </ion-toolbar>
        </ion-header>
        <div class="graph__container my-4">
          <ChartComponent :symbol="asset.symbol" :data="chartData" :currency="preferredCurrency" :displayAllLabels="true" />
          <div class="time__options w-full flex justify-between mt-4">
            <ion-chip @click="changeActiveTimeOption(option)" v-model="activeTimeOption" v-for="option in Object.keys(timeOptions)" :key="option" :class="{ active: option == activeTimeOption }">
              <ion-label class="uppercase">{{ option }}</ion-label>
            </ion-chip>
          </div>
        </div>
        <div class="wallet__container">
          <div class="wallet">
            <AssetsList :assets="[asset]" :walletMode="true" :allowHistory="true" routableAssets />
            <ion-button @click="presentActionSheet" mode="ios" expand="block" class="text-lg text-white font-bold">Trade</ion-button>
          </div>
        </div>
      </section>
      <section class="market__stats container md:max-w-screen-md">
        <h2 class="h2">Market Stats</h2>
        <ion-list class="my-4">
          <ion-item lines="none" v-for="stat in assetStats" :key="stat.value">
            <ion-icon slot="start" color="primary" :icon="stat.icon" />
            <ion-label slot="start">{{ stat.title }}</ion-label>
            <ion-label class="ion-text-right">{{ stat.value }}</ion-label>
          </ion-item>
        </ion-list>
      </section>
      <ion-modal
          :is-open="isActive"
          css-class="transaction-modal"
          @didDismiss="setOpen(false)"
          mode="ios"
          swipeToClose
        >
          <TransactionModal @onDismiss="setOpen(false)" :title="`${chosenTransactionType} ${asset.symbol.toUpperCase()}`" :asset="asset" :transactionType="chosenTransactionType" />
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonModal, IonIcon, IonButton, IonChip, IonLabel, IonList, IonItem, actionSheetController, onIonViewWillEnter } from '@ionic/vue';
import AssetsList from '../components/AssetsList.vue'
import TransactionModal from '../components/TransactionModal.vue'
import ChartComponent from '../components/charts/ChartComponent.vue'
import { openToast } from '@/services/OpenToast'
import { convertCurrency } from '@/services/ConvertCurrency'
import { formatValue } from '@/services/FormatValue'
import { useStore } from '@/store'
import { useRoute } from 'vue-router'
import { computed, ComputedRef, ref, Ref } from 'vue'
import { starOutline, star, addOutline, removeOutline, repeatOutline, close, barChartOutline, statsChartOutline, pieChartOutline, trendingUpOutline, trendingDownOutline, sparklesOutline } from 'ionicons/icons'
import User from '@/store/modules/auth/models/User';
import useCurrency from '@/hooks/useCurrency';
import { ActionTypes } from '@/store';
import Asset from '@/store/modules/assets/models/Asset';

type TimeOption = '1d' | '1w' | '1m' | '1y'

interface TimeOptions {
    '1d': 1;
    '1w': 7;
    '1m': 30;
    '1y': 365;
}

export default  {
  name: 'Asset',
  components: { AssetsList, TransactionModal, ChartComponent, IonHeader, IonTitle, IonToolbar, IonContent, IonPage, IonButtons, IonBackButton, IonModal, IonIcon, IonButton, IonChip, IonLabel, IonList, IonItem },
  setup() {
      const store = useStore()
      const route = useRoute()

      const { preferredCurrency, currencyRate, baseCurrencyRate } = useCurrency()
      const watchedAssets = computed(() => store.getters.watchedAssets) as ComputedRef<string[]>
      const isFavourite: ComputedRef<boolean> = computed(() => watchedAssets.value.includes(route.params.symbol as string))
      const asset = ref(store.getters.asset(route.params.symbol as string)) as Ref<Asset>
      const user = computed(() => store.getters.user) as ComputedRef<User>

      // components are preserved so as not to reload them
      // in case the route changes, component data may not change
      // so if the route symbol doesnt match the asset symbol, reload the asset
      onIonViewWillEnter(() => {
        if(route.params.symbol !== asset.value.symbol) {
          asset.value = store.getters.asset(route.params.symbol as string) as Asset
        }
      })

      const toggleFavourite = () => {
        const isWatched: boolean = watchedAssets.value.includes(route.params.symbol as string)
        let filteredAssets: string[] = []
        if(isWatched) { 
          filteredAssets = watchedAssets.value.filter((asset: string) => asset != route.params.symbol)
        } else {
          watchedAssets.value.push(route.params.symbol as string)
          filteredAssets = watchedAssets.value
        }
        store.dispatch(ActionTypes.updateUserAccount, { ...user.value.account, watchedAssets: filteredAssets })
      }

      const transactionType = ['Buy', 'Sell', 'Convert']
      const chosenTransactionType = ref(transactionType[0])
      const isActive = ref(false)
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
                const currentAsset = user.value.account.portfolio.find(curAsset => curAsset.symbol == asset.value.symbol)
                if(currentAsset && currentAsset.quantity > 0) {
                  setOpen(true)
                } else {
                  openToast('You don\'t have this asset.', 'bottom', 2000, 'primary')
                }
              },
            },
            {
              text: `Convert ${asset.value.symbol.toUpperCase()}`,
              icon: repeatOutline,
              handler: () => {
                chosenTransactionType.value = transactionType[2]
                const currentAsset = user.value.account.portfolio.find(curAsset => curAsset.symbol == asset.value.symbol)
                if(currentAsset && currentAsset.quantity > 0) {
                  setOpen(true)
                } else {
                  openToast('You don\'t have this asset.', 'bottom', 2000, 'primary')
                }
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
        await actionSheet.present()

        // const { role } = 
        await actionSheet.onDidDismiss()
      }

      const chartData = ref(asset.value.sparkline_in_7d.price)
      const timeOptions: TimeOptions = { '1d': 1, '1w': 7, '1m': 30, '1y': 365 }
      const activeTimeOption: Ref<TimeOption> = ref(Object.keys(timeOptions)[1] as TimeOption)

      const fetchAssetChart = (assetId: string, timeOption: number) => store.dispatch(ActionTypes.fetchAssetChart, { assetId, timeOption })

      const changeActiveTimeOption = async (option: TimeOption) => {
        activeTimeOption.value = option
        const numberOfDays = timeOptions[activeTimeOption.value]
        await fetchAssetChart(asset.value.id, numberOfDays)
        chartData.value = (asset as any).value[`sparkline_in_${numberOfDays}d`].price
      }

      const assetStats = computed(() => [
        {
          title: 'Market cap',
          value: `${preferredCurrency.value} ${formatValue(convertCurrency(asset.value.market_cap, baseCurrencyRate.value, currencyRate.value))}`,
          icon: barChartOutline
        },
        {
          title: 'Volume',
          value: `${preferredCurrency.value} ${formatValue(convertCurrency(asset.value.total_volume, baseCurrencyRate.value, currencyRate.value))}`,
          icon: statsChartOutline
        },
        {
          title: 'Circulating supply',
          value: asset.value.circulating_supply,
          icon: pieChartOutline
        },
        {
          title: 'All time high',
          value: `${preferredCurrency.value} ${formatValue(convertCurrency(asset.value.ath, baseCurrencyRate.value, currencyRate.value))}`,
          icon: trendingUpOutline
        },
        {
          title: 'All time low',
          value: `${preferredCurrency.value} ${formatValue(convertCurrency(asset.value.atl, baseCurrencyRate.value, currencyRate.value))}`,
          icon: trendingDownOutline
        },
        {
          title: 'Popularity rank',
          value: `#${asset.value.market_cap_rank}`,
          icon: sparklesOutline
        }
      ])

      return { route, asset, preferredCurrency, starOutline, star, isFavourite, presentActionSheet, toggleFavourite, chartData, timeOptions, activeTimeOption, changeActiveTimeOption, isActive, setOpen, chosenTransactionType, convertCurrency, formatValue, currencyRate, baseCurrencyRate, assetStats }
  }
}
</script>

<style>
.time__options ion-chip.active {
  --background: var(--ion-color-primary);
}

.time__options ion-chip.active ion-label {
  --color: #ffffff;
  color: #ffffff;
}


@media (max-width: 460px) and (orientation: portrait) {
  .prices {
    @apply min-h-full;
  }
}

.market__stats ion-icon {
  font-size: 20px;
  --ionicon-stroke-width: 32px;
}

.market__stats ion-item {
  --inner-padding-start: 0;
  --inner-padding-end: 0;
  --padding-start: 0;
  --padding-end: 0;
}
</style>