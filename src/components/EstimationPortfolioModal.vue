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
        <table class="grid">
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
    </ion-content>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent } from '@ionic/vue'
import { useStore } from 'vuex'

export default defineComponent({
    name: "EstimationPortfolioModal",
    components: { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent },
    props: ['title'],
    emits: ['onDismiss'],
    setup(props, { emit }) {
        const dismiss = () => {
            emit('onDismiss', false)
        }        
        const store = useStore()
        const assetsSummary = computed(() => store.getters.assetsSummary)

        const tableHeaders = ['name', 'quantity', 'price', 'value', 'nettoValue', 'value x%', 'nettoValue x%']
        
        return { dismiss, assetsSummary, tableHeaders }
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
  min-width: 16rem; /* Forcing the width */
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
  @apply py-2 px-4 capitalize text-left;
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
  position: relative
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