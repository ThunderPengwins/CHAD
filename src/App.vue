<template>
  <v-app>
    <router-view></router-view>
    <bottom-navigation></bottom-navigation>
  </v-app>
</template>

<script>
import BottomNavigation from '@/components/BottomNavigation'
export default {
  name: 'app',
  components: {
      BottomNavigation
  }
}
</script>

<style>
</style>
