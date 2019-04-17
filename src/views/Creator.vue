<template>
<div class="bkgd">
    <div class="top">
        <img src="@/assets/Pictures/chadLogo.jpg" class="logo">
    </div>
    <div class="interface">
        <input v-model="message" placeholder="Autonomous name" id="in-name"/>
        <div class="cchas"><p class="chassischoice">Chassis: {{ $store.getters.chassis }}</p></div>
        <v-container class="encoders" grid-list-xl>
            <v-layout row wrap>
                <v-flex sm3>
                    <v-overflow-btn outline color="gray" style="margin-top: 0em" height="2em" margin="0em" :items="presets" label="cpi presets" target=".encoders"></v-overflow-btn>
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

.chassischoice{
    font-family: 'Montserrat', sans-serif;
}

.cchas{
    padding:3px;
    position: absolute;
    margin: 3%;
    left: 23%;
}

.encoders{
    position: absolute;
    left: 40%;
    top: 0%;
    padding: 0%;
    margin: 0%;
}

#hope{
    border: 2px solid gray;
}
</style>
