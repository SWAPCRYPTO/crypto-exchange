<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet, isPlatform } from '@ionic/vue';
import firebase from './firebase';
import { computed, watch, defineComponent } from 'vue';
import { useStore } from 'vuex';
import router from './router';
import User from './store/modules/auth/models/User';
import { StatusBar, Style } from '@capacitor/status-bar'
import { LocalNotifications } from '@capacitor/local-notifications'

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet
  },
  setup() {
    const store = useStore()
    firebase.auth().onAuthStateChanged(user => {
      if (user) store.dispatch('autoSignUserIn', user);
    });

    const currentUser = computed(() => store.getters.user)
    watch(currentUser, (user: User | null, prevUser: User | null) => {
        if(user && !prevUser)
            router.push('/tabs/dashboard')
        else if (!user) {
            router.push('/authentication')
        }
    })

    if (isPlatform('mobile')) {
      const setStatusBarStyleDark = async () => {
        await StatusBar.setStyle({ style: Style.Dark })
      }

      const changeStyle = async () => {
        await StatusBar.setBackgroundColor({ color: '#d0b1fd' })
      }
      
      setStatusBarStyleDark()
      changeStyle()

      LocalNotifications.schedule({
        notifications: [
          {
            title: "Capacitor rules 💙",
            body: "Local notification",
            id: 1,
            schedule: { at: new Date(Date.now() + 1000 * 5) },
            actionTypeId: "",
            extra: null
          }
        ]
      });
    }
  }
});
</script>