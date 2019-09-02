<template>
<div class="bkgd">
    <div class="top">
        <button>
        <img src="@/assets/Pictures/chadLogo.jpg" class="logo">
        </button>
    </div>
    <div class="interface">
        <!-- #region General Inputs -->
            <div class="tooltip" id="pos-name">
                <input placeholder="Autonomous name" id="in-name" class="colors"/>
                <span class="tooltiptext">Naming Info!<br/><hr/><p class="hover-info">This is the name that will appear in your driver station app.</p></span>
            </div>
            <div class="tooltip" id="pos-num">
                <input type="number" value="1" placeholder="Movement bias" id="in-num" class="colors"/>
                <span class="tooltiptext">Bias Info<br/><hr/><p class="hover-info">Set to one as default. This value can be used to counteract friction and other factors.</p></span>
            </div>
            <p class="chassischoice">Chassis: {{ $store.getters.chassis }}</p>
            <div class="tooltip" id="pos-preset">
                <select @change="cpichange($event)" class="dropdown">
                    <option disabled selected value="">CPI Presets</option>
                    <option text-xs-center v-for="(preset, index) in presets" v-bind:key="index">{{preset}}</option>
                </select>
                <span class="tooltiptext">CPI Info<br/><hr/><p class="hover-info">Determines rotation of wheels. Presets assume 4.125 inch wheel diameter and 28 counts per rotation motor. Select custom to bypass this.</p></span>
            </div>
            <div class="tooltip" id="pos-start">
                <select  v-model="starpos" @change="startChange($event)" class="dropdown">
                    <option disabled selected>Starting Side</option>
                    <option v-for="(start, index) in starts" v-bind:key="index">{{start}}</option>
                </select>
                <span class="tooltiptext">Side Info<br/><hr/><p class="hover-info">Used for the field display. This won't affect the code.</p></span>
            </div>
            <div class="tooltip" id="pos-dims">
                <input type="number" placeholder="robot width" @change="widthChange($event)" id="in-width" class="colors" v-model="robotWidth"/> 
                <div id="flourish" color="color"></div>
                <input type="number" placeholder="robot length" @change="lengthChange($event)" id="in-length" class="colors" v-model="robotLength"/>
                <span class="tooltiptext">Dimension Info<br/><hr/><p class="hover-info">Dimensions are important for arcing, but should be filled in even without arcs.</p></span>
            </div>
            <v-dialog v-model="opencustoms" width="500">
                <v-card>
                    <v-card-title class="headline popup" primary-title>Custom Inputs</v-card-title>
                    <v-card-text class="popup-text">
                        Gear Ratio: <input type="number" placeholder="Gearratio" value="40" class="popup-inputs"/><br/>
                        Motor CPR: <input type="number" placeholder="cpr" value="28" class="popup-inputs"/><br/>
                        Wheel Diameter: <input type="number" placeholder="diameter" value="4.125" class="popup-inputs"/>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn class="popup-button" flat @click="opencustoms = false">Done</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <!--<v-overflow-btn outline color="gray" style="margin-top: 0em" height="2em" margin="0em" :items="presets" label="cpi presets"></v-overflow-btn>
            <v-overflow-btn outline color="gray" style="margin-top: 0em" height="2em" margin="0em" :items="starts" label="starting side" target=".encoders"></v-overflow-btn>-->
        <!-- #endregion -->
        <!-- #region Field Container -->
            <!-- 36 pixels per foot or 3 pixels per inch -->
            <!--<svg width="396" height="396">-->
                <div id="field">
                    <draw-lines
                        @hey = 'setStepPoint'
                        @lock = 'setInterimFloat'
                        :imageSrc = 'field'
                        :imageHeight = 'fieldDim'
                        :imageWidth = 'fieldDim'
                        :lines = 'lines'
                        :points = 'points'
                        :arcs = 'arcs'
                        :interimPoint = 'interimPoint'
                        :interimLine = 'interimLine'
                        :interimArc = 'interimArc'
                        :directionLine = 'directionLine'
                    >
                    </draw-lines>
                </div>
            <!--</svg>-->
        <!-- #endregion -->
        <!-- #region Input Zone -->
            <!-- #region toggle -->
                    <button block v-bind:class="{active: $store.getters.isCurrentStepMove}" v-on:click="newStep(drive)" class="button" id="tog-drive">Drive</button>
                    <button block v-bind:class="{active: $store.getters.isCurrentStepTurn}" v-on:click="newStep(turn)" class="button" id="tog-turn">Turn</button>
                    <div class="tooltip">
                        <button block v-bind:class="{active: $store.getters.isCurrentStepArc}" v-if=$store.getters.isArcingAvail :disabled="$store.getters.chassis=='traction'" v-on:click="newStep(arc)" class="button" id="tog-fancy">Arc</button>
                        <span class="tooltiptext" v-if="$store.getters.chassis=='traction'" id="disable">Disabled<br/><hr/><p class="hover-info">This movement type is not available for this chassis.</p></span>
                    </div>
                    <button block v-bind:class="{active: $store.getters.isCurrentStepStrafe}" v-if=!$store.getters.isArcingAvail v-on:click="newStep(strafe)" class="button" id="tog-fancy">Strafe</button>
            <!-- #endregion -->
            <!-- #region inputs -->
                <div id="stepinputs">
                    <div v-if="($store.getters.isCurrentStepTurn || $store.getters.isCurrentStepArc)" sm12>
                        <p class="label">Angle:</p>
                        <input type="number" v-model="angle" @change="getStepPoint" placeholder="angle" step="5" min="-360" max="360" class="colors" id="in-dist"/>
                        <div class="amount">°</div>
                    </div>
                    <div v-if="($store.getters.isCurrentStepMove || $store.getters.isCurrentStepArc || $store.getters.isCurrentStepStrafe)" sm12>
                        <p class="label">Distance:</p>
                        <input type="number" v-model="distance" @change="getStepPoint" placeholder="distance" step="0.2" class="colors" id="in-dist"/>
                        <div class="amount">"</div>
                    </div>
                    <div sm12>
                        <p class="label">Speed:</p>
                        <input type="number" v-model="speed" placeholder="speed" step="0.05" min="0" max="1" class="colors" id="in-dist"/>
                        <div class="amount">/1</div>
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
                        <div id="step-title" sm12>
                            <h3>
                                {{step.type}}
                            </h3>
                        </div> 
                        <!-- #region Steps -->
                        <div row wrap>
                            <div v-if="step.type==drive">
                                <v-layout>
                                    <v-flex sm5>
                                        Distance: {{step.params.distance}}
                                    </v-flex>
                                    <v-flex sm5>
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
                                        Distance: {{step.params.distance}}
                                    </v-flex>
                                    <v-flex sm4>
                                        Speed: {{step.params.speed}}
                                    </v-flex>
                                </v-layout> 
                            </div>
                        </div>
                        <div sm2 id="trash" v-if="(step.stepNumber + 1) == $store.getters.getTheSteps.length">
                            <v-btn icon flat color="black" v-on:click="deleteStep(step)"><v-icon>delete</v-icon></v-btn>
                            <v-btn icon flat color="red" v-on:click="deleteSteps(step)"><v-icon>clear</v-icon></v-btn>
                        </div>
                        <!-- #endregion -->
                    <!--</v-card-title>-->
                </div>
            </div>
        <!-- #endregion -->
        <div sm4>
            <v-btn id="generate" v-on:click="setGenerateVisible()">Generate</v-btn>
        </div>
    </div>
    <v-dialog v-model="deleteWarning" width="500">
      <v-card>
        <v-card-title class="headline" primary-title>WARNING</v-card-title>
        <v-card-text class="popup-text">
          This action will delete all of your saved steps. Do you want to continue?
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="popup-button" flat @click="falseAlarm()">No</v-btn>
          <v-btn class="popup-button" flat @click="confirmDelete()">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</div>
</template>

<script>
import { MovementOptions } from "@/store/steps";
import DrawLines from "@/components/DrawLines";
export default {
  name: "Creator",
  components: { DrawLines },
  methods: {
    newStep: function(step) {
      this.$store.commit("setCurrentStep", step);
      //
      this.interimFloat = false;
      //
      this.getStepPoint();
      //
    },
    deleteStep: function(step) {
      //
      this.$store.commit("removeLastStep");
      //
      switch (step.type) {
        case MovementOptions.DRIVE:
          this.lines.pop();
          this.points.pop();
          this.curX = this.points[this.points.length - 1].x;
          this.curY = this.points[this.points.length - 1].y;
          this.distance = 30;
          this.points.pop();
          this.points.push({
            x: this.curX,
            y: this.curY,
            rotation: this.curAngle,
            width: this.robotWidth * 3,
            height: this.robotLength * 3,
            offsetX: this.robotWidth * 3 / 2,
            offsetY: this.robotLength * 3 / 2,
            stroke: "#32cd32",
            strokeWidth: 5,
            cornerRadius: 5
          });
          this.$store.commit("setCurrentStep", MovementOptions.DRIVE);
          this.getDrive();
          break;
        case MovementOptions.TURN:
          this.arcs.pop();
          this.points.pop();
          this.curAngle = this.points[this.points.length - 1].rotation;
          this.angle = 45;
          this.nextAngle = this.curAngle + this.angle;
          this.points.pop();
          this.points.push({
            x: this.curX,
            y: this.curY,
            rotation: this.curAngle,
            width: this.robotWidth * 3,
            height: this.robotLength * 3,
            offsetX: this.robotWidth * 3 / 2,
            offsetY: this.robotLength * 3 / 2,
            stroke: "#32cd32",
            strokeWidth: 5,
            cornerRadius: 5
          });
          this.$store.commit("setCurrentStep", MovementOptions.TURN);
          this.getTurn();
          break;
        case MovementOptions.ARC:
          //
          console.log("Should be working.");
          this.arcs.pop();
          this.points.pop();
          this.curAngle = this.points[this.points.length - 1].rotation;
          this.curX = this.points[this.points.length - 1].x;
          this.curY = this.points[this.points.length - 1].y;
          this.angle = 45;
          this.distance = 30;
          this.points.pop();
          this.points.push({
            x: this.curX,
            y: this.curY,
            rotation: this.curAngle,
            width: this.robotWidth * 3,
            height: this.robotLength * 3,
            offsetX: this.robotWidth * 3 / 2,
            offsetY: this.robotLength * 3 / 2,
            stroke: "#32cd32",
            strokeWidth: 5,
            cornerRadius: 5
          });
          this.$store.commit("setCurrentStep", MovementOptions.ARC);
          this.getArc();
          //
          break;
        case MovementOptions.STRAFE:
          this.lines.pop();
          this.points.pop();
          this.curX = this.points[this.points.length - 1].x;
          this.curY = this.points[this.points.length - 1].y;
          this.distance = 30;
          this.points.pop();
          this.points.push({
            x: this.curX,
            y: this.curY,
            rotation: this.curAngle,
            width: this.robotWidth * 3,
            height: this.robotLength * 3,
            offsetX: this.robotWidth * 3 / 2,
            offsetY: this.robotLength * 3 / 2,
            stroke: "#32cd32",
            strokeWidth: 5,
            cornerRadius: 5
          });
          this.$store.commit("setCurrentStep", MovementOptions.STRAFE);
          this.getStrafe();
          break;
      }
      //
    },
    deleteSteps: function(step) {
      if (this.$store.getters.getTheSteps.length >= 1) {
        this.deleteWarning = true;
      } else {
        this.confirmDelete();
      }
    },
    confirmDelete: function() {
      //
      this.deleteWarning = false;
      //
      if (!this.sideChosen) {
        if (this.starpos == "top left") {
          this.startingPos = this.topLeft;
        } else if (this.starpos == "top right") {
          this.startingPos = this.topRight;
        } else if (this.starpos == "bottom left") {
          this.startingPos = this.bottomLeft;
        } else if (this.starpos == "bottom right") {
          this.startingPos = this.bottomRight;
        } else {
          this.customStart();
        }
        this.sideChosen = true;
        this.laststarpos = this.starpos;
      }
      //
      this.$store.commit("nukeIt");
      this.points = [];
      this.lines = [];
      this.arcs = [];
      //
      this.points.push({
        //
        x: this.startingPos.x,
        y: this.startingPos.y,
        rotation: this.startingPos.rotation,
        width: this.robotWidth * 3,
        height: this.robotLength * 3,
        offsetX: this.robotWidth * 3 / 2,
        offsetY: this.robotLength * 3 / 2,
        stroke: "#32cd32",
        strokeWidth: 5,
        cornerRadius: 5
      });
      //
      this.curX = this.startingPos.x;
      this.curY = this.startingPos.y;
      this.curAngle = this.startingPos.rotation;
      //
      this.getStepPoint();
      //
    },
    falseAlarm: function() {
      //
      this.deleteWarning = false;
      //
      if (!this.sideChosen) {
        console.log(this.laststarpos);
        this.starpos = this.laststarpos;
        this.sideChosen = true;
      }
      //
    },
    setGenerateVisible: function() {
      this.$store.commit("setGenerateVisible");
      this.$router.push("/Generate");
    },
    cpichange: function(event) {
      if (event.target.value == "Custom") {
        this.opencustoms = true;
      } else {
        this.opencustoms = false;
      }
    },
    startChange: function(event) {
      if (this.$store.getters.getTheSteps.length >= 1) {
        this.sideChosen = false;
        this.deleteWarning = true;
      } else {
        this.sideChosen = true;
        if (event.target.value == "top left") {
          this.startingPos = this.topLeft;
        } else if (event.target.value == "top right") {
          this.startingPos = this.topRight;
        } else if (event.target.value == "bottom left") {
          this.startingPos = this.bottomLeft;
        } else if (event.target.value == "bottom right") {
          this.startingPos = this.bottomRight;
        } else {
          this.customStart();
        }
        this.confirmDelete();
        this.laststarpos = this.starpos;
      }
      //
    },
    widthChange: function(event) {
      this.robotWidth = event.target.value;
      this.getStepPoint();
    },
    lengthChange: function(event) {
      this.robotLength = event.target.value;
      this.getStepPoint();
    },
    customStart: function() {
      //
      this.interimPoint = null;
      this.interimLine = null;
      this.interimArc = null;
      //
      //while !mouse clicked
      //
    },
    confirmStep: function() {
      var params;
      switch (this.$store.getters.currentStep) {
        case MovementOptions.DRIVE:
          params = {
            distance: this.$data.distance,
            speed: this.$data.speed
          };
          //#region
          //
          this.lines.push({
            x: 0,
            y: 0,
            points: [
              this.curX,
              this.curY,
              this.curX + this.nextX,
              this.curY + this.nextY
            ],
            stroke: this.stepColors[this.currentColor],
            strokeWidth: 4,
            lineCap: "round"
          });
          //
          this.points.pop();
          //#endregion
          var x1 =
            (this.robotLength / 2 + 5) *
            Math.cos((90 - this.curAngle) * Math.PI / 180);
          var y1 =
            (this.robotLength / 2 + 5) *
            Math.sin((90 - this.curAngle) * Math.PI / 180);
          //
          this.directionLine = {
            x: 0,
            y: 0,
            points: [
              this.curX + this.nextX,
              this.curY + this.nextY,
              this.curX + this.nextX + x1 * 3,
              this.curY + this.nextY - y1 * 3
            ],
            stroke: "orange",
            strokeWidth: 4,
            lineCap: "round"
          };
          //
          this.points.push({
            //
            x: this.curX,
            y: this.curY,
            rotation: this.curAngle,
            width: this.robotWidth * 3,
            height: this.robotLength * 3,
            offsetX: this.robotWidth * 3 / 2,
            offsetY: this.robotLength * 3 / 2,
            stroke: this.stepColors[this.currentColor],
            strokeWidth: 5,
            cornerRadius: 5
          });
          //
          if (this.currentColor > this.stepColors.length - 2) {
            this.currentColor = 0;
          } else {
            this.currentColor++;
          }
          //
          var mx =
            this.distance * 3 * Math.cos((90 - this.curAngle) * Math.PI / 180);
          var my =
            this.distance * 3 * Math.sin((90 - this.curAngle) * Math.PI / 180);
          //
          this.curX = this.curX + mx;
          this.curY = this.curY - my;
          //
          this.points.push({
            //
            x: this.curX,
            y: this.curY,
            rotation: this.curAngle,
            width: this.robotWidth * 3,
            height: this.robotLength * 3,
            offsetX: this.robotWidth * 3 / 2,
            offsetY: this.robotLength * 3 / 2,
            stroke: "#32cd32",
            strokeWidth: 5,
            cornerRadius: 5
          });
          //
          this.distance = 30;
          //
          var l2 = this.distance * 3;
          var x2 = l2 * Math.cos((90 - this.curAngle) * Math.PI / 180);
          var y2 = l2 * Math.sin((90 - this.curAngle) * Math.PI / 180);
          //
          this.nextX = x2;
          this.nextY = y2 * -1;
          //
          this.getDrive();
          //
          this.interimFloat = false;
          //
          break;
        case MovementOptions.TURN:
          params = {
            angle: Math.round(this.$data.angle),
            speed: this.$data.speed
          };
          //
          if (this.angle > 0) {
            this.arcs.push({
              x: this.curX,
              y: this.curY,
              innerRadius: 0,
              outerRadius: 50,
              angle: this.angle,
              rotation: this.curAngle - 90,
              stroke: this.stepColors[this.currentColor],
              strokeWidth: 4,
              lineCap: "round",
              lineJoin: "round"
            });
          } else {
            this.arcs.push({
              x: this.curX,
              y: this.curY,
              innerRadius: 0,
              outerRadius: 50,
              angle: -this.angle,
              rotation: this.nextAngle - 90,
              stroke: this.stepColors[this.currentColor],
              strokeWidth: 4,
              lineCap: "round",
              lineJoin: "round"
            });
          }
          //
          this.points.pop();
          //
          this.points.push({
            x: this.curX,
            y: this.curY,
            rotation: this.curAngle,
            width: this.robotWidth * 3,
            height: this.robotLength * 3,
            offsetX: this.robotWidth * 3 / 2,
            offsetY: this.robotLength * 3 / 2,
            stroke: this.stepColors[this.currentColor],
            strokeWidth: 5,
            cornerRadius: 5
          });
          //
          if (this.currentColor > this.stepColors.length - 2) {
            this.currentColor = 0;
          } else {
            this.currentColor++;
          }
          //
          this.points.push({
            x: this.curX,
            y: this.curY,
            rotation: this.nextAngle,
            width: this.robotWidth * 3,
            height: this.robotLength * 3,
            offsetX: this.robotWidth * 3 / 2,
            offsetY: this.robotLength * 3 / 2,
            stroke: "#32cd32",
            strokeWidth: 5,
            cornerRadius: 5
          });
          //
          this.curAngle = Math.round(this.nextAngle / 5) * 5;
          this.angle = 45;
          this.nextAngle = this.curAngle + this.angle;
          //
          this.distance = 30;
          //
          l2 = this.distance * 3;
          x2 = l2 * Math.cos((90 - this.curAngle) * Math.PI / 180);
          y2 = l2 * Math.sin((90 - this.curAngle) * Math.PI / 180);
          //
          this.nextX = x2;
          this.nextY = y2 * -1;
          //
          x1 =
            this.fieldDim * 2 * Math.cos((90 - this.curAngle) * Math.PI / 180);
          y1 =
            this.fieldDim * 2 * Math.sin((90 - this.curAngle) * Math.PI / 180);
          //
          this.directionLine = {
            x: 0,
            y: 0,
            points: [this.curX, this.curY, this.curX + x1, this.curY - y1],
            stroke: "orange",
            strokeWidth: 4,
            lineCap: "round"
          };
          //
          this.getTurn();
          //
          this.interimFloat = false;
          //
          break;
        case MovementOptions.ARC:
          params = {
            angle: Math.round(this.$data.angle),
            distance: this.$data.distance,
            speed: this.$data.speed
          };
          //
          this.points.pop();
          //
          this.points.push({
            x: this.curX,
            y: this.curY,
            rotation: this.curAngle,
            width: this.robotWidth * 3,
            height: this.robotLength * 3,
            offsetX: this.robotWidth * 3 / 2,
            offsetY: this.robotLength * 3 / 2,
            stroke: this.stepColors[this.currentColor],
            strokeWidth: 5,
            cornerRadius: 5
          });
          //
          var ang = Number(this.angle);
          if (ang / 90 == Math.round(ang / 90)) {
            ang += 0.1;
          }
          //
          this.nextAy =
            this.distance *
            3 *
            Math.cos((Number(ang) + this.curAngle) * Math.PI / 180);
          this.nextAx =
            this.distance *
            3 *
            Math.sin((Number(ang) + this.curAngle) * Math.PI / 180);
          //
          if (this.nextAx == 0) {
            this.nextAx = 0.01;
          }
          if (this.nextAy == 0) {
            this.nextAy = 0.01;
          }
          //
          this.nextAx = this.curX + this.nextAx;
          this.nextAy = this.curY - this.nextAy;
          //
          var curA = this.curAngle;
          if (curA < -90) {
            curA += 180;
          } else if (curA > 90) {
            curA -= 180;
          }
          //
          var d1 = Math.sqrt(
            Math.pow(this.nextAx - this.curX, 2) +
              Math.pow(this.curY - this.nextAy, 2)
          );
          var a1 =
            Math.atan((this.curY - this.nextAy) / (this.nextAx - this.curX)) *
            180 /
            Math.PI;
          var r =
            d1 *
            Math.sin((90 - (90 - a1 - curA)) * Math.PI / 180) /
            Math.sin(2 * (90 - a1 - curA) * Math.PI / 180);
          x1 = r * Math.cos(-1 * curA * Math.PI / 180);
          y1 = r * Math.sin(-1 * curA * Math.PI / 180);
          var perp =
            (this.nextAx - this.curX) * Math.tan(curA * Math.PI / 180) +
            this.curY;
          var par =
            (this.curY - this.nextAy) / Math.tan((90 - curA) * Math.PI / 180) +
            this.curX;
          if (a1 > 90 - curA) {
            a1 = a1 - 180;
          }
          //
          var start = curA - 90;
          //
          if (this.nextAx < par) {
            start = curA + 90;
          }
          //
          if (this.nextAx < this.curX) {
            x1 = x1 * -1;
            y1 = y1 * -1;
          }
          //
          if (r < 0) {
            r = r * -1;
          }
          //
          var a2 = (90 - a1 - curA) * 2;
          if (a2 > 360) {
            a2 = a2 - 360;
          }
          //
          if (
            (this.nextAy > perp && this.nextAx > par) ||
            (this.nextAx < par && this.nextAy < perp)
          ) {
            this.arcs.push({
              x: this.curX + x1,
              y: this.curY - y1,
              innerRadius: r,
              outerRadius: r,
              angle: 2 * (90 + a1 + curA),
              rotation: start + (360 - 2 * (90 + a1 + curA)) - 90,
              stroke: this.stepColors[this.currentColor],
              strokeWidth: 4,
              lineCap: "round",
              lineJoin: "round"
            });
          } else if (this.nextAy <= perp) {
            this.arcs.push({
              x: this.curX + x1,
              y: this.curY - y1,
              innerRadius: r,
              outerRadius: r,
              angle: a2,
              rotation: curA - 180,
              stroke: this.stepColors[this.currentColor],
              strokeWidth: 4,
              lineCap: "round",
              lineJoin: "round"
            });
          } else {
            this.arcs.push({
              x: this.curX + x1,
              y: this.curY - y1,
              innerRadius: r,
              outerRadius: r,
              angle: a2,
              rotation: curA,
              stroke: this.stepColors[this.currentColor],
              strokeWidth: 4,
              lineCap: "round",
              lineJoin: "round"
            });
          }
          //
          this.points.push({
            x: this.nextAx,
            y: this.nextAy,
            width: this.robotWidth * 3,
            height: this.robotLength * 3,
            offsetX: this.robotWidth * 3 / 2,
            offsetY: this.robotLength * 3 / 2,
            stroke: "#32cd32",
            strokeWidth: 5,
            cornerRadius: 5,
            rotation: this.curAngle - (curA + (a1 + 90)) * 2,
            lineCap: "round",
            lineJoin: "round"
          });
          //
          if (this.currentColor > this.stepColors.length - 2) {
            this.currentColor = 0;
          } else {
            this.currentColor++;
          }
          //
          this.distance = 30;
          this.angle = 45;
          //
          this.curX = this.nextAx;
          this.curY = this.nextAy;
          var nang = this.curAngle - (this.curAngle + (a1 + 90)) * 2;
          console.log("nang1: " + nang);
          if (this.nextAy > perp && Math.abs(this.curAngle) < 90) {
            nang += 180;
          }
          console.log("nang2: " + nang);
          if (nang > 180) {
            nang -= 360;
          } else if (nang < -180) {
            nang += 360;
          }
          console.log("nang3: " + nang);
          this.curAngle = nang;
          //
          this.getArc();
          //
          this.interimFloat = false;
          break;
        case MovementOptions.STRAFE:
          params = {
            direction: this.$data.direction,
            distance: this.$data.distance,
            speed: this.$data.speed
          };
          //
          this.lines.push({
            x: 0,
            y: 0,
            points: [
              this.curX,
              this.curY,
              this.curX + this.nextAx,
              this.curY + this.nextAy
            ],
            stroke: this.stepColors[this.currentColor],
            strokeWidth: 4,
            lineCap: "round"
          });
          //
          this.points.pop();
          //#endregion
          //
          this.points.push({
            //
            x: this.curX,
            y: this.curY,
            rotation: this.curAngle,
            width: this.robotWidth * 3,
            height: this.robotLength * 3,
            offsetX: this.robotWidth * 3 / 2,
            offsetY: this.robotLength * 3 / 2,
            stroke: this.stepColors[this.currentColor],
            strokeWidth: 5,
            cornerRadius: 5
          });
          //
          if (this.currentColor > this.stepColors.length - 2) {
            this.currentColor = 0;
          } else {
            this.currentColor++;
          }
          //
          mx =
            this.distance * 3 * Math.cos((180 - this.curAngle) * Math.PI / 180);
          my =
            this.distance * 3 * Math.sin((180 - this.curAngle) * Math.PI / 180);
          //
          this.curX = this.curX - mx;
          this.curY = this.curY + my;
          //
          this.points.push({
            //
            x: this.curX,
            y: this.curY,
            rotation: this.curAngle,
            width: this.robotWidth * 3,
            height: this.robotLength * 3,
            offsetX: this.robotWidth * 3 / 2,
            offsetY: this.robotLength * 3 / 2,
            stroke: "#32cd32",
            strokeWidth: 5,
            cornerRadius: 5
          });
          //
          this.distance = 30;
          //
          l2 = this.distance * 3;
          x2 = l2 * Math.cos((180 - this.curAngle) * Math.PI / 180);
          y2 = l2 * Math.sin((180 - this.curAngle) * Math.PI / 180);
          //
          this.nextAx = x2;
          this.nextAy = y2 * -1;
          //
          this.getStrafe();
          //
          this.interimFloat = false;
          //
          break;
      }
      this.$store.commit("confirmStep", params);
      //
    },
    setInterimFloat: function(mousePos) {
      if (this.interimFloat) {
        this.interimFloat = false;
      } else {
        this.interimFloat = true;
      }
      //
      this.setStepPoint(mousePos);
    },
    getStepPoint: function() {
      //
      if (this.sideChosen) {
        switch (this.$store.getters.currentStep) {
          case MovementOptions.DRIVE:
            //
            this.getDrive();
            //
            break;
          case MovementOptions.TURN:
            //
            this.getTurn();
            //
            break;
          case MovementOptions.ARC:
            //
            this.getArc();
            //
            break;
          case MovementOptions.STRAFE:
            //
            this.getStrafe();
            //
            break;
        }
      }
    },
    setStepPoint: function(mousePos) {
      console.log("Click location--X: " + mousePos.x + ",Y: " + mousePos.y);
      //
      if (this.sideChosen) {
        switch (this.$store.getters.currentStep) {
          case MovementOptions.DRIVE:
            //
            var x1 =
              (this.robotLength / 2 + 5) *
              Math.cos((90 - this.curAngle) * Math.PI / 180);
            var y1 =
              (this.robotLength / 2 + 5) *
              Math.sin((90 - this.curAngle) * Math.PI / 180);
            //
            this.directionLine = {
              x: 0,
              y: 0,
              points: [
                this.curX /*+ this.nextX*/,
                this.curY /*+ this.nextY*/,
                this.curX /* + this.nextX*/ + x1 * 3,
                this.curY /* + this.nextY*/ - y1 * 3
              ],
              stroke: "orange",
              strokeWidth: 4,
              lineCap: "round"
            };
            //
            if (this.interimFloat) {
              //Fix Click Assist
              if (mousePos.x > this.curX) {
                var l1 = Math.sqrt(
                  Math.pow(this.curY - mousePos.y, 2) +
                    Math.pow(mousePos.x - this.curX, 2)
                );
                var a1 =
                  Math.atan(
                    (this.curY - mousePos.y) / (mousePos.x - this.curX)
                  ) *
                  180 /
                  Math.PI;
                var a2 = 90 - this.curAngle - a1;
                var l2 = l1 * Math.cos(a2 * Math.PI / 180);
                var x2 = l2 * Math.cos((90 - this.curAngle) * Math.PI / 180);
                var y2 = l2 * Math.sin((90 - this.curAngle) * Math.PI / 180);
                console.log(
                  "L2 components--Y: " +
                    Math.pow(this.curY - mousePos.y, 2) +
                    ", X: " +
                    Math.pow(mousePos.x - this.curX, 2)
                );
                console.log(
                  "New position--L1: " +
                    l1 +
                    ", A1: " +
                    a1 +
                    ", A2: " +
                    a2 +
                    ", L2: " +
                    l2 +
                    ", X2: " +
                    x2 +
                    ", Y2: " +
                    y2
                );
                //
                this.interimPoint = {
                  //
                  x: this.curX + x2,
                  y: this.curY - y2,
                  width: this.robotWidth * 3,
                  height: this.robotLength * 3,
                  offsetX: this.robotWidth * 3 / 2,
                  offsetY: this.robotLength * 3 / 2,
                  stroke: this.newColor,
                  strokeWidth: 5,
                  dash: [20, 20],
                  cornerRadius: 5,
                  rotation: this.curAngle,
                  lineCap: "round",
                  lineJoin: "round"
                };
                //
                this.interimLine = {
                  x: 0,
                  y: 0,
                  points: [
                    this.curX,
                    this.curY,
                    this.curX + x2,
                    this.curY - y2
                  ],
                  stroke: this.newColor,
                  strokeWidth: 4,
                  dash: [20, 20],
                  lineCap: "round",
                  lineJoin: "round"
                };
                //
                this.nextX = x2;
                this.nextY = y2 * -1;
                //
              } else {
                l1 = Math.sqrt(
                  Math.pow(this.curY - mousePos.y, 2) +
                    Math.pow(mousePos.x - this.curX, 2)
                );
                a1 =
                  Math.atan(
                    (this.curY - mousePos.y) / (mousePos.x - this.curX)
                  ) *
                  180 /
                  Math.PI;
                a2 = 90 - this.curAngle - a1;
                l2 = l1 * Math.cos(a2 * Math.PI / 180);
                x2 = l2 * Math.cos((90 - this.curAngle) * Math.PI / 180);
                y2 = l2 * Math.sin((90 - this.curAngle) * Math.PI / 180);
                //
                this.interimPoint = {
                  //
                  x: this.curX - x2,
                  y: this.curY + y2,
                  width: this.robotWidth * 3,
                  height: this.robotLength * 3,
                  offsetX: this.robotWidth * 3 / 2,
                  offsetY: this.robotLength * 3 / 2,
                  stroke: this.newColor,
                  strokeWidth: 5,
                  dash: [20, 20],
                  cornerRadius: 5,
                  rotation: this.curAngle,
                  lineCap: "round",
                  lineJoin: "round"
                };
                //
                this.interimLine = {
                  x: 0,
                  y: 0,
                  points: [
                    this.curX,
                    this.curY,
                    this.curX - x2,
                    this.curY + y2
                  ],
                  stroke: this.newColor,
                  strokeWidth: 4,
                  dash: [20, 20],
                  lineCap: "round",
                  lineJoin: "round"
                };
                l2 = l2 * -1;
                //
                this.nextX = x2 * -1;
                this.nextY = y2;
                //
              }
              //
              this.distance = Math.round(l2 / 3 * 5) / 5;
              //
            } else {
              this.getDrive();
            }
            //
            x1 =
              (this.robotLength / 2 + 5) *
              Math.cos((90 - this.curAngle) * Math.PI / 180);
            y1 =
              (this.robotLength / 2 + 5) *
              Math.sin((90 - this.curAngle) * Math.PI / 180);
            //
            console.log("X1: " + x1 + ", Y1: " + y1);
            //
            break;
          case MovementOptions.TURN:
            x1 =
              this.fieldDim *
              2 *
              Math.cos((90 - this.curAngle) * Math.PI / 180);
            y1 =
              this.fieldDim *
              2 *
              Math.sin((90 - this.curAngle) * Math.PI / 180);
            //
            this.directionLine = {
              x: 0,
              y: 0,
              points: [this.curX, this.curY, this.curX + x1, this.curY - y1],
              stroke: "orange",
              strokeWidth: 4,
              lineCap: "round"
            };
            //
            if (this.interimFloat) {
              //
              if (mousePos.x > this.curX) {
                this.nextAngle =
                  90 -
                  Math.atan(
                    (this.curY - mousePos.y) / (mousePos.x - this.curX)
                  ) *
                    180 /
                    Math.PI;
              } else {
                this.nextAngle =
                  -180 +
                  (90 -
                    Math.atan(
                      (this.curY - mousePos.y) / (mousePos.x - this.curX)
                    ) *
                      180 /
                      Math.PI);
              }
              //
              x2 =
                this.fieldDim *
                2 *
                Math.cos((90 - this.nextAngle) * Math.PI / 180);
              y2 =
                this.fieldDim *
                2 *
                Math.sin((90 - this.nextAngle) * Math.PI / 180);
              //
              this.interimLine = {
                x: 0,
                y: 0,
                points: [this.curX, this.curY, this.curX + x2, this.curY - y2],
                stroke: this.newColor,
                strokeWidth: 4,
                dash: [20, 20],
                lineCap: "round",
                lineJoin: "round"
              };
              //
              a1 = Math.round(this.nextAngle / 5) * 5 - this.curAngle;
              //
              if (Math.abs(a1) > 180) {
                if (a1 > 0) {
                  a1 = a1 - 360;
                } else {
                  a1 = a1 + 360;
                }
              }
              this.angle = a1;
              //
              this.interimPoint = {
                x: this.curX,
                y: this.curY,
                width: this.robotWidth * 3,
                height: this.robotLength * 3,
                offsetX: this.robotWidth * 3 / 2,
                offsetY: this.robotLength * 3 / 2,
                stroke: this.newColor,
                strokeWidth: 5,
                cornerRadius: 5,
                rotation: this.nextAngle,
                dash: [20, 20],
                lineCap: "round",
                lineJoin: "round"
              };
              //
              a2 = this.nextAngle - this.curAngle;
              if (Math.abs(a2) > 180) {
                if (a2 > 0) {
                  a2 = a2 - 360;
                } else {
                  a2 = a2 + 360;
                }
              }
              //
              if (a2 > 0) {
                this.interimArc = {
                  x: this.curX,
                  y: this.curY,
                  innerRadius: 70,
                  outerRadius: 70,
                  angle: a2,
                  rotation: this.curAngle - 90,
                  stroke: this.newColor,
                  strokeWidth: 4,
                  lineCap: "round",
                  lineJoin: "round"
                };
              } else {
                this.interimArc = {
                  x: this.curX,
                  y: this.curY,
                  innerRadius: 70,
                  outerRadius: 70,
                  angle: -a2,
                  rotation: this.nextAngle - 90,
                  stroke: this.newColor,
                  strokeWidth: 4,
                  lineCap: "round",
                  lineJoin: "round"
                };
              }
              //
            } else {
              this.getTurn();
            }
            //
            break;
          case MovementOptions.ARC:
            //
            if (this.interimFloat) {
              x1 =
                (this.robotLength / 2 + 5) *
                Math.cos((90 - this.curAngle) * Math.PI / 180);
              y1 =
                (this.robotLength / 2 + 5) *
                Math.sin((90 - this.curAngle) * Math.PI / 180);
              //
              this.directionLine = {
                x: 0,
                y: 0,
                points: [
                  this.curX /*+ this.nextX*/,
                  this.curY /*+ this.nextY*/,
                  this.curX /* + this.nextX*/ + x1 * 3,
                  this.curY /* + this.nextY*/ - y1 * 3
                ],
                stroke: "orange",
                strokeWidth: 4,
                lineCap: "round"
              };
              //
              this.interimLine = null;
              //
              var curA = this.curAngle;
              console.log("curA: " + curA);
              if (curA < -90) {
                curA += 180;
              } else if (curA > 90) {
                curA -= 180;
              }
              //
              var d1 = Math.sqrt(
                Math.pow(mousePos.x - this.curX, 2) +
                  Math.pow(this.curY - mousePos.y, 2)
              );
              a1 =
                Math.atan((this.curY - mousePos.y) / (mousePos.x - this.curX)) *
                180 /
                Math.PI;
              var r =
                d1 *
                Math.sin((90 - (90 - a1 - curA)) * Math.PI / 180) /
                Math.sin(2 * (90 - a1 - curA) * Math.PI / 180);
              x1 = r * Math.cos(-1 * curA * Math.PI / 180);
              y1 = r * Math.sin(-1 * curA * Math.PI / 180);
              var perp =
                (mousePos.x - this.curX) * Math.tan(curA * Math.PI / 180) +
                this.curY;
              var par =
                (this.curY - mousePos.y) /
                  Math.tan((90 - curA) * Math.PI / 180) +
                this.curX;
              if (a1 > 90 - curA) {
                a1 = a1 - 180;
              }
              //
              var start = curA - 90;
              //
              if (mousePos.x < par) {
                start = curA + 90;
              }
              //
              if (mousePos.x < this.curX) {
                x1 = x1 * -1;
                y1 = y1 * -1;
              }
              //
              if (r < 0) {
                r = r * -1;
              }
              //
              a2 = (90 - a1 - curA) * 2;
              if (a2 > 360) {
                a2 = a2 - 360;
              }
              //
              console.log(
                "D1: " +
                  d1 +
                  ", A1: " +
                  a1 +
                  ", R: " +
                  r +
                  ", X1: " +
                  x1 +
                  ", Y1: " +
                  y1 +
                  ", Perp: " +
                  perp +
                  ", Par: " +
                  par
              );
              //
              if (
                (mousePos.y > perp && mousePos.x > par) ||
                (mousePos.x < par && mousePos.y < perp)
              ) {
                this.interimArc = {
                  x: this.curX + x1,
                  y: this.curY - y1,
                  innerRadius: r,
                  outerRadius: r,
                  angle: 2 * (90 + a1 + curA),
                  rotation: start + (360 - 2 * (90 + a1 + curA)) - 90,
                  stroke: this.newColor,
                  dash: [20, 20],
                  strokeWidth: 4,
                  lineCap: "round",
                  lineJoin: "round"
                };
                console.log("Angle: " + 2 * (90 + a1 + curA));
                console.log(
                  "Rotation: " + (start + (360 - 2 * (90 + a1 + curA)))
                );
              } else if (mousePos.y < perp) {
                this.interimArc = {
                  x: this.curX + x1,
                  y: this.curY - y1,
                  innerRadius: r,
                  outerRadius: r,
                  angle: a2,
                  rotation: curA - 180,
                  stroke: this.newColor,
                  dash: [20, 20],
                  strokeWidth: 4,
                  lineCap: "round",
                  lineJoin: "round"
                };
                console.log("first");
              } else {
                this.interimArc = {
                  x: this.curX + x1,
                  y: this.curY - y1,
                  innerRadius: r,
                  outerRadius: r,
                  angle: a2,
                  rotation: curA,
                  dash: [20, 20],
                  stroke: this.newColor,
                  strokeWidth: 4,
                  lineCap: "round",
                  lineJoin: "round"
                };
                console.log("Fourth");
              }
              //
              this.interimPoint = {
                x: mousePos.x,
                y: mousePos.y,
                width: this.robotWidth * 3,
                height: this.robotLength * 3,
                offsetX: this.robotWidth * 3 / 2,
                offsetY: this.robotLength * 3 / 2,
                stroke: this.newColor,
                strokeWidth: 5,
                cornerRadius: 5,
                rotation: this.curAngle - (curA + (a1 + 90)) * 2,
                dash: [20, 20],
                lineCap: "round",
                lineJoin: "round"
              };
              //
              var dis = Math.sqrt(
                Math.pow(this.curY - mousePos.y, 2) +
                  Math.pow(mousePos.x - this.curX, 2)
              );
              this.distance = Math.round(dis / 3 * 5) / 5;
              var ang =
                Math.asin((this.curY - mousePos.y) / dis) * 180 / Math.PI - 90;
              if (mousePos.x > this.curX) {
                ang = ang * -1;
              }
              ang -= this.curAngle;
              if (ang < -180) {
                ang += 360;
              } else if (ang > 180) {
                ang -= 360;
              }
              this.angle = Math.round(ang / 5) * 5;
              //
            } else {
              //
              console.log("It should show it.");
              this.getArc();
              //
            }
            //
            break;
          case MovementOptions.STRAFE:
            //
            x1 =
              (this.robotLength / 2 + 5) *
              Math.cos((90 - this.curAngle) * Math.PI / 180);
            y1 =
              (this.robotLength / 2 + 5) *
              Math.sin((90 - this.curAngle) * Math.PI / 180);
            //
            this.directionLine = {
              x: 0,
              y: 0,
              points: [
                this.curX /*+ this.nextX*/,
                this.curY /*+ this.nextY*/,
                this.curX /* + this.nextX*/ + x1 * 3,
                this.curY /* + this.nextY*/ - y1 * 3
              ],
              stroke: "orange",
              strokeWidth: 4,
              lineCap: "round"
            };
            //
            if (this.interimFloat) {
              //Fix Click Assist
              if (mousePos.x > this.curX) {
                l1 = Math.sqrt(
                  Math.pow(this.curY - mousePos.y, 2) +
                    Math.pow(mousePos.x - this.curX, 2)
                );
                a1 =
                  Math.atan(
                    (this.curY - mousePos.y) / (mousePos.x - this.curX)
                  ) *
                  180 /
                  Math.PI;
                a2 = 180 - this.curAngle - a1;
                l2 = l1 * Math.cos(a2 * Math.PI / 180);
                x2 = l2 * Math.cos((180 - this.curAngle) * Math.PI / 180);
                y2 = l2 * Math.sin((180 - this.curAngle) * Math.PI / 180);
                console.log(
                  "L2 components--Y: " +
                    Math.pow(this.curY - mousePos.y, 2) +
                    ", X: " +
                    Math.pow(mousePos.x - this.curX, 2)
                );
                console.log(
                  "New position--L1: " +
                    l1 +
                    ", A1: " +
                    a1 +
                    ", A2: " +
                    a2 +
                    ", L2: " +
                    l2 +
                    ", X2: " +
                    x2 +
                    ", Y2: " +
                    y2
                );
                //
                this.interimPoint = {
                  //
                  x: this.curX + x2,
                  y: this.curY - y2,
                  width: this.robotWidth * 3,
                  height: this.robotLength * 3,
                  offsetX: this.robotWidth * 3 / 2,
                  offsetY: this.robotLength * 3 / 2,
                  stroke: this.newColor,
                  strokeWidth: 5,
                  dash: [20, 20],
                  cornerRadius: 5,
                  rotation: this.curAngle,
                  lineCap: "round",
                  lineJoin: "round"
                };
                //
                this.interimLine = {
                  x: 0,
                  y: 0,
                  points: [
                    this.curX,
                    this.curY,
                    this.curX + x2,
                    this.curY - y2
                  ],
                  stroke: this.newColor,
                  strokeWidth: 4,
                  dash: [20, 20],
                  lineCap: "round",
                  lineJoin: "round"
                };
                //
                this.nextAx = x2;
                this.nextAy = y2 * -1;
                //
              } else {
                l1 = Math.sqrt(
                  Math.pow(this.curY - mousePos.y, 2) +
                    Math.pow(mousePos.x - this.curX, 2)
                );
                a1 =
                  Math.atan(
                    (this.curY - mousePos.y) / (mousePos.x - this.curX)
                  ) *
                  180 /
                  Math.PI;
                a2 = 180 - this.curAngle - a1;
                l2 = l1 * Math.cos(a2 * Math.PI / 180);
                x2 = l2 * Math.cos((180 - this.curAngle) * Math.PI / 180);
                y2 = l2 * Math.sin((180 - this.curAngle) * Math.PI / 180);
                //
                this.interimPoint = {
                  //
                  x: this.curX - x2,
                  y: this.curY + y2,
                  width: this.robotWidth * 3,
                  height: this.robotLength * 3,
                  offsetX: this.robotWidth * 3 / 2,
                  offsetY: this.robotLength * 3 / 2,
                  stroke: this.newColor,
                  strokeWidth: 5,
                  dash: [20, 20],
                  cornerRadius: 5,
                  rotation: this.curAngle,
                  lineCap: "round",
                  lineJoin: "round"
                };
                //
                this.interimLine = {
                  x: 0,
                  y: 0,
                  points: [
                    this.curX,
                    this.curY,
                    this.curX - x2,
                    this.curY + y2
                  ],
                  stroke: this.newColor,
                  strokeWidth: 4,
                  dash: [20, 20],
                  lineCap: "round",
                  lineJoin: "round"
                };
                l2 = l2 * -1;
                //
                this.nextAx = x2 * -1;
                this.nextAy = y2;
                //
              }
              //
              this.distance = Math.round(l2 / 3 * 5) / -5;
              //
            } else {
              this.getStrafe();
            }
            break;
        }
      }
    },
    getDrive: function() {
      var x1 =
        (this.robotLength / 2 + 5) *
        Math.cos((90 - this.curAngle) * Math.PI / 180);
      var y1 =
        (this.robotLength / 2 + 5) *
        Math.sin((90 - this.curAngle) * Math.PI / 180);
      //
      this.directionLine = {
        x: 0,
        y: 0,
        points: [
          this.curX /*+ this.nextX*/,
          this.curY /*+ this.nextY*/,
          this.curX /* + this.nextX*/ + x1 * 3,
          this.curY /* + this.nextY*/ - y1 * 3
        ],
        stroke: "orange",
        strokeWidth: 4,
        lineCap: "round"
      };
      //
      this.interimArc = {
        stroke: ""
      };
      //
      var l2 = this.distance * 3;
      var x2 = l2 * Math.cos((90 - this.curAngle) * Math.PI / 180);
      var y2 = l2 * Math.sin((90 - this.curAngle) * Math.PI / 180);
      //
      this.nextX = x2;
      this.nextY = y2 * -1;
      //
      this.interimPoint = {
        //
        x: this.curX + x2,
        y: this.curY - y2,
        width: this.robotWidth * 3,
        height: this.robotLength * 3,
        offsetX: this.robotWidth * 3 / 2,
        offsetY: this.robotLength * 3 / 2,
        stroke: this.newColor,
        strokeWidth: 5,
        cornerRadius: 5,
        rotation: this.curAngle,
        lineCap: "round",
        lineJoin: "round"
      };
      //
      this.interimLine = {
        x: 0,
        y: 0,
        points: [this.curX, this.curY, this.curX + x2, this.curY - y2],
        stroke: this.newColor,
        strokeWidth: 4,
        lineCap: "round",
        lineJoin: "round"
      };
      //
      this.interimFloat = false;
    },
    getTurn: function() {
      var x1 =
        this.fieldDim * 2 * Math.cos((90 - this.curAngle) * Math.PI / 180);
      var y1 =
        this.fieldDim * 2 * Math.sin((90 - this.curAngle) * Math.PI / 180);
      //
      this.directionLine = {
        x: 0,
        y: 0,
        points: [this.curX, this.curY, this.curX + x1, this.curY - y1],
        stroke: "orange",
        strokeWidth: 4,
        lineCap: "round"
      };
      //
      this.nextAngle = this.curAngle + parseFloat(this.angle);
      //
      var x2 =
        this.fieldDim * 2 * Math.cos((90 - this.nextAngle) * Math.PI / 180);
      var y2 =
        this.fieldDim * 2 * Math.sin((90 - this.nextAngle) * Math.PI / 180);
      //
      this.interimLine = {
        x: 0,
        y: 0,
        points: [this.curX, this.curY, this.curX + x2, this.curY - y2],
        stroke: this.newColor,
        strokeWidth: 4,
        lineCap: "round",
        lineJoin: "round"
      };
      //
      this.interimPoint = {
        x: this.curX,
        y: this.curY,
        width: this.robotWidth * 3,
        height: this.robotLength * 3,
        offsetX: this.robotWidth * 3 / 2,
        offsetY: this.robotLength * 3 / 2,
        stroke: this.newColor,
        strokeWidth: 5,
        cornerRadius: 5,
        rotation: this.nextAngle,
        lineCap: "round",
        lineJoin: "round"
      };
      //
      if (this.angle > 0) {
        this.interimArc = {
          x: this.curX,
          y: this.curY,
          innerRadius: 70,
          outerRadius: 70,
          angle: this.angle,
          rotation: this.curAngle - 90,
          stroke: this.newColor,
          strokeWidth: 4,
          lineCap: "round",
          lineJoin: "round"
        };
      } else {
        this.interimArc = {
          x: this.curX,
          y: this.curY,
          innerRadius: 70,
          outerRadius: 70,
          angle: -this.angle,
          rotation: this.nextAngle - 90,
          stroke: this.newColor,
          strokeWidth: 4,
          lineCap: "round",
          lineJoin: "round"
        };
      }
      //
      this.interimFloat = false;
    },
    getArc: function() {
      //
      var ang = Number(this.angle);
      if (ang / 90 == Math.round(ang / 90)) {
        ang += 0.1;
      }
      //
      this.nextAy =
        this.distance *
        3 *
        Math.cos((Number(ang) + this.curAngle) * Math.PI / 180);
      this.nextAx =
        this.distance *
        3 *
        Math.sin((Number(ang) + this.curAngle) * Math.PI / 180);
      //
      console.log("angle: " + (Number(ang) + this.curAngle));
      //
      console.log(
        "ayL: " +
          this.distance * 3 * Math.cos((ang + this.curAngle) * Math.PI / 180)
      );
      console.log(
        "axL: " +
          this.distance * 3 * Math.sin((ang + this.curAngle) * Math.PI / 180)
      );
      //
      if (this.nextAx == 0) {
        this.nextAx = 0.01;
      }
      if (this.nextAy == 0) {
        this.nextAy = 0.01;
      }
      //
      this.nextAx = this.curX + this.nextAx;
      this.nextAy = this.curY - this.nextAy;
      //
      var x1 =
        (this.robotLength / 2 + 5) *
        Math.cos((90 - this.curAngle) * Math.PI / 180);
      var y1 =
        (this.robotLength / 2 + 5) *
        Math.sin((90 - this.curAngle) * Math.PI / 180);
      //
      this.directionLine = {
        x: 0,
        y: 0,
        points: [this.curX, this.curY, this.curX + x1 * 3, this.curY - y1 * 3],
        stroke: "orange",
        strokeWidth: 4,
        lineCap: "round"
      };
      //
      this.interimLine = null;
      //
      var curA = this.curAngle;
      console.log("curA: " + curA);
      if (curA < -90) {
        curA += 180;
      } else if (curA > 90) {
        curA -= 180;
      }
      //
      var d1 = Math.sqrt(
        Math.pow(this.nextAx - this.curX, 2) +
          Math.pow(this.curY - this.nextAy, 2)
      );
      var a1 =
        Math.atan((this.curY - this.nextAy) / (this.nextAx - this.curX)) *
        180 /
        Math.PI;
      var r =
        d1 *
        Math.sin((90 - (90 - a1 - curA)) * Math.PI / 180) /
        Math.sin(2 * (90 - a1 - curA) * Math.PI / 180);
      x1 = r * Math.cos(-1 * curA * Math.PI / 180);
      y1 = r * Math.sin(-1 * curA * Math.PI / 180);
      var perp =
        (this.nextAx - this.curX) * Math.tan(curA * Math.PI / 180) + this.curY;
      var par =
        (this.curY - this.nextAy) / Math.tan((90 - curA) * Math.PI / 180) +
        this.curX;
      if (a1 > 90 - curA) {
        a1 = a1 - 180;
      }
      //
      var start = curA - 90;
      //
      if (this.nextAx < par) {
        start = curA + 90;
      }
      //
      if (this.nextAx < this.curX) {
        x1 = x1 * -1;
        y1 = y1 * -1;
      }
      //
      if (r < 0) {
        r = r * -1;
      }
      //
      var a2 = (90 - a1 - curA) * 2;
      if (a2 > 360) {
        a2 = a2 - 360;
      }
      //
      console.log(
        "D1: " +
          d1 +
          ", A1: " +
          a1 +
          ", R: " +
          r +
          ", X1: " +
          x1 +
          ", Y1: " +
          y1 +
          ", Perp: " +
          perp +
          ", Par: " +
          par
      );
      //
      if (
        (this.nextAy > perp && this.nextAx > par) ||
        (this.nextAx < par && this.nextAy < perp)
      ) {
        this.interimArc = {
          x: this.curX + x1,
          y: this.curY - y1,
          innerRadius: r,
          outerRadius: r,
          angle: 2 * (90 + a1 + curA),
          rotation: start + (360 - 2 * (90 + a1 + curA)) - 90,
          stroke: this.newColor,
          strokeWidth: 4,
          lineCap: "round",
          lineJoin: "round"
        };
        console.log("Angle: " + 2 * (90 + a1 + curA));
        console.log("Rotation: " + (start + (360 - 2 * (90 + a1 + curA))));
      } else if (this.nextAy <= perp) {
        this.interimArc = {
          x: this.curX + x1,
          y: this.curY - y1,
          innerRadius: r,
          outerRadius: r,
          angle: a2,
          rotation: curA - 180,
          stroke: this.newColor,
          strokeWidth: 4,
          lineCap: "round",
          lineJoin: "round"
        };
        console.log("first");
      } else {
        this.interimArc = {
          x: this.curX + x1,
          y: this.curY - y1,
          innerRadius: r,
          outerRadius: r,
          angle: a2,
          rotation: curA,
          stroke: this.newColor,
          strokeWidth: 4,
          lineCap: "round",
          lineJoin: "round"
        };
        console.log("Fourth");
      }
      //
      this.interimPoint = {
        x: this.nextAx,
        y: this.nextAy,
        width: this.robotWidth * 3,
        height: this.robotLength * 3,
        offsetX: this.robotWidth * 3 / 2,
        offsetY: this.robotLength * 3 / 2,
        stroke: this.newColor,
        strokeWidth: 5,
        cornerRadius: 5,
        rotation: this.curAngle - (curA + (a1 + 90)) * 2,
        lineCap: "round",
        lineJoin: "round"
      };
      //
      console.log("Ay: " + this.nextAy + " , Ax: " + this.nextAx);
      //
    },
    getStrafe: function() {
      var x1 =
        (this.robotLength / 2 + 5) *
        Math.cos((90 - this.curAngle) * Math.PI / 180);
      var y1 =
        (this.robotLength / 2 + 5) *
        Math.sin((90 - this.curAngle) * Math.PI / 180);
      //
      this.directionLine = {
        x: 0,
        y: 0,
        points: [
          this.curX /*+ this.nextX*/,
          this.curY /*+ this.nextY*/,
          this.curX /* + this.nextX*/ + x1 * 3,
          this.curY /* + this.nextY*/ - y1 * 3
        ],
        stroke: "orange",
        strokeWidth: 4,
        lineCap: "round"
      };
      //
      this.interimArc = {
        stroke: ""
      };
      //
      var l2 = this.distance * 3;
      var x2 = l2 * Math.cos((180 - this.curAngle) * Math.PI / 180);
      var y2 = l2 * Math.sin((180 - this.curAngle) * Math.PI / 180);
      x2 = x2 * -1;
      y2 = y2 * -1;
      //
      this.nextAx = x2;
      this.nextAy = y2 * -1;
      //
      this.interimPoint = {
        //
        x: this.curX + x2,
        y: this.curY - y2,
        width: this.robotWidth * 3,
        height: this.robotLength * 3,
        offsetX: this.robotWidth * 3 / 2,
        offsetY: this.robotLength * 3 / 2,
        stroke: this.newColor,
        strokeWidth: 5,
        cornerRadius: 5,
        rotation: this.curAngle,
        lineCap: "round",
        lineJoin: "round"
      };
      //
      this.interimLine = {
        x: 0,
        y: 0,
        points: [this.curX, this.curY, this.curX + x2, this.curY - y2],
        stroke: this.newColor,
        strokeWidth: 4,
        lineCap: "round",
        lineJoin: "round"
      };
      //
      this.interimFloat = false;
    },
    interimSet: function() {
      this.interimPoint = {
        //
        x: this.curX + this.nextX,
        y: this.curY + this.nextY,
        width: this.robotWidth * 3,
        height: this.robotLength * 3,
        offsetX: this.robotWidth * 3 / 2,
        offsetY: this.robotLength * 3 / 2,
        stroke: this.newColor,
        strokeWidth: 5,
        cornerRadius: 5,
        rotation: this.curAngle,
        lineCap: "round",
        lineJoin: "round"
      };
      //
      this.interimLine = {
        x: 0,
        y: 0,
        points: [
          this.curX,
          this.curY,
          this.curX + this.nextX,
          this.curY + this.nextY
        ],
        stroke: this.newColor,
        strokeWidth: 4,
        lineCap: "round",
        lineJoin: "round"
      };
    }
  },
  created() {
    //
    if (this.$store.getters.chassis == null) {
      this.$router.push("/");
    }
    //
  },
  data: () => ({
    presets: ["Gear ratio: 20", "Gear ratio: 40", "Gear ratio: 60", "Custom"],
    starts: ["top left", "top right", "bottom left", "bottom right", "Custom"],
    dialog: false,
    drive: MovementOptions.DRIVE,
    turn: MovementOptions.TURN,
    arc: MovementOptions.ARC,
    strafe: MovementOptions.STRAFE,
    angle: 45,
    direction: "right",
    distance: 30,
    speed: 0.2,
    pxperinch: 3,
    robotWidth: 16,
    robotLength: 18,
    newColor: "white",
    opencustoms: false,
    stepInProgress: true,
    interimPoint: null,
    interimLine: null,
    interimArc: null,
    directionLine: null,
    field: require("@/assets/Pictures/field2.jpg"),
    fieldDim: 423,
    curX: 268,
    curY: 159,
    nextX: 0,
    nextY: 0,
    nextAx: 0,
    nextAy: 0,
    curAngle: 45,
    nextAngle: 0,
    interimFloat: true,
    clickAssist: false,
    startingPos: {},
    starpos: "Starting Side",
    laststarpos: "Staring Side",
    sideChosen: false,
    deleteWarning: false,
    inputAlert: true,
    topLeft: {
      x: 161,
      y: 159,
      rotation: -45
    },
    topRight: {
      x: 268,
      y: 159,
      rotation: 45
    },
    bottomLeft: {
      x: 163,
      y: 263,
      rotation: -135
    },
    bottomRight: {
      x: 267,
      y: 263,
      rotation: 135
    },
    points: [],
    arcs: [],
    lines: [
      {
        points: [147, 240, 200, 200]
      }
    ],
    stepColors: [
      "#9d00ff",
      "#b700ff",
      "#cc00ff",
      "#ff00ff",
      "#ff00dd",
      "#ff00ff",
      "#cc00ff",
      "#b700ff"
    ],
    currentColor: 0
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

.bkgd {
  margin: 0%;
}

input:disabled {
  background-color: red;
}

.interface {
  border-radius: 5px;
  position: absolute;
  margin: 3%;
  width: 94%;
  height: 80%;
  top: 3%;
}

.trash {
  position: absolute;
  top: 30px;
  background-color: yellow;
}

.chassischoice {
  font-family: "Montserrat", sans-serif;
  color: white;
  font-size: 2em;
  position: absolute;
  left: 2%;
  top: 2%;
}

#pos-name {
  position: absolute;
  left: 2%;
  top: 12%;
  width: 16.5%;
  height: 5%;
}

#in-name {
  padding: 3px;
  color: black;
  font-family: "Montserrat", sans-serif;
  border-right-width: 1px;
  text-align: center;
}

#pos-num {
  position: absolute;
  left: 19.5%;
  top: 12%;
  width: 15.5%;
  height: 5%;
}

#in-num {
  padding: 3px;
  font-family: "Montserrat", sans-serif;
  border-left-width: 1px;
  text-align: center;
}

#pos-preset {
  position: absolute;
  left: 39.5%;
  width: 15%;
  height: 8%;
  top: 12%;
}

#pos-start {
  position: absolute;
  left: 55.5%;
  width: 15%;
  height: 8%;
  top: 12%;
}

#pos-dims {
  position: absolute;
  left: 80%;
  top: 12%;
}

#in-width {
  padding-left: 4px;
  margin: 5px;
  margin-top: 0;
  font-family: "Montserrat", sans-serif;
}

#in-length {
  padding-left: 4px;
  margin: 5px;
  font-family: "Montserrat", sans-serif;
}

#in-dist {
  width: 85%;
  padding-left: 4px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  float: left;
  left: 5%;
  top: -10px;
  position: relative;
  margin-right: 5%;
  margin-bottom: 3%;
}

.amount {
  background-color: white;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  width: 5%;
  top: -10px;
  position: relative;
  text-align: right;
  padding-right: 4px;
  float: left;
}

.dropdown {
  background-color: white;
  color: black;
  width: 100%;
  padding: 10px;
  text-align-last: center;
  border-radius: 4px;
  font-family: "Montserrat", sans-serif;
}

.colors {
  background-color: white;
  border-radius: 4px;
}

.popup {
  background-color: lightgray; /*rgb(100,230,209);*/
}

.popup-text {
  text-align: left;
}

.popup-inputs {
  background-color: white;
  border: 0.5px solid black;
  border-radius: 4px;
  text-align: left;
  margin: 3px;
  padding: 1px;
  padding-left: 3px;
}

.popup-button {
  background-color: lightgray; /*rgb(100,230,209);*/
}

#field {
  position: absolute;
  left: 2%;
  top: 20%;
  border-radius: 4px;
}

.button {
  width: 10%;
  height: 7%;
  top: 25%;
  background-color: white;
  position: absolute;
}

#tog-drive {
  left: 40%;
  position: absolute;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}

#tog-turn {
  left: 50%;
}

#tog-fancy {
  left: 60%;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}

#disable {
    position: absolute;
    left: 105%;
    top: 35%;
    width: 20%;
}

.active {
  background-color: lightgray;
}

.label {
  color: white;
  font-family: "Montserrat", sans-serif;
}

.whatever_you_want {
  overflow-y: auto;
}

#toggle {
  position: absolute;
  top: 30%;
  width: 30%;
  left: 40%;
}

#stepinputs {
  position: absolute;
  top: 37%;
  width: 30%;
  left: 40%;
}

#listofsteps {
  position: absolute;
  left: 75%;
  top: 30%;
  width: 25%;
  height: 60%;
  overflow: auto;
  background-color: gray;
  border-radius: 4px;
  /*border: 0.5px solid black;*/
}

#step-title {
  padding: 10px;
}

#generate {
  position: absolute;
  top: 90%;
  left: 39.2%;
  width: 30%;
}

html,
body {
  height: 100%;
  margin: 0;
}

hr {
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  display: block;
  border: 2px solid rgb(100, 230, 209);
  border-radius: 2px;
}

#autostep {
  height: 20%;
  background-color: white;
  border: 0.5px solid black;
  padding-bottom: 70px;
  border-top-width: 0;
}

.tooltip {
  display: inline-block;
  border-bottom: 1px dotted black;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 100%;
  height: auto;
  background-color: white;
  color: black;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
  top: calc(100% + 15px);
  left: 50%;
  margin-left: -50%;
  font-family: "Montserrat", sans-serif;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}

.tooltip .tooltiptext::after {
  content: " ";
  position: absolute;
  bottom: 100%; /* At the top of the tooltip */
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent white transparent;
}

.hover-info {
  color: black;
  margin: 10px;
  background-color: white;
}
</style>
