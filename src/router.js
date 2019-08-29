import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/surprise',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/creator',
      name: 'creator',
      component: () => import('./views/Creator.vue')
    },
    {
      path: '/tipsninfo',
      name: 'tipsninfo',
      component: () => import('./views/TipsNInfo.vue')
    },
    {
      path: '/generate',
      name: 'generate',
      component: () => import('./views/Generate.vue')
    },
    {
      path: '*',
      name: 'not-found',
      component: () => import('./views/404.vue')
    }
  ]
})
