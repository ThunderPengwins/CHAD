<template>
<div class="bkgd">
    <v-textarea auto-grow id="text" v-model="$store.getters.getGenCode"></v-textarea>
</div>
</template>

<script>
export default {
    name: "Generate"
}
</script>

<style>
#top{
    height: 5%;
    width: 100%;
    top: 0%;
    position: absolute;
}

#logo{
    width: 10%;
}

#bkgd{
    margin: 0%;
}

.text{
}

</style>