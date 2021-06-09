<template>
    <ion-page>
        <ion-content scroll-y="false" fullscreen>
            <section class="authentication max-w-md md:max-w-xl mx-auto flex flex-col justify-between w-full h-full p-8">
                <section class="signUp" v-if="showSignUp">
                    <div class="signUp__container flex flex-col w-full">
                        <header class="flex flex-col items-center justify-start mb-4">
                                <h1 class="h1 text-center">Create your account</h1>
                                <p class="mt-2 text-center">Join the platform and start managing your assets in the most comfortable way.</p>
                        </header>
                        <ion-list lines="full" class="my-4">
                            <ion-item>
                                <ion-label :color="v$.name.$error ? 'danger' : ''" position="stacked">{{ v$.name.$error ? 'Provide your name' : 'Name' }}</ion-label>
                                <ion-input mode="ios" :disabled="isLoading" :color="v$.name.$error ? 'danger' : ''" autofocus autocomplete="on" placeholder="Your name" type="text" v-model="authData.name"></ion-input>
                            </ion-item>

                            <ion-item>
                                <ion-label color="danger" v-if="v$.email.required.$invalid" position="stacked">Provide your email</ion-label>
                                <ion-label color="danger" v-else-if="v$.email.email.$invalid" position="stacked">Provide a valid email</ion-label>
                                <ion-label position="stacked" v-else-if="!v$.email.dirty">Email</ion-label>
                                <ion-input mode="ios" :disabled="isLoading" :color="v$.email.$error ? 'danger' : ''" inputmode="email" autocomplete="on" placeholder="Email address" type="email" v-model="authData.email"></ion-input>
                            </ion-item>

                            <ion-item>
                                <ion-label color="danger" v-if="v$.password.required.$invalid" position="stacked">Provide a password</ion-label>
                                <ion-label color="danger" v-else-if="v$.password.minLength.$invalid" position="stacked">Password must be at least 8 characters long</ion-label>
                                <ion-label position="stacked" v-else-if="!v$.password.dirty">Password</ion-label>
                                <ion-input mode="ios" :disabled="isLoading" :color="v$.password.$error ? 'danger' : ''" clearInput autocomplete="new-password" placeholder="Password" type="password" v-model="authData.password"></ion-input>
                            </ion-item>

                            <ion-item>
                                    <ion-checkbox mode="ios" :disabled="isLoading" v-model="termsAccepted"></ion-checkbox>
                                    <ion-label>Accept our Terms and Conditions</ion-label>
                            </ion-item>
                        </ion-list>
                        <ion-button class="mt-4" mode="ios" :disabled="isLoading || v$.$invalid || !termsAccepted" expand="block" @click="onSignUp">Sign up</ion-button>
                    </div>
                </section>
                <section class="signIn" v-else>
                    <div class="signIn__container flex flex-col w-full">
                        <header class="flex flex-col items-center justify-start mb-4">
                                <h1 class="h1 text-center">Welcome back</h1>
                                <p class="mt-2 text-center">Log in and start managing your assets.</p>
                        </header>
                        <ion-list lines="full" class="my-4">
                            <ion-item>
                                <ion-label color="danger" v-if="v$.email.required.$invalid" position="stacked">Provide your email</ion-label>
                                <ion-label color="danger" v-else-if="v$.email.email.$invalid" position="stacked">Provide a valid email</ion-label>
                                <ion-label position="stacked" v-else-if="!v$.email.dirty">Email</ion-label>
                                <ion-input mode="ios" :disabled="isLoading" :color="v$.password.$error ? 'danger' : ''" inputmode="email" autocomplete="on" placeholder="Email address" type="email" v-model="authData.email"></ion-input>
                            </ion-item>

                            <ion-item>
                                <ion-label color="danger" v-if="v$.password.required.$invalid" position="stacked">Provide a password</ion-label>
                                <ion-label color="danger" v-else-if="v$.password.minLength.$invalid" position="stacked">Password must be at least 8 characters long</ion-label>
                                <ion-label position="stacked" v-else-if="!v$.password.dirty">Password</ion-label>
                                <ion-input mode="ios" :disabled="isLoading" :color="v$.password.$error ? 'danger' : ''" clearInput autocomplete="current-password" placeholder="Password" type="password" v-model="authData.password"></ion-input>
                            </ion-item>
                        </ion-list>
                        <ion-button class="mt-4" mode="ios" :disabled="isLoading || v$.email.$invalid || v$.password.$invalid" expand="block" @click="onSignIn">Sign in</ion-button>
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
import { computed, defineComponent, reactive, ref } from 'vue'
import { IonPage, IonContent, IonList, IonButton, IonInput, IonItem, IonCheckbox, IonLabel, IonText } from '@ionic/vue';
import { useStore } from 'vuex';
import { useVuelidate } from '@vuelidate/core'
import { minLength, email, required } from '@vuelidate/validators'

export default defineComponent({
    name: 'Authentication',
    components: { IonPage, IonContent, IonButton, IonList, IonInput, IonItem, IonCheckbox, IonLabel, IonText },
    setup() {
        const store = useStore()
        const isLoading = computed(() => store.getters.isLoading)
        const showSignUp = ref(true)

        const authData = reactive({
            name: "",
            email: "",
            password: ""
        })

        const termsAccepted = ref(false)

        const requiredPasswordLength = 8
        const rules = computed(() => ({
            name: {
                required,
                $autoDirty: true
            },
            email: {
                required,
                email,
                $autoDirty: true
            },
            password: {
                required,
                minLength: minLength(requiredPasswordLength),
                $autoDirty: true
            }
        }))

        const v$ = useVuelidate(rules as any, authData)

        const onSignUp = () => {
            v$.value.$touch()
            if(v$.value.$error) return

            store.dispatch('signUserUp', authData).then(() => {
                authData.name = ""
                authData.email = ""
                authData.password = ""
                // v$.value.$reset()
            })
        }

        const onSignIn = () => {
            if (authData.email && authData.password) {
                store.dispatch('signUserIn', { email: authData.email, password: authData.password }).then(() => {
                    authData.email = ""
                    authData.password = ""
                    // v$.value.$reset()
                })
            }
        }

        return { isLoading, showSignUp, authData, termsAccepted, onSignUp, onSignIn, v$ }
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

input.native-input:-webkit-autofill {
    background-clip: text !important;
    -webkit-background-clip: text !important;
}
</style>
