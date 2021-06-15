<template>
  <ion-page>
    <ion-header translucent>
        <ion-toolbar mode="ios">
            <ion-buttons slot="start">
                <ion-back-button default-href="/tabs" text=""></ion-back-button>
            </ion-buttons>
            <!-- <ion-title>{{ preferredCurrency }} {{ formatValue(convertCurrency(balance, baseCurrencyRate, currencyRate), 2) }}</ion-title> -->
            <!-- // ilosc zasobu -->
        </ion-toolbar>
    </ion-header>
    <ion-content fullscreen>
      <section class="prices container md:max-w-screen-md">
        <ion-header collapse="condense">
          <ion-toolbar>
            <div class="header__container flex flex-row items-center justify-between">
              <div class="asset__details">
                <p class="font-medium mb-2">{{ isPrivacyModeActive ? PRIVACY_MASK : portfolioAsset ? portfolioAsset.quantity : 0 }} <span class="uppercase">{{ isPrivacyModeActive ? '' : asset.symbol }}</span></p>
                <h1 class="h1 balance">{{ isPrivacyModeActive ? PRIVACY_MASK : `${preferredCurrency} ${formatValue(portfolioAsset ? convertCurrency(portfolioAsset.quantity * asset.current_price, baseCurrencyRate, currencyRate) : 0.00, 2)}` }}</h1>
              </div>
            </div>
          </ion-toolbar>
        </ion-header>
        <section class="history mt-8">
            <h2 class="h2">History</h2>
            <ul class="assetsList__items mt-4" v-if="portfolioAsset?.transactions">
                <li class="assetsList__item cursor-default" v-for="(transaction, i) in portfolioAsset.transactions" :key="i">
                    <div class="currency__title">
                        <div class="currency__name">
                            <p class="capitalize">{{ transaction.quantity > 0 ? 'Received' : 'Converted' }} {{ portfolioAsset.name }}</p>
                            <span class="capitalize text-sm">From Exchange Earn</span>
                        </div>
                    </div>
                    <div class="currency__details">
                        <p class="currency__value">{{ isPrivacyModeActive ? PRIVACY_MASK : transaction.quantity }} <span class="uppercase">{{ isPrivacyModeActive ? '' : portfolioAsset.symbol }}</span></p>
                        <p class="uppercase text-sm">{{ isPrivacyModeActive ? PRIVACY_MASK : `${preferredCurrency} ${formatValue(convertCurrency(transaction.quantity * transaction.purchasePrice, baseCurrencyRate, currencyRate), 2)}` }}</p>
                    </div>
                </li>
            </ul>
            <p v-else class="mt-4">You have no transactions</p>
        </section>
      </section>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { computed, defineComponent, ref, Ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { convertCurrency } from '@/services/ConvertCurrency';
import { formatValue } from '@/services/FormatValue'
import { Currencies } from '@/store/modules/assets/models/NBPCurrency'
import { PortfolioItem } from '@/store/modules/auth/models/UserAccount'
import Asset from '@/store/modules/assets/models/Asset'

import { IonBackButton, IonButtons, IonToolbar, IonHeader, IonContent, IonPage } from '@ionic/vue'
import usePrivacyMode from '@/hooks/usePrivacyMode';

export default defineComponent({
    name: 'AssetHistory',
    components: { IonBackButton, IonButtons, IonToolbar, IonHeader, IonContent, IonPage },
    setup() {
        const store = useStore()
        const route = useRoute()
        const preferredCurrency = computed(() => store.getters.user.account.preferredCurrency)
        const portfolio = computed(() => store.getters.user.account.portfolio)
        const asset: Ref<Asset> = ref(store.getters.asset(route.params.symbol))
        const portfolioAsset = computed(() => portfolio.value.find((portfolioItem: PortfolioItem) => portfolioItem.symbol == asset.value.symbol))
        
        const baseCurrencyRate = computed(() => store.getters.baseCurrencyRate)
        const currencies: Ref<Currencies> = computed(() => store.getters.currencies)
        const currencyRate = computed(() => preferredCurrency.value in currencies.value ? currencies.value[preferredCurrency.value] : 1)

        const { PRIVACY_MASK, isPrivacyModeActive } = usePrivacyMode()

        return { preferredCurrency, baseCurrencyRate, currencyRate, asset, portfolioAsset, convertCurrency, formatValue, PRIVACY_MASK, isPrivacyModeActive }
    },
})
</script>
