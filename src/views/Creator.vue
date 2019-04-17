<template>
<div class="bkgd">
    <div class="top">
        <img src="@/assets/Pictures/chadLogo.jpg" class="logo">
    </div>
    <div class="interface">
        <input v-model="message" placeholder="Autonomous name" id="in-name"/>
        <p class="display">Chassis: {{ $store.getters.chassis }}</p>
        <v-container class="encoders" grid-list-xl>
            <v-layout row wrap>
                <v-flex xs12 sm4>
                    <v-overflow-btn :items="presets" label="cpi presets" target="#encoders"></v-overflow-btn>
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
      presets: ['Preset 1', 'Preset 2', 'Preset 3', 'Custom']
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
    position: absolute;
    padding: 3px;
    margin: 3%;
    left: 3%;
    color: black;
    font-family: 'Montserrat', sans-serif;
}

.display{
    position: absolute;
    margin: 3%;
    padding: 3px;
    left: 23%;
    font-family: 'Montserrat', sans-serif;
}

#encoders{
    position: absolute;
    left: 40%;
    margin: 3%;
}
</style>
