<template>
    <ion-page>
        <ion-header translucent>
            <ion-toolbar mode="ios">
                <ion-title v-if="!isLoading"
                    >Market is {{ marketChangeStatus }} <span :class="isMarketUp ? 'text-success' : 'text-error'">{{ marketChangePercentageText }}</span></ion-title
                >
            </ion-toolbar>
        </ion-header>
        <ion-content fullscreen>
            <section class="prices container md:max-w-screen-md">
                <ion-header class="bg-transparent" collapse="condense">
                    <ion-toolbar>
                        <div class="header__container flex flex-col lg:flex-row items-start justify-between">
                            <div class="header__details flex flex-col" v-if="!isLoading">
                                <p class="font-medium mb-2">In the past 24 hours</p>
                                <h1 class="h1 balance">
                                    Market is {{ marketChangeStatus }}
                                    <span class="text-2xl md:text-3xl" :class="isMarketUp ? 'text-success' : 'text-error'">{{ marketChangePercentageText }}</span>
                                </h1>
                            </div>
                            <div class="header__details flex flex-col w-full" v-else>
                                <p class="font-medium mb-2">In the past 24 hours</p>
                                <ion-skeleton-text style="height: 100%; width: 100%; line-height: 2.5rem; min-height: 2.5rem" animated />
                            </div>
                            <div class="search__wrapper mt-8 lg:mt-0 w-full md:max-w-xs">
                                <ion-searchbar
                                    v-if="!isLoading"
                                    v-model="searchQuery"
                                    show-cancel-button="never"
                                    debounce="500"
                                    placeholder="Find your asset"
                                    animated
                                ></ion-searchbar>
                                <ion-skeleton-text v-else style="height: 100%; width: 100%; line-height: 2.5rem; min-height: 2.5rem" animated />
                            </div>
                            <div class="chips__container">
                                <ion-chip @click="presentCurrencyActionSheet">
                                    <ion-label>{{ preferredCurrency }}</ion-label>
                                </ion-chip>
                                <ion-chip @click="presentSortActionSheet">
                                    <ion-label>Sort</ion-label>
                                </ion-chip>
                                <ion-chip color="primary" v-if="activeSorting" @click="sortAscending = !sortAscending">
                                    <ion-label>{{ activeSorting }}</ion-label>
                                    <ion-icon :icon="sortAscending ? arrowUpOutline : arrowDownOutline" color="primary"></ion-icon>
                                    <ion-icon :icon="close" @click="removeSorting" color="primary"></ion-icon>
                                </ion-chip>
                            </div>
                        </div>
                    </ion-toolbar>
                </ion-header>
                <AssetsList :assets="sortedAssets" :searchQuery="searchQuery" :walletMode="false" :allowHistory="false" routableAssets />
            </section>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, ref, Ref, watch } from 'vue'
import { useStore } from 'vuex'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonSkeletonText, IonChip, IonLabel, IonIcon, actionSheetController } from '@ionic/vue'
import { arrowDownOutline, arrowUpOutline, statsChartOutline, rocketOutline, ribbonOutline, cashOutline, repeatOutline, close } from 'ionicons/icons'
import AssetsList from '../components/AssetsList.vue'
import Asset from '@/store/modules/assets/models/Asset'
import Currency from '@/store/modules/assets/models/Currency'
import User from '@/store/modules/auth/models/User'
import useCurrency from '@/hooks/useCurrency'
import { ActionTypes, MutationTypes } from '@/store'

interface SortOption {
    title: string
    icon: string
    settings: {
        sortingCategory: string
        sortingKey: string
        reverseSorting: boolean
        absoluteValues: boolean
    }
}

const sortAssets = (items: any[], key: string, absoluteValues: boolean) => items.sort((a, b) => (absoluteValues ? Math.abs(a[key]) - Math.abs(b[key]) : a[key] - b[key]))

export default defineComponent({
    name: 'Prices',
    components: { AssetsList, IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonSearchbar, IonSkeletonText, IonChip, IonLabel, IonIcon },
    setup() {
        const store = useStore()
        const isLoading: ComputedRef<boolean> = computed(() => store.getters.isLoading)
        const assets: Ref<Asset[]> = computed(() => store.getters.assets)
        const sortedAssets: Ref<Asset[]> = ref(assets.value)
        const user: Ref<User> = computed(() => store.getters.user)

        const { preferredCurrency, currencies, baseCurrencyRate } = useCurrency()
        const updateUserAccount = (preferredCurrency: string) => store.dispatch(ActionTypes.updateUserAccount, { ...user.value.account, preferredCurrency })

        const marketChangePercentage = ref(assets.value.reduce((acc, elem) => acc + elem.market_cap_change_percentage_24h, 0) / assets.value.length)
        const isMarketUp = ref(marketChangePercentage.value > 0)
        const marketChangeStatus = ref(isMarketUp.value ? 'up' : 'down')
        const marketChangePercentageText = ref(`${isMarketUp.value ? '+' : ''}${marketChangePercentage.value.toFixed(2)}%`)
        const searchQuery = ref('')

        const activeSorting = ref('')
        const sortAscending = ref(true)

        const removeSorting = () => {
            sortedAssets.value = assets.value
            activeSorting.value = ''
        }

        watch(sortAscending, (newSorting, oldSorting) => {
            if (newSorting != oldSorting && activeSorting.value) {
                sortedAssets.value = sortedAssets.value.reverse()
            }
        })

        const sortBy = (sortingCategory: string, sortingKey: string, reverseSorting: boolean, absoluteValues: boolean) => {
            activeSorting.value = sortingCategory
            sortedAssets.value =
                sortAscending.value && !reverseSorting
                    ? sortAssets(assets.value.slice(), sortingKey, absoluteValues)
                    : sortAssets(assets.value.slice(), sortingKey, absoluteValues).reverse()
            sortAscending.value = !sortAscending.value
        }

        const sortOptions: SortOption[] = [
            {
                title: 'Rank',
                icon: ribbonOutline,
                settings: { sortingCategory: 'Rank', sortingKey: 'market_cap_rank', reverseSorting: false, absoluteValues: true },
            },
            {
                title: 'Change (24h) %',
                icon: sortAscending.value ? arrowUpOutline : arrowDownOutline,
                settings: { sortingCategory: 'Change (24h) %', sortingKey: 'price_change_percentage_24h_in_currency', reverseSorting: false, absoluteValues: true },
            },
            {
                title: 'Market Cap Change (24h)',
                icon: statsChartOutline,
                settings: { sortingCategory: 'Market Cap (24h)', sortingKey: 'market_cap_change_24h', reverseSorting: false, absoluteValues: true },
            },
            {
                title: 'Total Volume',
                icon: rocketOutline,
                settings: { sortingCategory: 'Total Volume', sortingKey: 'total_volume', reverseSorting: false, absoluteValues: false },
            },
            {
                title: 'Circulating Supply',
                icon: repeatOutline,
                settings: { sortingCategory: 'Circulating Supply', sortingKey: 'circulating_supply', reverseSorting: false, absoluteValues: false },
            },
            {
                title: 'Price',
                icon: cashOutline,
                settings: { sortingCategory: 'Price', sortingKey: 'current_price', reverseSorting: false, absoluteValues: false },
            },
        ]

        const generateSortActionSheetButtons = (sortOptions: SortOption[]) => {
            const sortButtons = []

            for (const option of sortOptions) {
                const button = {
                    text: option.title,
                    icon: option.icon,
                    handler: () => {
                        sortBy(option.settings.sortingCategory, option.settings.sortingKey, option.settings.reverseSorting, option.settings.absoluteValues)
                    },
                }
                sortButtons.push(button)
            }

            return sortButtons
        }

        const presentSortActionSheet = async () => {
            const actionSheet = await actionSheetController.create({
                header: 'Sort by',
                cssClass: 'sort',
                buttons: [
                    ...generateSortActionSheetButtons(sortOptions),
                    {
                        text: 'Cancel',
                        icon: close,
                        role: 'cancel',
                        handler: () => {
                            console.log('Cancel clicked')
                        },
                    },
                ],
            })
            await actionSheet.present()
            await actionSheet.onDidDismiss()
        }

        const availableCurrencies: Currency[] = [
            { symbol: 'CAD', type: 'currency' },
            { symbol: 'USD', type: 'currency' },
            { symbol: 'PLN', type: 'currency' },
            { symbol: 'EUR', type: 'currency' },
            { symbol: 'BTC', type: 'crypto' },
            { symbol: 'ETH', type: 'crypto' },
        ]

        const generateActionSheetButtons = (availableCurrencies: Currency[]) => {
            const buttons = []
            for (const currency of availableCurrencies) {
                currency.symbol = currency.symbol.toUpperCase()
                let button = {}

                if (currency.type == 'currency' && Object.keys(currencies.value).includes(currency.symbol)) {
                    button = {
                        text: currency.symbol,
                        handler: () => {
                            if (preferredCurrency.value !== currency.symbol) updateUserAccount(currency.symbol)
                        },
                    }
                } else if (currency.type == 'crypto') {
                    button = {
                        text: currency.symbol,
                        handler: () => {
                            if (preferredCurrency.value !== currency.symbol) {
                                if (!currencies.value[currency.symbol]) {
                                    const foundAsset = assets.value.find((asset: Asset) => asset.symbol === currency.symbol.toLowerCase())

                                    if (foundAsset) {
                                        store.commit(MutationTypes.addNewCurrency, {
                                            currencyName: foundAsset.symbol.toUpperCase(),
                                            currencyRate: foundAsset.current_price * baseCurrencyRate.value,
                                        })
                                    }
                                }
                                updateUserAccount(currency.symbol)
                            }
                        },
                    }
                }
                buttons.push(button)
            }

            return buttons
        }

        const presentCurrencyActionSheet = async () => {
            const actionSheet = await actionSheetController.create({
                header: 'Pick preferred currency',
                cssClass: 'currenct',
                buttons: [
                    ...generateActionSheetButtons(availableCurrencies),
                    {
                        text: 'Cancel',
                        icon: close,
                        role: 'cancel',
                    },
                ],
            })
            await actionSheet.present()
            await actionSheet.onDidDismiss()
        }

        return {
            isLoading,
            assets,
            sortedAssets,
            preferredCurrency,
            marketChangePercentageText,
            marketChangeStatus,
            isMarketUp,
            searchQuery,
            presentSortActionSheet,
            close,
            activeSorting,
            removeSorting,
            arrowDownOutline,
            arrowUpOutline,
            sortAscending,
            presentCurrencyActionSheet,
        }
    },
})
</script>

<style>
ion-content ion-toolbar {
    --background: transparent;
}
</style>