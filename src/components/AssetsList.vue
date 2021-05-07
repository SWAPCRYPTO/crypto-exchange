<template>
    <div class="assetsList">
        <ul class="assetsList__items">
            <li class="assetsList__item" v-for="asset in assets" :key="asset.symbol">
                <div class="currency__title">
                    <div class="currency__icon">
                        <img src="../assets/images/currency.png" class="currency__icon" alt="currency icon">
                    </div>
                    <div class="currency__name">
                        <p>{{ asset.title }}</p>
                        <span class="symbol">{{ asset.symbol }}</span>
                    </div>
                </div>
                <div class="currency__details">
                    <p class="currency__value">{{ currentCurrency }} {{ 123 }}</p>
                    <p class="currency__gain" :class="movePercentage > 0 ? 'positive' : 'negative'">{{ movePercentage }}%</p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue"
import { useStore } from "vuex"

export default defineComponent({
    name: "AssetsList",
    props: ['assets'],
    setup() {
        const store = useStore()
        const currentCurrency = computed(() => store.getters.currentCurrency)
        const currencyMovePercentage = 2.123
        const movePercentage = (currencyMovePercentage > 0 ? '+' : '') + currencyMovePercentage.toFixed(2)
        return { currentCurrency, movePercentage }
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

.currency__gain.positive {
    @apply text-green-500;
}

.currency__gain.negative {
    @apply text-red-600;
}
</style>