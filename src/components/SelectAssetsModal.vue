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
      <section class="modal__content container md:max-w-screen-md">
          <AssetsList :assets="convertibleAssets" :walletMode="false" :allowHistory="false" :routableAssets="false" @selectedAsset="chooseConversionAsset" :selectedAssetSymbol="conversionAssetSymbol" />
      </section>
    </ion-content>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import AssetsList from '@/components/AssetsList.vue'
import { useStore } from 'vuex'
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent } from '@ionic/vue'
import Asset from '@/store/modules/assets/models/Asset'

export default defineComponent({
    name: 'SelectAssetsModal',
    components: { AssetsList, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent },
    props: {
        currentAssetSymbol: {
            type: String,
            required: true
        },
        conversionAssetSymbol: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        }
    },
    emits: ['onDismiss', 'selectedAsset'],
    setup (props, { emit }) {
        const store = useStore()
        const convertibleAssets = computed(() => store.getters.assets.filter((asset: Asset) => asset.symbol !== props.currentAssetSymbol))

        const dismiss = () => {
            emit('onDismiss', false)
        }

        const chooseConversionAsset = (selectedAsset: string) => {
          emit('selectedAsset', selectedAsset)
          dismiss()
        }

        return { convertibleAssets, dismiss, chooseConversionAsset }
    }
})
</script>

<style scoped>

</style>