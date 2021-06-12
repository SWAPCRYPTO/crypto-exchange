import { toastController } from '@ionic/vue'

type Position = 'top' | 'bottom' | 'middle'

export const openToast = async (
    message: string,
    position: Position,
    duration = 2000,
    color = 'primary',
    header?: string
) => {
    const toast = await toastController.create({
        message,
        position,
        duration,
        color,
        header,
    })
    return toast.present()
}
