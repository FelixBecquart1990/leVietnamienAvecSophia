<template>
  <div class="mt-5 mx-3">
    <div v-if="user && user.email">
      <div style="display: flex;justify-content: center">
        <v-img
          :src="user.photoURL"
          :lazy-src="user.photoURL"
          style="border-radius:25px; max-width:50px"
        >
          <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
            <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
          </v-layout>
        </v-img>
      </div>
      <div
        style="text-align:center;font-size:20px; width:100%;"
        class="mt-4 primary--text"
      >{{user.displayName}}</div>

      <div
        style="opacity:0.5; text-align:center"
        class="mt-4 mx-4"
      >Vos informations sont stockées dans notre base de données. Vous pouvez retrouver vos informations depuis n'importe quelle plateforme grâce à votre email.</div>

      <div style="text-align:center; width:100%; position:fixed; bottom: 10px;left:0px">
        <v-btn
          style="color:#4267b2; transform:scale(0.8)"
          class="mt-4"
          round
          large
          outline
          :loading="loading"
          @click="logout()"
        >Déconnexion</v-btn>
      </div>
    </div>

    <div v-else>
      <div style="display: flex;justify-content: center">
        <v-img
          src="https://oddstuffmagazine.com/wp-content/uploads/2013/03/9a1c5cca175d19421d146b2c0f4dffcd.gif"
          lazy-src="https://oddstuffmagazine.com/wp-content/uploads/2013/03/9a1c5cca175d19421d146b2c0f4dffcd.gif"
          style="border-radius:69px; max-width:138px"
        >
          <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
            <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
          </v-layout>
        </v-img>
      </div>

      <div
        style="opacity:0.5;text-align:center"
        class="mt-4"
      >Vous pouvez lier votre compte à Facebook pour avoir accès à vos informations depuis n'importe quelle plateforme</div>

      <div style="text-align:center; width:100%;">
        <v-btn
          style="background-color:#4267b2;"
          class="mt-4 white--text"
          round
          large
          :loading="loading"
          @click="facebookSignup()"
        >Facebook</v-btn>
      </div>

    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data: () => ({}),
  computed: {
    ...mapState(["user", "loading", "currentUser"])
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
    },
    facebookSignup() {
      this.$store.dispatch("facebookSignup");
    }
  }
};
</script>

<style scoped>
.v-image {
  margin-right: 0px !important;
}
</style>

