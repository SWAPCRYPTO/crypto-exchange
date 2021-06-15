<template>
  <ion-page>
    <ion-header translucent>
      <ion-toolbar mode="ios">
        <ion-title>{{ isPrivacyModeActive ? PRIVACY_MASK : `${preferredCurrency} ${formatValue(convertCurrency(balance, baseCurrencyRate, currencyRate), 2)}` }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen>
      <section class="portfolio container md:max-w-screen-md">
        <BalanceHeader />
        <section class="portfolio__container" v-if="portfolioAssets.length > 0">
          <AssetsList :assets="portfolioAssets" :walletMode="true" routableAssets />
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
            <EstimationPortfolioModal @onDismiss="setOpen(false)" title="Portfolio estimation" :assetsSummary="assetsSummary" :percentageOfPortfolio="percentageDecimal" />
          </ion-modal>
        </section>
        <section class="empty__portfolio mt-16 mb-8 flex flex-col items-center justify-center text-center" v-else>
          <h2 class="h2">Your portfolio is empty</h2>
          <p class="my-4">Keep track of your profits, losses and portfolio valuation. Start building the portfolio today.</p>
          <ion-button @click="router.push('/tabs/prices')" mode="ios" expand="block" class="text-lg text-white font-bold">Check available assets</ion-button>
        </section>
      </section>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonButton, IonSpinner, IonModal, alertController } from "@ionic/vue";
import { computed, ref, Ref, watch } from 'vue';
import { useStore } from 'vuex';
import BalanceHeader from '@/components/BalanceHeader.vue'
import AssetsList from "@/components/AssetsList.vue"
import User from '@/store/modules/auth/models/User';
import Asset from '@/store/modules/assets/models/Asset';
import { convertCurrency } from '@/services/ConvertCurrency';
import { formatValue } from '@/services/FormatValue';
import { Currencies } from '@/store/modules/assets/models/NBPCurrency';
import EstimationPortfolioModal from '@/components/EstimationPortfolioModal.vue';
import { useRouter } from 'vue-router';
import { PortfolioItem, Transaction } from '@/store/modules/auth/models/UserAccount';
import useBalance from '@/hooks/useBalance';
import { LOCALE } from '@/store/modules/assets/constants';
import usePrivacyMode from '@/hooks/usePrivacyMode';

const collectPurchasesData = (portfolio: PortfolioItem[]): number[] => {
  const transactions: Transaction[] = []
  for (const asset of portfolio) {
      transactions.push(...asset.transactions)
  }

  transactions.sort((a, b) => a.transactionDate.seconds - b.transactionDate.seconds)
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
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonLabel, IonButton, IonSpinner, IonModal, BalanceHeader, AssetsList, EstimationPortfolioModal },
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

      const balance = useBalance()

      const estimatePortfolio = (percentageOfPortfolio: number, checkArbitrage: boolean) => store.dispatch('estimatePortfolioValue', { portfolio: user.value.account.portfolio, percentageOfPortfolio, checkArbitrage })
     
      const isActive = ref(false);
      const setOpen = (state: boolean) => isActive.value = state;
      const percentagePortfolio = ref(10)
      const percentageDecimal = computed(() => percentagePortfolio.value / 100)

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
                  estimatePortfolio(percentageDecimal.value, true).then(() => {
                    setOpen(true)
                  })
                },
                cssClass: 'primary'
              },
              {
                text: 'No',
                handler: () => {
                  estimatePortfolio(percentageDecimal.value, false).then(() => {
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

      const askForPercentage = async () => {
        const alert = await alertController
          .create({
            cssClass: 'my-custom-class',
            header: 'Percentage',
            message: 'What percentage of your portfolio would you like to estimate?',
            inputs: [
              {
                name: 'percentage',
                type: 'number',
                placeholder: 'Provide a number (0-100]: ie. 10 (%)',
                attributes: {
                  maxlength: 3,
                  value: 10,
                  min: 0,
                  max: 100,
                  inputmode: 'decimal'
                }
              }
            ],
            buttons: [
              {
                text: 'Estimate',
                handler: (alertData) => {
                  percentagePortfolio.value = alertData.percentage
                  presentAlertConfirm()
                },
                cssClass: 'primary'
              },
              {
                text: 'Cancel',
                role: 'cancel',
              }
            ]
        });
        return alert.present();
      }

      const openModal = () => {
        askForPercentage()
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

      const { PRIVACY_MASK, isPrivacyModeActive } = usePrivacyMode()

      return { isLoading, isEstimationLoading, user, preferredCurrency, portfolioAssets, balance, isActive, openModal, setOpen, assetsSummary, formatValue, router, currencyRate, convertCurrency, currencies, baseCurrencyRate, transactionsData, timeOptions, activeTimeOption, changeActiveTimeOption, percentageDecimal, PRIVACY_MASK, isPrivacyModeActive }
  }
}
</script>