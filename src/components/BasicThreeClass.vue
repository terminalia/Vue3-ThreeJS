<script setup>

import { onMounted } from 'vue';
import { ThreeBasics } from '../modules/three-basics.js'

onMounted(()=> {
    let element = document.getElementById("three-container")
    let threBasics = new ThreeBasics(element)
    threBasics.init()
    threBasics.animate()
    window.addEventListener('resize', ()=> { threBasics.onWindowResize() })
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