<template>
  <div id="app">
    <div class="top">
        <h1 id="title">insert CHAD logo here</h1>
    </div>
    <div class="bkgd">
      <p class ="words">
        &emsp;&emsp;&emsp;Welcome to CHAD! CHAD is online FTC autonomous program builder,
        meant to help program all movement in autonomous programs. CHAD works with four different types of chasses,
        which are shown below.<br/>
        <img src="https://cdn10.bigcommerce.com/s-cn6mxlx/products/1459/images/3382/GR-LJ-Chassis-Tracer-Suspension-1200__92452.1509032823.1280.1280.jpg?c=2" alt="First Chassis" class="chaspic">
        <img src="@/assets/Pictures/4omnitest.jpg" alt="Second Chassis" class="chaspic">
        <img src="https://ae01.alicdn.com/kf/HTB1D228bx6I8KJjSszfq6yZVXXaG/MT200S-4WD-100mm-Omni-Wheels-Robot-Car-Chassis-Stainsteel-Frame-Big-Power-Motor-For-DIY-Toy.jpg_640x640.jpg" alt="Third Chassis" class="chaspic">
        <img src="https://www.superdroidrobots.com/images/TP/TP-152-004.jpg" alt="Fourth Chassis" class="chaspic">
        <br/>
        In addition to having one of these four chasses, you must have encoders and a gyro
        in order for CHAD to work. If you fit these requirements, follow these steps to get started:<br/>
        &emsp;&emsp;&emsp;1.&emsp;Click Start! and choose your chassis<br/>
        &emsp;&emsp;&emsp;2.&emsp;Enter your encoder count to wheel circumference radius in the input box 
        (see below for details)<br/>
        &emsp;&emsp;&emsp;3.&emsp;Click a movement icon to add a step to your autonomous<br/>
        &emsp;&emsp;&emsp;4.&emsp;Enter the neccesary inputs to complete the step<br/>
        &emsp;&emsp;&emsp;5.&emsp;Repeat steps 3 and 4 until you're finished building your autonomous<br/>
        &emsp;&emsp;&emsp;6.&emsp;Click generate code to get automatically generated code!<br/>
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
  overflow: hidden;
}

::-webkit-scrollbar { 
    display: none; 
}

#title{
  color: green;
  top: 5%;
  text-align: center;
  margin: 3%;
}

.top{
  background-color: black;
  width: 100%;
  height: 100%;
  top: 0%;
  position: absolute;
}

.bkgd{
  height: 80%;
  width: 94%;
  top: 10%;
  margin: 3%;
  position: absolute;
  border-radius: 5px;
  background-color: lightgrey;
}

.words{
  text-align: left;
  margin-left: 3%;
  margin-right: 3%;
  font-family: 'Montserrat', sans-serif;
  font-weight: bold;
}

.chaspic{
  height: 10%;
  width: 10%;
  border-radius: 3px;
  margin-left: 12%;
  margin-top:2%;
  margin-bottom: 2%;
}
</style>
