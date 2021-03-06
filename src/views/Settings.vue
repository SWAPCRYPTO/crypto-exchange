<template>
  <ion-page>
    <ion-header translucent>
      <ion-toolbar mode="ios">
        <ion-title v-if="!isLoading">{{ user.name }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen>
      <section class="settings container md:max-w-screen-md">
        <div class="settings__container">
            <header class="userDetails__container">
                <ion-header collapse="condense">
                  <ion-toolbar>
                    <p class="user__email">{{ user.email }}</p>
                    <h1 class="h1 user__title">{{ user.name }}</h1>
                  </ion-toolbar>
                </ion-header>
            </header>
            <div class="options__container">                
                <section class="options" v-for="item in optionsList" :key="item.title">
                    <h2 class="h2">{{ item.title }}</h2>
                    <ul>
                        <li class="category" v-for="(category, index) in item.subCategories" :key="index">
                            <p @click="category.action" :class="{'text-error': category.isDangerous }">{{ category.name }}</p>
                            <ion-icon v-if="!category.action" name="chevron-forward-outline"></ion-icon>
                            <ion-toggle v-if="!category.action && category.hasOwnProperty('toggleValue')" v-model="category.toggleValue" color="primary"></ion-toggle>
                        </li>
                    </ul>
                </section>
            </div>
          </div>
      </section>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, Ref } from 'vue';
import { IonPage, IonContent, IonIcon, IonHeader, IonToolbar, IonToggle, IonTitle } from '@ionic/vue';
import { useStore, ActionTypes } from '@/store';
import User from '@/store/modules/auth/models/User';

interface Option {
  title: string
  subCategories: Array<{
    name: string
    isDangerous: boolean
    toggleValue?: boolean
    action?: () => void
  }>
}

export default defineComponent({
    name: "Settings",
    components: { IonPage, IonContent, IonIcon, IonHeader, IonToolbar, IonToggle, IonTitle },
    setup() {
        const store = useStore()
        const isLoading: ComputedRef<boolean> = computed(() => store.getters.isLoading)
        const user = computed(() => store.getters.user) as ComputedRef<User>
        const optionsList: Option[] = [
            {
                title: "Account",
                subCategories: [
                    {
                        name: "Limits and features",
                        isDangerous: false
                    },
                    {
                        name: "Native currency",
                        isDangerous: false
                    },
                    {
                        name: "Privacy",
                        isDangerous: false
                    },
                    {
                        name: "Notification settings",
                        isDangerous: false
                    },
                ]
            },
            {
                title: "Security",
                subCategories: [
                    {
                        name: "Require PIN / Biometrics",
                        isDangerous: false,
                        toggleValue: false
                    },
                    {
                        name: "Privacy mode",
                        isDangerous: false,
                        toggleValue: true
                    },
                    {
                        name: "Sign out",
                        isDangerous: true,
                        action: () => store.dispatch(ActionTypes.signUserOut),
                    }
                ]
            }
        ]

        return { isLoading, user, optionsList }
    }
})
</script>

<style>

.user__email {
  @apply font-medium mb-2;
}

.user__title {
  @apply capitalize;
}

.options__container {
  @apply my-8 flex flex-col;
}

.options {
  @apply flex flex-col;
}

.options  ul {
  @apply my-12;
}

.category {
  @apply flex justify-between items-center my-12 text-lg;
}

.category:first-of-type {
  @apply mt-0;
}

.category:last-of-type {
  @apply mb-0;
}

.category .icon {
  @apply w-5 h-5 text-white;
}
</style>