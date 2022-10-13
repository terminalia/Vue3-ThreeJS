<script setup>
import ThreeCanvas from './components/three-canvas.vue';
import Header from './components/Header.vue';
</script>

<template>
  <Header></Header>
  <section>
  <ThreeCanvas></ThreeCanvas>
</section>
</template>

<style>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
</style>