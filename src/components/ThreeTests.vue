<script setup>

import { onMounted } from 'vue';
import { ThreeTest7 } from '../modules/three-test7-gradient-fluid'

onMounted(async () => {
    let element = document.getElementById("three-container")
    let threeTest = new ThreeTest7(element)
    const canvasLeft = await threeTest.init()
    console.log(canvasLeft)
    const canvasRight = canvasLeft.cloneNode()
    document.querySelector('#three-right').appendChild(canvasRight)
    const ctx = canvasRight.getContext('2d')
    function animate() {
        threeTest.update()
        ctx.save()
        ctx.scale(2, 2)
        ctx.drawImage(canvasLeft, 0, 0);
        ctx.restore()
        requestAnimationFrame(animate)
    }
    animate()
    window.addEventListener('resize', () => {
        threeTest.onWindowResize()
    })
})
</script>

<template>

    <div id="three-container">
    </div>
    <div></div>
    <div id="three-right"></div>
</template>

<style scoped>
#three-container {

    width: 50%;
    height: 100vh;
    background-color: #3E3E51;
    /* filter: blur(36px); */
    /* background-image: url('src/assets/textures/brown.jpg'); */

    /* background-position: 0 bottom; */
}

#three-right {
position: absolute;
right: 0;
top: 0;
transform: scale(-1, -1);
width: 50%;
height: 100vh;
background-color: #3E3E51;
/* filter: blur(36px); */
/* background-image: url('src/assets/textures/brown.jpg'); */

/* background-position: 0 bottom; */
}
</style>