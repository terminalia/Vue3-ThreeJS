<script setup>

import { onMounted } from 'vue';
import { ThreeTest7 } from '../modules/three-test7-gradient-fluid'

let background_color = "#3E3E51"
let colors = [
    "#41D629",
    "#FB9600",
    "#FF3C5F",
    "#FE83F2"
]

let colorIndex = 0

onMounted(async () => {
    let element = document.getElementById("three-container")
    let threeTest = new ThreeTest7(element, background_color, colors[0])
    const canvasLeft = await threeTest.init()
    const canvasRight = canvasLeft.cloneNode()
    document.querySelector('#three-right').appendChild(canvasRight)
    const ctx = canvasRight.getContext('2d')
    function animate() {
        threeTest.update(background_color, colors[colorIndex])
        // ctx.save()
        // ctx.scale(2, 2)
        // ctx.drawImage(canvasLeft, 0, 0);
        // ctx.restore()
        requestAnimationFrame(animate)
    }
    animate()
    window.addEventListener('resize', () => {
        threeTest.onWindowResize()
    })

    window.addEventListener('keypress', (event) => {
        if (event.defaultPrevented)
            return
    
        if (event.key === 's') {
            colorIndex = (colorIndex + 1) % (colors.length)
            console.log(colorIndex)
        }
    })
})
</script>

<template>

    <div id="three-container">
    </div>
    <div id="three-right"></div>
</template>

<style scoped>
#three-container {

    width: 100%;
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
width: 0%;
height: 100vh;
background-color: #3E3E51;
/* filter: blur(36px); */
/* background-image: url('src/assets/textures/brown.jpg'); */

/* background-position: 0 bottom; */
}
</style>