<template>
  <v-app class="white">
    <v-toolbar
      :class="{'home-page': $router.currentRoute.path == '/'}"
      fixed
      @click="drawer = true"
    >
      <v-toolbar-side-icon style="position:fixed;top:5px" color="white--text"></v-toolbar-side-icon>
      <v-toolbar-title
        :class="{'title-center': $router.currentRoute.path == '/'}"
        style="margin-left:42px"
      >
        <div></div>
        <v-img
          v-if="$router.currentRoute.path == '/'"
          src="https://scontent.fsgn3-1.fna.fbcdn.net/v/t1.0-1/p240x240/14563526_1803366913219392_7827760973898100766_n.jpg?_nc_cat=107&_nc_oc=AQkLL31RNUiDc1St3VtQNw4Ng3Lu726yLB7LeJozDUQ-wFLGwt4e6gDzlYPZzlJrxTM&_nc_ht=scontent.fsgn3-1.fna&oh=a6b8d1f83b76bc821a3e8715ebf8bbdc&oe=5CDBCEBB"
          lazy-src="https://scontent.fsgn3-1.fna.fbcdn.net/v/t1.0-1/p240x240/14563526_1803366913219392_7827760973898100766_n.jpg?_nc_cat=107&_nc_oc=AQkLL31RNUiDc1St3VtQNw4Ng3Lu726yLB7LeJozDUQ-wFLGwt4e6gDzlYPZzlJrxTM&_nc_ht=scontent.fsgn3-1.fna&oh=a6b8d1f83b76bc821a3e8715ebf8bbdc&oe=5CDBCEBB"
          style="border-radius:50%; width: 150px; height:150px; border:solid 6px white; margin-right:auto;margin-left:auto"
          class="mb-4"
        >
          <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
            <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
          </v-layout>
        </v-img>
        <span v-if="$router.currentRoute.path != '/create-lesson'">Le vietnamien avec Sophia</span>
        <span v-else class="px-1">Création d'un cours {{ lessonCategory.title | lowerCase }}</span>
      </v-toolbar-title>
      <!-- <v-toolbar-items class="hidden-sm-and-down">
        <v-btn icon>
          <v-icon>more_vert</v-icon>
        </v-btn>
      </v-toolbar-items>-->
    </v-toolbar>

    <v-navigation-drawer v-model="drawer" absolute temporary style="position:fixed; top:0; left:0;">
      <v-list class="pt-0">
        <v-list-tile
          @click="$router.push('/profile'), drawer = false"
          avatar
          style="background-image: linear-gradient(to bottom right, #f2709c, #ff9472)"
        >
          <!-- <v-list-tile-avatar v-if="user && user.photoURL">
            <img :src="user.photoURL">
          </v-list-tile-avatar> -->
          <v-list-tile-avatar>
            <img :src="anonymousProfilePicture">
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title
              v-if="currentUser && currentUser.email"
              class="white--text"
            >{{ currentUser.email || "Utilisateur anonyme"}}</v-list-tile-title>
            <v-list-tile-title v-else class="white--text">Utilisateur anonyme</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-group prepend-icon="school" value="true">
          <v-list-tile slot="activator">
            <v-list-tile-title>Leçons (42%)</v-list-tile-title>
          </v-list-tile>
          <v-list-group sub-group no-action v-for="category in categories" :key="category.name">
            <v-list-tile slot="activator">
              <v-list-tile-title>{{ category.title }}</v-list-tile-title>
              <v-list-tile-action v-if="user && user.displayName == 'Sophia Cherry'">
                <v-btn icon to="/create-lesson" @click="drawer = false, lessonCategory = category">
                  <v-icon color="primary">add</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
            <v-list-tile
              v-for="(lesson, i) in category.lessons"
              :key="i"
              @click="$router.push('/lessons'), selectedLesson = lesson, drawer = false"
            >
              <v-list-tile-title v-text="lesson.title"></v-list-tile-title>
              <v-list-tile-action>
                <v-icon>check</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list-group>
        </v-list-group>

        <v-list-tile @click="goToBlog()">
          <v-list-tile-action>
            <v-icon>dashboard</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>Blog</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-img
        src="https://pro2-bar-s3-cdn-cf1.myportfolio.com/aea485e98f54bacdbe4868df307e5980/93663200-8230-45a7-9bc9-976ade253d05_rw_1920.gif?h=a5f35efc7aeaa6fa8706bb910ca81d9f"
        lazy-src="https://pro2-bar-s3-cdn-cf1.myportfolio.com/aea485e98f54bacdbe4868df307e5980/93663200-8230-45a7-9bc9-976ade253d05_rw_1920.gif?h=a5f35efc7aeaa6fa8706bb910ca81d9f"
        class="grey lighten-2"
      >
        <v-layout slot="placeholder" fill-height align-center justify-center ma-0>
          <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
        </v-layout>
      </v-img>
    </v-navigation-drawer>

    <v-content class="mt-5">
      <router-view/>
    </v-content>
    <Snackbar/>
  </v-app>
</template>

<script>
import Snackbar from "./components/Snackbar";
import anonymousProfilePicture from "./assets/anonymous-profile-picture.png";
import { mapState } from "vuex";

export default {
  computed: {
    categories() {
      return [
        {
          name: "beginner",
          title: "Débutant",
          lessons: this.lessonsBeginner
        },
        {
          name: "intermediate",
          title: "Intermédiaire",
          lessons: this.lessonsIntermediate
        },
        {
          name: "expert",
          title: "Expert",
          lessons: this.lessonsExpert
        }
      ];
    },
    ...mapState(["user", "lessons", "currentUser"]),
    lessonsBeginner() {
      return this.lessons.filter(function(lesson) {
        return lesson.category == "beginner";
      });
    },
    lessonsIntermediate() {
      return this.lessons.filter(function(lesson) {
        return lesson.category == "intermediate";
      });
    },
    lessonsExpert() {
      return this.lessons.filter(function(lesson) {
        return lesson.category == "expert";
      });
    },
    selectedLesson: {
      get: function() {
        return this.$store.state.selectedLesson;
      },
      set: function(newValue) {
        this.$store.commit("setSelectedLesson", newValue);
      }
    },
    lessonCategory: {
      get: function() {
        return this.$store.state.lessonCategory;
      },
      set: function(newValue) {
        this.$store.commit("setLessonCategory", newValue);
      }
    }
  },
  name: "App",
  components: { Snackbar },
  mounted() {
    this.$store.dispatch("getLessons");
    this.$store.dispatch("autoLogin");
  },
  data: () => ({
    drawer: null,
    anonymousProfilePicture: anonymousProfilePicture
  }),
  methods: {
    goToBlog() {
      window.open("https://www.vietnamesepod101.com/blog/", "_blank");
    }
  },
  filters: {
    lowerCase: function(value) {
      return value.toLowerCase();
    }
  }
};
</script>

<style>
@font-face {
  font-family: secondary;
  src: url(./assets/BadmintonOfShadow.ttf);
}
.v-toolbar__content {
  background-image: linear-gradient(to bottom right, #f2709c, #ff9472);
  font-family: secondary;
  color: white;
  transition: all 0.3s;
}
.v-toolbar__title {
  font-size: 30px;
}
.v-card {
  border-radius: 30px;
}
.home-page .v-toolbar__content {
  height: 100vh !important;
}
.home-page .title-center {
  width: 100%;
  margin-left: 0px !important;
  text-align: center;
  font-size: 40px;
  /* text-shadow: 0px 5px 15px rgba(0,0,0,0.6); */
  padding-bottom: 50px;
}

.list-item {
  display: inline-block;
}
.list-enter-active {
  transition: all 0.5s;
}
.list-enter /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(-70px);
}

.pink-text::placeholder {
  color: #f98485;
}
.white-text::placeholder {
  color: white;
}
</style>

