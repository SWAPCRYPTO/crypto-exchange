<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import firebase from './firebase';
import { computed, watch, defineComponent } from 'vue';
import { useStore } from 'vuex';
import router from './router';
import User from './store/modules/auth/models/User';
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


    LocalNotifications.schedule({
      notifications: [
        {
          title: "Title",
          body: "Body",
          id: 1,
          schedule: { at: new Date(Date.now() + 1000 * 5) },
          // sound: null,
          // attachments: null,
          actionTypeId: "",
          extra: null
        }
      ]
    });
  }
});
</script>