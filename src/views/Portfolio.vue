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
              <h1 class="h1 balance cursor-pointer" @click="router.push('/tabs/portfolio')">{{ preferredCurrency }} {{ balance }}</h1>
            </ion-toolbar>
          </ion-header>
        </header>
        <section class="portfolio__container">
          <AssetsList :assets="portfolioAssets" :walletMode="true" />
        </section>
      </section>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/vue";
import { computed, Ref } from 'vue';
import { useStore } from 'vuex';
import AssetsList from "../components/AssetsList.vue"
import User from '@/store/modules/auth/models/User';
import Asset from '@/store/modules/assets/models/Asset';
import { convertCurrency } from '@/services/ConvertCurrency';
import { Currencies } from '@/store/modules/assets/models/NBPCurrency';
// import axios from 'axios';

export default  {
  name: "Portfolio",
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, AssetsList },
  setup() {
      // const url = 'https://api.lunarcrush.com/v2?data=market-pairs&key=3qv7tzf23ynn2ygzj8qvm&symbol=LTC&limit=30'
      // const url = "https://api.bitbay.net/rest/trading/orderbook/BTC-PLN"
      // const corsPrefix = "https://api.allorigins.win/get?url="
      // const url = `${corsPrefix}https://api.bittrex.com/v3/markets/ETH-USD/orderbook`
      // axios.get(url).then(result => {
      //   console.log(result.data)
      //   console.log(JSON.parse(result.data.contents))
      // })
      const store = useStore()
      const user: Ref<User> = computed(() => store.getters.user)
      const preferredCurrency = computed(() => user.value.account.preferredCurrency)
      const assets: Ref<Asset[]> = computed(() => store.getters.assets)
      const portfolioAssets: Ref<Asset[]> = computed(() => assets.value.filter(asset => asset.symbol in user.value.account.portfolio))
      const currencies: Ref<Currencies> = computed(() => store.getters.currencies)
      const currencyRate = preferredCurrency.value in currencies.value ? currencies.value[preferredCurrency.value] : 1
      const balance = computed(() => convertCurrency(user.value.account.balance, currencyRate))


      return { user, preferredCurrency, portfolioAssets, balance }
  }
}
</script>