<script setup>
import {ref} from 'vue'

defineProps({
    taxResult: {
        type: Object,
        required: true
    }
})
const showDetails = ref(false)
</script>

<template>
    <div id="results" v-cloak>
        <div class="columns">
            <div class="column col-12 primary-result-color">
                <div class="text-center">Net Income (take home)</div>
                <h1 class="text-center">GH¢ {{ taxResult.netIncome }}</h1>
            </div>
        </div>

        <div class="divider text-center" data-content="DEDUCTIONS"></div>

        <div class="columns text-center">
            <div class="column col-6 primary-result-color">
                <span>Income Tax: <strong> GH¢ {{ taxResult.incomeTax }}</strong></span>
            </div>
            <div class="column col-6 primary-result-color">
          <span
                  class="tooltip"
                  data-tooltip="Contributes towards your pension"
          >SSNIT: <strong>GH¢ {{ taxResult.ssnit }}</strong></span
          >
            </div>
        </div>
        <div class="columns mt-2">
            <div class="column col-12 text-center">
                <button class="btn mt-2" @click="showDetails = !showDetails">
                    Show income tax breakdown
                </button>

                <table
                        class="table table-striped table-scroll"
                        v-if="showDetails"
                        transition="expand"
                >
                    <thead>
                    <tr>
                        <th>Taxable amount</th>
                        <th>Rate</th>
                        <th>Tax paid</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(band, index) in taxResult.computationBreakdown" :key="index">
                        <td>{{ index === 0 ? 'First' : 'Next' }} GHC {{ band.amountTaxed }}</td>
                        <td>{{ band.taxRate }} %</td>
                        <td>GHC {{ band.taxAmount }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
