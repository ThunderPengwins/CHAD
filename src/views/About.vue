<template>
  <div class="about">
    <h1 class="words">Holy cow! You found an Easter Egg! Have a present:</h1>
    <img  v-on:click="goBalloon()" style="cursor: pointer" src="https://cdn.shopify.com/s/files/1/1061/1924/products/Gift_Present_Emoji_large.png?v=1480481039" alt="Whoops">
  </div>
</template>

<script>
export default {
    methods: {
        goBalloon: function(){
            this.$router.push('/balloon');
        }
    }
}
</script>

<style>
.words{
  text-align: left;
  margin: 1%;
  font-family: 'Montserrat', sans-serif;
  font-weight: bold;
}
</style>
