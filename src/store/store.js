import Vue from 'vue'
import Vuex from 'vuex'
import {MovementOptions} from './steps'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    chassis: null,
    currentStep: MovementOptions.DRIVE,
    listOfSteps: [],
    generateClicked: false,
    firstChassis: false,
    genCode: null,
    genCali: null,
    roboLength: 18,
    roboWidth: 16,
    bias: 1,
    name: null,
    dBias: true,
    cpi: [28, 40, 4.125],
    cpishow: "CPI Presets",
    side: "Starting Side",
    yside: null
  },
  mutations: {
    changeChassis(state, chassis) {
      state.chassis = chassis;
      state.listOfSteps = [];
    },
    setCurrentStep(state, step) {
      state.currentStep = step
    },
    setWidth(state, width){
      state.roboWidth = width;
    },
    setLength(state, length){
      state.roboLength = length;
    },
    setBias(state, bias){
      state.bias = bias;
      state.dBias = false;
    },
    setName(state, name){
      state.name = name;
    },
    setCPI(state, cpi){
      state.cpi = cpi;
    },
    setCPIShow(state, show){
      state.cpishow = show;
    },
    setSide(state, [side, yside]){
      state.side = side;
      state.yside = yside;
    },
    confirmStep(state, params){
      state.listOfSteps.push({
        stepNumber: state.listOfSteps ? state.listOfSteps.length : 0,
        type: state.currentStep,
        params: params
      })
    },
    setGenerateVisible(state){
      state.generateClicked = true;
    },
    setFirstChassis(state){
      state.firstChassis = true;
    },
    removeLastStep(state){
      state.listOfSteps.pop();
    },
    nukeIt(state){
      state.listOfSteps = [];
      state.generateClicked = false;
      state.roboLength = 18;
      state.roboWidth = 16;
      state.bias = 1
      state.dBias = true;
    },
    setGenCode(state, code){
      state.genCode = code;
    },
    setGenCali(state, code){
      state.genCali = code;
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
    getTheSteps: state => state.listOfSteps,
    getGenerateVisibility: state => state.generateClicked,
    getFirstChassis: state => state.firstChassis,
    getGenCode: state => state.genCode,
    getGenCali: state => state.genCali,
    getWidth: state => state.roboWidth,
    getLength: state => state.roboLength,
    getBias: state => state.bias,
    getName: state => state.name,
    getDBias: state => state.dBias,
    getCPI: state => state.cpi,
    getCPIShow: state => state.cpishow,
    getSide: state => state.side,
    getYSide: state => state.yside
  }
})
