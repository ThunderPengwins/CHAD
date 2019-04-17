import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    chassis: 'traction'
  },
  mutations: {
    changeChassis(state, chassis) {
      state.chassis = chassis
    }
  },
  getters: {
    chassis: state => state.chassis
  }
})
