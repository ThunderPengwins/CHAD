<template>
<div>
    <h1 class="words">
        Uh oh. You've got yourself a 404.
    </h1>
    <p class="words">Things may look bad, but don't panic. Click this cat meme to go home:</p>
    <img v-on:click="goHome()" style="cursor: pointer" src="@/assets/Miscellaneous/computerCat.gif"/>
</div>
</template>

<script>
export default {
    methods: {
        goHome: function(){
            this.$router.push('/');
        }
    }
}
</script>

<style>
.words{
  text-align: center;
  margin: 1%;
  font-family: 'Montserrat', sans-serif;
  font-weight: bold;
}
</style>