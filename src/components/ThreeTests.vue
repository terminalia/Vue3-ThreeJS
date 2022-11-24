<script setup>

import { onMounted } from 'vue';
import { ThreeTest1 } from '../modules/three-test1.js'
import { ThreeTest2 } from '../modules/three-test2-modelloading';
import { ThreeTest3 } from '../modules/three-test3-custom-shader';
import { TestCrossHatch } from '../modules/three-example-cross-hatch';
import { ThreeDissolve } from '../modules/three-example-dissolve'
import { ThreeTest4 } from '../modules/three-test4-transparent-shader'
import { TestOrthoMask } from '../modules/three-example-ortho-mask'
import { ThreeTest5 } from '../modules/three-test5-outline-shader'
import { ThreeTest6 } from '../modules/three-test6-perlin-noise'

onMounted(()=> {
    let element = document.getElementById("three-container")
    let threeTest = new ThreeTest6(element)
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
        height: 700px;
        background-image: url('src/assets/textures/brown.jpg');
        filter: blur(18px);
        background-position: 0 bottom;
    }
</style>