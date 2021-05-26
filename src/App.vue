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
    const preferredCurrency = computed(() => store.getters.preferredCurrency)
    watch(currentUser, (user: User | null, prevUser: User | null) => {
        // if(user && prevUser) {
        //   if(user.account.preferredCurrency != prevUser.account.preferredCurrency) {
        //     store.dispatch('fetchAssets', user.account.preferredCurrency)
        //   }
        // }
        if(user && !prevUser)
            router.push('/tabs/dashboard')
        else if (!user) {
            router.push('/authentication')
        }
    })

    watch(preferredCurrency, (newCurrency, oldCurrency) => {
        // console.log(newCurrency, oldCurrency)
        if(newCurrency && oldCurrency && newCurrency != oldCurrency) {
          // store.dispatch('fetchAssets', newCurrency).then(() => console.log('t'))
        }
    })
  }
});
</script>