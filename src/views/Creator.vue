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
                <input v-model="name" @change="nameChange($event)" placeholder="Autonomous name" id="in-name" class="colors"/>
                <span class="tooltiptext">Naming Info!<br/><hr/><p class="hover-info">This is the name that will appear in your driver station app.</p></span>
            </div>
            <div class="tooltip" id="pos-num">
                <input v-model="bias" @change="biasChange($event)" type="number" step="0.1" value="1" placeholder="Movement bias" id="in-num" class="colors"/>
                <span class="tooltiptext">Bias Info<br/><hr/><p class="hover-info">Set to one as default. This value can be used to counteract friction and other factors.</p></span>
            </div>
            <p class="chassischoice">Chassis: {{ $store.getters.chassis }}</p>
            <div class="tooltip" id="pos-preset">
                <select v-model="cpi" @change="cpichange($event)" class="dropdown">
                    <option disabled selected>CPI Presets</option>
                    <option text-xs-center v-for="(preset, index) in presets" v-bind:key="index + 'cpi_presets'">{{preset}}</option>
                </select>
                <span class="tooltiptext">CPI Info<br/><hr/><p class="hover-info">Determines rotation of wheels. Presets assume 4.125 inch wheel diameter and 28 counts per rotation motor. Select custom to bypass this.</p></span>
            </div>
            <div class="tooltip" id="pos-start">
                <select v-model="starpos" @change="startChange($event)" class="dropdown">
                    <option disabled selected>Starting Side</option>
                    <option v-for="(start, index) in starts" v-bind:key="index + 'starting_side'">{{start}}</option>
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
                        Gear Ratio: <input v-model="gearratio" type="number" placeholder="Gearratio" value="40" class="popup-inputs"/><br/>
                        Motor CPR: <input v-model="cpr" type="number" placeholder="cpr" value="28" class="popup-inputs"/><br/>
                        Wheel Diameter: <input v-model="diameter" type="number" placeholder="diameter" value="4.125" class="popup-inputs"/>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn class="popup-button" flat @click="finishcpi()">Done</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <!--<v-overflow-btn outline color="gray" style="margin-top: 0em" height="2em" margin="0em" :items="presets" label="cpi presets"></v-overflow-btn>
            <v-overflow-btn outline color="gray" style="margin-top: 0em" height="2em" margin="0em" :items="starts" label="starting side" target=".encoders"></v-overflow-btn>-->
        <!-- #endregion -->
        <!-- #region Field Container -->
            <!-- 36 pixels per foot or 3 pixels per inch >> changed to this.pxperinch -->
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
                        <button block v-bind:class="{active: $store.getters.isCurrentStepArc}" v-if="$store.getters.isArcingAvail" :disabled="$store.getters.chassis=='traction'" v-on:click="newStep(arc)" class="button" id="tog-fancy">Arc</button>
                        <span class="tooltiptext" v-if="$store.getters.chassis=='traction'" id="disable">Disabled<br/><hr/><p class="hover-info">This movement type is not available for this chassis.</p></span>
                    </div>
                    <button block v-bind:class="{active: $store.getters.isCurrentStepStrafe}" v-if="!$store.getters.isArcingAvail" v-on:click="newStep(strafe)" class="button" id="tog-fancy">Strafe</button>
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
                 <div sm2 white id="trash" v-if="$store.getters.getTheSteps.length > 0">
                    <v-btn icon flat color="black" v-on:click="deleteStep()"><v-icon>delete</v-icon></v-btn>
                    <v-btn icon flat color="red" v-on:click="deleteSteps()"><v-icon>clear</v-icon></v-btn>
                </div>
                <div id="autostep" v-for="step in $store.getters.getTheSteps.slice().reverse()" v-bind:key="step.stepNumber + 'list'">
                    <!--<v-card-title primary-title>-->
                        <v-layout  row wrap  id="step-title" sm12>
                          <v-flex sm1>
                            {{step.stepNumber + 1}}
                          </v-flex>
                          <v-flex sm11>
                            <h3>
                                {{step.type}}
                            </h3>
                          </v-flex>
                        </v-layout> 
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
import type1 from '!raw-loader!@/assets/Miscellaneous/Type1.txt';
import type2 from '!raw-loader!@/assets/Miscellaneous/Type2.txt';
import type3 from '!raw-loader!@/assets/Miscellaneous/Type3.txt';
import type4 from '!raw-loader!@/assets/Miscellaneous/Type4.txt';
import calibrateTW from '!raw-loader!@/assets/Miscellaneous/CalibrateTW.txt';
import calibrateFW from '!raw-loader!@/assets/Miscellaneous/CalibrateFW.txt';
export default {
  name: "Creator",
  components: { DrawLines },
  methods: {
    isWhole: function(inPut){
      return (Math.round(inPut) == inPut);
    },
    readTextFile: function(){
      //
      var trac;
      var cali;
      if(this.$store.getters.chassis == 'traction'){
        trac = type1;
        cali = calibrateFW;
      }else if(this.$store.getters.chassis == 'omni wheel'){
        trac = type2;
        cali = calibrateTW;
      }else if(this.$store.getters.chassis == 'meccanum'){
        trac = type3;
        cali = calibrateFW;
      }else{
        trac = type4;
        cali = calibrateFW;
      }
      if(this.name == null){
        this.name = "myAuto";
      }
      trac = trac.replace("{name}", this.name);
      trac = trac.replace("{name}", this.name);
      var width = this.robotWidth;
      if(this.isWhole(width)){
        width += ".0";
      }
      trac = trac.replace("{width}", width);
      trac = trac.replace("{cpr}", Math.round(this.cpr));
      cali = cali.replace("{cpr}", Math.round(this.cpr))
      trac = trac.replace("{gearratio}", Math.round(this.gearratio));
      cali = cali.replace("{gearratio}", Math.round(this.gearratio));
      var diam = this.diameter;
      if(this.isWhole(diam)){
        diam += ".0";
      }
      trac = trac.replace("{diameter}", diam);
      cali = cali.replace("{diameter}", diam);
      var bias = this.bias;
      if(this.isWhole(bias)){
        bias += ".0";
      }
      trac = trac.replace("{bias}", bias);
      cali = cali.replace("{bias}", bias);
      //
      var steps = this.$store.getters.getTheSteps;
      var buildCode = "";
      for(var i = 0; i < steps.length; i++){
        var line = "";
        if (i > 0){
          line = "\n\t";
        }
        if(steps[i].type == MovementOptions.DRIVE){
          line += "moveToPosition(" + steps[i].params.distance + ", " + steps[i].params.speed + ");";
        }else if(steps[i].type == MovementOptions.TURN){
          var speedDirection = steps[i].params.speed;
          if(steps[i].params.angle < 0){
            speedDirection *= -1;
          }
          line += "turnWithGyro(" + Math.abs(steps[i].params.angle) + ", " + speedDirection + ");";
        }else if(steps[i].type == MovementOptions.ARC){
          var angy = steps[i].params.angle;
          if(this.isWhole(angy)){
            angy += ".0";
          }
          var disy = steps[i].params.distance;
          if(this.isWhole(disy)){
            disy = disy + ".0";
          }
          var spd = steps[i].params.speed;
          if(this.isWhole(spd)){//fix this
            spd += ".0";
          }
          line += "arc(" + angy + ", " + disy + ", " + spd + ");";
        }else{
          disy = steps[i].params.distance;
          if(this.isWhole(disy)){
            disy = disy + ".0";
          }
          spd = steps[i].params.speed;
          if(this.isWhole(spd)){//fix this
            spd += ".0";
          }
          line += "strafeToPosition(" + disy + ", " + spd + ");";
        }
        line += "\n\t//"
        buildCode += line;
      }
      trac = trac.replace("{code}", buildCode);
      //
      this.$store.commit("setGenCode", trac);
      this.$store.commit("setGenCali", cali);
      //
    },
    newStep: function(step) {
      this.$store.commit("setCurrentStep", step);
      //
      this.interimFloat = false;
      //
      this.getStepPoint();
      //
    },
    deleteStep: function() {
      //
      var step = this.$store.getters.getTheSteps[this.$store.getters.getTheSteps.length - 1];
      this.$store.commit("removeLastStep");
      //
      if(this.currentColor > 0){
        this.currentColor--;
      }else{
        this.currentColor = this.stepColors.length - 3;
      }
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
            width: this.robotWidth * this.pxperinch,
            height: this.robotLength * this.pxperinch,
            offsetX: this.robotWidth * this.pxperinch / 2,
            offsetY: this.robotLength * this.pxperinch / 2,
            stroke: "#32cd32",
            strokeWidth: 5 / 3 * this.pxperinch,
            cornerRadius: 5 / 3 * this.pxperinch
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
            width: this.robotWidth * this.pxperinch,
            height: this.robotLength * this.pxperinch,
            offsetX: this.robotWidth * this.pxperinch / 2,
            offsetY: this.robotLength * this.pxperinch / 2,
            stroke: "#32cd32",
            strokeWidth: 5 / 3 * this.pxperinch,
            cornerRadius: 5 / 3 * this.pxperinch
          });
          this.$store.commit("setCurrentStep", MovementOptions.TURN);
          this.getTurn();
          break;
        case MovementOptions.ARC:
          //
          //console.log("Should be working.");
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
            width: this.robotWidth * this.pxperinch,
            height: this.robotLength * this.pxperinch,
            offsetX: this.robotWidth * this.pxperinch / 2,
            offsetY: this.robotLength * this.pxperinch / 2,
            stroke: "#32cd32",
            strokeWidth: 5 / 3 * this.pxperinch,
            cornerRadius: 5 / 3 * this.pxperinch
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
            width: this.robotWidth * this.pxperinch,
            height: this.robotLength * this.pxperinch,
            offsetX: this.robotWidth * this.pxperinch / 2,
            offsetY: this.robotLength * this.pxperinch / 2,
            stroke: "#32cd32",
            strokeWidth: 5 / 3 * this.pxperinch,
            cornerRadius: 5 / 3 * this.pxperinch
          });
          this.$store.commit("setCurrentStep", MovementOptions.STRAFE);
          this.getStrafe();
          break;
      }
      //
    },
    deleteSteps: function() {
      if (this.$store.getters.getTheSteps.length >= 1) {
        this.deleteWarning = true;
      } else {
        this.confirmDelete();
      }
    },
    confirmDelete: function() {
      //this function is called when all steps are deleted or the starting position is reset
      this.deleteWarning = false;//close warning
      //
      this.$store.commit("nukeIt");//Reset Everything but starting side
      this.$store.commit("setGenCode", null);
      this.points = [];
      this.lines = [];
      this.arcs = [];
      this.interimLine = null;
      this.directionLine = null;
      //
      if (this.sideChosen != 3) {//reset starting side
        this.startingPos.rotation = 0;//face forward
        this.curAngle = 0;
        this.startingPos.y = this.fieldDim - this.robotLength - 10;//bottom of the field
        //
        switch(this.starpos){
          case "left blue":
            this.startingPos.x = this.fieldDim / 6;//x position 1/6 from left of field
            break;
          case "right blue":
            this.startingPos.x = this.fieldDim * 2 / 6;//x position 2/6 from left of field
            break;
          case "left red":
            this.startingPos.x = this.fieldDim * 4 / 6;//x position 4/6 from left of field
            break;
          case "right red":
            this.startingPos.x = this.fieldDim * 5 / 6;//x position 5/6 from left of field
            break;
          default:
            this.startingPos.x = 0;
            break;
        }
        //
        this.sideChosen = 1;
        //
        this.laststarpos = this.starpos;
      }
      //
      if(this.sideChosen == 3){//steps deleted, starting pos remains
        this.points.push({//recolor starting point
          //
          x: this.startingPos.x,
          y: this.startingPos.y,
          rotation: this.startingPos.rotation,
          width: this.robotWidth * this.pxperinch,
          height: this.robotLength * this.pxperinch,
          offsetX: this.robotWidth * this.pxperinch / 2,
          offsetY: this.robotLength * this.pxperinch / 2,
          stroke: "#32cd32",
          strokeWidth: 5 / 3 * this.pxperinch,
          cornerRadius: 5 / 3 * this.pxperinch
        });
        if(this.sideChosen == 4){
          this.sideChosen = 3;
        }
      }else{//prepare for fresh auto starting side setup
        this.interimPoint = {
          x: this.startingPos.x,
          y: this.startingPos.y,
          rotation: this.startingPos.rotation,
          width: this.robotWidth * this.pxperinch,
          height: this.robotLength * this.pxperinch,
          offsetX: this.robotWidth * this.pxperinch / 2,
          offsetY: this.robotLength * this.pxperinch / 2,
          stroke: this.newColor,
          dash: [20, 20],
          strokeWidth: 5 / 3 * this.pxperinch,
          cornerRadius: 5 / 3 * this.pxperinch
        }
        this.$store.commit("resetSide");
      }
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
      if (this.sideChosen == 0) {
        //console.log(this.laststarpos);
        this.starpos = this.laststarpos;
        this.sideChosen == 3;
      }
      //
    },
    setGenerateVisible: function() {
      //this function is called when the generate button is pressed
      this.readTextFile();
      //
      this.$store.commit("setGenerateVisible");
      this.$router.push("/Generate");
    },
    cpichange: function(event) {
      this.$store.commit("setCPIShow", event.target.value);
      if (event.target.value == "Custom") {
        this.opencustoms = true;
      } else {
        this.opencustoms = false;
        if(event.target.value == "Gear ratio: 20"){
          this.gearratio = 20;
        }else if(event.target.value == "Gear ratio: 40"){
          this.gearratio = 40;
        }else{
          this.gearratio = 60;
        }
        this.$store.commit("setCPI", [this.cpr, this.gearratio, this.diameter]);
      }
    },
    finishcpi: function(){
      this.opencustoms = false;
      this.$store.commit("setCPI", [this.cpr, this.gearratio, this.diameter]);
    },
    startChange: function() {
      //this function is called when a change is made to the starting position
      if (this.$store.getters.getTheSteps.length >= 1) {//auto is aged
        this.sideChosen = 0;
        this.deleteWarning = true;//request confirmation
      } else {
        this.sideChosen = 1;
        this.confirmDelete();//no consequences, prepare new starting position
      }
      //
    },
    widthChange: function(event) {
      this.robotWidth = event.target.value;
      this.getStepPoint();
      this.$store.commit("setWidth", this.robotWidth);
    },
    lengthChange: function(event) {
      this.robotLength = event.target.value;
      this.getStepPoint();
      this.$store.commit("setLength", this.robotLength);
    },
    biasChange: function(event){
      this.$store.commit("setBias", event.target.value);
    },
    nameChange: function(event){
      this.$store.commit("setName", event.target.value);
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
    generateGradient: function(){
      /*gradient() {
        let colors = "linear-gradient(45deg";
        this.colors.forEach(function(e) {
          colors += "," + e.hex;
        });
        colors += ")";
        return colors;
      }*/
    },
    blend_colors: function(color1, color2, percentage){
      // check input
      color1 = color1 || '#000000';
      color2 = color2 || '#ffffff';
      percentage = percentage || 0.5;
      //
      if (color1.length == 4){
          color1 = color1[1] + color1[1] + color1[2] + color1[2] + color1[3] + color1[3];
      }else{
          color1 = color1.substring(1);
      }
      if (color2.length == 4){
          color2 = color2[1] + color2[1] + color2[2] + color2[2] + color2[3] + color2[3];
      }else{
          color2 = color2.substring(1);
      }
      //
      //console.log('valid: c1 => ' + color1 + ', c2 => ' + color2);
      // 3: we have valid input, convert colors to rgb
      color1 = [parseInt(color1[0] + color1[1], 16), parseInt(color1[2] + color1[3], 16), parseInt(color1[4] + color1[5], 16)];
      color2 = [parseInt(color2[0] + color2[1], 16), parseInt(color2[2] + color2[3], 16), parseInt(color2[4] + color2[5], 16)];
      //
      //console.log('hex -> rgba: c1 => [' + color1.join(', ') + '], c2 => [' + color2.join(', ') + ']');
      // 4: blend
      var color3 = [ 
          (1 - percentage) * color1[0] + percentage * color2[0], 
          (1 - percentage) * color1[1] + percentage * color2[1], 
          (1 - percentage) * color1[2] + percentage * color2[2]
      ];
      //
      //console.log('c3 => [' + color3.join(', ') + ']');
      //
      // 5: convert to hex
      color3 = '#' + this.int_to_hex(color3[0]) + this.int_to_hex(color3[1]) + this.int_to_hex(color3[2]);
      //
      //console.log(color3);
      //
      // color3 in the middle
      //ctx.fillStyle = color3;
      //ctx.fillRect(30, 0, 30, 25);
      // return hex
      return color3;
    },
    int_to_hex: function(num){
      /*
        convert a Number to a two character hex string
        must round, or we will end up with more digits than expected (2)
        note: can also result in single digit, which will need to be padded with a 0 to the left
        @param: num         => the number to conver to hex
        @returns: string    => the hex representation of the provided number
      */
      var hex = Math.round(num).toString(16);
      if (hex.length == 1)
          hex = '0' + hex;
      return hex;
    },
    createGradient: function(color1, color2, steps, cx, cy, nx, ny){
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      //
      var gradient = ctx.createLinearGradient(cx, cy, nx, ny);
      gradient.addColorStop(0.00, color1);
      for(var i = 0; i < steps - 1; i++){
        gradient.addColorStop((i + 1) / 5, this.blend_colors(color1, color2, (i + 1)/ steps));
        //console.log("Stuff" + this.blend_colors(color1, color2, (i + 1) / steps));
      }
      gradient.addColorStop(1.00, color2);
      return gradient;
    },
    confirmStep: function() {
      if(this.sideChosen == 3){
      var params;
      switch (this.$store.getters.currentStep) {
        case MovementOptions.DRIVE:
          params = {
            distance: this.$data.distance,
            speed: this.$data.speed
          };
          //
          var grad = this.createGradient(this.stepColors[this.currentColor], this.stepColors[this.currentColor + 1], 5, this.curX, this.curY, this.curX + this.nextX, this.curY + this.nextY);
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
            stroke: grad,
            strokeWidth: 4 / 3 * this.pxperinch,
            lineCap: "round"
          });
          //
          this.points.pop();
          //redraw direction line
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
              this.curX + this.nextX + x1 * this.pxperinch,
              this.curY + this.nextY - y1 * this.pxperinch
            ],
            stroke: "orange",
            strokeWidth: 4 / 3 * this.pxperinch,
            lineCap: "round"
          };
          //
          this.points.push({//repush last step with new color
            //
            x: this.curX,
            y: this.curY,
            rotation: this.curAngle,
            width: this.robotWidth * this.pxperinch,
            height: this.robotLength * this.pxperinch,
            offsetX: this.robotWidth * this.pxperinch / 2,
            offsetY: this.robotLength * this.pxperinch / 2,
            stroke: this.stepColors[this.currentColor],
            strokeWidth: 5 / 3 * this.pxperinch,
            cornerRadius: 5 / 3 * this.pxperinch
          });
          //
          var mx =
            this.distance * this.pxperinch * Math.cos((90 - this.curAngle) * Math.PI / 180);
          var my =
            this.distance * this.pxperinch * Math.sin((90 - this.curAngle) * Math.PI / 180);
          //
          this.curX = this.curX + mx;
          this.curY = this.curY - my;
          //
          this.points.push({//push new step with green color
            //
            x: this.curX,
            y: this.curY,
            rotation: this.curAngle,
            width: this.robotWidth * this.pxperinch,
            height: this.robotLength * this.pxperinch,
            offsetX: this.robotWidth * this.pxperinch / 2,
            offsetY: this.robotLength * this.pxperinch / 2,
            stroke: "#32cd32",
            strokeWidth: 5 / 3 * this.pxperinch,
            cornerRadius: 5 / 3 * this.pxperinch
          });
          //
          this.distance = 30;//set default distance
          //
          var l2 = this.distance * this.pxperinch;//get new interim point
          var x2 = l2 * Math.cos((90 - this.curAngle) * Math.PI / 180);
          var y2 = l2 * Math.sin((90 - this.curAngle) * Math.PI / 180);
          //
          this.nextX = x2;//set new interim point
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
          x1 = 50 * Math.sin(this.curAngle * Math.PI / 180) + this.curX;
          y1 = -50 * Math.cos(this.curAngle * Math.PI / 180) + this.curY;
          x2 = 50 * Math.sin((this.curAngle + this.angle) * Math.PI / 180) + this.curX;
          y2 = -50 * Math.cos((this.curAngle + this.angle) * Math.PI / 180) + this.curY;
          //
          //console.log("gradient cords:");
          //console.log("x1: " + x1 + ", y1: " + y1);
          //console.log("x2: " + x2 + ", y2: " + y2);
          //
          //grad = this.createGradient(this.stepColors[this.currentColor], this.stepColors[this.currentColor + 1], 5, x1, y1, x2, y2);
          //
          if (this.angle > 0) {
            this.arcs.push({
              x: this.curX,
              y: this.curY,
              innerRadius: 0,
              outerRadius: 50,
              angle: this.angle,
              rotation: this.curAngle - 90,
              stroke: this.stepColors[this.currentColor + 1],
              strokeWidth: 4 / 3 * this.pxperinch,
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
              stroke: this.stepColors[this.currentColor + 1],
              strokeWidth: 4 / 3 * this.pxperinch,
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
            width: this.robotWidth * this.pxperinch,
            height: this.robotLength * this.pxperinch,
            offsetX: this.robotWidth * this.pxperinch / 2,
            offsetY: this.robotLength * this.pxperinch / 2,
            stroke: this.stepColors[this.currentColor],
            strokeWidth: 5 / 3 * this.pxperinch,
            cornerRadius: 5 / 3 * this.pxperinch
          });
          //
          this.points.push({
            x: this.curX,
            y: this.curY,
            rotation: this.nextAngle,
            width: this.robotWidth * this.pxperinch,
            height: this.robotLength * this.pxperinch,
            offsetX: this.robotWidth * this.pxperinch / 2,
            offsetY: this.robotLength * this.pxperinch / 2,
            stroke: "#32cd32",
            strokeWidth: 5 / 3 * this.pxperinch,
            cornerRadius: 5 / 3 * this.pxperinch
          });
          //
          this.curAngle = Math.round(this.nextAngle / 5) * 5;
          this.angle = 45;
          this.nextAngle = this.curAngle + this.angle;
          //
          this.distance = 30;
          //
          l2 = this.distance * this.pxperinch;
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
            strokeWidth: 4 / 3 * this.pxperinch,
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
            width: this.robotWidth * this.pxperinch,
            height: this.robotLength * this.pxperinch,
            offsetX: this.robotWidth * this.pxperinch / 2,
            offsetY: this.robotLength * this.pxperinch / 2,
            stroke: this.stepColors[this.currentColor],
            strokeWidth: 5 / 3 * this.pxperinch,
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
            this.pxperinch *
            Math.cos((Number(ang) + this.curAngle) * Math.PI / 180);
          this.nextAx =
            this.distance *
            this.pxperinch *
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
          //grad = this.createGradient(this.stepColors[this.currentColor], this.stepColors[this.currentColor + 1], 5, this.curX, this.curY, this.nextAx, this.nextAy);
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
              stroke: this.stepColors[this.currentColor + 1],
              strokeWidth: 4 / 3 * this.pxperinch,
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
              stroke: this.stepColors[this.currentColor + 1],
              strokeWidth: 4 / 3 * this.pxperinch,
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
              stroke: this.stepColors[this.currentColor + 1],
              strokeWidth: 4 / 3 * this.pxperinch,
              lineCap: "round",
              lineJoin: "round"
            });
          }
          //
          this.points.push({
            x: this.nextAx,
            y: this.nextAy,
            width: this.robotWidth * this.pxperinch,
            height: this.robotLength * this.pxperinch,
            offsetX: this.robotWidth * this.pxperinch / 2,
            offsetY: this.robotLength * this.pxperinch / 2,
            stroke: "#32cd32",
            strokeWidth: 5 / 3 * this.pxperinch,
            cornerRadius: 5 / 3 * this.pxperinch,
            rotation: this.curAngle - (curA + (a1 + 90)) * 2,
            lineCap: "round",
            lineJoin: "round"
          });
          //
          this.distance = 30;
          this.angle = 45;
          //
          this.curX = this.nextAx;
          this.curY = this.nextAy;
          var nang = this.curAngle - (this.curAngle + (a1 + 90)) * 2;
          //console.log("nang1: " + nang);
          if (this.nextAy > perp && Math.abs(this.curAngle) < 90) {
            nang += 180;
          }
          //console.log("nang2: " + nang);
          if (nang > 180) {
            nang -= 360;
          } else if (nang < -180) {
            nang += 360;
          }
          //console.log("nang3: " + nang);
          this.curAngle = nang;
          //
          this.getArc();
          //
          this.interimFloat = false;
          break;
        case MovementOptions.STRAFE:
          params = {
            distance: this.$data.distance,
            speed: this.$data.speed
          };
          //
          grad = this.createGradient(this.stepColors[this.currentColor], this.stepColors[this.currentColor + 1], 5, this.curX, this.curY, this.curX + this.nextAx, this.curY + this.nextAy);
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
            stroke: grad,
            strokeWidth: 4 / 3 * this.pxperinch,
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
            width: this.robotWidth * this.pxperinch,
            height: this.robotLength * this.pxperinch,
            offsetX: this.robotWidth * this.pxperinch / 2,
            offsetY: this.robotLength * this.pxperinch / 2,
            stroke: this.stepColors[this.currentColor],
            strokeWidth: 5 / 3 * this.pxperinch,
            cornerRadius: 5 / 3 * this.pxperinch
          });
          //
          mx =
            this.distance * this.pxperinch * Math.cos((180 - this.curAngle) * Math.PI / 180);
          my =
            this.distance * this.pxperinch * Math.sin((180 - this.curAngle) * Math.PI / 180);
          //
          this.curX = this.curX - mx;
          this.curY = this.curY + my;
          //
          this.points.push({
            //
            x: this.curX,
            y: this.curY,
            rotation: this.curAngle,
            width: this.robotWidth * this.pxperinch,
            height: this.robotLength * this.pxperinch,
            offsetX: this.robotWidth * this.pxperinch / 2,
            offsetY: this.robotLength * this.pxperinch / 2,
            stroke: "#32cd32",
            strokeWidth: 5 / 3 * this.pxperinch,
            cornerRadius: 5 / 3 * this.pxperinch
          });
          //
          this.distance = 30;
          //
          l2 = this.distance * this.pxperinch;
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
      //
      this.$store.commit("setInterim", [this.angle, this.distance]);
      //
      if (this.currentColor > this.stepColors.length - 3) {
        this.currentColor = 0;
      } else {
        this.currentColor++;
      }
      this.$store.commit("confirmStep", params);
      }
      //
    },
    setInterimFloat: function(mousePos) {
      //this function is called when the field is clicked
      if(this.sideChosen == 1 || this.sideChosen == 2){//if starting position is being finalized
        this.startingPos.y = this.curY;//set Y starting pos
        //
        if(this.sideChosen == 1){//finish rotation
          //
          this.curAngle = 5 * Math.round(this.curAngle / 5);
          this.nextX = mousePos.x - this.startingPos.x;
          //
          this.interimPoint = {
            x: this.curX,
            y: this.curY,
            width: this.robotWidth * this.pxperinch,
            height: this.robotLength * this.pxperinch,
            offsetX: this.robotWidth * this.pxperinch / 2,
            offsetY: this.robotLength * this.pxperinch / 2,
            stroke: this.newColor,
            strokeWidth: 5 / 3 * this.pxperinch,
            cornerRadius: 5 / 3 * this.pxperinch,
            rotation: this.curAngle
          };
          //
          var ix = (this.robotLength / 2 + 5) * Math.cos((90 - this.curAngle) * Math.PI / 180);
          var iy = (this.robotLength / 2 + 5) * Math.sin((90 - this.curAngle) * Math.PI / 180);
          //
          this.directionLine = {
            x: 0,
            y: 0,
            points: [
              this.curX,
              this.curY,
              this.curX + ix * this.pxperinch,
              this.curY - iy * this.pxperinch
            ],
            stroke: "orange",
            strokeWidth: 4 / 3 * this.pxperinch,
            lineCap: "round"
          };
        }else if(this.sideChosen == 2){//finalize starting point
          //
          this.startingPos.x = this.curX;
          this.startingPos.y = this.curY;
          this.startingPos.rotation = 5 * Math.round(this.curAngle / 5);
          this.curAngle = this.startingPos.rotation;
          //
          this.points.push({
            x: this.startingPos.x,
            y: this.startingPos.y,
            width: this.robotWidth * this.pxperinch,
            height: this.robotLength * this.pxperinch,
            offsetX: this.robotWidth * this.pxperinch / 2,
            offsetY: this.robotLength * this.pxperinch / 2,
            stroke: "#32cd32",
            strokeWidth: 5 / 3 * this.pxperinch,
            cornerRadius: 5 / 3 * this.pxperinch,
            rotation: this.startingPos.rotation,
            lineCap: "round",
            lineJoin: "round"
          });
          //
          this.$store.commit("setSide", [this.starpos, this.startingPos]);
        }
        this.sideChosen++;
      }else{
        if (this.interimFloat) {//toggle interim float
          this.interimFloat = false;
          this.$store.commit("setInterim", [this.angle, this.distance]);
          //console.log("Interim set: " + [this.angle, this.distance]);
        } else {
          this.interimFloat = true;
        }
      }
      //
      this.setStepPoint(mousePos);
    },
    getStepPoint: function() {
      //this function is called when a change is made to the input values of a step
      if (this.sideChosen == 3) {//staring pos had been finalized
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
        this.$store.commit("setInterim", [this.angle, this.distance]);
      }
    },
    setStepPoint: function(mousePos) {
      //this function is called when the mouse moves around the field
      if (this.sideChosen == 3) {//aged auto, setting interim location
        switch (this.$store.getters.currentStep) {
          case MovementOptions.DRIVE:
            //redraw direction line
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
                this.curX /* + this.nextX*/ + x1 * this.pxperinch,
                this.curY /* + this.nextY*/ - y1 * this.pxperinch
              ],
              stroke: "orange",
              strokeWidth: 4 / 3 * this.pxperinch,
              lineCap: "round"
            };
            //
            if (this.interimFloat) {//if interim is floating
              //Fix Click Assist
              if (mousePos.x > this.curX) {//math for cursor reflection
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
                /*console.log(
                  "L2 components--Y: " +
                    Math.pow(this.curY - mousePos.y, 2) +
                    ", X: " +
                    Math.pow(mousePos.x - this.curX, 2)
                );*/
                /*console.log(
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
                );*/
                //draw interim stuff
                this.interimPoint = {
                  //
                  x: this.curX + x2,
                  y: this.curY - y2,
                  width: this.robotWidth * this.pxperinch,
                  height: this.robotLength * this.pxperinch,
                  offsetX: this.robotWidth * this.pxperinch / 2,
                  offsetY: this.robotLength * this.pxperinch / 2,
                  stroke: this.newColor,
                  strokeWidth: 5 / 3 * this.pxperinch,
                  dash: [20, 20],
                  cornerRadius: 5 / 3 * this.pxperinch,
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
                  strokeWidth: 4 / 3 * this.pxperinch,
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
                  width: this.robotWidth * this.pxperinch,
                  height: this.robotLength * this.pxperinch,
                  offsetX: this.robotWidth * this.pxperinch / 2,
                  offsetY: this.robotLength * this.pxperinch / 2,
                  stroke: this.newColor,
                  strokeWidth: 5 / 3 * this.pxperinch,
                  dash: [20, 20],
                  cornerRadius: 5 / 3 * this.pxperinch,
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
                  strokeWidth: 4 / 3 * this.pxperinch,
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
              this.distance = Math.round(l2 / this.pxperinch * 5) / 5;
              //
            } else {//interim is stationary
              this.getDrive();//draw stationary interim
            }
            ////console the math for direction line, I guess
            x1 =
              (this.robotLength / 2 + 5) *
              Math.cos((90 - this.curAngle) * Math.PI / 180);
            y1 =
              (this.robotLength / 2 + 5) *
              Math.sin((90 - this.curAngle) * Math.PI / 180);
            //
            //console.log("X1: " + x1 + ", Y1: " + y1);
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
              strokeWidth: 4 / 3 * this.pxperinch,
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
                    180 / Math.PI;
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
                strokeWidth: 4 / 3 * this.pxperinch,
                dash: [20, 20],
                lineCap: "round",
                lineJoin: "round"
              };
              //
              a1 = Math.round(this.nextAngle / 5) * 5 - this.curAngle;//round angle to nearest five
              //
              if (Math.abs(a1) > 180) {
                if (a1 > 0) {
                  a1 = a1 - 360;
                } else {
                  a1 = a1 + 360;
                }
              }
              this.angle = a1;//change in angles
              //
              this.interimPoint = {
                x: this.curX,
                y: this.curY,
                width: this.robotWidth * this.pxperinch,
                height: this.robotLength * this.pxperinch,
                offsetX: this.robotWidth * this.pxperinch / 2,
                offsetY: this.robotLength * this.pxperinch / 2,
                stroke: this.newColor,
                strokeWidth: 5 / 3 * this.pxperinch,
                cornerRadius: 5 / 3 * this.pxperinch,
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
                  strokeWidth: 4 / 3 * this.pxperinch,
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
                  strokeWidth: 4 / 3 * this.pxperinch,
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
              x1 = (this.robotLength / 2 + 5) * Math.cos((90 - this.curAngle) * Math.PI / 180);
              y1 = (this.robotLength / 2 + 5) * Math.sin((90 - this.curAngle) * Math.PI / 180);
              //
              this.directionLine = {
                x: 0,
                y: 0,
                points: [this.curX, this.curY, this.curX + x1 * this.pxperinch, this.curY - y1 * this.pxperinch],
                stroke: "orange",
                strokeWidth: 4 / 3 * this.pxperinch,
                lineCap: "round"
              };
              //
              this.interimLine = null;
              //
              var curA = this.curAngle;
              //console.log("curA: " + curA);
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
                  strokeWidth: 4 / 3 * this.pxperinch,
                  lineCap: "round",
                  lineJoin: "round"
                };
                //console.log("Angle: " + 2 * (90 + a1 + curA));
                /*console.log(
                  "Rotation: " + (start + (360 - 2 * (90 + a1 + curA)))
                );*/
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
                  strokeWidth: 4 / 3 * this.pxperinch,
                  lineCap: "round",
                  lineJoin: "round"
                };
                //console.log("first");
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
                  strokeWidth: 4 / 3 * this.pxperinch,
                  lineCap: "round",
                  lineJoin: "round"
                };
                //console.log("Fourth");
              }
              //
              this.interimPoint = {
                x: mousePos.x,
                y: mousePos.y,
                width: this.robotWidth * this.pxperinch,
                height: this.robotLength * this.pxperinch,
                offsetX: this.robotWidth * this.pxperinch / 2,
                offsetY: this.robotLength * this.pxperinch / 2,
                stroke: this.newColor,
                strokeWidth: 5 / 3 * this.pxperinch,
                cornerRadius: 5 / 3 * this.pxperinch,
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
              this.distance = Math.round(dis / this.pxperinch * 5) / 5;
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
              this.angle = Math.round(ang * 2) / 2;
              //
            } else {
              //
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
                this.curX /* + this.nextX*/ + x1 * this.pxperinch,
                this.curY /* + this.nextY*/ - y1 * this.pxperinch
              ],
              stroke: "orange",
              strokeWidth: 4 / 3 * this.pxperinch,
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
                /*console.log(
                  "L2 components--Y: " +
                    Math.pow(this.curY - mousePos.y, 2) +
                    ", X: " +
                    Math.pow(mousePos.x - this.curX, 2)
                );*/
                //
                this.interimPoint = {
                  //
                  x: this.curX + x2,
                  y: this.curY - y2,
                  width: this.robotWidth * this.pxperinch,
                  height: this.robotLength * this.pxperinch,
                  offsetX: this.robotWidth * this.pxperinch / 2,
                  offsetY: this.robotLength * this.pxperinch / 2,
                  stroke: this.newColor,
                  strokeWidth: 5 / 3 * this.pxperinch,
                  dash: [20, 20],
                  cornerRadius: 5 / 3 * this.pxperinch,
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
                  strokeWidth: 4 / 3 * this.pxperinch,
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
                  width: this.robotWidth * this.pxperinch,
                  height: this.robotLength * this.pxperinch,
                  offsetX: this.robotWidth * this.pxperinch / 2,
                  offsetY: this.robotLength * this.pxperinch / 2,
                  stroke: this.newColor,
                  strokeWidth: 5 / 3 * this.pxperinch,
                  dash: [20, 20],
                  cornerRadius: 5 / 3 * this.pxperinch,
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
                  strokeWidth: 4 / 3 * this.pxperinch,
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
              this.distance = Math.round(l2 / this.pxperinch * 5) / -5;
              //
            } else {
              this.getStrafe();
            }
            break;
        }
      }else if(this.sideChosen == 1){//fresh auto, setting starting rotation
        let n = mousePos.x - this.startingPos.x;
        let m = this.startingPos.y - mousePos.y;
        //
        let theta1 = Math.atan(n / m);
        x1 = this.robotWidth * this.pxperinch / 2;
        y1 = this.robotLength * this.pxperinch / 2;
        //
        let a = x1 * Math.sin(theta1);
        let b = x1 * Math.cos(theta1);
        let c = a * Math.tan(theta1);
        let d = Math.sqrt(Math.pow(x1,2) + Math.pow(y1,2));
        //
        let theta2 = Math.atan(y1 / x1);
        let b2 = d * Math.cos(theta1 + theta2);
        let b1 = b - b2;
        //
        let g = 0;
        if(theta1 > 0){
          g = (1 / Math.tan(theta1)) * (c + b1);
        }else{
          g = (-1 / Math.tan(theta1)) * (c - b1);
        }
        //
        this.curX = this.startingPos.x;
        this.curY = this.fieldDim - g - (1 * this.pxperinch);
        this.curAngle = Math.round(180 * theta1 / Math.PI);
        this.startingPos.rotation = this.curAngle;
        if(mousePos.y > this.startingPos.y){//if mouse is below robot, correct atan
          this.curAngle += 180;
          //
          if(this.curAngle > 180){//if angle is 180 to 270, make it -180 to -90
            this.curAngle -= 360;
          }
        }
        //
        //console.log(`curAngle: ${this.curAngle}`);
        //
        this.interimPoint = {
          x: this.startingPos.x,
          y: this.curY,
          width: this.robotWidth * this.pxperinch,
          height: this.robotLength * this.pxperinch,
          offsetX: this.robotWidth * this.pxperinch / 2,
          offsetY: this.robotLength * this.pxperinch / 2,
          stroke: this.newColor,
          strokeWidth: 5 / 3 * this.pxperinch,
          cornerRadius: 5 / 3 * this.pxperinch,
          dash: [20, 20],
          rotation: this.curAngle,
          lineCap: "round",
          lineJoin: "round"
        };
        //
        //this.$store.commit("setSide", [this.starpos, this.startingPos]);
        //
        /*this.curX = this.startingPos.x;
        this.curY = mousePos.y;
        this.$store.commit("setSide", [this.starpos, this.startingPos.y, this.startingPos.rotation]);
        //console.log("Set Y: " + this.$store.getters.getYSide);
        this.interimPoint = {
          x: this.startingPos.x,
          y: mousePos.y,
          width: this.robotWidth * this.pxperinch,
          height: this.robotLength * this.pxperinch,
          offsetX: this.robotWidth * this.pxperinch / 2,
          offsetY: this.robotLength * this.pxperinch / 2,
          stroke: this.newColor,
          strokeWidth: 5 / 3 * this.pxperinch,
          cornerRadius: 5 / 3 * this.pxperinch,
          dash: [20, 20],
          rotation: this.startingPos.rotation,
          lineCap: "round",
          lineJoin: "round"
        };*/
      }else if(this.sideChosen == 2){//fresh auto, setting starting x position
        //
        let theta1 = this.startingPos.rotation * Math.PI / 180;
        x1 = this.robotWidth * this.pxperinch / 2;
        y1 = this.robotLength * this.pxperinch / 2;
        let d = Math.sqrt(Math.pow(x1,2) + Math.pow(y1,2));
        let b1 = 45 - theta1;
        let a1 = 45 - theta1;
        if(theta1 < 0){
          b1 = 45 + theta1;
          a1 = 45 + theta1;
        }
        let b = this.startingPos.x + (d * Math.cos(b1));
        let a = this.startingPos.x - (d * Math.cos(a1));
        //
        //console.log(`a: ${a}, mouseX: ${mousePos.x}`);
        //
        if(mousePos.x - this.nextX > b){
          this.curX = b;
        }else if(mousePos.x - this.nextX < a){
          this.curX = a;
        }else{
          this.curX = mousePos.x - this.nextX;
        }
        //this.$store.commit("setSide", [this.starpos, this.startingPos]);
        //console.log("Set Y: " + this.$store.getters.getYSide);
        this.interimPoint = {
          x: this.curX,
          y: this.curY,
          width: this.robotWidth * this.pxperinch,
          height: this.robotLength * this.pxperinch,
          offsetX: this.robotWidth * this.pxperinch / 2,
          offsetY: this.robotLength * this.pxperinch / 2,
          stroke: this.newColor,
          strokeWidth: 5 / 3 * this.pxperinch,
          cornerRadius: 5 / 3 * this.pxperinch,
          rotation: this.curAngle
        };
        //
        x1 = (this.robotLength / 2 + 5) * Math.cos((90 - this.curAngle) * Math.PI / 180);
        y1 = (this.robotLength / 2 + 5) * Math.sin((90 - this.curAngle) * Math.PI / 180);
        //
        this.directionLine = {
          x: 0,
          y: 0,
          points: [
            this.curX,
            this.curY,
            this.curX + x1 * this.pxperinch,
            this.curY - y1 * this.pxperinch
          ],
          stroke: "orange",
          strokeWidth: 4 / 3 * this.pxperinch,
          lineCap: "round"
        };
        //
        /*if (mousePos.x > this.curX) {
          a1 = 90 - Math.atan((this.curY - mousePos.y) / (mousePos.x - this.curX)) * 180 / Math.PI;
        } else {
          a1 = -180 + (90 - Math.atan((this.curY - mousePos.y) / (mousePos.x - this.curX)) * 180 / Math.PI);
        }
        //
        this.curAngle = Math.round(a1 / 90) * 90;
        //
        this.interimPoint = {
          x: this.startingPos.x,
          y: this.startingPos.y,
          width: this.robotWidth * this.pxperinch,
          height: this.robotLength * this.pxperinch,
          offsetX: this.robotWidth * this.pxperinch / 2,
          offsetY: this.robotLength * this.pxperinch / 2,
          stroke: this.newColor,
          strokeWidth: 5 / 3 * this.pxperinch,
          cornerRadius: 5 / 3 * this.pxperinch,
          rotation: this.curAngle,
          lineCap: "round",
          lineJoin: "round"
        };
        //redraw direction line
        x1 = (this.robotLength / 2 + 5) * Math.cos((90 - this.curAngle) * Math.PI / 180);
        y1 = (this.robotLength / 2 + 5) * Math.sin((90 - this.curAngle) * Math.PI / 180);
        //
        this.directionLine = {
          x: 0,
          y: 0,
          points: [
            this.curX,
            this.curY,
            this.curX + x1 * this.pxperinch,
            this.curY - y1 * this.pxperinch
          ],
          stroke: "orange",
          strokeWidth: 4 / 3 * this.pxperinch,
          lineCap: "round"
        };
        //
        this.$store.commit("setSide", [this.starpos, this.startingPos.y, this.curAngle]);
        //*/
      }
    },
    getDrive: function() {
      //function is to redraw interim point as solid
      //redraw direction line
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
          this.curX,
          this.curY,
          this.curX + x1 * this.pxperinch,
          this.curY - y1 * this.pxperinch
        ],
        stroke: "orange",
        strokeWidth: 4 / 3 * this.pxperinch,
        lineCap: "round"
      };
      //remove arcing lines
      this.interimArc = {
        stroke: ""
      };
      //calculate interim location
      var l2 = this.distance * this.pxperinch;
      var x2 = l2 * Math.cos((90 - this.curAngle) * Math.PI / 180);
      var y2 = l2 * Math.sin((90 - this.curAngle) * Math.PI / 180);
      //
      this.nextX = x2;
      this.nextY = y2 * -1;
      //draw interim point
      this.interimPoint = {
        //
        x: this.curX + x2,
        y: this.curY - y2,
        width: this.robotWidth * this.pxperinch,
        height: this.robotLength * this.pxperinch,
        offsetX: this.robotWidth * this.pxperinch / 2,
        offsetY: this.robotLength * this.pxperinch / 2,
        stroke: this.newColor,
        strokeWidth: 5 / 3 * this.pxperinch,
        cornerRadius: 5 / 3 * this.pxperinch,
        rotation: this.curAngle,
        lineCap: "round",
        lineJoin: "round"
      };
      //draw interim line
      this.interimLine = {
        x: 0,
        y: 0,
        points: [this.curX, this.curY, this.curX + x2, this.curY - y2],
        stroke: this.newColor,
        strokeWidth: 4 / 3 * this.pxperinch,
        lineCap: "round",
        lineJoin: "round"
      };
      //lock interim point
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
        strokeWidth: 4 / 3 * this.pxperinch,
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
        strokeWidth: 4 / 3 * this.pxperinch,
        lineCap: "round",
        lineJoin: "round"
      };
      //
      this.interimPoint = {
        x: this.curX,
        y: this.curY,
        width: this.robotWidth * this.pxperinch,
        height: this.robotLength * this.pxperinch,
        offsetX: this.robotWidth * this.pxperinch / 2,
        offsetY: this.robotLength * this.pxperinch / 2,
        stroke: this.newColor,
        strokeWidth: 5 / 3 * this.pxperinch,
        cornerRadius: 5 / 3 * this.pxperinch,
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
          strokeWidth: 4 / 3 * this.pxperinch,
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
          strokeWidth: 4 / 3 * this.pxperinch,
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
        this.pxperinch *
        Math.cos((Number(ang) + this.curAngle) * Math.PI / 180);
      this.nextAx =
        this.distance *
        this.pxperinch *
        Math.sin((Number(ang) + this.curAngle) * Math.PI / 180);
      //
      //console.log("angle: " + (Number(ang) + this.curAngle));
      //
      /*console.log(
        "ayL: " +
          this.distance * this.pxperinch * Math.cos((ang + this.curAngle) * Math.PI / 180)
      );
      //console.log(
        "axL: " +
          this.distance * this.pxperinch * Math.sin((ang + this.curAngle) * Math.PI / 180)
      );*/
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
        points: [this.curX, this.curY, this.curX + x1 * this.pxperinch, this.curY - y1 * this.pxperinch],
        stroke: "orange",
        strokeWidth: 4 / 3 * this.pxperinch,
        lineCap: "round"
      };
      //
      this.interimLine = null;
      //
      var curA = this.curAngle;
      //console.log("curA: " + curA);
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
      /*console.log(
        "D1: " + d1 + ", A1: " + a1 + ", R: " + r + ", X1: " + x1 + ", Y1: " + y1 + ", Perp: " + perp + ", Par: " + par);
      /*/
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
          strokeWidth: 4 / 3 * this.pxperinch,
          lineCap: "round",
          lineJoin: "round"
        };
        //console.log("Angle: " + 2 * (90 + a1 + curA));
        //console.log("Rotation: " + (start + (360 - 2 * (90 + a1 + curA))));
      } else if (this.nextAy <= perp) {
        this.interimArc = {
          x: this.curX + x1,
          y: this.curY - y1,
          innerRadius: r,
          outerRadius: r,
          angle: a2,
          rotation: curA - 180,
          stroke: this.newColor,
          strokeWidth: 4 / 3 * this.pxperinch,
          lineCap: "round",
          lineJoin: "round"
        };
        //console.log("first");
      } else {
        this.interimArc = {
          x: this.curX + x1,
          y: this.curY - y1,
          innerRadius: r,
          outerRadius: r,
          angle: a2,
          rotation: curA,
          stroke: this.newColor,
          strokeWidth: 4 / 3 * this.pxperinch,
          lineCap: "round",
          lineJoin: "round"
        };
        //console.log("Fourth");
      }
      //
      this.interimPoint = {
        x: this.nextAx,
        y: this.nextAy,
        width: this.robotWidth * this.pxperinch,
        height: this.robotLength * this.pxperinch,
        offsetX: this.robotWidth * this.pxperinch / 2,
        offsetY: this.robotLength * this.pxperinch / 2,
        stroke: this.newColor,
        strokeWidth: 5 / 3 * this.pxperinch,
        cornerRadius: 5 / 3 * this.pxperinch,
        rotation: this.curAngle - (curA + (a1 + 90)) * 2,
        lineCap: "round",
        lineJoin: "round"
      };
      //
      //console.log("Ay: " + this.nextAy + " , Ax: " + this.nextAx);
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
          this.curX /* + this.nextX*/ + x1 * this.pxperinch,
          this.curY /* + this.nextY*/ - y1 * this.pxperinch
        ],
        stroke: "orange",
        strokeWidth: 4 / 3 * this.pxperinch,
        lineCap: "round"
      };
      //
      this.interimArc = {
        stroke: ""
      };
      //
      var l2 = this.distance * this.pxperinch;
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
        width: this.robotWidth * this.pxperinch,
        height: this.robotLength * this.pxperinch,
        offsetX: this.robotWidth * this.pxperinch / 2,
        offsetY: this.robotLength * this.pxperinch / 2,
        stroke: this.newColor,
        strokeWidth: 5 / 3 * this.pxperinch,
        cornerRadius: 5 / 3 * this.pxperinch,
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
        strokeWidth: 4 / 3 * this.pxperinch,
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
        width: this.robotWidth * this.pxperinch,
        height: this.robotLength * this.pxperinch,
        offsetX: this.robotWidth * this.pxperinch / 2,
        offsetY: this.robotLength * this.pxperinch / 2,
        stroke: this.newColor,
        strokeWidth: 5 / 3 * this.pxperinch,
        cornerRadius: 5 / 3 * this.pxperinch,
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
        strokeWidth: 4 / 3 * this.pxperinch,
        lineCap: "round",
        lineJoin: "round"
      };
    },
    recallAuto: function(){
      //this function is called when an auto has already been created, not deleted, and returned to
      //console.log("I've entered the function.");
      //
      this.curX = this.startingPos.x;
      this.curY = this.startingPos.y;
      this.curAngle = this.startingPos.rotation;
      //
      var steps = this.$store.getters.getTheSteps;
      if(steps.length >= 1){//there are saved steps
        this.recalling = true;
        for (var i = 0; i < steps.length; i++) {
          //do point + line
          //console.log("Step type: " + steps[i].type);
          switch (steps[i].type) {//redraw step in progress
            case MovementOptions.DRIVE:
              this.distance = steps[i].params.distance;
              var mx =
                this.distance * this.pxperinch * Math.cos((90 - this.curAngle) * Math.PI / 180);
              var my =
                this.distance * this.pxperinch * Math.sin((90 - this.curAngle) * Math.PI / 180);
              //
              this.nextX = mx;
              this.nextY = -my;
              //
              var grad = this.createGradient(this.stepColors[this.currentColor], this.stepColors[this.currentColor + 1], 5, this.curX, this.curY, this.curX + this.nextX, this.curY + this.nextY);
              //
              this.lines.push({//push line to new position
                x: 0,
                y: 0,
                points: [
                  this.curX,
                  this.curY,
                  this.curX + this.nextX,
                  this.curY + this.nextY
                ],
                stroke: grad,
                strokeWidth: 4 / 3 * this.pxperinch,
                lineCap: "round"
              });
              //
              this.points.push({//push point of old position
                //
                x: this.curX,
                y: this.curY,
                rotation: this.curAngle,
                width: this.robotWidth * this.pxperinch,
                height: this.robotLength * this.pxperinch,
                offsetX: this.robotWidth * this.pxperinch / 2,
                offsetY: this.robotLength * this.pxperinch / 2,
                stroke: this.stepColors[this.currentColor],
                strokeWidth: 5 / 3 * this.pxperinch,
                cornerRadius: 5 / 3 * this.pxperinch
              });
              this.curX = this.curX + this.nextX;
              this.curY = this.curY + this.nextY;
              break;
            case MovementOptions.TURN:
              this.angle = steps[i].params.angle;
              //
              this.nextAngle = this.curAngle + this.angle;
              //
              if (this.angle > 0) {//push arc to new angle
                //console.log("Positive Change");
                this.arcs.push({
                  x: this.curX,
                  y: this.curY,
                  innerRadius: 0,
                  outerRadius: 50,
                  angle: this.angle,
                  rotation: this.curAngle - 90,
                  stroke: this.stepColors[this.currentColor + 1],
                  strokeWidth: 4 / 3 * this.pxperinch,
                  lineCap: "round",
                  lineJoin: "round"
                });
              } else {
                //console.log("Negative change");
                this.arcs.push({
                  x: this.curX,
                  y: this.curY,
                  innerRadius: 0,
                  outerRadius: 50,
                  angle: -this.angle,
                  rotation: this.nextAngle - 90,
                  stroke: this.stepColors[this.currentColor + 1],
                  strokeWidth: 4 / 3 * this.pxperinch,
                  lineCap: "round",
                  lineJoin: "round"
                });
              }
              //
              this.points.push({//push point of old angle
                x: this.curX,
                y: this.curY,
                rotation: this.curAngle,
                width: this.robotWidth * this.pxperinch,
                height: this.robotLength * this.pxperinch,
                offsetX: this.robotWidth * this.pxperinch / 2,
                offsetY: this.robotLength * this.pxperinch / 2,
                stroke: this.stepColors[this.currentColor],
                strokeWidth: 5 / 3 * this.pxperinch,
                cornerRadius: 5 / 3 * this.pxperinch
              });
              //
              this.curAngle = this.curAngle + this.angle;
              break;
            case MovementOptions.ARC:
              this.distance = steps[i].params.distance;
              this.angle = steps[i].params.angle;
              //
              this.points.push({//push point of old position
                x: this.curX,
                y: this.curY,
                rotation: this.curAngle,
                width: this.robotWidth * this.pxperinch,
                height: this.robotLength * this.pxperinch,
                offsetX: this.robotWidth * this.pxperinch / 2,
                offsetY: this.robotLength * this.pxperinch / 2,
                stroke: this.stepColors[this.currentColor],
                strokeWidth: 5 / 3 * this.pxperinch,
                cornerRadius: 5 / 3 * this.pxperinch
              });
              //crazy math starts here
              var ang = Number(this.angle);
              if (ang / 90 == Math.round(ang / 90)) {
                ang += 0.1;
              }
              //
              this.nextAy =
                this.distance *
                this.pxperinch *
                Math.cos((Number(ang) + this.curAngle) * Math.PI / 180);
              this.nextAx =
                this.distance *
                this.pxperinch *
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
              var x1 = r * Math.cos(-1 * curA * Math.PI / 180);
              var y1 = r * Math.sin(-1 * curA * Math.PI / 180);
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
              //crazy math ends here, draw arcs
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
                  stroke: this.stepColors[this.currentColor + 1],
                  strokeWidth: 4 / 3 * this.pxperinch,
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
                  stroke: this.stepColors[this.currentColor + 1],
                  strokeWidth: 4 / 3 * this.pxperinch,
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
                  stroke: this.stepColors[this.currentColor + 1],
                  strokeWidth: 4 / 3 * this.pxperinch,
                  lineCap: "round",
                  lineJoin: "round"
                });
              }
              //
              this.curX = this.nextAx;
              this.curY = this.nextAy;
              //
              var nang = this.curAngle - (this.curAngle + (a1 + 90)) * 2;
              if (this.nextAy > perp && Math.abs(this.curAngle) < 90) {
                nang += 180;
              }
              if (nang > 180) {
                nang -= 360;
              } else if (nang < -180) {
                nang += 360;
              }
              this.curAngle = nang;
              //
              break;
            case MovementOptions.STRAFE:
              this.distance = steps[i].params.distance;
              //
              mx =
                this.distance * this.pxperinch * Math.cos((180 - this.curAngle) * Math.PI / 180);
              my =
                this.distance *  this.pxperinch* Math.sin((180 - this.curAngle) * Math.PI / 180);
              //
              this.nextX = -mx;
              this.nextY = my;
              //console.log("mx: " + this.nextX + ", my: " + this.nextY);
              //console.log("x: " + (this.curX + this.nextX) + ", y: " + (this.curY + this.nextY));
              //
              grad = this.createGradient(this.stepColors[this.currentColor], this.stepColors[this.currentColor + 1], 5, this.curX, this.curY, this.curX + this.nextX, this.curY + this.nextY);
              //
              this.lines.push({//push line to new position
                x: 0,
                y: 0,
                points: [
                  this.curX,
                  this.curY,
                  this.curX + this.nextX,
                  this.curY + this.nextY
                ],
                stroke: grad,
                strokeWidth: 4 / 3 * this.pxperinch,
                lineCap: "round"
              });
              //
              this.points.push({//push point of old position
                //
                x: this.curX,
                y: this.curY,
                rotation: this.curAngle,
                width: this.robotWidth * this.pxperinch,
                height: this.robotLength * this.pxperinch,
                offsetX: this.robotWidth * this.pxperinch / 2,
                offsetY: this.robotLength * this.pxperinch / 2,
                stroke: this.stepColors[this.currentColor],
                strokeWidth: 5 / 3 * this.pxperinch,
                cornerRadius: 5 / 3 * this.pxperinch
              });
              //
              this.curX = this.curX + this.nextX;
              this.curY = this.curY + this.nextY;
              break;
          }
          //
          if (this.currentColor > this.stepColors.length - 3) {
            this.currentColor = 0;
          } else {
            this.currentColor++;
          }
          //
          //console.log("I'm on step: " + (i + 1));
          /*
          Steps:
          1. Determine step type
          2. Update nextX, nextY, nextAngle
          3. Draw Current Position
          4. Draw line to Next Position
          5. Update curX, curY, curAngle
          6. Repeat
          */
        }
        //
        this.points.push({//push final green curPos
          x: this.curX,
          y: this.curY,
          rotation: this.curAngle,
          width: this.robotWidth * this.pxperinch,
          height: this.robotLength * this.pxperinch,
          offsetX: this.robotWidth * this.pxperinch / 2,
          offsetY: this.robotLength * this.pxperinch / 2,
          stroke: "#32cd32",
          strokeWidth: 5 / 3 * this.pxperinch,
          cornerRadius: 5 / 3 * this.pxperinch
        });
        //
      }else{//there are no saved steps
        this.points.push({
            x: this.startingPos.x,
            y: this.startingPos.y,
            width: this.robotWidth * this.pxperinch,
            height: this.robotLength * this.pxperinch,
            offsetX: this.robotWidth * this.pxperinch / 2,
            offsetY: this.robotLength * this.pxperinch / 2,
            stroke: "#32cd32",
            strokeWidth: 5 / 3 * this.pxperinch,
            cornerRadius: 5 / 3 * this.pxperinch,
            rotation: this.startingPos.rotation,
            lineCap: "round",
            lineJoin: "round"
          });
          this.curX = this.startingPos.x;
          this.curY = this.startingPos.y;
      }
      this.distance = this.$store.getters.getInterim.distance;//get interim data
      this.angle = this.$store.getters.getInterim.angle;
      //
      switch (this.$store.getters.currentStep) {//redraw step in progress
        case MovementOptions.DRIVE:
          this.getDrive();
          break;
        case MovementOptions.TURN:
          this.getTurn();
          break;
        case MovementOptions.ARC:
          this.getArc();
          break;
        case MovementOptions.STRAFE:
          this.getStrafe();
          break;
      }
    }
  },
  mounted() {
    //console.log("Created called");
    //console.log("chassis: " + this.$store.getters.chassis);
    //
    var scrw = window.innerWidth;//get screen width
    var scrh = window.innerHeight;//get screen height
    //
    //console.log(`Width: ${scrw}, Height: ${scrh}`);
    //
    if (this.$store.getters.chassis == null) {//Go home if no chassis
      this.$router.push("/");
    }
    if(!this.$store.getters.getFirstChassis){
      //alert("Please note: the current starting position system is outdated, and will be updated shortly.");
    }
    //
    if(!this.$store.getters.getYSide){
      //set field dimensions
      var factor = 0;
      if(scrh / scrw > 0.481){//bigger height than normal
        factor = scrw / 1422;
      }else{//bigger width than normal
        factor = scrh / 684;
      }
      this.pxperinch = 3 * factor;
      this.fieldDim = (423 / 3) * this.pxperinch;
      //
      this.$store.commit("setPx", this.pxperinch);
    }else{
      this.pxperinch = this.$store.getters.getPxPerInch;
      this.fieldDim = (423 / 3) * this.pxperinch;
    }
    //
    if(this.$store.getters.getDBias){//fresh auto
      //
      if(this.$store.getters.chassis == 'meccanum'){//meccy bias
        this.bias = 0.8;
        //console.log("Restore bias");
      }else if(this.$store.getters.chassis == 'holonomic'){//holo bias
        this.bias = 0.714;
      }
    }else{//Recall auto - bias
      this.bias = this.$store.getters.getBias;
    }
    this.name = this.$store.getters.getName;
    //
    this.distance = 30;
    this.angle = 45;
    //
    if(this.$store.getters.getDimChange){
      this.robotWidth = this.$store.getters.getWidth;
      this.robotLength = this.$store.getters.getLength;
    }
    //
    this.cpr = this.$store.getters.getCPI[0];
    this.gearratio = this.$store.getters.getCPI[1];
    this.diameter = this.$store.getters.getCPI[2];
    if(this.$store.getters.getCPIShow != "CPI Presets"){//Recall auto - CPI
      this.cpi = this.$store.getters.getCPIShow;
    }
    if(this.$store.getters.getSide != "Starting Side"){//Recall auto - starting side
      this.starpos = this.$store.getters.getSide;
      //console.log("Starpos: " + this.starpos);
      this.laststarpos = this.starpos;
      //console.log(`Interim: ${this.$store.getters.getInterim.angle}`);
      if(this.$store.getters.getInterim.angle == ""){//position hasn't been finalized
        this.sideChosen = 0;
        this.confirmDelete();
      }else{//pos is final
        this.sideChosen = 3;
        //console.log(this.$store.getters.getYSide);
        this.startingPos.y = this.$store.getters.getYSide;
        this.startingPos.x = this.$store.getters.getXSide;
        this.startingPos.rotation = this.$store.getters.getStartRot;
        this.curAngle = this.startingPos.rotation;
        //console.log(`Stating rotation: ${this.curAngle}`);
        this.recallAuto();
      }
    }
    //
  },
  data: () => ({
    presets: ["Gear ratio: 20", "Gear ratio: 40", "Gear ratio: 60", "Custom"],
    starts: ["left blue", "right blue", "left red", "right red"],
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
    cpr: 28,
    gearratio: 40,
    diameter: 4.125,
    bias: 1,
    name: null,
    stepInProgress: true,
    interimPoint: null,
    interimLine: null,
    interimArc: null,
    directionLine: null,
    field: require("@/assets/Pictures/ultimateField.png"),
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
    laststarpos: "Starting Side",
    cpi: "CPI Presets",
    chosen: 0,
    deleteWarning: false,
    inputAlert: true,
    points: [],
    arcs: [],
    lines: [
      {
        points: [147, 240, 200, 200]
      }
    ],
    stepColors: [
      "#ff0000",
      "#ffa600",
      "#fff700",
      "#00ff55",
      "#00ffff",
      "#2b00ff",
      "#ff00ff",
      "#ff0000"
    ],
    currentColor: 0,
    recalling: false
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
  left: .5%;
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
  font-size: 100%;
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

.stepNumber {
  display: inline-block;
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
