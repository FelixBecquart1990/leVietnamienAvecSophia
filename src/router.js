import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Profile from './views/Profile.vue'
import Lessons from './views/Lessons.vue'
import CreateLesson from './views/CreateLesson.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: "*",
      redirect: "/"
    },
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile
    },
    {
      path: '/create-lesson',
      name: 'create-lesson',
      component: CreateLesson
    },
    {
      path: '/lessons',
      name: 'lessons',
      component: Lessons
    }
  ]
})
