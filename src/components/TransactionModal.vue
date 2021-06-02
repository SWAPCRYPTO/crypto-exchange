<template>
    <ion-header translucent>
        <ion-toolbar mode="ios">
            <ion-title>{{ title }}</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="dismiss">Close</ion-button>
            </ion-buttons>
        </ion-toolbar>
    </ion-header>
    <ion-content fullscreen>
      <section class="modal__content flex flex-col items-center justify-center p-8">
        <ion-item class="mt-8">
          <ion-input type="number" :readonly="transactionType == 'Sell'" mode="ios" autofocus value="0" placeholder="0" min="15" max="10000" color="primary" inputmode="decimal" v-model="providedQuantity"></ion-input>
          <ion-label color="primary" class="font-bold">{{ preferredCurrency }}</ion-label>
        </ion-item>
        <ion-list class="w-full">
          <ion-item class="flex items-center justify-between">
            <ion-label><span class="uppercase">{{ asset.symbol }}</span> price</ion-label>
            <ion-label class="text-right">{{ displayOnlySignificatDigits(assetQuantity, 8) }} <span class="uppercase">{{ asset.symbol }}</span></ion-label>
          </ion-item>
          <ion-item>
            <ion-label>{{ transactionType == 'Buy' ? 'Purchase' : 'Sale' }}</ion-label>
            <ion-label class="text-right">{{ displayOnlySignificatDigits(transactionType == 'Buy' ? purchasePrice : +providedQuantity, 8) }} {{ preferredCurrency }}</ion-label>
          </ion-item>
          <ion-item>
            <ion-label>Transaction Fee</ion-label>
            <ion-label class="text-right">{{ transactionFee }} {{ preferredCurrency }}</ion-label>
          </ion-item>
          <ion-item>
            <ion-label class="font-bold">Total</ion-label>
            <ion-label class="font-bold text-right">{{ displayOnlySignificatDigits(transactionType == 'Buy' ? +providedQuantity : purchasePrice, 8) }} {{ preferredCurrency }}</ion-label>
          </ion-item>
        </ion-list>
        <ion-button @click="proceedTransaction" mode="ios" :disabled="isLoading || providedQuantity == 0" expand="block" class="mt-8 text-lg w-full text-white font-bold">
          <ion-spinner v-if="isLoading" />
          <ion-label v-else>{{ transactionType }} now</ion-label>
        </ion-button>
      </section>
    </ion-content>
</template>

<script lang="ts">
import { computed, defineComponent, Ref, ref } from 'vue'
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonInput, IonLabel, IonItem, IonList, IonSpinner, toastController } from '@ionic/vue'
import { useStore } from 'vuex'
import { displayOnlySignificatDigits } from '@/services/FormatValue'
import { PortfolioItem } from '@/store/modules/auth/models/UserAccount'
import firebase from 'firebase'
import { Currencies } from '@/store/modules/assets/models/NBPCurrency'
import { convertCurrency } from '@/services/ConvertCurrency'

export default defineComponent({
    name: 'TransactionModal',
    components: { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonInput, IonLabel, IonItem, IonList, IonSpinner },
    props: ['title', 'asset', 'transactionType'],
    emits: ['onDismiss'],
    setup(props, { emit }) {
        const dismiss = () => {
            emit('onDismiss', false)
        }        
        const store = useStore()
        const preferredCurrency = computed(() => store.getters.preferredCurrency)
        const currencies: Ref<Currencies> = computed(() => store.getters.currencies)
        const currencyRate = computed(() => preferredCurrency.value in currencies.value ? currencies.value[preferredCurrency.value] : 1)
        const baseCurrencyRate = computed(() => store.getters.baseCurrencyRate)
        const isLoading = computed(() => store.getters.isLoading)
        const userPortfolio = computed(() => store.getters.userPortfolio)
        
        const portfolioAsset = computed(() => userPortfolio.value.find((asset: PortfolioItem) => asset.symbol == props.asset.symbol.toLowerCase()))
        const providedQuantity = ref(props.transactionType === 'Sell' ? convertCurrency(portfolioAsset.value.quantity * props.asset.current_price, baseCurrencyRate.value, currencyRate.value): 0)
        const TRANSACTION_FEE = 2.99
        const transactionFee = computed(() => +convertCurrency(TRANSACTION_FEE, baseCurrencyRate.value, currencyRate.value).toFixed(2))
        const purchasePrice = computed(() => providedQuantity.value - transactionFee.value < 0 ? 0 : providedQuantity.value - transactionFee.value)
        const assetQuantity = computed(() => { 
          if (props.transactionType === 'Sell')
            return convertCurrency(portfolioAsset.value.quantity, baseCurrencyRate.value, currencyRate.value)
          else if (providedQuantity.value - transactionFee.value < 0) 
            return 0
          else return purchasePrice.value / convertCurrency(props.asset.current_price, baseCurrencyRate.value, currencyRate.value)
        })

        const openResultToast = async (message: string) => {
        const toast = await toastController
          .create({
            message,
            duration: 2000,
            position: 'bottom',
            color: 'primary'
          })
          return toast.present();
      }

        const proceedTransaction = () => {
          if(props.transactionType == 'Buy') {
              const buyQuantity = +assetQuantity.value.toFixed(4)
              const assetToBuy: PortfolioItem = {
                name: props.asset.name.toLowerCase(),
                quantity: buyQuantity,
                symbol: props.asset.symbol.toLowerCase(),
                transactions: [
                  {
                    purchasePrice: props.asset.current_price,
                    quantity: buyQuantity,
                    transactionDate: firebase.firestore.Timestamp.now()
                  }
                ],
              }
              store.dispatch('buyAsset', assetToBuy)
          } else if (props.transactionType == 'Sell') {
              store.dispatch('sellAsset', { symbol: props.asset.symbol })
          } else {
            console.log('convert')
          }
          setTimeout(() => {
            dismiss()
            const symbol = props.asset.symbol.toUpperCase()
            const resultMessage = props.transactionType == 'Buy' ? `Successfully bought ${assetQuantity.value.toFixed(4)} of ${symbol}.` : `Successfully sold all of your ${symbol}.`
            openResultToast(resultMessage)
          }, 500)
        }
        
        return { dismiss, preferredCurrency, isLoading, displayOnlySignificatDigits, providedQuantity, assetQuantity, transactionFee, purchasePrice, proceedTransaction }
    }
})
</script>

<style scoped>
ion-input, item-input .sc-ion-label-ios- {
  @apply text-4xl;
}
ion-item {
  --border-width: 0;
  --inner-border-width: 0;
  --padding-start: 0;
  --padding-end: 0;
  --inner-padding-start: 0;
  --inner-padding-end: 0;  
}
ion-item ion-input {
  @apply text-4xl font-bold;
}
</style>