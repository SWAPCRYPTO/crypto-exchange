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
        <ion-list>
            <ion-item v-for="asset in assetsSummary" :key="asset.name">
                <ion-label>
                    <h2>{{ asset.name }}</h2>
                    <p>Sneaky little hobbitses!</p>
                </ion-label>
                <ion-grid>
                    <ion-row>
                        <ion-col>
                            ion-col
                        </ion-col>
                        <ion-col>
                            ion-col
                        </ion-col>
                        <ion-col>
                            ion-col
                        </ion-col>
                        <ion-col>
                            ion-col
                        </ion-col>
                    </ion-row>

                    <ion-row>
                        <ion-col size="6">
                            ion-col [size="6"]
                        </ion-col>
                        <ion-col>
                            ion-col
                        </ion-col>
                        <ion-col>
                            ion-col
                        </ion-col>
                    </ion-row>
                </ion-grid>
            </ion-item>
        </ion-list>
    </ion-content>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonList, IonItem, IonLabel, IonCol, IonGrid, IonRow } from '@ionic/vue'

export default defineComponent({
    name: "EstimationPortfolioModal",
    components: { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonList, IonItem, IonLabel, IonCol, IonGrid, IonRow },
    props: ['title', 'assetsSummary'],
    setup(props, { emit }) {
        const dismiss = () => {
            emit('onDismiss', false)
        }        
        
        return { dismiss }
    }
})
</script>
