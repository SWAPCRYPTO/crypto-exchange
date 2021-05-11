<template>
    <ion-page>
        <ion-content class="px-4" scroll-y="false" fullscreen>
            <ion-slides class="h-full" :options="slideOpts">
                <ion-slide class="flex flex-col items-center justify-center">
                    <div class="slide p-16">
                        <img src="../../assets/images/currency.png"/>
                        <h2>Welcome to</h2>
                        <h2>CryptoExchanger</h2>
                        <p>The <b>ionic conference app</b> is a practical preview of the ionic framework in action, and a demonstration of proper code use.</p>
                    </div>
                </ion-slide>
                <ion-slide class="flex flex-col items-center justify-center">
                    <img src="../../assets/images/currency.png"/>
                    <h2>Ready to Play?</h2>
                    <router-link to="/authentication">
                        <ion-button fill="clear">Continue <ion-icon slot="end" name="arrow-forward"></ion-icon></ion-button>           
                    </router-link>
                </ion-slide>
            </ion-slides>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { IonPage, IonContent, IonSlides, IonSlide } from '@ionic/vue';
import { defineComponent } from 'vue'

export default defineComponent({
    name: "WelcomeScreen",
    components: { IonPage, IonContent, IonSlides, IonSlide },
    setup() {
        const slideOpts = {
            initialSlide: 1,
            speed: 400
        };
        return { slideOpts }
    }
})
</script>
