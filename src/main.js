import Vue from 'vue'
import './plugins/vuetify';
import App from './App.vue'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader
import router from './router'
import {store} from './store/store'
import {MovementOptions} from './store/steps'
import VueKonva from 'vue-konva'

Vue.use(VueKonva);
Vue.config.productionTip = false

new Vue({
  router,
  store,
  MovementOptions,
  render: h => h(App)
}).$mount('#app')
