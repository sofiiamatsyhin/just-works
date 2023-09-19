<template>
  <button @click="handleClick" :disabled="disabled">
    <slot></slot>
  </button>
</template>

<script setup>
const { disabled } = defineProps(['disabled']);
const emit = defineEmits(['clickButton']);

const handleClick = () => emit('clickButton');
</script>

<style scoped lang="scss">
@import '@/assets/main.scss';

button {
  background-color: $light-blue;
  color: $white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: $small-padding;
  transition: background-color 0.5s;

  &:hover {
    background-color: $dark-blue;
  }

  &:disabled {
    background-color: $grey;
    cursor: not-allowed;
  }
}
</style>
