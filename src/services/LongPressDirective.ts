import { DirectiveBinding } from 'vue'
import { Haptics, ImpactStyle } from '@capacitor/haptics'

export const beforeMount = (el: HTMLElement, binding: DirectiveBinding) => {
    if (typeof binding.value !== 'function') {
        const warn = `[longpress:] provided expression '${binding.value}' is not a function, but has to be`

        console.warn(warn)
    }

    let pressTimer: any = null

    // Define funtion handlers
    // Create timeout ( run function after 1s )
    const start = (e: Event) => {
        if (e.type === 'click' && (e as any).button !== 0) return

        if (pressTimer === null) {
            pressTimer = setTimeout(() => {
                binding.value(e)
            }, 1000)
        }
    }

    // Cancel Timeout
    const cancel = () => {
        // Check if timer has a value or not
        if (pressTimer !== null) {
            clearTimeout(pressTimer)
            pressTimer = null
        }
    }

    const hapticsVibrate = async () => {
        await Haptics.vibrate()
    }

    // Add Event listeners
    el.addEventListener('mousedown', start)
    el.addEventListener('touchstart', start)

    hapticsVibrate()

    // Cancel timeouts if this events happen
    el.addEventListener('click', cancel)
    el.addEventListener('mouseout', cancel)
    el.addEventListener('touchend', cancel)
    el.addEventListener('touchcancel', cancel)
}
