<template>
  <div class="calculator">
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <h1 class="calculator-title">Asset Allocation Calculator</h1>
    <BaseInput
      label="Investable assets (USD)"
      id="total-amount"
      type="number"
      placeholder="Enter amount"
      :min="0"
      :modelValue="totalAmount"
      @update:modelValue="totalAmount = $event"
    />
    <div class="result">
      <p class="result-label">You could buy:</p>
      <div class="allocation">
        <div class="allocation-item">
          <BaseInput
            id="btc-amount"
            type="number"
            label="70% BTC allocation"
            :labelPosition="'left'"
            :readonly="true"
            :modelValue="btcAmount"
          />
        </div>
        <div class="allocation-item">
          <BaseInput
            id="eth-amount"
            type="number"
            label="30% ETH allocation"
            :labelPosition="'left'"
            :readonly="true"
            :modelValue="ethAmount"
          />
        </div>
      </div>
    </div>
    <BaseButton
      class="update-button"
      @clickButton="refreshRates"
      :disabled="loading || isTotalAmountInvalid"
    >
      Refresh Rates
    </BaseButton>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';

import BaseInput from '@/components/base/BaseInput.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import CurrencyService from '@/services/CurrencyService.js';

const totalAmount = ref(0);
const btcRate = ref(0);
const ethRate = ref(0);
const loading = ref(false);
const errorMessage = ref('');

const btcAmount = computed(() =>
  (totalAmount.value * 0.7 * btcRate.value).toFixed(8)
);
const ethAmount = computed(() =>
  (totalAmount.value * 0.3 * ethRate.value).toFixed(8)
);

const isTotalAmountInvalid = computed(() => {
  return !totalAmount.value || totalAmount.value <= 0;
});

onMounted(() => {
  refreshRates();
});

async function refreshRates() {
  loading.value = true;
  await CurrencyService.fetchCurrencyRates()
    .then((response) => {
      btcRate.value = response.BTC;
      ethRate.value = response.ETH;
      errorMessage.value = '';
    })
    .catch((error) => {
      console.error('Error fetching exchange rates:', error);
      errorMessage.value =
        'An error occurred while fetching exchange rates. Please try again later.';
    })
    .finally(() => {
      loading.value = false;
    });
}
</script>

<style scoped lang="scss">
@import '@/assets/main.scss';
.calculator {
  max-width: 400px;
  margin: 0 auto;
  padding: $medium-padding;
  border: 1px solid $grey;
  border-radius: 5px;
  background-color: $light-grey;

  .error-message {
    color: $light-grey;
    background-color: $red;
    padding: $small-padding;
    margin: $medium-margin 0;
    border-radius: 4px;
    font-size: 14px;
  }

  &-title {
    color: $dark-grey;
    font-size: 24px;
    text-align: center;
    margin-bottom: $medium-margin;
  }

  .result {
    background-color: $white;
    padding: $medium-padding;
    border-radius: 4px;

    &-label {
      font-weight: bold;
      margin-bottom: $small-margin;
    }
    .allocation {
      display: flex;
      flex-direction: column;
      gap: 10px;

      &-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }

  .update-button {
    display: flex;
    justify-content: center;
    margin: $medium-margin auto;
    width: 80%;
  }

  @media screen and (max-width: 600px) {
    min-width: 100%;
    min-height: 100vh;

    .calculator-title {
      font-size: 20px;
    }

    .result {
      .result-label {
        font-size: 16px;
      }
    }

    .update-button {
      width: 100%;
    }
  }
}
</style>
