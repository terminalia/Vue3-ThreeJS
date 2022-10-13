<script setup>

import { onMounted } from 'vue';
import { ThreeTest1 } from '../modules/three-test1.js'
import { ThreeTest2 } from '../modules/three-test2-modelloading';

onMounted(()=> {
    let element = document.getElementById("three-container")
    let threeTest = new ThreeTest2(element)
    threeTest.init()
    threeTest.animate()
    window.addEventListener('resize', ()=> {
        threeTest.onWindowResize()
    })
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