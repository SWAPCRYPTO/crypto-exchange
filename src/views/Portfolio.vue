<template>
  <ion-page>
    <ion-header translucent>
      <ion-toolbar mode="ios">
        <ion-title>{{ preferredCurrency }} {{ formatValue(convertCurrency(balance, baseCurrencyRate, currencyRate), 2) }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen>
      <section class="portfolio container">
        <header class="balance__container">
          <ion-header n-header collapse="condense">
            <ion-toolbar>
              <p class="font-medium mb-2">Portfolio balance</p>
              <h1 v-if="!isLoading" class="h1 balance cursor-pointer" @click="router.push('/tabs/portfolio')">{{ preferredCurrency }} {{ formatValue(convertCurrency(balance, baseCurrencyRate, currencyRate), 2) }}</h1>
              <ion-skeleton-text v-else animated style="height: 100%; width: 80%; line-height: 2.5rem;" />
            </ion-toolbar>
          </ion-header>
        </header>
        <!-- <div class="graph__container my-4" v-if="portfolioAssets.length > 0">
          <ChartComponent :symbol="preferredCurrency" :data="transactionsData" :currency="preferredCurrency" :displayAllLabels="false" />
          <div class="time__options w-full flex justify-between mt-4">
            <ion-chip @click="changeActiveTimeOption(option)" v-model="activeTimeOption" v-for="option in Object.keys(timeOptions)" :key="option" :class="{ active: option == activeTimeOption }">
              <ion-label class="uppercase">{{ option }}</ion-label>
            </ion-chip>
          </div>
        </div> -->
        <section class="portfolio__container" v-if="portfolioAssets.length > 0">
          <AssetsList :assets="portfolioAssets" :walletMode="true" />
          <ion-button @click="openModal" mode="ios" expand="block" class="text-lg text-white font-bold">
            <ion-spinner v-if="isEstimationLoading" />
            <ion-label v-else>Estimate portfolio value</ion-label>
          </ion-button>
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
        <section class="empty__portfolio my-8 flex flex-col items-center justify-center text-center" v-else>
          <h2 class="h2">Your portfolio is empty</h2>
          <p class="my-4">Keep track of your profits, losses and portfolio valuation. Start building the portfolio today.</p>
          <ion-button @click="router.push('/tabs/prices')" mode="ios" expand="block" class="text-lg text-white font-bold">Check available assets</ion-button>
        </section>
      </section>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonChip, IonLabel, IonButton, IonSpinner, IonModal, IonSkeletonText, alertController } from "@ionic/vue";
import { computed, ref, Ref, watch } from 'vue';
import { useStore } from 'vuex';
// import ChartComponent from "../components/charts/ChartComponent.vue"
import AssetsList from "../components/AssetsList.vue"
import User from '@/store/modules/auth/models/User';
import Asset from '@/store/modules/assets/models/Asset';
import { convertCurrency } from '@/services/ConvertCurrency';
import { formatValue } from '@/services/FormatValue';
import { Currencies } from '@/store/modules/assets/models/NBPCurrency';
import EstimationPortfolioModal from '@/components/EstimationPortfolioModal.vue';
import { useRouter } from 'vue-router';
import { PortfolioItem, Transaction } from '@/store/modules/auth/models/UserAccount';

const collectPurchasesData = (portfolio: PortfolioItem[]): number[] => {
  const transactions: Transaction[] = []
  for (const asset of portfolio) {
      transactions.push(...asset.transactions)
  }

  transactions.sort((a, b) => a.transactionDate.seconds - b.transactionDate.seconds)

  const LOCALE = 'pl-PL'
  // wynik jest inny niz balance bo ten wynik nie bierze pod uwage aktualnej ceny kazdego zasobu,
  // a przdstawiane sa dane jakie kwoty byly w momencie kupowania
  const getDatesBetweenDates = (startDate: Date, endDate: Date, transactions: Transaction[]) => {
    const timeBetween = endDate.getTime() - startDate.getTime()
    const daysBetween = Math.ceil(timeBetween / (1000 * 3600 * 24))

    const dates: { date: string, value: number }[] = []
    const theDate = new Date(startDate)
    theDate.setHours(0, 0, 0, 0)
    for (let i = 0; i < daysBetween; i++) {
      const dateObject = {
        date: (new Date(theDate)).toLocaleDateString(LOCALE),
        value: 0
      }

      transactions.forEach(transaction => {
        const transactionDate = new Date(((transaction.transactionDate as any).toDate() as Date))
        transactionDate.setHours(0, 0, 0, 0)
        const transactionStringDate = transactionDate.toLocaleDateString(LOCALE)

        if (transactionStringDate == dateObject.date) {
          dateObject.value += transaction.purchasePrice * transaction.quantity
        }
      })
      dates.push(dateObject)
      theDate.setDate(theDate.getDate() + 1)
    }

    return dates
  }
  
  const getData = (transactions: { date: string, value: number }[]) => {
    const pricesInTime: number[] = [0]
    let currentValue = 0
    for (const transaction of transactions) {
      if (transaction.value !== 0)
        currentValue += transaction.value
      pricesInTime.push(currentValue)
    }

    return pricesInTime
  }

  const dataValues = getDatesBetweenDates(transactions.length > 0 ? (transactions[0].transactionDate as any).toDate() : new Date(), new Date(), transactions)
  return getData(dataValues)
}

type TimeOption = '1d' | '1w' | '1m' | '1y'

interface TimeOptions {
    '1d': 1;
    '1w': 7;
    '1m': 30;
    '1y': 365;
}

export default  {
  name: "Portfolio",
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonLabel, IonButton, IonSpinner, IonModal, AssetsList, EstimationPortfolioModal, IonSkeletonText },
  setup() {
      const store = useStore()
      const router = useRouter()
      const isLoading = computed(() => store.getters.isLoading)
      const isEstimationLoading = computed(() => store.getters.isEstimationLoading)
      const user: Ref<User> = computed(() => store.getters.user)
      const preferredCurrency = computed(() => user.value.account.preferredCurrency)
      const assets: Ref<Asset[]> = computed(() => store.getters.assets)
      const portfolioAssets: Ref<Asset[]> = computed(() => assets.value.filter(asset => user.value.account.portfolio.map(portfolioItem => portfolioItem.symbol).includes(asset.symbol)))
      const currencies: Ref<Currencies> = computed(() => store.getters.currencies)
      const currencyRate = computed(() => preferredCurrency.value in currencies.value ? currencies.value[preferredCurrency.value] : 1)
      const baseCurrencyRate = computed(() => store.getters.baseCurrencyRate)

      const findAssetRate = (assetSymbol: string, assets: Asset[]) => assets.find(asset => asset.symbol == assetSymbol)?.current_price as number
      const balance = computed(() => {
        let portfolioSum = 0

        user.value.account.portfolio.forEach(portfolioAsset => {
          const assetRate = findAssetRate(portfolioAsset.symbol, assets.value)
          const assetValue =  (assetRate ? assetRate : 0) * portfolioAsset.quantity
          
          portfolioSum += assetValue
        })
        
        return portfolioSum
      })

      const estimatePortfolio = (percentageOfPortfolio: number, checkArbitrage: boolean) => store.dispatch('estimatePortfolioValue', { portfolio: user.value.account.portfolio, percentageOfPortfolio, checkArbitrage })
     
      const isActive = ref(false);
      const setOpen = (state: boolean) => isActive.value = state;

      const presentAlertConfirm = async () => {
        const alert = await alertController
          .create({
            cssClass: 'my-custom-class',
            header: 'Arbitrage',
            message: 'Would you like to check whether the arbitrage is possible?',
            buttons: [
              {
                text: 'Yes',
                handler: () => {
                  estimatePortfolio(0.1, true).then(() => {
                    setOpen(true)
                  })
                },
                cssClass: 'primary'
              },
              {
                text: 'No',
                handler: () => {
                  estimatePortfolio(0.1, false).then(() => {
                    setOpen(true)
                  })
                },
              },
              {
                text: 'Cancel',
                role: 'cancel',
              }
            ],
        });
        return alert.present();
      }

      const openModal = () => {
        presentAlertConfirm()
      }

      const assetsSummary = computed(() => store.getters.assetsSummary)

      const transactionsData = ref(collectPurchasesData(user.value.account.portfolio))

      watch(portfolioAssets, () => {
          transactionsData.value = collectPurchasesData(user.value.account.portfolio)
      })

      const timeOptions: TimeOptions = { '1d': 1, '1w': 7, '1m': 30, '1y': 365 }
      const activeTimeOption: Ref<TimeOption> = ref(Object.keys(timeOptions)[1] as TimeOption)

      const changeActiveTimeOption = async (option: TimeOption) => {
        activeTimeOption.value = option
        const numberOfDays = timeOptions[activeTimeOption.value] == 1 ? timeOptions[activeTimeOption.value] + 1 : timeOptions[activeTimeOption.value]

        const collectedDates = collectPurchasesData(user.value.account.portfolio)
        transactionsData.value = collectedDates.slice(collectedDates.length > numberOfDays ? -numberOfDays : -collectedDates.length)
      }

      return { isLoading, isEstimationLoading, user, preferredCurrency, portfolioAssets, balance, isActive, openModal, setOpen, assetsSummary, formatValue, router, currencyRate, convertCurrency, currencies, baseCurrencyRate, transactionsData, timeOptions, activeTimeOption, changeActiveTimeOption }
  }
}
</script>