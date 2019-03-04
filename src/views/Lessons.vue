<template>
  <div class="mx-3 mt-4" v-if="selectedLesson.examples">
    <v-card class="elevation-5">
      <v-card-title primary-title>
        <div v-if="user.displayName == 'Sophia Cherry'">
          <h3 class="display-1 mb-1 primary--text">
            <textarea
              placeholder="Titre"
              rows="2"
              v-model="selectedLesson.title"
              type="text"
              class="pink-text"
              style="width:100%;outline: 0;"
            ></textarea>
          </h3>
          <div class="headline">
            <textarea
              placeholder="Traduction"
              rows="2"
              v-model="selectedLesson.translation"
              type="text"
              style="width:100%;outline: 0;"
            ></textarea>
          </div>
          <div class="headline mt-3">
            <textarea
              placeholder="Commentaire"
              rows="2"
              v-model="selectedLesson.comment"
              type="text"
              style="width:100%;outline: 0;"
            ></textarea>
          </div>
        </div>

        <div v-else>
          <h3 class="display-1 mb-1 primary--text">{{ selectedLesson.title }}</h3>
          <div class="headline">{{ selectedLesson.translation }}</div>
          <div class="headline mt-3">{{ selectedLesson.comment }}</div>
        </div>
      </v-card-title>
    </v-card>
    <div class="subheading mt-3" style="opacity:0.5" v-if="selectedLesson.examples.length>0">
      Exemple
      <span v-if="selectedLesson.examples.length>1">s</span> :
    </div>

    <transition-group name="list" tag="p" v-if="user.displayName == 'Sophia Cherry'">
      <div v-for="(example, index) in selectedLesson.examples" :key="1+index">
        <div style="width:100%; text-align:right;">
          <v-btn
            @click="deleteExample(index)"
            icon
            dark
            class="primary"
            style="margin-bottom:-20px"
          >
            <v-icon>close</v-icon>
          </v-btn>
        </div>
        <v-layout row wrap class="mb-2">
          <v-flex xs6 style="position:relative" class="mt-4">
            <v-img
              @click.prevent="playSound(example.sound)"
              v-if="example.gif.match(/\.(gif)/g)"
              :src="example.gif"
              :lazy-src="example.gif"
              style="border-radius:17px"
              class="elevation-5"
            >
              <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
              </v-layout>
            </v-img>
            <v-btn
              v-if="example.sound != ''"
              @click.prevent="playSound(example.sound)"
              icon
              flat
              style="position:absolute;bottom:0px; right:0px"
              color="white"
            >
              <v-icon style="text-shadow:0px 3px 3px black">volume_up</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs12>
            <textarea
              placeholder="URL du GIF"
              rows="1"
              v-model="example.gif"
              type="text"
              style="width:100%;outline: 0;"
            ></textarea>
            <div
              v-if="!example.gif.match(/\.(gif)/g) && example.gif.length > 0"
              class="error--text"
            >Ceci n'est pas une url de GIF</div>
          </v-flex>
          <v-flex xs12>
            <v-card flat color="white">
              <div class="headline mt-3">
                <textarea
                  placeholder="Text en français"
                  rows="2"
                  v-model="example.frenchText"
                  type="text"
                  style="width:100%;outline: 0;"
                ></textarea>
              </div>
              <div class="headline">
                <textarea
                  placeholder="Text en vietnamien"
                  rows="2"
                  v-model="example.vietnameseText"
                  type="text"
                  class="primary white-text white--text px-2 py-1"
                  style="width:100%;outline: 0;border-radius:4px"
                ></textarea>
              </div>
            </v-card>
          </v-flex>
        </v-layout>
        <v-divider class="my-3"></v-divider>
      </div>
    </transition-group>

    <div v-else v-for="example in selectedLesson.examples" :key="example.title">
      <v-layout row wrap class="my-2">
        <v-flex xs6 style="position:relative">
          <v-img
            @click.prevent="playSound(example.sound)"
            :src="example.gif"
            :lazy-src="example.gif"
            style="border-radius:17px"
            class="elevation-5"
          >
            <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
              <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
            </v-layout>
          </v-img>
          <v-btn
            @click.prevent="playSound(example.sound)"
            icon
            flat
            style="position:absolute;bottom:0px; right:0px"
            color="white"
            v-if="example.sound != ''"
          >
            <v-icon style="text-shadow:0px 3px 3px black">volume_up</v-icon>
          </v-btn>
        </v-flex>
        <v-flex xs12>
          <v-card flat color="white">
            <div class="headline mt-3">{{ example.frenchText }}</div>
            <div class="headline">
              <kbd class="primary">{{ example.vietnameseText }}</kbd>
            </div>
          </v-card>
        </v-flex>
      </v-layout>
      <v-divider class="my-3"></v-divider>
    </div>
    <div v-if="user.displayName == 'Sophia Cherry'">
      <v-btn
        color="primary"
        :disabled="!lessonIsComplete()"
        :loading="loading"
        fab
        fixed
        bottom
        right
        @click="save()"
      >
        <v-icon>save</v-icon>
      </v-btn>
      <v-btn
        round
        class="ml-0 mb-4 elevation-0 text-lowercase mt-3"
        color="primary"
        @click="addExample()"
      >
        <v-icon style="margin-left:-10px;margin-right:5px">add</v-icon>Ajouter un exemple
      </v-btn>
      <div class="text-xs-center">
        <v-btn
          round
          @click="deleteLesson()"
          outline
          :loading="loading"
          color="error"
          class="elevation-0 mt-4 mb-5"
        >Supprimer la leçon</v-btn>
      </div>
    </div>
    <v-btn v-else color="primary" dark fab fixed bottom right @click="check()">
      <v-icon>check</v-icon>
    </v-btn>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data: () => ({}),
  computed: {
    ...mapState(["selectedLesson", "user", "loading"])
  },
  methods: {
    playSound(sound) {
      if (sound) {
        var audio = new Audio(sound);
        audio.play();
      }
    },
    check() {
      this.$store.commit("setSnackbar", {
        color: "success",
        timeout: 3000,
        text: "Bravo, leçon terminée 💪"
      });
    },
    deleteLesson() {
      this.$store.dispatch("deleteLesson", this.selectedLesson);
    },
    addExample() {
      this.selectedLesson.examples.push({
        gif: "",
        frenchText: "",
        vietnameseText: "",
        sound: ""
      });
    },
    deleteExample(index) {
      let self = this;
      setTimeout(function() {
        self.selectedLesson.examples.splice(index, 1);
      }, 50);
    },
    lessonIsComplete() {
      if (
        this.selectedLesson.title == "" ||
        this.selectedLesson.translation == "" ||
        this.selectedLesson.comment == ""
      )
        return false;

      let examples = this.selectedLesson.examples;
      if (examples.length == 0) return true;
      for (let example in examples) {
        if (
          !examples[example].gif.match(/\.(gif)/g) ||
          examples[example].frenchText == "" ||
          examples[example].vietnameseText == ""
        )
          return false;
      }
      return true;
    },
    save() {
      this.$store.dispatch("updateLesson", this.selectedLesson);
    }
  }
};
</script>
