<template>
  <ion-page>
    <ion-header translucent>
      <ion-toolbar mode="ios">
        <ion-title>{{ preferredCurrency }} {{ balance }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen>
      <section class="portfolio container">
        <header class="balance__container">
          <ion-header n-header collapse="condense">
            <ion-toolbar>
              <p class="font-medium mb-2">Portfolio balance</p>
              <h1 v-if="!isLoading" class="h1 balance cursor-pointer" @click="router.push('/tabs/portfolio')">{{ preferredCurrency }} {{ balance }}</h1>
              <ion-skeleton-text v-else animated style="height: 100%; width: 80%; line-height: 2.5rem;" />
            </ion-toolbar>
          </ion-header>
        </header>
        <section class="portfolio__container">
          <AssetsList :assets="portfolioAssets" :walletMode="true" />
        </section>
        <ion-button @click="openModal" mode="ios" expand="block" class="text-lg text-white font-bold">Estimate portfolio value</ion-button>
        <ion-modal
          :is-open="isActive"
          css-class="my-custom-class"
          @didDismiss="setOpen(false)"
          mode="ios"
          swipeToClose
        >
          <EstimationPortfolioModal @onDismiss="setOpen(false)" title="Portfolio estimation" :assetsSummary="assetsSummary" :percentageOfPortfolio="0.1" />
        </ion-modal>
      </section>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonModal, IonSkeletonText } from "@ionic/vue";
import { computed, ref, Ref } from 'vue';
import { useStore } from 'vuex';
import AssetsList from "../components/AssetsList.vue"
import User from '@/store/modules/auth/models/User';
import Asset from '@/store/modules/assets/models/Asset';
import { convertCurrency } from '@/services/ConvertCurrency';
import { Currencies } from '@/store/modules/assets/models/NBPCurrency';
import EstimationPortfolioModal from '@/components/EstimationPortfolioModal.vue';

export default  {
  name: "Portfolio",
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButton, IonModal, AssetsList, EstimationPortfolioModal, IonSkeletonText },
  setup() {
      // const url = "https://api.bitbay.net/rest/trading/orderbook/BTC-PLN"
      // const corsPrefix = "https://api.allorigins.win/get?url="
      // const url = `${corsPrefix}https://api.bittrex.com/v3/markets/ETH-USD/orderbook`
      // axios.get(url).then(result => {
      //   console.log(result.data)
      //   console.log(JSON.parse(result.data.contents))
      // })
      const store = useStore()
      const isLoading = computed(() => store.getters.isLoading)
      const user: Ref<User> = computed(() => store.getters.user)
      const preferredCurrency = computed(() => user.value.account.preferredCurrency)
      const assets: Ref<Asset[]> = computed(() => store.getters.assets)
      const portfolioAssets: Ref<Asset[]> = computed(() => assets.value.filter(asset => user.value.account.portfolio.map(portfolioItem => portfolioItem.symbol).includes(asset.symbol)))
      const currencies: Ref<Currencies> = computed(() => store.getters.currencies)
      const currencyRate = preferredCurrency.value in currencies.value ? currencies.value[preferredCurrency.value] : 1
      const balance = computed(() => convertCurrency(user.value.account.balance, currencyRate))

      const estimatePortfolio = (percentageOfPortfolio: number) => store.dispatch('estimatePortfolioValue', { portfolio: user.value.account.portfolio, percentageOfPortfolio })
     
      const isActive = ref(false);
      const setOpen = (state: boolean) => isActive.value = state;

      const openModal = () => {
        estimatePortfolio(0.1).then(() => {
          setOpen(true)
        })
      }

      const assetsSummary = computed(() => store.getters.assetsSummary)

      return { isLoading, user, preferredCurrency, portfolioAssets, balance, isActive, openModal, setOpen, assetsSummary }
  }
}
</script>