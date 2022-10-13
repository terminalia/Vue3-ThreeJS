<script setup>

import * as THREE from 'three'
import { onMounted } from 'vue';

let camera = null
let scene = null
let renderer = null
let mesh = null
let container = null

function init() {
    container = document.getElementById('three-container')

    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)

    camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.01, 1000.0)
    camera.position.z = 1

    scene = new THREE.Scene()

    let geom = new THREE.BoxGeometry(0.2, 0.2, 0.2)
    let mat = new THREE.MeshNormalMaterial()
    mesh = new THREE.Mesh(geom, mat)
    scene.add(mesh)
}

function animate() {
    requestAnimationFrame(animate)
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;
    renderer.render(scene, camera)
}

function onWindowResize() {
    renderer.setSize(container.clientWidth, container.clientHeight)
    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix()
}

onMounted(()=> {
    init()
    animate()
    window.addEventListener('resize', ()=> {onWindowResize()})
})
</script>

<template>
    <div id="three-container">

    </div>
</template>

<style scoped>
    #three-container {
        width: 100%;
        height: 500px;
    }
</style>