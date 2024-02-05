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
    <div class="text-primary mt-4 mb-6">
      <div class="text-center">Net Income (take home)</div>
      <h1 class="mt-1.5 text-3xl sm:text-4xl text-center font-mono">GH¢ {{ taxResult.netIncome }}</h1>
    </div>

    <div class="flex justify-between flex-wrap">
      <div class="text-primary text-center">
        <div>Income Tax</div>
        <div class="font-mono font-bold">GH¢ {{ taxResult.incomeTax }}</div>
      </div>
      <div class="text-primary text-center">
        <div
          class="tooltip"
          data-tooltip="Contributes towards your pension"
        >SSNIT
        </div>
        <div
          class="font-mono font-bold"
          data-tooltip="Contributes towards your pension"
        >GH¢ {{ taxResult.ssnit }}
        </div>
      </div>
    </div>
    <div class="columns my-4">
      <div class="column col-12 text-center">
        <button class="border border-primary text-primary px-4 py-2 my-4 rounded-sm"
                @click="showDetails = !showDetails">
          Show tax breakdown
        </button>

        <table
          class="min-w-full divide-y divide-gray-300"
          v-if="showDetails"
          transition="expand"
        >
          <thead>
          <tr>
            <th class="font-semibold text-left px-2 py-3">Taxable amount</th>
            <th class="font-semibold text-right px-2 py-3">Rate</th>
            <th class="font-semibold text-right px-2 py-3">Tax due (GH¢)</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="(band, index) in taxResult.computationBreakdown" :key="index" class="even:bg-gray-50">
            <td class="text-left px-2 py-3">{{ index === 0 ? "First" : "Next" }} <span
              class="font-mono">GH¢ {{ band.amountTaxed }}</span></td>
            <td class="font-mono text-right">{{ band.taxRate }}%</td>
            <td class="font-mono text-right">{{ band.taxAmount }}</td>
          </tr>
          <tr>
            <td class="px-2 py-3 font-bold text-left">Total</td>
            <td colspan="2" class="py-3 font-mono text-right font-bold">GHC {{ taxResult.incomeTax }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
