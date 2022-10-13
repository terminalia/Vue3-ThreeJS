<script setup>

import { onMounted } from 'vue';
import { ThreeCanvas } from '../modules/three-canvas.js'

onMounted(()=> {
    let element = document.getElementById("three-container")
    let threeCanvas = new ThreeCanvas(element)
    threeCanvas.init()
    threeCanvas.animate()
    window.addEventListener('resize', ()=> { threeCanvas.onWindowResize() })
})
</script>

<template>
    <div id="three-container">
    </div>
</template>
<style scoped>
    #three-container {
        width: 100%;
        height: 600px;
    }
</style>