<template>
<div>
    <v-bottom-nav
      :active.sync="bottomNav"
      :value="true"
      absolute
      color="white"
      shift
    >
      <v-btn
        color="rgba(100,230,209)"
        flat
        value="Home"
        to="/"
      >
        <span>Home</span>
        <v-icon>home</v-icon>
      </v-btn>

      <v-btn
        color="rgba(100,230,209)"
        flat
        value="Creator"
        to="/Creator"
        v-if="$store.getters.chassis"
      >
        <span>Creator</span>
        <v-icon>create</v-icon>
      </v-btn>

      <v-btn
        color="rgba(100,230,209)"
        flat
        value="Generate"
        to="/Generate"
        v-if="$store.getters.getGenerateVisibility"
      >
        <span>Generate</span>
        <v-icon>code</v-icon>
      </v-btn>
      
      <v-btn
        color="rgba(100,230,209)"
        flat
        value="Scorer"
        to="/Scorer"
      >
        <span>Scoring</span>
        <v-icon>stars</v-icon>
      </v-btn>

      <v-btn
        color="rgba(100,230,209)"
        flat
        value="nearby"
        to="/TipsNInfo"
      >
        <span>Tips & Info</span>
        <v-icon>info</v-icon>
      </v-btn>
    </v-bottom-nav>
</div>
</template>

<script>
export default {
    name: 'BottomNavigation',
    data () {
      return {
        bottomNav: 'recent'
      }
    }
}
</script>

<style>
.hide{
  visibility: hidden;
}

.show{
  visibility: visible;
}
</style>
