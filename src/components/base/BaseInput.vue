<template>
  <div :class="['input-container', `input-wrapper-${labelPosition}`]">
    <label :for="id">{{ label }}</label>
    <input
      :class="{ 'invalid-input': validationMessage }"
      :id="id"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      :readonly="readonly"
      :min="min"
      @input="handleInput"
    />
    <p v-if="validationMessage" class="validation-message">
      {{ validationMessage }}
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const { label, id, type, placeholder, modelValue, readonly } = defineProps({
  label: {
    type: String,
    required: true,
  },
  labelPosition: {
    type: String,
    default: 'top',
  },
  id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    required: false,
  },
  modelValue: {
    type: [String, Number],
    required: true,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  min: {
    type: Number,
    required: false,
  },
});
const emit = defineEmits(['update:modelValue']);

const validationMessage = ref('');

function handleInput(event) {
  const value = event.target.value;
  emit('update:modelValue', value);
  validateInput(value);
}

function validateInput(value) {
  if (type === 'number' && !value) {
    validationMessage.value = 'Please enter a valid number.';
  } else if (type === 'number' && value < 0) {
    validationMessage.value = 'Please enter a non-negative number.';
    emit('update:modelValue', 0);
  } else {
    validationMessage.value = '';
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/main.scss';

.input-container {
  margin-bottom: $medium-margin;

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: $dark-grey;
    font-size: 16px;
  }

  input {
    width: 100%;
    padding: 8px;
    border: 1px solid $light-grey;
    border-radius: 4px;
    font-size: 16px;
  }

  .validation-message {
    color: $red;
    margin-top: 5px;
    font-size: 14px;
  }

  .invalid-input {
    border-color: $red;
    outline: 1px solid $red;
  }
}

.input-wrapper-top {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 10px;
}

.input-wrapper-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
