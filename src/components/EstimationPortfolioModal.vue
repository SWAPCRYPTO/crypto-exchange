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
        <table class="grid" v-if="!isEstimationLoading">
            <thead>
                <tr>
                    <th v-for="header in tableHeaders" :key="header">{{ header }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="asset in assetsSummary" :key="asset.name">
                    <td v-for="(prop, key) in asset" :key="prop">{{ isPrivacyModeActive ? PRIVACY_MASK : displayProp(prop, key) }}</td>
                </tr>
                <tr>
                    <td v-for="(cell, index) in sumCells" :key="index">{{ isPrivacyModeActive ? PRIVACY_MASK : displayProp(cell) }}</td>
                </tr>
            </tbody>
        </table>
        <table class="grid" v-else>
            <thead>
                <tr>
                    <th v-for="header in tableHeaders" :key="header">
                      <ion-skeleton-text animated style="height: 100%" />
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="header in tableHeaders" :key="header">
                    <td v-for="n in SKELETON_ITEMS" :key="n"><ion-skeleton-text animated style="width: 60%" /></td>
                </tr>
            </tbody>
        </table>
    </ion-content>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonSkeletonText } from '@ionic/vue'
import { useStore } from 'vuex'
import { displayOnlySignificatDigits } from '@/services/FormatValue'
import { ArbitrageDetails } from '@/store/modules/assets/models/estimation/ArbitrageDetails'
import { convertCurrency } from '@/services/ConvertCurrency';
import AssetSummary from '@/store/modules/assets/models/estimation/AssetSummary'
import usePrivacyMode from '@/hooks/usePrivacyMode'
import useCurrency from '@/hooks/useCurrency'

export default defineComponent({
    name: 'EstimationPortfolioModal',
    components: { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonSkeletonText },
    props: {
      title: {
        type: String,
        required: true
      },
      assetsSummary: {
        type: Array as PropType<AssetSummary[]>,
        required: true
      },
      percentageOfPortfolio: {
        type: Number,
        required: true
      }
    },
    emits: ['onDismiss'],
    setup(props, { emit }) {
        const dismiss = () => {
            emit('onDismiss', false)
        }        
        const store = useStore()
        const { preferredCurrency, currencyRate, baseCurrencyRate } = useCurrency()
        const isEstimationLoading = computed(() => store.getters.isEstimationLoading)
        const SKELETON_ITEMS = 4

        const tableHeaders = computed(() => ['asset', 'quantity', `price [${preferredCurrency.value}]`, `value [${preferredCurrency.value}]`, `nettoValue [${preferredCurrency.value}]`, `value ${props.percentageOfPortfolio * 100}% [${preferredCurrency.value}]`, `nettoValue ${props.percentageOfPortfolio * 100}% [${preferredCurrency.value}]`, 'exchange name', 'arbitrage'])

        const sumColumnValues = (array: AssetSummary[], key: string) => array.reduce((acc, elem) => acc + (elem as any)[key], 0)
        const sumValues = computed(() => sumColumnValues(props.assetsSummary, 'value'))
        const sumNettoValues = computed(() => sumColumnValues(props.assetsSummary, 'nettoValue'))
        const sumPercentageValue = computed(() => sumColumnValues(props.assetsSummary, 'percentageValue'))
        const sumPercentageNettoValue = computed(() => sumColumnValues(props.assetsSummary, 'percentageNettoValue'))
        const sumCells = computed(() => ['Sum', '', '', sumValues.value, sumNettoValues.value, sumPercentageValue.value, sumPercentageNettoValue.value, '', ''])

        const displayProp = (prop: number | string | ArbitrageDetails, key: string) => {
          if (typeof prop === 'number') {
            if(key == 'quantity') {
              return  displayOnlySignificatDigits(prop, 6)
            }
            return displayOnlySignificatDigits(convertCurrency(prop, baseCurrencyRate.value, currencyRate.value), 6)
          } else if (typeof prop === 'object' && typeof prop !== 'string') {
            if (Object.keys(prop).length !== 0) {
              return `${prop.exchangeMarkets[0]}->${prop.exchangeMarkets[1]} ${prop.market} +${displayOnlySignificatDigits(convertCurrency(prop.profit, baseCurrencyRate.value, currencyRate.value), 6)} ${prop.market.split('-')[1]}`
            } else return 'not possible'
          } else return prop
        }

        const { PRIVACY_MASK, isPrivacyModeActive } = usePrivacyMode()
        
        return { dismiss, isEstimationLoading, tableHeaders, SKELETON_ITEMS, displayOnlySignificatDigits, displayProp, sumCells, PRIVACY_MASK, isPrivacyModeActive }
    }
})
</script>

<style scoped>
ion-col {
    @apply text-sm capitalize;
}
table {
  @apply border-collapse mt-2 mb-20 w-full overflow-auto;
}

th, td {
  min-width: 16rem;
  border-right: solid 2px transparent;
  border-right: solid 2px transparent;
}

th:last-child,
td:last-child {
  border-right: none;
}

thead th {
  border-bottom: 2px solid transparent;
  border-bottom: 2px solid transparent;
  @apply py-2 px-4 capitalize text-left text-lg;
}

tbody th,
tbody td {
  border-bottom: 2px dotted transparent;
  border-bottom: 2px dotted transparent;
  @apply py-2 px-4 capitalize;
}

tbody tr:last-child th,
tbody tr:last-child td {
  border-bottom: 2px solid transparent;
  border-bottom: 2px solid transparent;
}

.grid {
  display: grid;
  grid-template-columns: repeat(9, auto);
  grid-template-rows: 1fr;
  @apply relative py-4;
}

.grid thead,
.grid tbody,
.grid tr,
.grid colgroup {
  display: contents;
}

.grid caption {
  grid-column: 1 / -1;
}
</style>