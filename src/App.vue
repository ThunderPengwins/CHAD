<template>
  <div id="app">
    <div class="bkgd">
      <h1 id="title">Is this working?</h1>
      <p class ="words">
        Welcome to CHAD!<br/>This is where you do all of your autonomous coding forever more.
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
}
</style>
