<template>
  <ion-page>
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button :tab="tab.title" :href="tab.path" v-for="tab in tabs" :key="tab.title">
          <ion-icon :icon="tab.icon" />
          <ion-label>{{ tab.name }}</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage } from '@ionic/vue';
import { homeOutline, walletOutline, statsChartOutline, settingsOutline } from 'ionicons/icons';

interface Tab {
  title: string
  name: string
  icon: any
  path: string
}

export default defineComponent({
  name: 'Tabs',
  components: { IonLabel, IonTabs, IonTabBar, IonTabButton, IonIcon, IonPage },
  setup() {
    const tabs: Tab[] = [
      {
        title: 'dashboard',
        name: 'Dashboard',
        icon: homeOutline,
        path: '/tabs/dashboard'
      },
      {
        title: 'portfolio',
        name: 'Portfolio',
        icon: walletOutline,
        path: '/tabs/portfolio'
      },
      {
        title: 'prices',
        name: 'Prices',
        icon: statsChartOutline,
        path: '/tabs/prices'
      },
      {
        title: 'settings',
        name: 'Settings',
        icon: settingsOutline,
        path: '/tabs/settings'
      }
    ]

    return { tabs }
  }
})
</script>

<style scoped>
ion-tab-bar {
  @apply my-2
}
</style>