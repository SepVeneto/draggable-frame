<template>
  <button class="v-button">{{propValue}}</button>
</template>

<script lang="ts" setup>
defineProps({
  propValue: String,
})
</script>

<style scoped>
.v-button {
  background: #fff;
  border: 1px solid #222;
  padding: 10px;
}
</style>
