<template>
<div class="bkgd">
    <div class="top">
        <img src="@/assets/Pictures/chadLogo.jpg" class="logo">
    </div>
    <div class="interface">
        <v-container class="encoders" fluid grid-list-m box>
            <!-- #region General Inputs -->
            <v-layout row>
                <v-flex align-content-start sm2>
                    <input placeholder="Autonomous name" id="in-name"/>
                </v-flex>
                <v-flex sm2>
                    <p class="chassischoice">Chassis: {{ $store.getters.chassis }}</p>
                </v-flex>
                <v-flex sm3>
                    <v-overflow-btn outline color="gray" style="margin-top: 0em" height="2em" margin="0em" :items="presets" label="cpi presets" target=".encoders"></v-overflow-btn>
                </v-flex>
                <v-flex sm3>
                    <v-overflow-btn outline color="gray" style="margin-top: 0em" height="2em" margin="0em" :items="starts" label="starting side" target=".encoders"></v-overflow-btn>
                </v-flex>
                <v-flex sm2>
                    <input type="number" placeholder="Movement bias" value="1" class="in-num"/>
                </v-flex>
            </v-layout>
            <!-- #endregion -->
            <v-layout row>
                <!-- #region Field Container -->
                <v-flex d-flex sm5>
                    <!-- 36 pixels per foot or 3 pixels per inch -->
                    <!--<svg width="396" height="396">-->
                        <v-card>
                        <v-img :src="require('@/assets/Pictures/field.jpg')" style="height:396px; width:396px;" alt="Field" class="logo"/>
                        </v-card>
                    <!--</svg>-->
                </v-flex>
                <!-- #endregion -->
                <!-- #region Input Zone -->
                <v-flex d-flex sm4>
                    <v-layout row wrap>
                        <!-- #region toggle -->
                        <v-flex d-flex sm12>
                            <v-btn-toggle mandatory>
                                <v-btn block v-on:click="newStep(drive)" class="button">Drive</v-btn>
                                <v-btn block v-on:click="newStep(turn)">Turn</v-btn>
                                <v-btn block v-if=$store.getters.isArcingAvail v-on:click="newStep(arc)">Arc</v-btn>
                                <v-btn block v-if=!$store.getters.isArcingAvail v-on:click="newStep(strafe)">Strafe</v-btn>
                            </v-btn-toggle>
                        </v-flex>
                        <!-- #endregion -->
                        <!-- #region inputs -->
                        <v-flex v-if="($store.getters.isCurrentStepTurn || $store.getters.isCurrentStepArc)" sm12>
                            Angle:
                            <input type="number" v-model="angle" placeholder="angle" step="5" min="-360" max="360" class="in-num" id="in-dist"/>
                        </v-flex>
                        <v-flex v-if="($store.getters.isCurrentStepStrafe)" sm12>
                            Direction:
                            <input v-model="direction" placeholder="direction" step="1" min="1" max="4" class="in-num" id="in-dist"/>
                        </v-flex>
                        <v-flex v-if="($store.getters.isCurrentStepMove || $store.getters.isCurrentStepArc || $store.getters.isCurrentStepStrafe)" sm12>
                            Distance:
                            <input type="number" v-model="distance" placeholder="distance" step="0.2" class="in-num" id="in-dist"/>
                        </v-flex>
                        <v-flex sm12>
                            Speed:
                            <input type="number" v-model="speed" placeholder="speed" step="0.05" min="-1" max="1" class="in-num" id="in-dist"/>
                        </v-flex>
                        <v-flex sm4>
                            <v-btn v-on:click="confirmStep()">Done</v-btn>
                        </v-flex>
                        <!-- #endregion -->
                    </v-layout>
                </v-flex>
                <!-- #endregion -->
                <!-- #region Step List -->
                <v-flex class="whatever_you_want" d-flex sm3>
                    <v-flex sm12>
                        <v-card v-for="step in $store.getters.getTheSteps" v-bind:key="step.stepNumber">
                            <v-card-title primary-title>
                                <v-flex sm12>
                                    <h3>
                                        {{step.type}}
                                    </h3>
                                </v-flex>
                                <!-- #region Steps -->
                                <v-flex sm12>
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
                                </v-flex>
                                <!-- #endregion -->
                            </v-card-title>
                        </v-card>
                    </v-flex>
                </v-flex>
                <!-- #endregion -->
            </v-layout>
        </v-container>
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
    drive: MovementOptions.DRIVE,
    turn: MovementOptions.TURN,
    arc: MovementOptions.ARC,
    strafe: MovementOptions.STRAFE,
    angle: 0,
    direction: "right",
    distance: 0,
    speed: 0
  })
};
</script>

<style>
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
  background-color: white;
  border-radius: 5px;
  position: absolute;
  margin: 3%;
  width: 94%;
  height: 80%;
  top: 3%;
}

#in-name {
  border: 2px solid gray;
  border-radius: 4px;
  padding: 3px;
  color: black;
  font-family: "Montserrat", sans-serif;
}

#in-dist {
  width: 90%;
}

.in-num {
  border: 2px solid gray;
  border-radius: 4px;
  padding: 3px;
  color: black;
  font-family: "Montserrat", sans-serif;
  margin: 3%;
}

.chassischoice {
  font-family: "Montserrat", sans-serif;
}

#field {
  background-color: gray;
  height: 330px;
  width: 50px;
  border-radius: 5px;
}

.button {
    width: 100%;
}

.whatever_you_want{
    overflow-y: auto;
}
</style>
