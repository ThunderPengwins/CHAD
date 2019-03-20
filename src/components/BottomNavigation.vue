<template>
<div>
    <v-bottom-nav
      :active.sync="bottomNav"
      :value="true"
      absolute
      color="transparent"
    >
      <v-btn
        color="teal"
        flat
        value="Home"
        to="/"
      >
        <span>Home</span>
        <v-icon>home</v-icon>
      </v-btn>

      <v-btn
        color="teal"
        flat
        value="Creator"
        to="/Creator"
      >
        <span>Creator</span>
        <v-icon>create</v-icon>
      </v-btn>

      <v-btn
        color="teal"
        flat
        value="nearby"
      >
        <span>Nearby</span>
        <v-icon>place</v-icon>
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
