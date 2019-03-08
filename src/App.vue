<template>
  <div id="app">
    <div class="bkgd">
      <h1 id="title">insert CHAD logo here</h1>
      <p class ="words">
        &emsp;&emsp;&emsp;Welcome to CHAD! CHAD is online FTC autonomous program builder,
        meant to help program all movement in autonomous programs. CHAD works with four different types of chasses,
        which are shown below.
      </p>
    </div>
  </div>
</template>

<script>

export default {
  name: 'app',
  components: {
    
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
  margin-top: 60px;
}

#title{
  color: green;
}

.bkgd{
  top: 5%;
  bottom: 15%;
  left: 3%;
  right: 3%;
  position: absolute;
  border-radius: 5px;
  background-color: lightgrey;
}

.words{
  text-align: left;
  margin-left: 3%;
  font-family: 'Montserrat', sans-serif;
}
</style>
