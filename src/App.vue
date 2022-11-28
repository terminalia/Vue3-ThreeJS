<script setup>
import Header from './components/Header.vue';
import BasicThreeClass from './components/BasicThreeClass.vue';
import BasicThreeComponent from './components/BasicThreeComponent.vue';
import ThreeTests from './components/ThreeTests.vue';
</script>

<template>
  <!-- <Header></Header> -->
  <section>
    <ThreeTests></ThreeTests>
  </section>
</template>

<style>
  * {
    overflow: hidden;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    background-color: #3E3E51;
  }
</style>