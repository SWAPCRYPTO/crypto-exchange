<template>
  <ion-page>
    <ion-header>
      <ion-toolbar mode="ios">
        <ion-title>Tab 2</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 2</ion-title>
        </ion-toolbar>
      </ion-header>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/vue";
// import axios from 'axios';

export default  {
  name: "Portfolio",
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage },
  // setup() {
  //   const url = 'https://api.lunarcrush.com/v2?data=market-pairs&key=3qv7tzf23ynn2ygzj8qvm&symbol=LTC&limit=30'
  //   axios.get(url).then(result => console.log(result.data))
  // }
}
</script>