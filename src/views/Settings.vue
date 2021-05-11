<template>
  <ion-page>
    <ion-content fullscreen>
      <section class="settings container">
        <div class="settings__container">
            <header class="userDetails__container">
                <p class="user__email">{{ user.email }}</p>
                <h1 class="h1 user__title">{{ user.name }}</h1>
            </header>
            <div class="options__container">
                <section class="options" v-for="item in optionsList" :key="item.title">
                    <h2 class="h2">{{ item.title }}</h2>
                    <ul>
                        <li class="category" v-for="(category, index) in item.subCategories" :key="index">
                            <p @click="category.action" :class="{'text-error': category.isDangerous }">{{ category.name }}</p>
                            <ion-icon v-if="!category.action" name="chevron-forward-outline"></ion-icon>
                        </li>
                    </ul>
                </section>
                <!-- <ion-list v-for="item in optionsList" :key="item.title">
                  <h2 class="h2">{{ item.title }}</h2>
                  <ion-item>
                    <ion-list>
                      <ion-item class="category" v-for="(category, index) in item.subCategories" :key="index">
                        <ion-label @click="category.action" :class="{'text-error': category.isDangerous }">
                          {{ category.name }}
                        </ion-label>
                        <ion-icon v-if="!category.action" name="chevron-forward-outline"></ion-icon>
                      </ion-item>
                    </ion-list>
                  </ion-item>
                </ion-list> -->
            </div>
          </div>
      </section>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { IonPage, IonContent, IonIcon, IonList, IonItem, IonLabel } from '@ionic/vue';
import { useStore } from 'vuex';

interface Option {
  title: string
  subCategories: Array<{
    name: string
    isDangerous: boolean 
    action?: () => void
  }>
}

export default defineComponent({
    name: "Settings",
    // eslint-disable-next-line vue/no-unused-components
    components: { IonPage, IonContent, IonIcon, IonList, IonItem, IonLabel },
    setup() {
        const store = useStore()
        const user = computed(() => store.getters.user)
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
                    {
                        name: "Sign out",
                        isDangerous: true,
                        action: () => store.dispatch('signUserOut'),
                    }
                ]
            }
        ]

        return { user, optionsList }
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
  @apply flex justify-between items-center my-12;
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