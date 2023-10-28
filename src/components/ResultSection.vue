<script setup>
import { ref } from "vue";

defineProps({
  taxResult: {
    type: Object,
    required: true
  }
});
const showDetails = ref(false);
</script>

<template>
  <div id="results" v-cloak class="">
    <div class="primary-result-color mt-4 mb-6">
      <div class="text-center">Net Income (take home)</div>
      <h1 class="text-2xl sm:text-3xl text-center font-mono">GH¢ {{ taxResult.netIncome }}</h1>
    </div>

    <div class="divider text-center" data-content="DEDUCTIONS"></div>

    <div class="flex justify-between flex-wrap">
      <div class="primary-result-color">
        <span>Income Tax: <strong> GH¢ {{ taxResult.incomeTax }}</strong></span>
      </div>
      <div class="primary-result-color">
          <span
            class="tooltip"
            data-tooltip="Contributes towards your pension"
          >SSNIT: <strong>GH¢ {{ taxResult.ssnit }}</strong></span
          >
      </div>
    </div>
    <div class="columns my-4">
      <div class="column col-12 text-center">
        <button class="btn my-4" @click="showDetails = !showDetails">
          Show income tax breakdown
        </button>

        <table
          class="table table-striped w-full table-auto"
          v-if="showDetails"
          transition="expand"
        >
          <thead>
          <tr>
            <th class="font-medium">Taxable amount</th>
            <th class="font-medium text-right">Rate</th>
            <th class="font-medium text-right">Tax due (GH¢)</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(band, index) in taxResult.computationBreakdown" :key="index">
            <td>{{ index === 0 ? "First" : "Next" }} <span class="font-mono">GH¢ {{ band.amountTaxed }}</span></td>
            <td class="font-mono text-right">{{ band.taxRate }}%</td>
            <td class="font-mono text-right">{{ band.taxAmount }}</td>
          </tr>
          <tr >
            <td class="font-bold">Total</td>
            <td colspan="2" class="font-mono text-right font-bold">GHC {{ taxResult.incomeTax }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
