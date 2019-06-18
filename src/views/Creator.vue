<template>
<div class="bkgd">
    <div class="top">
        <img src="@/assets/Pictures/chadLogo.jpg" class="logo">
    </div>
    <div class="interface">
        <!-- #region General Inputs -->
            <input placeholder="Autonomous name" id="in-name" class="colors"/>
            <input type="number" placeholder="Movement bias" id="in-num" class="colors"/>
            <p class="chassischoice">Chassis: {{ $store.getters.chassis }}</p>
            <select @change="cpichange($event)" class="dropdown" id="in-preset">
                <option disabled selected value="">CPI Presets</option>
                <option text-xs-center v-for="(preset, index) in presets" v-bind:key="index">{{preset}}</option>
            </select>
            <select class="dropdown" id="in-start">
                <option disabled selected>Starting Side</option>
                <option v-for="(start, index) in starts" v-bind:key="index">{{start}}</option>
            </select>
            <input type="number" placeholder="robot width" id="in-width" class="colors"/> 
            <div id="flourish" color="color"></div>
            <input type="number" placeholder="robot length" id="in-length" class="colors"/>
            <v-dialog v-model="opencustoms" width="500">
                <v-card>
                    <v-card-title class="headline blue lighten-2" primary-title>Custom Inputs</v-card-title>
                    <v-card-text>
                        Gear Ratio: <input type="number" placeholder="Gearratio" value="40" class="popup-inputs"/><br/>
                        Motor CPR: <input type="number" placeholder="cpr" value="28" class="popup-inputs"/><br/>
                        Wheel Diameter: <input type="number" placeholder="diameter" value="4.125" class="popup-inputs"/>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="popup-inputs" flat @click="opencustoms = false">Done</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <!--<v-overflow-btn outline color="gray" style="margin-top: 0em" height="2em" margin="0em" :items="presets" label="cpi presets"></v-overflow-btn>
            <v-overflow-btn outline color="gray" style="margin-top: 0em" height="2em" margin="0em" :items="starts" label="starting side" target=".encoders"></v-overflow-btn>-->
        <!-- #endregion -->
        <!-- #region Field Container -->
            <!-- 36 pixels per foot or 3 pixels per inch -->
            <!--<svg width="396" height="396">-->
                <div>
                <v-img :src="require('@/assets/Pictures/field.jpg')" style="height:396px; width:396px;" alt="Field" id="field"/>
                </div>
            <!--</svg>-->
        <!-- #endregion -->
        <!-- #region Input Zone -->
                <!-- #region toggle -->
                    <v-btn-toggle id="toggle" mandatory>
                        <v-btn block v-on:click="newStep(drive)" class="button">Drive</v-btn>
                        <v-btn block v-on:click="newStep(turn)">Turn</v-btn>
                        <v-btn block v-if=$store.getters.isArcingAvail v-on:click="newStep(arc)">Arc</v-btn>
                        <v-btn block v-if=!$store.getters.isArcingAvail v-on:click="newStep(strafe)">Strafe</v-btn>
                    </v-btn-toggle>
                <!-- #endregion -->
                <!-- #region inputs -->
                <div id="stepinputs">
                    <div v-if="($store.getters.isCurrentStepTurn || $store.getters.isCurrentStepArc)" sm12>
                        <p class="label">Angle:</p>
                        <input type="number" v-model="angle" placeholder="angle" step="5" min="-360" max="360" class="colors" id="in-dist"/>
                    </div>
                    <div v-if="($store.getters.isCurrentStepStrafe)" sm12>
                        <p class="label">Direction:</p>
                        <input v-model="direction" placeholder="direction" step="1" min="1" max="4" class="colors" id="in-dist"/>
                    </div>
                    <div v-if="($store.getters.isCurrentStepMove || $store.getters.isCurrentStepArc || $store.getters.isCurrentStepStrafe)" sm12>
                        <p class="label">Distance:</p>
                        <input type="number" v-model="distance" placeholder="distance" step="0.2" class="colors" id="in-dist"/>
                    </div>
                    <div sm12>
                        <p class="label">Speed:</p>
                        <input type="number" v-model="speed" placeholder="speed" step="0.05" min="-1" max="1" class="colors" id="in-dist"/>
                    </div>
                    <div sm4>
                        <v-btn v-on:click="confirmStep()">Done</v-btn>
                    </div>
                </div>
                <!-- #endregion -->
        <!-- #endregion -->
        <!-- #region Step List -->
            <div id="listofsteps">
                <div id="autostep" v-for="step in $store.getters.getTheSteps" v-bind:key="step.stepNumber">
                    <!--<v-card-title primary-title>-->
                        <div sm12>
                            <h3>
                                {{step.type}}
                            </h3>
                        </div>
                        <!-- #region Steps -->
                        <div sm12>
                            <div v-if="step.type==drive">
                                <v-layout row wrap>
                                    <v-flex sm6>
                                        Distance: {{step.params.distance}}
                                    </v-flex>
                                    <v-flex sm6>
                                        Speed: {{step.params.speed}}
                                    </v-flex>
                                </v-layout> 
                            </div>
                            <div v-if="step.type==turn">
                                <v-layout row wrap>
                                    <v-flex sm6>
                                        Angle: {{step.params.angle}}
                                    </v-flex>
                                    <v-flex sm6>
                                        Speed: {{step.params.speed}}
                                    </v-flex>
                                </v-layout> 
                            </div>
                            <div v-if="step.type==arc">
                                <v-layout row wrap>
                                    <v-flex sm4>
                                        Angle: {{step.params.angle}}
                                    </v-flex>
                                    <v-flex sm4>
                                        Distance: {{step.params.distance}}
                                    </v-flex>
                                    <v-flex sm4>
                                        Speed: {{step.params.speed}}
                                    </v-flex>
                                </v-layout> 
                            </div>
                            <div v-if="step.type==strafe">
                                <v-layout row wrap>
                                    <v-flex sm4>
                                        Direction: {{step.params.direction}}
                                    </v-flex>
                                    <v-flex sm4>
                                        Distance: {{step.params.distance}}
                                    </v-flex>
                                    <v-flex sm4>
                                        Speed: {{step.params.speed}}
                                    </v-flex>
                                </v-layout> 
                            </div>
                        </div>
                        <!-- #endregion -->
                    <!--</v-card-title>-->
                </div>
            </div>
        <!-- #endregion -->
    </div>
    <bottom-navigation>
    </bottom-navigation>
</div>
</template>

<script>
import BottomNavigation from "@/components/BottomNavigation";
import { MovementOptions } from "@/store/steps";
export default {
  name: "Creator",
  components: {
    BottomNavigation
  },
  methods: {
    newStep: function(step) {
      this.$store.commit("setCurrentStep", step);
    },
    cpichange: function(event){
        if(event.target.value=="Custom"){
            this.opencustoms = true;
        }else{
            this.opencustoms = false;
        }
    },
    confirmStep: function() {
      var params;
      switch (this.$store.getters.currentStep) {
        case MovementOptions.DRIVE:
          params = {
            distance: this.$data.distance,
            speed: this.$data.speed
          };
          break;
        case MovementOptions.TURN:
          params = {
            angle: this.$data.angle,
            speed: this.$data.speed
          };
          break;
        case MovementOptions.ARC:
          params = {
            angle: this.$data.angle,
            distance: this.$data.distance,
            speed: this.$data.speed
          };
          break;
        case MovementOptions.STRAFE:
          params = {
            direction: this.$data.direction,
            distance: this.$data.distance,
            speed: this.$data.speed
          };
          break;
      }
      this.$store.commit("confirmStep", params);
    }
  },
  data: () => ({
    presets: ["Gear ratio: 20", "Gear ratio: 40", "Gear ratio: 60", "Custom"],
    starts: ["top left", "top right", "bottom left", "bottom right"],
    dialog: false,
    drive: MovementOptions.DRIVE,
    turn: MovementOptions.TURN,
    arc: MovementOptions.ARC,
    strafe: MovementOptions.STRAFE,
    angle: 0,
    direction: "right",
    distance: 0,
    speed: 0,
    opencustoms: false
  })
};
</script>

<style lang="scss">
#top {
  height: 5%;
  width: 100%;
  top: 0%;
  position: absolute;
}

#logo {
  width: 10%;
}

#bkgd {
  margin: 0%;
}

.interface {
  background-color: black;
  border-radius: 5px;
  position: absolute;
  margin: 3%;
  width: 94%;
  height: 80%;
  top: 3%;
}

.chassischoice {
  font-family: "Montserrat", sans-serif;
  color: white;
  font-size: 2em;
  position: absolute;
  left: 2%;
  top: 2%;
}

#in-name {
  padding: 3px;
  color: black;
  font-family: "Montserrat", sans-serif;
  position: absolute;
  left: 2%;
  top: 12%;
  width: 16.5%;
  height: 5%;
  border-right-width: 1px;
  text-align: center;
}

#in-num {
  padding: 3px;
  font-family: "Montserrat", sans-serif;
  position: absolute;
  left: 19.5%;
  top: 12%;
  width: 15.5%;
  height: 5%;
  border-left-width: 1px;
  text-align: center;
}

#in-preset{
    left: 39.5%;
}

#in-start{
    left: 55.5%;
}

#in-width{
    left: 80%;
    position: absolute;
    padding-left: 4px;
    top: 12%;
}

#in-length{
    left: 80%;
    position: absolute;
    padding-left: 4px;
    top: 17%;
}

#in-dist {
  width: 90%;
  padding-left: 4px;
}

.dropdown{
    background-color: white;
    color: black;
    position: absolute;
    width: 15%;
    height: 8%;
    top: 12%;
    padding: 10px;
    text-align-last: center;
    border-radius: 4px;
}

.colors{
    background-color: white;
    border-radius: 4px;
}

.popup-inputs{
    background-color: white;
    border: 3px solid #64b5f6;
    border-radius: 4px;
}

#field {
  position: absolute;
  width: 30%;
  height: 30%;
  left: 2%;
  top: 20%;
}

.button {
    width: 100%;
}

.label{
    color: white;
}

.whatever_you_want{
    overflow-y: auto;
}

#toggle{
    position: absolute;
    top: 30%;
    width: 30%;
    left: 40%;
}

#stepinputs{
    position: absolute;
    top: 40%;
    width: 30%;
    left: 40%;
}

#listofsteps{
    position: absolute;
    left: 75%;
    top: 30%;
    width: 25%;
    height: 60%;
    overflow: auto;
    background-color: gray;
}

html, body {
    height: 100%;
    margin: 0;
}

#autostep{
    height: 20%;
}
</style>
