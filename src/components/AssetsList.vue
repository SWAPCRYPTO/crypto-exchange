<template>
    <div class="assetsList">
        <ul class="assetsList__items">
            <li class="assetsList__item" v-for="asset in assets" :key="asset.id" @click="router.push('/tabs/prices/test')">
                <div class="currency__title">
                    <div class="currency__icon">
                        <img :src="asset.image" class="currency__icon" alt="currency icon">
                    </div>
                    <div class="currency__name">
                        <p>{{ asset.name }}</p>
                        <span class="symbol">{{ asset.symbol }}</span>
                    </div>
                </div>
                <div class="sparkline">
                </div>
                <div class="currency__details">
                    <p class="currency__value">{{ preferredCurrency }} {{ asset.current_price }}</p>
                    <p class="currency__gain" :class="asset.price_change_percentage_1h_in_currency > 0 ? 'text-success' : 'text-error'">{{ formatChange(asset.price_change_percentage_1h_in_currency) }}%</p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue"
import { useRouter } from "vue-router"
import { useStore } from "vuex"

export default defineComponent({
    name: "AssetsList",
    props: ['assets'],
    setup() {
        const store = useStore()
        const router = useRouter()
        const preferredCurrency = computed(() => store.getters.user.account.preferredCurrency)

        const formatChange = (value: number) => (value > 0 ? '+' : '') + value.toFixed(2)
        return { preferredCurrency, formatChange, router }
    },
})
</script>

<style>
.assetsList {
    @apply p-4 my-4;
}

.assetsList__items {
    @apply flex flex-col;
}

.assetsList__item {
    @apply flex items-center justify-between my-3;
}
.assetsList__item:first-of-type {
    @apply mt-0;
}
.assetsList__item:last-of-type {
    @apply mb-0;
}

.currency__title {
    @apply flex items-center justify-between;
}

.currency__icon {
    max-width: 32px;
    @apply w-8 h-full mr-4;
}

.currency__icon img {
    @apply w-full h-full object-contain;
}

.currency__name {
    @apply flex flex-col;
}

.currency__name p {
    @apply text-lg;
}

.currency__name .symbol {
    @apply uppercase;
}

.currency__details {
    @apply flex flex-col items-end;
}
</style>