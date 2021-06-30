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
      <section class="modal__content flex flex-col items-center justify-center p-8" v-if="transactionType == 'Convert'">
        <ion-list class="w-full">
          <ion-item class="my-4 w-4/5 mx-auto" lines="none">
            <ion-input class="default text-center" type="number" mode="ios" autofocus value="0" placeholder="0" min="15" max="10000" color="primary" inputmode="decimal" v-model="providedQuantity"></ion-input>
            <ion-label color="primary" class="font-bold uppercase">{{ asset.symbol }}</ion-label>
          </ion-item>
          <ion-item lines="none" class="w-full">
            <div class="assets__comparison w-full">
                <div class="asset__title">
                    <div class="asset__icon">
                        <img :src="asset.image" class="asset__img" alt="asset icon">
                    </div>
                    <div class="asset__name">
                        <p>From</p>
                        <span class="symbol">{{ asset.symbol }}</span>
                    </div>
                </div>
                <div class="icon__wrapper w-10 h-10 flex items-center justify-center">
                  <ion-icon size="small" :icon="arrowForwardOutline" />
                </div>
                <div class="asset__title flex-row-reverse" @click="setOpen(true)">
                    <div class="asset__icon">
                        <img :src="conversionAsset.image" class="asset__img" alt="asset icon">
                    </div>
                    <div class="asset__name">
                        <p>To</p>
                        <span class="symbol">{{ conversionAsset.symbol }}</span>
                    </div>
                </div>
            </div>
          </ion-item>
          <ion-item lines="none">
            <ion-label>Pay with</ion-label>
            <ion-label class="text-right">{{ asset.name }}</ion-label>
          </ion-item>
          <ion-item lines="none">
            <ion-label class="w-min">Exchange rate</ion-label>
            <ion-label class="text-right uppercase">1 {{ asset.symbol }} = {{ displayOnlySignificatDigits(convertCurrency(1, asset.current_price, conversionAsset.current_price), 4)  }} {{ conversionAsset.symbol }}</ion-label>
          </ion-item>
          <ion-item lines="none">
            <ion-label>Transaction Fee</ion-label>
            <ion-label class="text-right">{{ transactionFee }} {{ preferredCurrency }}</ion-label>
          </ion-item>
          <ion-item lines="none">
            <ion-label>Total ({{ preferredCurrency }})</ion-label>
            <ion-label class="text-right uppercase">{{ displayOnlySignificatDigits(convertCurrency(+providedQuantity * asset.current_price, baseCurrencyRate, currencyRate), 8) }} {{ preferredCurrency }}</ion-label>
          </ion-item>
          <ion-item lines="none">
            <ion-label class="font-bold">Total</ion-label>
            <ion-label class="font-bold text-right uppercase">{{ displayOnlySignificatDigits(convertCurrency(+providedQuantity, asset.current_price, conversionAsset.current_price), 8) }} {{ conversionAsset.symbol }}</ion-label>
          </ion-item>
        </ion-list>
        <ion-button @click="proceedTransaction" mode="ios" :disabled="isLoading || providedQuantity == 0 || isQuantityInvalid" expand="block" class="mt-8 text-lg w-full text-white font-bold">
          <ion-spinner v-if="isLoading" />
          <ion-label v-else>{{ transactionType }} now</ion-label>
        </ion-button>
        <ion-modal
          :is-open="isActive"
          css-class="transaction-modal"
          @didDismiss="setOpen(false)"
          mode="ios"
          swipeToClose
        >
          <SelectAssetsModal @onDismiss="setOpen(false)" @selectedAsset="chooseConversionAsset" :currentAssetSymbol="asset.symbol" :conversionAssetSymbol="conversionAsset.symbol" title="Select asset to convert to" />
        </ion-modal>
      </section>
      <section class="modal__content flex flex-col items-center justify-center p-8" v-else>
        <ion-list class="w-full">
          <ion-item class="my-4 w-4/5 mx-auto" lines="none">
            <ion-input class="default text-center" type="number" :readonly="transactionType == 'Sell'" mode="ios" autofocus value="0" placeholder="0" min="15" max="10000" color="primary" inputmode="decimal" v-model="providedQuantity"></ion-input>
            <ion-label color="primary" class="font-bold">{{ preferredCurrency }}</ion-label>
          </ion-item>
          <ion-item class="price__input--container" lines="none" v-if="transactionType == 'Buy' && provideCustomPurchasePrice">
            <ion-label class="text-left">Unit price</ion-label>
            <ion-input class="small text-right" type="number" mode="ios" autofocus value="0" placeholder="0" min="15" max="10000" color="primary" inputmode="decimal" v-model="customPurchasePrice"></ion-input>
            <ion-label>{{ preferredCurrency }}</ion-label>
          </ion-item>
          <ion-item lines="none">
            <ion-label><span class="uppercase">{{ asset.symbol }}</span> price</ion-label>
            <ion-label class="text-right">{{ displayOnlySignificatDigits(assetQuantity, 8) }} <span class="uppercase">{{ asset.symbol }}</span></ion-label>
          </ion-item>
          <ion-item lines="none">
            <ion-label>{{ transactionType == 'Buy' ? 'Purchase' : 'Sale' }}</ion-label>
            <ion-label class="text-right">{{ displayOnlySignificatDigits(transactionType == 'Buy' ? purchasePrice : +providedQuantity, 8) }} {{ preferredCurrency }}</ion-label>
          </ion-item>
          <ion-item lines="none">
            <ion-label>Transaction Fee</ion-label>
            <ion-label class="text-right">{{ transactionFee }} {{ preferredCurrency }}</ion-label>
          </ion-item>
          <ion-item lines="none">
            <ion-label class="font-bold">Total</ion-label>
            <ion-label class="font-bold text-right">{{ displayOnlySignificatDigits(transactionType == 'Buy' ? +providedQuantity : purchasePrice, 8) }} {{ preferredCurrency }}</ion-label>
          </ion-item>
        </ion-list>
        <ion-button @click="proceedTransaction" mode="ios" :disabled="isLoading || isNegative || isQuantityInvalid" expand="block" class="mt-8 text-lg w-full text-white font-bold">
          <ion-spinner v-if="isLoading" />
          <ion-label v-else>{{ transactionType }} now</ion-label>
        </ion-button>
      </section>
    </ion-content>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, PropType, reactive, ref } from 'vue'
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonInput, IonLabel, IonItem, IonList, IonSpinner, IonIcon, IonModal } from '@ionic/vue'
import { useStore } from 'vuex'
import { displayOnlySignificatDigits, formatValue } from '@/services/FormatValue'
import { PortfolioItem } from '@/store/modules/auth/models/UserAccount'
import { convertCurrency } from '@/services/ConvertCurrency'
import { openToast } from '@/services/OpenToast'
import { arrowForwardOutline } from 'ionicons/icons'
import SelectAssetsModal from '@/components/SelectAssetsModal.vue'
import Asset from '@/store/modules/assets/models/Asset'
import firebase from 'firebase'
import useVuelidate from '@vuelidate/core'
import { between } from '@vuelidate/validators'
import useCurrency from '@/hooks/useCurrency'

export default defineComponent({
    name: 'TransactionModal',
    components: { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonInput, IonLabel, IonItem, IonList, IonSpinner, IonIcon, IonModal, SelectAssetsModal },
    props: {
      title: {
        type: String,
        required: true
      },
      asset: {
        type: Object as PropType<Asset>,
        required: true
      },
      transactionType: {
        type: String,
        required: true
      }
    },
    emits: ['onDismiss'],
    setup(props, { emit }) {        
        const store = useStore()
        const isLoading: ComputedRef<boolean> = computed(() => store.getters.isLoading)
        const userPortfolio = computed(() => store.getters.userPortfolio)
        const { preferredCurrency, currencyRate, baseCurrencyRate } = useCurrency()

        const assets = computed(() => store.getters.assets)
        const chosenAsset = ref(props.asset.symbol === assets.value[0].symbol ? assets.value[1].symbol : assets.value[0].symbol)
        const conversionAsset: ComputedRef<Asset> = computed(() => assets.value.find((asset: Asset) => asset.symbol == chosenAsset.value))

        const provideCustomPurchasePrice = false
        const TRANSACTION_FEE = props.transactionType === 'Convert' ? 0 : 2.99
        const portfolioAsset = computed(() => userPortfolio.value.find((asset: PortfolioItem) => asset.symbol == props.asset.symbol.toLowerCase()))
        const customPurchasePrice = ref(props.transactionType === 'Convert' ? conversionAsset.value.current_price : props.asset.current_price)
        const providedQuantity = ref(props.transactionType === 'Sell' ? convertCurrency(portfolioAsset.value.quantity * +customPurchasePrice.value, baseCurrencyRate.value, currencyRate.value): 0)
        const transactionFee = computed(() => +convertCurrency(TRANSACTION_FEE, baseCurrencyRate.value, currencyRate.value).toFixed(2))
        const purchasePrice = computed(() => providedQuantity.value - transactionFee.value < 0 ? 0 : providedQuantity.value - transactionFee.value)
        const assetQuantity = computed(() => { 
          if (props.transactionType === 'Sell')
            return convertCurrency(portfolioAsset.value.quantity, baseCurrencyRate.value, currencyRate.value)
          else if (providedQuantity.value - transactionFee.value < 0) 
            return 0
          else return purchasePrice.value / convertCurrency(+customPurchasePrice.value, baseCurrencyRate.value, currencyRate.value)
        })

        const MAX_TRANSACTION_VALUE = 10000000
        const rules = computed(() => ({
          providedQuantity: {
            between: between(0, props.transactionType === 'Convert' ? portfolioAsset.value?.quantity : MAX_TRANSACTION_VALUE)
          }
        }))
        const v$ = useVuelidate(rules, reactive({ providedQuantity }))

        const isQuantityInvalid = computed(() => v$.value.providedQuantity.$invalid)
        const isNegative = computed(() => +(providedQuantity.value as any) <= 0)
        console.log(isLoading.value, isNegative.value, isQuantityInvalid.value)
        const dismiss = () => {
          emit('onDismiss', false)
        }

        const proceedTransaction = () => {
          if(props.transactionType == 'Buy') {
              const transactionQuantity = +assetQuantity.value.toFixed(4)
              const assetToBuy: PortfolioItem = {
                name: props.asset.name.toLowerCase(),
                quantity: transactionQuantity,
                symbol: props.asset.symbol.toLowerCase(),
                transactions: [
                  {
                    purchasePrice: +customPurchasePrice.value,
                    quantity: transactionQuantity,
                    transactionDate: firebase.firestore.Timestamp.now()
                  }
                ],
              }
              store.dispatch('buyAsset', assetToBuy)
          } else if (props.transactionType == 'Sell') {
              store.dispatch('sellAsset', { symbol: props.asset.symbol })
          } else {
              const transactionQuantity = +providedQuantity.value // quantity is provided in the currency before conversion
              const assetToConvert: PortfolioItem = {
                name: props.asset.name.toLowerCase(),
                quantity: transactionQuantity,
                symbol: conversionAsset.value.symbol.toLowerCase(),
                transactions: [
                  {
                    purchasePrice: +customPurchasePrice.value,
                    quantity: transactionQuantity,
                    transactionDate: firebase.firestore.Timestamp.now()
                  }
                ],
              }
              store.dispatch('convertAsset', { currentAssetSymbol: props.asset.symbol, conversionAsset: assetToConvert })
          }

          setTimeout(() => {
            dismiss()
            const symbol = props.asset.symbol.toUpperCase()
            const resultMessage = props.transactionType == 'Buy' ? `Successfully bought ${assetQuantity.value.toFixed(4)} of ${symbol}.` : props.transactionType == 'Sell' ? `Successfully sold all of your ${symbol}.` : `Converted ${providedQuantity.value} of ${symbol} to ${conversionAsset.value.symbol.toUpperCase()}`
            openToast(resultMessage, 'bottom', 2000, 'primary')
          }, 500)
        }

        const isActive = ref(false);
        const setOpen = (state: boolean) => isActive.value = state;

        const chooseConversionAsset = (selectedAsset: string) => {
          chosenAsset.value = selectedAsset
        }

        return { dismiss, preferredCurrency, conversionAsset, isLoading, displayOnlySignificatDigits, provideCustomPurchasePrice, customPurchasePrice, providedQuantity, assetQuantity, transactionFee, purchasePrice, proceedTransaction, convertCurrency, formatValue, baseCurrencyRate, currencyRate, arrowForwardOutline, isActive, setOpen, chooseConversionAsset, v$, isQuantityInvalid, isNegative, portfolioAsset }
    }
})
</script>

<style scoped>
ion-input.default, item-input .sc-ion-label-ios- {
  @apply text-4xl;
}

ion-input.small {
  @apply text-xl;
}

ion-item {
  --padding-start: 0;
  --padding-end: 0;
  --inner-padding-start: 0;
  --inner-padding-end: 0;  
}

ion-item ion-input.default {
  @apply text-4xl font-bold;
}

.assets__comparison {
  @apply flex items-center justify-between my-4;
}

.assets__comparison .asset__title {
  @apply flex items-center justify-between cursor-pointer;
}

.assets__comparison .asset__title:first-of-type .asset__name {
  @apply text-left;
}

.assets__comparison .asset__title:last-of-type .asset__name {
  @apply text-right;
}

.assets__comparison .asset__title .asset__name p {
  @apply text-sm;
}

.assets__comparison .asset__title .asset__name span {
  @apply uppercase;
}

.assets__comparison .asset__title .asset__icon {
  max-width: 32px;
  @apply w-8 h-full;
}

.assets__comparison .asset__title .asset__icon .asset__img {
  max-width: 32px;
  @apply w-full h-full object-contain;
}

.assets__comparison .asset__title:first-of-type .asset__icon {
  @apply mr-4;
}

.assets__comparison .asset__title:last-of-type .asset__icon {
  @apply ml-4;
}
</style>