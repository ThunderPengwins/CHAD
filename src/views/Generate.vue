<template>
<div class="bkgd">
    <div class="top">
        <img src="@/assets/Pictures/chadLogo.jpg" alt="Logo" class="logo">
    </div>
    <h1 class="header">Congratulations! Here's your generated code, courtesy of the Thunder Pengwins:</h1>
    <v-btn class="copier" @click="copyStringToClipboard($store.getters.getGenCode)">Copy to Clipboard</v-btn>
    <pre id="text">{{$store.getters.getGenCode}}</pre>
    <div id="buffer"/>
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
        }
    },
    created() {
    //
    if (this.$store.getters.getGenCode == null) {
      this.$router.push("/");
    }
    //
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

.buffer{
    height: 200px;
    position: relative;
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
    margin-bottom: 10.6em;
    max-width: 90%;
    overflow: auto;
    padding: 1em 1.5em;
    display: block;
    word-wrap: break-word;
    text-align: left;
    left: 5%;
    top: 70px;
    position: relative;
    border-radius: 5px;
}

.copier{
}

.header{
  text-align: center;
  margin: 50px;
  font-family: 'Montserrat', sans-serif;
  font-weight: bold;
  color: white;
  position: relative;
  top: 20px;
}

</style>