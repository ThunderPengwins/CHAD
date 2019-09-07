<template>
  <div id="app">
    <div class="top">
        <img src="@/assets/Pictures/chadLogo.jpg" alt="Logo" class="logo">
    </div>
    <div class="topbkgd">
      <v-carousel  hide-controls height="100%" class="carol">
        <v-carousel-item v-for="(item,i) in items" :key="i" :src="item.src">
          <v-img contain :src="item"></v-img>
        </v-carousel-item>
    </v-carousel>
    </div>
    <h1 class="desc">Select Chassis:</h1>
    <div class="bottom">
     <v-btn color="rgba(100,230,209)" outline v-bind:class="{betterBaton:$store.getters.chassis == 'traction', baton:$store.getters.chassis != 'traction'}" v-on:click="chassisChanged('traction')"><img src="@/assets/Pictures/TractionB.png" alt="traction" class="chaspic"/></v-btn>
     <v-btn color="rgba(100,230,209)" outline v-bind:class="{betterBaton:$store.getters.chassis == 'omni wheel', baton:$store.getters.chassis != 'omni wheel'}" v-on:click="chassisChanged('omni wheel')"><img src="@/assets/Pictures/OmniB.png" alt="omni" class="chaspic"/></v-btn>
     <v-btn color="rgba(100,230,209)" outline v-bind:class="{betterBaton:$store.getters.chassis == 'meccanum', baton:$store.getters.chassis != 'meccanum'}" v-on:click="chassisChanged('meccanum')"><img src="@/assets/Pictures/MeccanumB.png" alt="meccanum" class="chaspic"/></v-btn>
     <v-btn color="rgba(100,230,209)" v-bind:class="{betterBaton:$store.getters.chassis == 'holonomic', baton:$store.getters.chassis != 'holonomic'}" v-on:click="chassisChanged('holonomic')" outline><img src="@/assets/Pictures/Holonomic.png" alt="holonomic" class="chaspic"/></v-btn>
    </div>
    <v-dialog v-model="openWarning" width="500">
      <v-card>
        <v-card-title class="headline" primary-title>WARNING</v-card-title>
        <v-card-text class="popup-text">
          Reselecting your chassis will remove all steps in your current autonomous.
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="popup-button" flat @click="openWarning = false">Cancel</v-btn>
          <v-btn class="popup-button" flat @click="bunnyOctopus()">Okay</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
var file1 = require('@/assets/slideshow/p1.jpg')

import { MovementOptions } from "@/store/steps";
export default {
  name: 'Home',
  methods: {
    chassisChanged: function(chassis){
      if(chassis == "traction" || chassis == "omni wheel"){
        if (this.$store.getters.getFirstChassis){
          this.chassis = chassis;
          this.openWarning = true;
        }else{
          this.$store.commit("setFirstChassis");
          this.$store.commit('changeChassis', chassis);
          this.$router.push('/Creator');
        }
      }else{
        alert("This chassis hasn't been fine tuned yet. We hope to get this done in the next few weeks.");
      }
    },
    bunnyOctopus: function(){
      this.$router.push('/Creator');
      this.openWarning = false;
      this.$store.commit('changeChassis', this.chassis);
      this.$store.commit("setCurrentStep", MovementOptions.DRIVE);
    }
  },
  data () {
      return {
        items: [
          {
            src: file1
          },
          {
            src: 'https://www.brookings.edu/wp-content/uploads/2017/11/metro_20171121_tech-empowers-tech-polarizes-mark-muro.jpg'
          },
          {
            src: 'https://www.homage.sg/wp-content/uploads/2018/09/47724337_l-1080x675.jpg'
          },
          {
            src: 'http://www.sandiego-tech.com/wp-content/uploads/2016/09/tech3.jpg'
          }
        ],
        openWarning: false,
        chassis: ''
      }
    }
}
</script>


<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow: hidden;
}

::-webkit-scrollbar { 
    display: none; 
}

.top{
  background-color: black;
  width: 100%;
  height: 100%;
  top: 0%;
  position: absolute;
}

.topbkgd{
  height: 30%;
  width: 94%;
  position: absolute;
  top: 3%;
  margin: 3%;
  background-color: rgb(12, 12, 12);
}

.carol{
  height: 35%;
  border-radius: 5px;
}

.desc{
  top: 40%;
  margin: 1%;
  position: absolute;
  width: 18%;
  left: 40%;
  text-align: center;
  color: white;
  font-family: 'Montserrat', sans-serif;
}

.bottom{
  height: 36%;
  width: 94%;
  position: absolute;
  top: 44%;
  margin: 3%;
}

.baton{
  height: 100%;
  width: 23%;
  margin: 1%;
  vertical-align: top;
}

.betterBaton{
  height: 100%;
  width: 23%;
  margin: 1%;
  color: red;
}

.words{
  text-align: left;
  margin: 3%;
  font-family: 'Montserrat', sans-serif;
  font-weight: bold;
}

.chaspic{
  height: 100%;
  width: 100%;
}

.logo{
  width: 10%;
  position: absolute;
  left: 4%;
  top: 0.7em;
}

.popup-button{
    background-color: lightgray;/*rgb(100,230,209);*/
}

.headline{
  background-color: red;
}

</style>
