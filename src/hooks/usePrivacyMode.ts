import { computed, Ref } from 'vue'
import { useStore } from 'vuex'

export default function usePrivacyMode() {
    const store = useStore()
    const PRIVACY_MASK = '••••••••'

    const isPrivacyModeActive: Ref<boolean> = computed(() => store.getters.isPrivacyModeActive)
    const setPrivacyModeStatus = (value: boolean) => store.commit('setPrivacyModeStatus', value)

    const handlePrivacyMode = () => {
        setPrivacyModeStatus(!isPrivacyModeActive.value)
    }

    return { PRIVACY_MASK, isPrivacyModeActive, handlePrivacyMode }
}
