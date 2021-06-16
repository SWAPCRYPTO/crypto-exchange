import { Currencies } from '@/store/modules/assets/models/NBPCurrency'
import { computed, ComputedRef, Ref } from 'vue'
import { useStore } from 'vuex'

export default function useCurrency() {
    const store = useStore()
    const preferredCurrency: ComputedRef<string> = computed(() => store.getters.preferredCurrency)
    const currencies: Ref<Currencies> = computed(() => store.getters.currencies)
    const currencyRate = computed(() =>
        preferredCurrency.value in currencies.value ? currencies.value[preferredCurrency.value] : 1
    )
    const baseCurrencyRate: ComputedRef<number> = computed(() => store.getters.baseCurrencyRate)

    return { preferredCurrency, currencies, currencyRate, baseCurrencyRate }
}
