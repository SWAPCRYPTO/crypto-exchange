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
    padding: 16px;
    margin: 16px 0;
}

.assetsList__items {
    display: flex;
    flex-direction: column;
}

.assetsList__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 12px 0;
}
.assetsList__item:first-of-type {
    margin-top: 0;
}
.assetsList__item:last-of-type {
    margin-bottom: 0;
}

.currency__title {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.currency__icon {
    max-width: 32px;
    width: 32px;
    height: 100%;
    margin-right: 8px;
}

.currency__icon img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.currency__name {
    display: flex;
    flex-direction: column;
}

.currency__name p {
    font-size: 18px;
    line-height: 28px;
}

.currency__name .symbol {
    text-transform: uppercase;
}
</style>