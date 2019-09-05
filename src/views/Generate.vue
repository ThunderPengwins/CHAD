<template>
<div class="bkgd">
    <div class="top">
        <img src="@/assets/Pictures/chadLogo.jpg" alt="Logo" class="logo">
    </div>
    <h1 class="header">Congratulations! Here's your generated code, courtesy of the Thunder Pengwins:</h1>
    <v-btn class="copier" @click="copyStringToClipboard($store.getters.getGenCode)">Copy to Clipboard</v-btn>
    <v-btn sm2 id="scroll" @click="scrollDown()"><v-icon>arrow_downward</v-icon></v-btn>
    <pre id="code">{{$store.getters.getGenCode}}</pre>
    <h1 ic="caltext">Calibration file:</h1>
    <v-btn class="copier" @click="copyStringToClipboard($store.getters.getGenCali)">Copy to Clipboard</v-btn>
    <v-btn id="scroll" @click="scrollDown()"><v-icon>arrow_downward</v-icon></v-btn>
     <v-btn sm2 id="scroll" @click="scrollUp('top')"><v-icon>arrow_upward</v-icon></v-btn>
    <pre id="cali">{{$store.getters.getGenCali}}</pre>
    <v-btn sm2 id="bottom" @click="scrollUp('bottom')"><v-icon>arrow_upward</v-icon></v-btn>
</div>
</template>

<script>
export default {
    name: "Generate",
    methods: {
        copyStringToClipboard: function(str){
        // Create new element
        var el = document.createElement('textarea');
        // Set value (string to be copied)
        el.value = str;
        // Set non-editable to avoid focus and move outside of view
        el.setAttribute('readonly', '');
        el.style = {position: 'absolute', left: '-9999px'};
        document.body.appendChild(el);
        // Select text inside element
        el.select();
        // Copy text to clipboard
        document.execCommand('copy');
        // Remove temporary element
        document.body.removeChild(el);
        },
        scrollDown: function(){
            //
            var height = 50 * this.$store.getters.getTheSteps.length + 7500;
            //
            window.scrollBy(0, height);
        },
        scrollUp: function(pos){
            //
            if(pos == "bottom"){
                window.scrollBy(0, -2000);
            }else{
                window.scrollBy(0, -10000);
            }
            //
            
        },
        checkKey: function(key) {
            if (key == '38') {//up arrow
                this.scrollUp();
            }
            else if (key == '40') {//down arrow
                this.scrollDown();
            }
        }
    },
    created() {
    //
    if (this.$store.getters.getGenCode == null) {
      this.$router.push("/");
    }
    //
    /*window.addEventListener('keydown', function(e) {
        this.checkKey(e.keyCode);
    });*/
  }
}
//v-model="$store.getters.getGenCode"
</script>

<style>
.top{
  background-color: black;
  width: 100%;
  height: 100%;
  top: 0%;
  position: absolute;
}

.logo{
  width: 10%;
}

#bkgd{
    margin: 0%;
}

pre {
    background: #f4f4f4;
    border: 1px solid #ddd;
    border-left: 3px solid rgb(100, 230, 209);
    color: #666;
    page-break-inside: avoid;
    font-family: monospace;
    font-size: 15px;
    line-height: 1.6;
    max-width: 90%;
    overflow: auto;
    padding: 1em 1.5em;
    margin-bottom: 5.6em;
    display: block;
    word-wrap: break-word;
    text-align: left;
    left: 5%;
    top: 0px;
    position: relative;
    border-radius: 5px;
}

#cali{
    margin-bottom: 1em;
    top: 0%;
}

#caltext{
    margin-bottom: 0px;
}

#bottom{
    margin-bottom: 10.6em
}

h1{
  text-align: center;
  margin: 50px;
  font-family: 'Montserrat', sans-serif;
  font-weight: bold;
  color: white;
  position: relative;
  top: 20px;
}

</style>