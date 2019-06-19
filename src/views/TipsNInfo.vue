<template>
<div class="bkgd">
    <div class="top">
        <img src="@/assets/Pictures/chadLogo.jpg" class="logo">
    </div>
    <div class="main">
        <v-expansion-panel class="panel">
            <v-expansion-panel-content>
      <template v-slot:header>
        <div>General Process</div>
      </template>
      <v-card>
        <v-card-text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</v-card-text>
      </v-card>
    </v-expansion-panel-content>
    <v-expansion-panel-content>
      <template v-slot:header>
        <div>Balloon facts<img src="https://www.dollartree.com/ccstore/v1/images/?source=/file/v8200564444066591050/products/174788.jpg&height=475&width=475" class="balloon"/></div>
      </template>
      <v-card>
        <v-card-text>I am a Balloon</v-card-text>
      </v-card>
    </v-expansion-panel-content>
        </v-expansion-panel>
    </div>
</div>
</template>

<script>
export default {
    name: "TipsNInfo",
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

.main{
    width: 94%;
    margin: 3%;
    height: 91%;
    top: 5%;
    position: absolute;
    border-radius: 5px;
}

.panel{
    border-radius: 5px;
}

.balloon{
    width: 10%;
}

</style>
