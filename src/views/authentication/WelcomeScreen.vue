<template>
    <ion-page>
        <ion-content class="px-4" scroll-y="false" fullscreen>
            <ion-slides class="h-full" :options="slideOpts">
                <ion-slide class="flex flex-col items-center justify-center p-16">
                    <div class="slide p-16">
                        <img class="unselectable" src="../../assets/images/crypto.svg"/>
                        <h2 class="h2 mt-8">Welcome to</h2>
                        <h1 class="h1 mt-4 mb-8">CryptoExchanger</h1>
                        <router-link to="/authentication">
                            <ion-button mode="ios" expand="block">Start now</ion-button> 
                        </router-link>
                    </div>
                </ion-slide>
                <ion-slide class="flex flex-col items-center justify-center p-16">
                    <img class="unselectable" src="../../assets/images/bitcoin.svg"/>
                    <h1 class="h2 mt-8">Ready to start?</h1>
                    <router-link to="/authentication" class="mt-8">
                        <ion-button mode="ios" expand="block">Continue</ion-button> 
                    </router-link>
                </ion-slide>
            </ion-slides>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { IonPage, IonContent, IonSlides, IonSlide, IonButton } from '@ionic/vue';
import { defineComponent } from 'vue'

export default defineComponent({
    name: "WelcomeScreen",
    components: { IonPage, IonContent, IonSlides, IonSlide, IonButton },
    setup() {
        const slideOpts = {
            initialSlide: 0,
            speed: 400,
            pager: true
        }

        return { slideOpts }
    }
})
</script>

<style>
.swiper-slide img {
    @apply max-w-xs;
}
</style>