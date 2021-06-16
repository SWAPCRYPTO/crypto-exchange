<template>
    <header class="balance__container">
        <ion-header collapse="condense">
            <ion-toolbar mode="ios">
                <p class="font-medium mb-2">Portfolio balance</p>
                <h1 v-if="!isLoading" v-longpress="handleLongPress" class="h1 balance cursor-pointer" @click="router.push('/tabs/portfolio')">{{ isPrivacyModeActive ? PRIVACY_MASK : `${preferredCurrency} ${formatValue(convertCurrency(balance, baseCurrencyRate, currencyRate), 2)}` }}</h1>
                <ion-skeleton-text v-else animated style="height: 100%; width: 80%; line-height: 2.5rem;" />
            </ion-toolbar>
        </ion-header>
    </header>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { convertCurrency } from "@/services/ConvertCurrency"
import { formatValue } from "@/services/FormatValue"
import { IonHeader, IonToolbar, IonSkeletonText } from '@ionic/vue'

import useCurrency from '@/hooks/useCurrency'
import useBalance from '@/hooks/useBalance'
import usePrivacyMode from '@/hooks/usePrivacyMode'
import { Haptics } from '@capacitor/haptics'

export default defineComponent({
    components: { IonHeader, IonToolbar, IonSkeletonText },
    setup() {
        const store = useStore()
        const router = useRouter()
        const isLoading: ComputedRef<boolean> = computed(() => store.getters.isLoading)
        const { preferredCurrency, currencyRate, baseCurrencyRate } = useCurrency()

        const balance = useBalance()
        const { PRIVACY_MASK, isPrivacyModeActive, handlePrivacyMode } = usePrivacyMode()

        const hapticsVibrate = async () => {
            await Haptics.vibrate()
        }

        const handleLongPress = () => {
            handlePrivacyMode()
            hapticsVibrate()
        }

        return { isLoading, preferredCurrency, router, formatValue, convertCurrency, currencyRate, baseCurrencyRate, balance, PRIVACY_MASK, isPrivacyModeActive, handleLongPress }
    },
})
</script>
