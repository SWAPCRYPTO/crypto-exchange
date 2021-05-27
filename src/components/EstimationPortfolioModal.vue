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
                    <td v-for="prop in asset" :key="prop">{{ typeof prop === 'number' ? prop.toFixed(2) : prop }}</td>
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
import { computed, defineComponent } from 'vue'
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonSkeletonText } from '@ionic/vue'
import { useStore } from 'vuex'

export default defineComponent({
    name: 'EstimationPortfolioModal',
    components: { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonSkeletonText },
    props: ['title', 'assetsSummary', 'percentageOfPortfolio'],
    emits: ['onDismiss'],
    setup(props, { emit }) {
        const dismiss = () => {
            emit('onDismiss', false)
        }        
        const store = useStore()
        const isEstimationLoading = computed(() => store.getters.isEstimationLoading)
        const SKELETON_ITEMS = 4

        const tableHeaders = ['name', 'quantity', 'price', 'value', 'nettoValue', `value ${props.percentageOfPortfolio * 100}%`, `nettoValue ${props.percentageOfPortfolio * 100}%`]
        
        return { dismiss, isEstimationLoading, tableHeaders, SKELETON_ITEMS }
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
  min-width: 14rem; /* Forcing the width */
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
  grid-template-columns: repeat(7, auto);
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