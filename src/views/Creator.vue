<template>
<div class="bkgd">
    <div class="top">
        <img src="@/assets/Pictures/chadLogo.jpg" class="logo">
    </div>
    <div class="interface">
        <v-container class="encoders" fluid grid-list-m box>
            <v-layout row>
                <v-flex align-content-start sm3>
                    <input v-model="message" placeholder="Autonomous name" id="in-name"/>
                </v-flex>
                <v-flex sm3>
                    <p class="chassischoice">Chassis: {{ $store.getters.chassis }}</p>
                </v-flex>
                <v-flex sm3>
                    <v-overflow-btn outline color="gray" style="margin-top: 0em" height="2em" margin="0em" :items="presets" label="cpi presets" target=".encoders"></v-overflow-btn>
                </v-flex>
                <v-flex sm3>
                    <input type="number" v-model="message" placeholder="Movement bias" id="in-bias"/>
                </v-flex>
            </v-layout>
            <v-layout row>
                <v-layout row wrap>
                <v-flex sm12>
                    <div id="field">
                        <br/>I am a field?<br/><br/><br/>Supposedly<br/>.
                    </div>
                </v-flex>
                </v-layout>
                <v-flex sm4>
                    <v-btn>Move</v-btn>
                </v-flex>
                <v-flex sm4>
                    <v-btn>Turn</v-btn>
                </v-flex>
                <v-flex sm4 v-if=$store.getters.isArcingAvail>
                    <v-btn>Arcing</v-btn>
                </v-flex>
                <v-flex sm4 v-if=!$store.getters.isArcingAvail>
                    <v-btn>Strafing</v-btn>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
    <bottom-navigation>
    </bottom-navigation>
</div>
</template>

<script>
import BottomNavigation from '@/components/BottomNavigation'
export default {
    name: "Creator",
    components: {
    BottomNavigation
  },
  data: () => ({
      presets: ['Gear ratio: 20', 'Gear ratio: 40', 'Gear ratio: 60', 'Custom']
    })
}
</script>

<style>
#top{
    height: 5%;
    width: 100%;
    top: 0%;
    position: absolute;
}

#logo{
    width: 10%;
}

#bkgd{
    margin: 0%;
}

.interface{
    background-color: white;
    border-radius: 5px;
    position: absolute;
    margin: 3%;
    width: 94%;
    height: 80%;
    top: 3%;
}

#in-name{
    border: 2px solid gray;
    border-radius: 4px;
    padding: 3px;
    color: black;
    font-family: 'Montserrat', sans-serif;
}

#in-bias{
    border: 2px solid gray;
    border-radius: 4px;
    padding: 3px;
    color: black;
    font-family: 'Montserrat', sans-serif;
}

.chassischoice{
    font-family: 'Montserrat', sans-serif;
}

#field{
    background-color: gray;
    height: 100%;
    border-radius: 5px;
}

</style>
