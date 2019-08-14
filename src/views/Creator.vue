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
                <span class="tooltiptext">Naming Info<br/><hr/><p class="hover-info">This is the name that will appear in your driver station app.</p></span>
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
                <select class="dropdown">
                    <option disabled selected>Starting Side</option>
                    <option v-for="(start, index) in starts" v-bind:key="index">{{start}}</option>
                </select>
                <span class="tooltiptext">Side Info<br/><hr/><p class="hover-info">Used for the field display. This won't affect the code.</p></span>
            </div>
            <div class="tooltip" id="pos-dims">
                <input type="number" placeholder="robot width" id="in-width" class="colors" v-model="robotWidth"/> 
                <div id="flourish" color="color"></div>
                <input type="number" placeholder="robot length" id="in-length" class="colors" v-model="robotLength"/>
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
                    <button block v-bind:class="{active: $store.getters.isCurrentStepArc}" v-if=$store.getters.isArcingAvail v-on:click="newStep(arc)" class="button" id="tog-fancy">Arc</button>
                    <button block v-bind:class="{active: $store.getters.isCurrentStepStrafe}" v-if=!$store.getters.isArcingAvail v-on:click="newStep(strafe)" class="button" id="tog-fancy">Strafe</button>
            <!-- #endregion -->
            <!-- #region inputs -->
                <div id="stepinputs">
                    <div v-if="($store.getters.isCurrentStepTurn || $store.getters.isCurrentStepArc)" sm12>
                        <p class="label">Angle:</p>
                        <input type="number" v-model="angle" @change="getStepPoint" placeholder="angle" step="5" min="-360" max="360" class="colors" id="in-dist"/>
                        <div class="amount">label</div>
                    </div>
                    <div v-if="($store.getters.isCurrentStepStrafe)" sm12>
                        <p class="label">Direction:</p>
                        <input v-model="direction" placeholder="direction" step="1" min="1" max="4" class="colors" id="in-dist"/>
                    </div>
                    <div v-if="($store.getters.isCurrentStepMove || $store.getters.isCurrentStepArc || $store.getters.isCurrentStepStrafe)" sm12>
                        <p class="label">Distance:</p>
                        <input type="number" v-model="distance" @change="getStepPoint" placeholder="distance" step="0.2" class="colors" id="in-dist"/>
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
                        <div id="step-title" sm12>
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
        <div sm4>
            <v-btn id="generate" v-on:click="setGenerateVisible()">Generate</v-btn>
        </div>
    </div>
</div>
</template>

<script>
import { MovementOptions } from "@/store/steps";
import DrawLines from "@/components/DrawLines"
export default {
  name: "Creator",
  components: {DrawLines},
  methods: {
    newStep: function(step) {
      this.$store.commit("setCurrentStep", step);
      //
      this.interimFloat = false;
      //
      if(step == MovementOptions.DRIVE){
          //this.interimArc = null;
          console.log("test");
      }
      //
      this.getStepPoint();
      //
    },
    setGenerateVisible: function(){
        this.$store.commit("setGenerateVisible");
        this.$router.push('/Generate');
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
                //#region
                //
                this.lines.push({
                    x: 0,
                    y: 0,
                    points: [this.curX, this.curY, this.curX + this.nextX, this.curY + this.nextY],
                    stroke: this.stepColors[this.currentColor],
                    strokeWidth: 4,
                    lineCap: 'round'
                });
                //
                this.points.pop();
                //#endregion
                var x1 = (this.robotLength / 2 + 5) * Math.cos((90 - this.curAngle) * Math.PI / 180);
                var y1 = (this.robotLength / 2 + 5) * Math.sin((90 - this.curAngle) * Math.PI / 180);
                //
                this.directionLine = {
                    x: 0,
                    y: 0,
                    points: [this.curX + this.nextX, this.curY + this.nextY, this.curX + this.nextX + x1 * 3, this.curY + this.nextY - y1 * 3],
                    stroke: 'orange',
                    strokeWidth: 4,
                    lineCap: 'round'
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
                if(this.currentColor > this.stepColors.length - 2){
                    this.currentColor = 0;
                }else{
                    this.currentColor++;
                }
                //
                var mx = this.distance * 3 * Math.cos((90 - this.curAngle) * Math.PI / 180);
                var my = this.distance * 3 * Math.sin((90 - this.curAngle) * Math.PI / 180);
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
                    stroke: '#32cd32',
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
                console.log("x2: " + x2 + ", y2: " + y2);
                //
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
                    lineCap: 'round',
                    lineJoin: 'round'
                };
                //
                this.interimLine = {
                    x: 0,
                    y: 0,
                    points: [this.curX, this.curY, this.curX + x2, this.curY - y2],
                    stroke: this.newColor,
                    strokeWidth: 4,
                    lineCap: 'round',
                    lineJoin: 'round'
                };
                //
                console.log("You made it!");
                //
                this.interimFloat = false;
                //
            break;
            case MovementOptions.TURN:
                params = {
                    angle: this.$data.angle,
                    speed: this.$data.speed
                };
                //
                if(this.nextAngle > 0){
                    this.arcs.push({
                        x: this.curX,
                        y: this.curY,
                        innerRadius: 0,
                        outerRadius: 70,
                        angle: this.angle,
                        rotation: (this.curAngle - 90),
                        stroke: this.stepColors[this.currentColor],
                        strokeWidth: 4,
                        lineCap: 'round',
                        lineJoin: 'round'
                    });
                }else{
                    this.arcs.push({
                        x: this.curX,
                        y: this.curY,
                        innerRadius: 0,
                        outerRadius: 70,
                        angle: this.angle * -1,
                        rotation: (Math.round(this.nextAngle / 5) * 5 - 90),
                        stroke: this.stepColors[this.currentColor],
                        strokeWidth: 4,
                        lineCap: 'round',
                        lineJoin: 'round'
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
                if(this.currentColor > this.stepColors.length - 2){
                    this.currentColor = 0;
                }else{
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
                    stroke: '#32cd32',
                    strokeWidth: 5,
                    cornerRadius: 5
                });
                //
                this.curAngle = Math.round(this.nextAngle / 5) * 5;
                this.angle = 45;
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
                var x1 = (this.fieldDim * 2) * Math.cos((90 - this.curAngle) * Math.PI / 180);
                var y1 = (this.fieldDim * 2) * Math.sin((90 - this.curAngle) * Math.PI / 180);
                //
                this.directionLine = {
                    x: 0,
                    y: 0,
                    points: [this.curX, this.curY, this.curX + x1, this.curY - y1],
                    stroke: 'orange',
                    strokeWidth: 4,
                    lineCap: 'round'
                };
                //
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
      //
      this.interimPoint = null;
      this.interimLine = null;
      this.interimArc = null;
    },
    setInterimFloat: function(mousePos){
        //
        //if(!this.clickAssist){
            if(this.interimFloat){
                this.interimFloat = false;
            }else{
                this.interimFloat = true;
            }
            //this.clickAssist = true;
        //}
        //
        this.setStepPoint(mousePos);
    },
    getStepPoint: function(){
        //
        switch (this.$store.getters.currentStep) {
            case MovementOptions.DRIVE:
                //
                var x1 = (this.robotLength / 2 + 5) * Math.cos((90 - this.curAngle) * Math.PI / 180);
                var y1 = (this.robotLength / 2 + 5) * Math.sin((90 - this.curAngle) * Math.PI / 180);
                //
                this.directionLine = {
                    x: 0,
                    y: 0,
                    points: [this.curX /*+ this.nextX*/, this.curY /*+ this.nextY*/, this.curX/* + this.nextX*/ + x1 * 3, this.curY/* + this.nextY*/ - y1 * 3],
                    stroke: 'orange',
                    strokeWidth: 4,
                    lineCap: 'round'
                };
                //
                this.interimArc = {
                    stroke: ''
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
                    lineCap: 'round',
                    lineJoin: 'round'
                };
                //
                this.interimLine = {
                    x: 0,
                    y: 0,
                    points: [this.curX, this.curY, this.curX + x2, this.curY - y2],
                    stroke: this.newColor,
                    strokeWidth: 4,
                    lineCap: 'round',
                    lineJoin: 'round'
                };
                //
                this.interimFloat = false;
                //
            break;
            case MovementOptions.TURN:
                //
                var x1 = (this.fieldDim * 2) * Math.cos((90 - this.curAngle) * Math.PI / 180);
                var y1 = (this.fieldDim * 2) * Math.sin((90 - this.curAngle) * Math.PI / 180);
                //
                this.directionLine = {
                    x: 0,
                    y: 0,
                    points: [this.curX, this.curY, this.curX + x1, this.curY - y1],
                    stroke: 'orange',
                    strokeWidth: 4,
                    lineCap: 'round'
                };
                //
                this.nextAngle = this.curAngle + parseFloat(this.angle);
                //
                var x2 = (this.fieldDim * 2) * Math.cos((90 - this.nextAngle) * Math.PI / 180);
                var y2 = (this.fieldDim * 2) * Math.sin((90 - this.nextAngle) * Math.PI / 180);
                //
                this.interimLine = {
                    x: 0,
                    y: 0,
                    points: [this.curX, this.curY, this.curX + x2, this.curY - y2],
                    stroke: this.newColor,
                    strokeWidth: 4,
                    lineCap: 'round',
                    lineJoin: 'round'
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
                    lineCap: 'round',
                    lineJoin: 'round'
                }
                //
                if(this.angle > 0){
                    this.interimArc = {
                        x: this.curX,
                        y: this.curY,
                        innerRadius: 70,
                        outerRadius: 70,
                        angle: this.angle,
                        rotation: this.curAngle - 90,
                        stroke: this.newColor,
                        strokeWidth: 4,
                        lineCap: 'round',
                        lineJoin: 'round'
                    }
                }else{
                    this.interimArc = {
                        x: this.curX,
                        y: this.curY,
                        innerRadius: 70,
                        outerRadius: 70,
                        angle: -this.angle,
                        rotation: (this.nextAngle - 90),
                        stroke: this.newColor,
                        strokeWidth: 4,
                        lineCap: 'round',
                        lineJoin: 'round'
                    }
                    console.log("Rotation: " + (this.curAngle + this.nextAngle - 90));
                }
                //
                this.interimFloat = false;
                //
            break;
            case MovementOptions.ARC:
                //
            break;
            case MovementOptions.STRAFE:
                //
            break;
        }
    },
    setStepPoint: function(mousePos){
        console.log("Click location--X: " + mousePos.x + ",Y: " + mousePos.y);
        //
        /*
        this.interimArc = {
            x: this.points[0].x - 70,
            y: this.points[0].y,
            innerRadius: 70,
            outerRadius: 70,
            angle: 180,
            stroke: 'black',
            strokeWidth: 4,
            lineJoin: 'round'
        }
        */
        switch (this.$store.getters.currentStep) {
            case MovementOptions.DRIVE:
                //
                var x1 = (this.robotLength / 2 + 5) * Math.cos((90 - this.curAngle) * Math.PI / 180);
                var y1 = (this.robotLength / 2 + 5) * Math.sin((90 - this.curAngle) * Math.PI / 180);
                //
                this.directionLine = {
                    x: 0,
                    y: 0,
                    points: [this.curX /*+ this.nextX*/, this.curY /*+ this.nextY*/, this.curX/* + this.nextX*/ + x1 * 3, this.curY/* + this.nextY*/ - y1 * 3],
                    stroke: 'orange',
                    strokeWidth: 4,
                    lineCap: 'round'
                };
                //
                if(this.interimFloat){
                    //Fix Click Assist
                    if(mousePos.x > this.curX){
                        var l1 = Math.sqrt(Math.pow(this.curY - mousePos.y, 2) + Math.pow(mousePos.x - this.curX, 2));
                        var a1 = Math.atan((this.curY - mousePos.y) / (mousePos.x - this.curX)) * 180 / Math.PI;
                        var a2 = 90 - this.curAngle - a1;
                        var l2 = l1 * Math.cos(a2 * Math.PI / 180);
                        var x2 = l2 * Math.cos((90 - this.curAngle) * Math.PI / 180);
                        var y2 = l2 * Math.sin((90 - this.curAngle) * Math.PI / 180);
                        console.log("L2 components--Y: " + (Math.pow(this.curY - mousePos.y, 2)) + ", X: " + (Math.pow(mousePos.x - this.curX, 2)));
                        console.log("New position--L1: " + l1 + ", A1: " + a1 + ", A2: " + a2 + ", L2: " + l2 + ", X2: " + x2 + ", Y2: " + y2);
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
                            lineCap: 'round',
                            lineJoin: 'round'
                        };
                        //
                        this.interimLine = {
                            x: 0,
                            y: 0,
                            points: [this.curX, this.curY, this.curX + x2, this.curY - y2],
                            stroke: this.newColor,
                            strokeWidth: 4,
                            dash: [20, 20],
                            lineCap: 'round',
                            lineJoin: 'round'
                        };
                        //
                        this.nextX = x2;
                        this.nextY = y2 * -1;
                        //
                    }else{
                        var l1 = Math.sqrt(Math.pow(this.curY - mousePos.y, 2) + Math.pow(mousePos.x - this.curX, 2));
                        var a1 = Math.atan((this.curY - mousePos.y) / (mousePos.x - this.curX)) * 180 / Math.PI;
                        var a2 = 90 - this.curAngle - a1;
                        var l2 = l1 * Math.cos(a2 * Math.PI / 180);
                        var x2 = l2 * Math.cos((90 - this.curAngle) * Math.PI / 180);
                        var y2 = l2 * Math.sin((90 - this.curAngle) * Math.PI / 180);
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
                            lineCap: 'round',
                            lineJoin: 'round'
                        };
                        //
                        this.interimLine = {
                            x: 0,
                            y: 0,
                            points: [this.curX, this.curY, this.curX - x2, this.curY + y2],
                            stroke: this.newColor,
                            strokeWidth: 4,
                            dash: [20, 20],
                            lineCap: 'round',
                            lineJoin: 'round'
                        };
                        l2 = l2 * -1;
                        //
                        this.nextX = x2 * -1;
                        this.nextY = y2;
                        //
                    }
                    //
                    this.distance = Math.round((l2 / 3) * 5) / 5;
                    //
                }else{
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
                        lineCap: 'round',
                        lineJoin: 'round'
                    };
                    //
                    this.interimLine = {
                        x: 0,
                        y: 0,
                        points: [this.curX, this.curY, this.curX + this.nextX, this.curY + this.nextY],
                        stroke: this.newColor,
                        strokeWidth: 4,
                        lineCap: 'round',
                        lineJoin: 'round'
                    };
                }
                //
                x1 = (this.robotLength / 2 + 5) * Math.cos((90 - this.curAngle) * Math.PI / 180);
                y1 = (this.robotLength / 2 + 5) * Math.sin((90 - this.curAngle) * Math.PI / 180);
                //
                console.log("X1: " + x1 + ", Y1: " + y1);
                /*
                this.directionLine = {
                    x: 0,
                    y: 0,
                    points: [this.curX, this.curY, this.curX + x1 * 3, this.curY - y1 * 3],
                    stroke: 'orange',
                    strokeWidth: 4,
                    lineCap: 'round'
                };
                */
            break;
            case MovementOptions.TURN:
                var x1 = (this.fieldDim * 2) * Math.cos((90 - this.curAngle) * Math.PI / 180);
                var y1 = (this.fieldDim * 2) * Math.sin((90 - this.curAngle) * Math.PI / 180);
                //
                this.directionLine = {
                    x: 0,
                    y: 0,
                    points: [this.curX, this.curY, this.curX + x1, this.curY - y1],
                    stroke: 'orange',
                    strokeWidth: 4,
                    lineCap: 'round'
                };
                //
                if(this.interimFloat){
                    //
                    if(mousePos.x > this.curX){
                        this.nextAngle = (90 - (Math.atan((this.curY - mousePos.y) / (mousePos.x - this.curX)) * 180 / Math.PI));
                    }else{
                        this.nextAngle = -180 + (90 - (Math.atan((this.curY - mousePos.y) / (mousePos.x - this.curX)) * 180 / Math.PI));
                    }
                    console.log("nextAngle: " + this.nextAngle);
                    //
                    var x2 = (this.fieldDim * 2) * Math.cos((90 - this.nextAngle) * Math.PI / 180);
                    var y2 = (this.fieldDim * 2) * Math.sin((90 - this.nextAngle) * Math.PI / 180);
                    //
                    this.interimLine = {
                        x: 0,
                        y: 0,
                        points: [this.curX, this.curY, this.curX + x2, this.curY - y2],
                        stroke: this.newColor,
                        strokeWidth: 4,
                        dash: [20, 20],
                        lineCap: 'round',
                        lineJoin: 'round'
                    };
                    //
                    var a1 = Math.round(this.nextAngle / 5) * 5 - this.curAngle;
                    //
                    if(Math.abs(a1) > 180){
                        if((a1) > 0){
                            a1 = a1 - 360;
                        }else{
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
                        lineCap: 'round',
                        lineJoin: 'round'
                    }
                    //
                    var a2 = this.nextAngle - this.curAngle;
                    if(Math.abs(a2) > 180){
                        if((a2) > 0){
                            a2 = a2 - 360;
                        }else{
                            a2 = a2 + 360;
                        }
                    }
                    //
                    if(a2 > 0){
                        this.interimArc = {
                            x: this.curX,
                            y: this.curY,
                            innerRadius: 70,
                            outerRadius: 70,
                            angle: a2,
                            rotation: this.curAngle - 90,
                            stroke: this.newColor,
                            strokeWidth: 4,
                            lineCap: 'round',
                            lineJoin: 'round'
                        }
                    }else{
                        this.interimArc = {
                            x: this.curX,
                            y: this.curY,
                            innerRadius: 70,
                            outerRadius: 70,
                            angle: -a2,
                            rotation: this.nextAngle - 90,
                            stroke: this.newColor,
                            strokeWidth: 4,
                            lineCap: 'round',
                            lineJoin: 'round'
                        }
                    }
                    //
                }else{
                    var x2 = (this.fieldDim * 2) * Math.cos((90 - this.nextAngle) * Math.PI / 180);
                    var y2 = (this.fieldDim * 2) * Math.sin((90 - this.nextAngle) * Math.PI / 180);
                    //
                    this.interimLine = {
                        x: 0,
                        y: 0,
                        points: [this.curX, this.curY, this.curX + x2, this.curY - y2],
                        stroke: this.newColor,
                        strokeWidth: 4,
                        lineCap: 'round',
                        lineJoin: 'round'
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
                        lineCap: 'round',
                        lineJoin: 'round'
                    }
                }
                //
            break;
            case MovementOptions.ARC:
                //
            break;
            case MovementOptions.STRAFE:
                //
            break;
        }
    }
  },
  created(){
    var x1 = (this.robotLength / 2 + 5) * Math.cos((90 - this.curAngle) * Math.PI / 180);
    var y1 = (this.robotLength / 2 + 5) * Math.sin((90 - this.curAngle) * Math.PI / 180);
    //
    this.directionLine = {
        x: 0,
        y: 0,
        points: [this.curX, this.curY, this.curX + x1 * 3, this.curY - y1 * 3],
        stroke: 'orange',
        strokeWidth: 4,
        lineCap: 'round'
    };
    //
    this.points.push({
        //
        x: this.topRight.x,
        y: this.topRight.y,
        rotation: this.topRight.rotation,
        width: this.robotWidth * 3,
        height: this.robotLength * 3,
        offsetX: this.robotWidth * 3 / 2,
        offsetY: this.robotLength * 3 / 2,
        stroke: '#32cd32',
        strokeWidth: 5,
        cornerRadius: 5
    });
    //
    this.getStepPoint();
    /*
    var l2 = this.distance * 3;
    var x2 = l2 * Math.cos(this.curAngle * Math.PI / 180);
    var y2 = l2 * Math.sin(this.curAngle * Math.PI / 180);
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
        rotation: this.points[0].rotation,
        lineCap: 'round',
        lineJoin: 'round'
    };
    //
    this.interimLine = {
        x: 0,
        y: 0,
        points: [this.points[0].x, this.points[0].y, this.curX + x2, this.curY - y2],
        stroke: this.newColor,
        strokeWidth: 4,
        lineCap: 'round',
        lineJoin: 'round'
    };
    //
    this.interimFloat = false;*/
    //
  },
  data: () => ({
    presets: ["Gear ratio: 20", "Gear ratio: 40", "Gear ratio: 60", "Custom"],
    starts: ["top left", "top right", "bottom left", "bottom right"],
    dialog: false,
    drive: MovementOptions.DRIVE,
    turn: MovementOptions.TURN,
    arc: MovementOptions.ARC,
    strafe: MovementOptions.STRAFE,
    angle: 45,
    direction: "right",
    distance: 0,
    speed: 0,
    pxperinch: 3,
    robotWidth: 16,
    robotLength: 18,
    newColor: 'white',
    opencustoms: false,
    stepInProgress: true,
    interimPoint: null,
    interimLine: null,
    interimArc: null,
    directionLine: null,
    field: require('@/assets/Pictures/field2.jpg'),
    fieldDim: 423,
    curX: 268,
    curY: 159,
    nextX: 0,
    nextY: 0,
    curAngle: 45,
    nextAngle: 0,
    interimFloat: true,
    clickAssist: false,
    topLeft: {
        x:161,
        y:159,
        rotation: -45
    },
    topRight: {
        x:268,
        y:159,
        rotation:45
    },
    bottomLeft: {
        x:160,
        y:260,
        rotation: -135
    },
    points: [/*{
        x:160,
        y:260,
        width:48,
        height:54,
        fill:'',
        stroke: '#1e53b0',
        strokeWidth: 5,
        cornerRadius: 5,
        rotation: 45,
        offsetX: 24,
        offsetY: 27
    }*/],
    arcs: [],
    lines: [{
        points: [147, 240, 200, 200]
    }],
    stepColors: ['#9d00ff', '#b700ff', '#cc00ff', '#ff00ff', '#ff00dd', '#ff00ff', '#cc00ff', '#b700ff'],
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

.interface {
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

#pos-name{
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

#pos-num{
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

#pos-preset{
    position: absolute;
    left: 39.5%;
    width: 15%;
    height: 8%;
    top: 12%;
}

#pos-start{
    position: absolute;
    left: 55.5%;
    width: 15%;
    height: 8%;
    top: 12%;
}

#pos-dims{
    position: absolute;
    left: 80%;
    top: 12%;
}

#in-width{
    padding-left: 4px;
    margin: 5px;
    margin-top: 0;
    font-family: "Montserrat", sans-serif;
}

#in-length{
    padding-left: 4px;
    margin: 5px;
    font-family: "Montserrat", sans-serif;
}

#in-dist {
  width: 85%;
  padding-left: 4px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.amount{
    background-color: white;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    width: 10%;
    text-align: right;
    padding-right: 4px;
}

.dropdown{
    background-color: white;
    color: black;
    width: 100%;
    padding: 10px;
    text-align-last: center;
    border-radius: 4px;
    font-family: "Montserrat", sans-serif;
}

.colors{
    background-color: white;
    border-radius: 4px;
}

.popup{
    background-color: lightgray;/*rgb(100,230,209);*/
}

.popup-text{
    text-align: left;
}

.popup-inputs{
    background-color: white;
    border: 0.5px solid black;
    border-radius: 4px;
    text-align: left;
    margin: 3px;
    padding: 1px;
    padding-left: 3px;
}

.popup-button{
    background-color: lightgray;/*rgb(100,230,209);*/
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

#tog-drive{
    left: 40%;
    position: absolute;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
}

#tog-turn{
    left: 50%;
}

#tog-fancy{
    left: 60%;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
}

.active{
    background-color: lightgray;
}

.label{
    color: white;
    font-family: "Montserrat", sans-serif;
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
    top: 37%;
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
    border-radius: 4px;
    /*border: 0.5px solid black;*/
}

#step-title{
    padding: 10px;
}

#generate{
    position: absolute;
    top: 90%;
    left: 39.2%;
    width: 30%;
}

html, body {
    height: 100%;
    margin: 0;
}

hr{
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    display: block;
    border: 2px solid rgb(100,230,209);
    border-radius: 2px;
}

#autostep{
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
  bottom: 100%;  /* At the top of the tooltip */
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent white transparent;
}

.hover-info{
    color: black;
    margin: 10px;
    background-color: white;
}
</style>
