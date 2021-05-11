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
        watch(currentUser, (user, prevUser) => {
            if(user && !prevUser)
                router.push('/tabs/dashboard')
            else if (!user) {
                router.push('/authentication')
            }
        })
  }
});
</script>