<template>
  <div class="mt-5 mx-3" @click="test()">
    <div v-if="currentUser && currentUser.email">
      <!-- <div style="display: flex;justify-content: center">
        <v-img
          :src="user.photoURL"
          :lazy-src="user.photoURL"
          style="border-radius:25px; max-width:50px"
        >
          <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
            <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
          </v-layout>
        </v-img>
      </div>-->
      <div style="text-align:center;font-size:20px; width:100%;" class="mt-4 primary--text">{{currentUser.email}}</div>

      <div
        style="opacity:0.5; text-align:center"
        class="mt-4 mx-4"
      >Vos informations sont stockées dans notre base de données. Vous pouvez retrouver vos informations depuis n'importe quelle plateforme grâce à votre email.</div>

      <!-- <div style="text-align:center; width:100%; position:fixed; bottom: 10px;left:0px">
        <v-btn
          style="color:#4267b2; transform:scale(0.8)"
          class="mt-4"
          round
          large
          outline
          :loading="loading"
          @click="unlinkFromFacebook()"
        >délier mon compte de Facebook</v-btn>
      </div>-->
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
      >
      Vous pourrez prochainement ajouter votre adresse email pour avoir accès à vos informations depuis n'importe quelle plateforme</div>

      <!-- <v-layout align-center justify-center column class="mt-5">
        <v-flex xs12>
          <v-text-field
            v-if="!emailSent"
            style="min-width:250px"
            v-model="email"
            solo
            :rules="[rules.required, rules.email]"
            label="Email"
          ></v-text-field>
          <div v-else class="mb-4 text-xs-center primary--text">Un email vous a été envoyé, veuillez consulter vos emails</div>
        </v-flex>
        <v-flex xs12>
          <v-btn
            v-if="!emailSent"
            large
            class="mt-2"
            round
            color="primary"
            :loading="loading"
            :disabled="!isEmailValid() || emailSent"
            @click="linkWithEmail()"
          >Envoyer</v-btn>
        </v-flex>
      </v-layout> -->
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  mounted(){
    let self = this
    setInterval(function(){ self.currentTime = Date() }, 1000);
  },
  data: () => ({
    currentTime: "",
    email: "",
    rules: {
      required: value => !!value || "Requis",
      email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || "Email invalide";
      }
    }
  }),
  computed: {
    ...mapState(["user", "loading", "emailSent", "currentUser"])
  },
  methods: {
    isEmailValid() {
      const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return pattern.test(this.email) || false;
    },
    linkWithEmail() {
      this.$store.dispatch("linkWithEmail", this.email);
    }
    // linkToFacebook() {
    //   this.$store.dispatch("linkToFacebook");
    // },
    // unlinkFromFacebook() {
    //   this.$store.dispatch("unlinkFromFacebook");
    // }
  }
};
</script>

<style scoped>
.v-image {
  margin-right: 0px !important;
}
</style>

