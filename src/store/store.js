import Vue from 'vue'
import Vuex from 'vuex'
import {MovementOptions} from './steps'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    chassis: 'traction',
    currentStep: MovementOptions.DRIVE,
    listOfSteps: []
  },
  mutations: {
    changeChassis(state, chassis) {
      state.chassis = chassis
    },
    setCurrentStep(state, step) {
      state.currentStep = step
    },
    confirmStep(state, params){
      state.listOfSteps.push({
        stepNumber: state.listOfSteps ? state.listOfSteps.length : 0,
        type: state.currentStep,
        params: params
      })
    }
  },
  getters: {
    chassis: state => state.chassis,
    currentStep: state => state.currentStep,
    isArcingAvail: state => state.chassis=='traction' || state.chassis=='omni wheel',
    isCurrentStepMove: state => state.currentStep==MovementOptions.DRIVE,
    isCurrentStepTurn: state => state.currentStep==MovementOptions.TURN,
    isCurrentStepArc: state => state.currentStep==MovementOptions.ARC,
    isCurrentStepStrafe: state => state.currentStep==MovementOptions.STRAFE,
    getTheSteps: state => state.listOfSteps
  }
})
