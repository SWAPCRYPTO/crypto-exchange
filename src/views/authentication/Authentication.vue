<template>
    <ion-page>
        <ion-content :fullscreen="true">
            <ion-list lines="full" class="p-4">
                <ion-list-header lines="full">
                    <ion-label>
                        Authentication
                    </ion-label>
                </ion-list-header>

                <ion-item>
                    <ion-label>Name</ion-label>
                    <ion-input placeholder="Provide name" type="text" v-model="authData.name"></ion-input>
                </ion-item>

                <ion-item>
                    <ion-label>Email</ion-label>
                    <ion-input placeholder="Provide email" type="email" v-model="authData.email"></ion-input>
                </ion-item>

                <ion-item>
                    <ion-label>Password</ion-label>
                    <ion-input placeholder="Provide password" type="password" v-model="authData.password"></ion-input>
                </ion-item>
    
                <ion-item>
                    <ion-button @click="onSignUp">Sign up</ion-button>
                </ion-item>
                
                <ion-item>
                    <ion-button @click="onSignIn">Sign in</ion-button>
                </ion-item>
            </ion-list>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, watch } from 'vue'
import { IonPage, IonContent, IonList, IonListHeader, IonButton, IonLabel, IonInput, IonItem } from '@ionic/vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default defineComponent({
    name: 'Authentication',
    components: { IonPage, IonContent, IonListHeader, IonButton, IonList, IonLabel, IonInput, IonItem },
    setup() {
        const store = useStore()
        const authData = reactive({
            name: "",
            email: "",
            password: ""
        })

        const onSignUp = () => {
            if (authData.name && authData.email && authData.password) {
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

        const router = useRouter()
        const currentUser = computed(() => store.getters.user)
        watch(currentUser, (user, prevUser) => {
            if(user && !prevUser)
                router.push('/tabs/dashboard')
            else if (!user) {
                router.push('/')
            }
        })

        return { authData, onSignUp, onSignIn }
    },
})
</script>
