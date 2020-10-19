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
    dimChange: false,
    bias: 1,
    name: null,
    dBias: true,
    cpi: [28, 40, 4.125],
    cpishow: "CPI Presets",
    side: "Starting Side",
    yside: null,
    xside: null,
    startRot: null,
    interim: [],
    pxPerInch: null
  },
  mutations: {
    changeChassis(state, chassis) {
      state.chassis = chassis;
      state.listOfSteps = [];
      state.roboWidth = 16;
      state.roboLength = 18;
      state.dimChange = false;
      state.bias = 1
      state.dBias = true;
    },
    setCurrentStep(state, step) {
      state.currentStep = step
    },
    setWidth(state, width){
      state.roboWidth = width;
      state.dimChange = true;
    },
    setLength(state, length){
      state.roboLength = length;
      state.dimChange = true;
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
    setSide(state, [side, startingPos]){
      state.side = side;
      state.xside = startingPos.x;
      state.yside = startingPos.y;
      state.startRot = startingPos.rotation;
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
    },
    setGenCode(state, code){
      state.genCode = code;
    },
    setGenCali(state, code){
      state.genCali = code;
    },
    setInterim(state, [angle, distance]){
      state.interim.angle = angle;
      state.interim.distance = distance;
    },
    resetSide(state){
      state.side = "Starting Side";
    },
    setPx(state, pxPerInch){
      state.pxPerInch = pxPerInch;
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
    getDimChange: state => state.dimChange,
    getBias: state => state.bias,
    getName: state => state.name,
    getDBias: state => state.dBias,
    getCPI: state => state.cpi,
    getCPIShow: state => state.cpishow,
    getSide: state => state.side,
    getYSide: state => state.yside,
    getXSide: state => state.xside,
    getStartRot: state => state.startRot,
    getInterim: state => state.interim,
    getPxPerInch: state => state.pxPerInch
  }
})
