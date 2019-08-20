<template>
    <div>
        <v-stage ref="field" :config="configKonva" @click="someoneClicked" @mousemove="updateMouse">
            <v-layer>
                <v-image 
                        :config="{
                        image: image,
                        width:imageWidth,
                        height:imageHeight
                    }"/>
                <div
                    v-for="(point, index) in points"
                    :key="index"
                >
                    <v-rect :config="point"></v-rect>
                </div>
                <div v-if="interimPoint">
                    <v-rect :config="interimPoint"></v-rect>
                </div>
                <div v-if="interimLine">
                    <v-line :config="interimLine"></v-line>
                </div>
                <div v-if="interimArc">
                    <v-arc :config="interimArc"></v-arc>
                </div>
                <div
                    v-for="(line, index) in lines"
                    :key="index"
                >
                    <v-line :config="line"></v-line>
                </div>
                <div
                    v-for="(arc, index) in arcs"
                    :key="index"
                >
                    <v-arc :config="arc"></v-arc>
                </div>
            </v-layer>
            <v-layer>
                <div v-if="directionLine">
                    <v-line :config="directionLine"></v-line>
                </div>
            </v-layer>
        </v-stage>
    </div>
</template>
<script>

export default {
    name: 'DrawLines',
    props: [
        'imageSrc',
        'imageHeight',
        'imageWidth',
        'points',
        'lines',
        'interimPoint',
        'interimLine',
        'interimArc',
        'directionLine',
        'arcs'
    ],
    data () {
        return{
            image: null,
            configKonva: null
        }
    },
    created() {
        const image = new window.Image();
        image.src = this.imageSrc;
        this.configKonva = {
            width: this.imageHeight,
            height: this.imageWidth
        };
        image.onload = () => {
            // set image only when it is loaded
            this.image = image;
        };
    },
    methods:{
        someoneClicked(event){
            const mousePos = this.$refs.field.getStage().getPointerPosition();
            this.$emit('lock', mousePos);
        },
        updateMouse(event){
            const mousePos = this.$refs.field.getStage().getPointerPosition();
            this.$emit('hey', mousePos);
        }
    }
}
</script>

<style>

</style>
