<template>
  <ion-page>
    <ion-header translucent>
      <ion-toolbar mode="ios">
        <ion-title v-if="!isLoading">Market is {{marketChangeStatus}} <span :class="isMarketUp ? 'text-success' : 'text-error'">{{marketChangePercentageText}}</span></ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen>
      <section class="prices container">
        <ion-header class="bg-transparent" collapse="condense">
          <ion-toolbar>
            <div class="header__container flex flex-col lg:flex-row items-start justify-between">
              <div class="header__details flex flex-col" v-if="!isLoading">
                <p class="font-medium mb-2">In the past 24 hours</p>
                <h1 class="h1 balance">Market is {{marketChangeStatus}} <span class="text-2xl md:text-3xl" :class="isMarketUp ? 'text-success' : 'text-error'">{{marketChangePercentageText}}</span></h1>
              </div>
              <div class="header__details flex flex-col w-full" v-else>
                <p class="font-medium mb-2">In the past 24 hours</p>
                <ion-skeleton-text style="height: 100%; width: 100%; line-height: 2.5rem; min-height: 2.5rem;" animated />
              </div>
              <div class="search__wrapper mt-8 lg:mt-0 w-full md:max-w-xs">
                  <ion-searchbar v-if="!isLoading" v-model="searchQuery" show-cancel-button="never" debounce="500" placeholder="Find your asset" animated></ion-searchbar>
                  <ion-skeleton-text v-else style="height: 100%; width: 100%; line-height: 2.5rem; min-height: 2.5rem;" animated />
              </div>
              <div class="chips__container">
                <ion-chip>
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
        <AssetsList :assets="sortedAssets" :searchQuery="searchQuery" />
      </section>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import Asset from '@/store/modules/assets/models/Asset';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonSkeletonText, IonChip, IonLabel, IonIcon, actionSheetController } from '@ionic/vue';
import { computed, defineComponent, ref, Ref, watch } from "vue"
import { useStore } from "vuex"
import AssetsList from "../components/AssetsList.vue"
import { arrowDownOutline, arrowUpOutline, statsChartOutline, rocketOutline, ribbonOutline, cashOutline, repeatOutline, close } from 'ionicons/icons'

const sortAssets = (items: any[], key: string, absoluteValues: boolean) => 
  items.sort((a, b) => absoluteValues ? Math.abs(a[key]) - Math.abs(b[key]) : a[key] - b[key])

export default defineComponent({
    name: "Prices",
    components: { AssetsList, IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonSearchbar, IonSkeletonText, IonChip, IonLabel, IonIcon },
    setup() {
        const store = useStore()
        const isLoading = computed(() => store.getters.isLoading)
        const assets: Ref<Asset[]> = computed(() => store.getters.assets)
        const sortedAssets: Ref<Asset[]> = ref(assets.value)
        const preferredCurrency = computed(() => store.getters.preferredCurrency)

        const marketChangePercentage = ref(assets.value.reduce((acc, elem) => acc + elem.market_cap_change_percentage_24h, 0) / assets.value.length)
        const isMarketUp = ref(marketChangePercentage.value > 0)
        const marketChangeStatus = ref(isMarketUp.value ? "up" : "down")
        const marketChangePercentageText = ref(`${isMarketUp.value ? '+' : ''}${marketChangePercentage.value.toFixed(2)}%`)
        const searchQuery = ref("")

        const activeSorting = ref("")
        const sortAscending = ref(true)

        const removeSorting = () => {
          sortedAssets.value = assets.value
          activeSorting.value = ""
        }

        watch(sortAscending, (newSorting, oldSorting) => {
          if(newSorting != oldSorting && activeSorting.value) {
            sortedAssets.value = sortedAssets.value.reverse()
          }
        })

        const sortBy = (sortingCategory: string, sortingKey: string, reverseSorting: boolean, absoluteValues: boolean) => {
            console.log(sortingCategory)
            activeSorting.value = sortingCategory
            sortedAssets.value = sortAscending.value && !reverseSorting ? sortAssets(assets.value.slice(), sortingKey, absoluteValues) : sortAssets(assets.value.slice(), sortingKey, absoluteValues).reverse()
            sortAscending.value = !sortAscending.value
        }

        const presentSortActionSheet = async () => {
        const actionSheet = await actionSheetController
          .create({
            header: 'Sort by',
            cssClass: 'sort',
            buttons: [
              {
                text: `Rank`,
                icon: ribbonOutline,
                handler: () => {
                  sortBy('Rank', 'market_cap_rank', false, true)
                },
              },
              {
                text: `Change (24h) %`,
                icon: sortAscending.value ? arrowUpOutline : arrowDownOutline,
                handler: () => {
                  sortBy('Change (24h) %', 'price_change_percentage_24h_in_currency', false, true)
                },
              },
              {
                text: `Market Cap Change (24h)`,
                icon: statsChartOutline,
                handler: () => {
                  sortBy('Market Cap (24h)', 'market_cap_change_24h', false, true)
                },
              },
              {
                text: `Total Volume`,
                icon: rocketOutline,
                handler: () => {
                  sortBy('Total Volume', 'total_volume', false, false)
                },
              },
              {
                text: `Circulating Supply`,
                icon: repeatOutline,
                handler: () => {
                  sortBy('Circulating Supply', 'circulating_supply', false, false)
                },
              },
              {
                text: `Price`,
                icon: cashOutline,
                handler: () => {
                  sortBy('Price', 'current_price', false, false)
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
          await actionSheet.present();

          const { role } = await actionSheet.onDidDismiss();
      }

        return { isLoading, assets, sortedAssets, preferredCurrency, marketChangePercentageText, marketChangeStatus, isMarketUp, searchQuery, presentSortActionSheet, close, activeSorting, removeSorting, arrowDownOutline, arrowUpOutline, sortAscending }
    }
})
</script>

<style>
  ion-content ion-toolbar {
    --background: transparent;
  }
</style>