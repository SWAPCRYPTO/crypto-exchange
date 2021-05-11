<template>
    <ion-page>
        <ion-content scroll-y="false" fullscreen>
            <section class="authentication max-w-md md:max-w-xl mx-auto flex flex-col justify-between w-full h-full p-8">
                <section class="signUp" v-if="showSignUp">
                    <div class="signUp__container flex flex-col w-full">
                        <header class="flex flex-col items-center justify-start mb-4">
                                <h1 class="h1 text-center">Create your account</h1>
                                <p class="mt-2 text-center">Create an account so you can manage your assets in the most comfortable way.</p>
                        </header>
                        <ion-list lines="full" class="my-4">
                            <ion-item>
                                <ion-input autofocus autocomplete="on" placeholder="Your name" type="text" v-model="authData.name"></ion-input>
                            </ion-item>

                            <ion-item>
                                <ion-input autocomplete="on" placeholder="Email address" type="email" v-model="authData.email"></ion-input>
                            </ion-item>

                            <ion-item>
                                <ion-input clearInput autocomplete="on" placeholder="Password" type="password" v-model="authData.password"></ion-input>
                            </ion-item>

                            <ion-item>
                                    <ion-checkbox v-model="termsAccepted"></ion-checkbox>
                                    <ion-label>Accept our Terms and Conditions</ion-label>
                            </ion-item>
                        </ion-list>
                        <ion-button class="mt-4" expand="block" @click="onSignUp">Sign up</ion-button>
                    </div>
                </section>
                <section class="signIn" v-else>
                    <div class="signIn__container flex flex-col w-full">
                        <header class="flex flex-col items-center justify-start mb-4">
                                <h1 class="h1 text-center">Welcome back</h1>
                                <p class="mt-2 text-center">Log in with your data and start managing your assets.</p>
                        </header>
                        <ion-list lines="full" class="my-4">
                            <ion-item>
                                <ion-input autocomplete="on" placeholder="Email address" type="email" v-model="authData.email"></ion-input>
                            </ion-item>

                            <ion-item>
                                <ion-input clearInput autocomplete="on" placeholder="Password" type="password" v-model="authData.password"></ion-input>
                            </ion-item>
                        </ion-list>
                        <ion-button class="mt-4" expand="block" @click="onSignIn">Sign in</ion-button>
                    </div>
                </section>
                <footer class="mb-4 flex items-center justify-center">
                    <p class="flex items-center justify-center">{{ showSignUp ? 'Already have an account?' : 'Don\'t have an account?' }}</p>
                    <ion-text mode="ios" color="primary" @click="showSignUp = !showSignUp"><p class="ml-1">{{ showSignUp ? 'Log in' : 'Sign up' }}</p></ion-text>
                </footer>
            </section>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { IonPage, IonContent, IonList, IonButton, IonInput, IonItem, IonCheckbox, IonLabel, IonText } from '@ionic/vue';
import { useStore } from 'vuex';

export default defineComponent({
    name: 'Authentication',
    components: { IonPage, IonContent, IonButton, IonList, IonInput, IonItem, IonCheckbox, IonLabel, IonText },
    setup() {
        const store = useStore()

        const showSignUp = ref(true)

        const authData = reactive({
            name: "",
            email: "",
            password: ""
        })
        const termsAccepted = ref(false)

        const onSignUp = () => {
            if (authData.name && authData.email && authData.password && termsAccepted.value) {
                store.dispatch('signUserUp', authData).then(() => {
                    authData.name = ""
                    authData.email = ""
                    authData.password = ""
                })
            }
        }

        const onSignIn = () => {
            if (authData.email && authData.password) {
                store.dispatch('signUserIn', { email: authData.email, password: authData.password }).then(() => {
                    authData.email = ""
                    authData.password = ""
                })
            }
        }

        return { showSignUp, authData, termsAccepted, onSignUp, onSignIn }
    },
})
</script>

<style>
.signUp ion-item, .signIn ion-item {
    --padding-start: 0;
    --padding-end: 0;
    --inner-padding-start: 0;
    --inner-padding-end: 0;
}
</style>
