<template>
    <div class="main-app">
        <form class="form-horizontal" v-cloak>
            <div class="form-group text-center">
                <label class="form-switch">
                    <input type="checkbox" v-model="isAnnual"/>
                    Check this if income is annual<i class="form-icon"></i>
                </label>
            </div>
            <div class="form-group">
                <div class="col-5">
                    <label class="form-label" for="gross-income"> {{getPeriod()}} Gross Income</label>
                </div>
                <div class="col-7">
                    <div class="input-group">
                        <span class="input-group-addon">GH¢</span>
                        <input class="form-input" id="gross-income" type="number" v-model.number="grossIncome"/>
                    </div>
                </div>
            </div>

            <div class="form-group">
                <div class="col-5">
                    <label class="form-label tooltip" for="allowances"
                           data-tooltip="Like transport allowance etc">{{getPeriod()}} Allowances*</label>
                </div>
                <div class="col-7">
                    <div class="input-group">
                        <span class="input-group-addon">GH¢</span>
                        <input class="form-input" id="allowances" type="number" v-model.number="allowances"/>
                    </div>
                </div>
            </div>
        </form>
        <div id="results" v-cloak>
            <div class="columns">
                <div class="column col-12 primary-result-color">
                    <div class="text-center" v-if="inputsArePositive">Monthly Net Income (take home)</div>
                    <h1 class=" text-center" v-if="inputsArePositive">GH¢ {{ taxResult.netIncome }}</h1>
                    <h2 class=" text-center text-danger" v-else>Please input valid amounts</h2>
                </div>
            </div>

            <div class="divider text-center" data-content="MONTHLY DEDUCTIONS"></div>

            <div class="columns text-center">
                <div class="column col-6 primary-result-color">
                    <span v-if="inputsArePositive">Income Tax: <strong> GH¢ {{taxResult.incomeTax}}</strong></span>
                    <span v-else>Income Tax: N/A</span>
                </div>
                <div class="column col-6 primary-result-color">
                            <span class="tooltip" data-tooltip="Contributes towards your pension"
                                  v-if="inputsArePositive">SSNIT: <strong>GH¢ {{ taxResult.ssnit }}</strong></span>
                    <span v-else>SSNIT: N/A</span>
                </div>
            </div>
            <div class="columns">
                <div class="column col-12 text-center">
                    <button class="btn" @click="showDetails = !showDetails">Show income tax breakdown</button>

                    <table class="table table-striped table-scroll" v-if="showDetails" transition="expand">
                        <thead>
                        <tr>
                            <th>Taxable amount</th>
                            <th>Rate</th>
                            <th>Tax paid</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(band, index) in taxResult.computationBreakdown" :key="index">
                            <td>GHC {{band.amountTaxed}}</td>
                            <td>{{band.taxRate}} %</td>
                            <td>GHC {{band.taxAmount}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { isPositive, calculate } from "./lib/core.js";

export default {
  name: "app",
  data: () => ({
    isAnnual: false,
    grossIncome: 0,
    allowances: 0,
    showDetails: false
  }),
  methods: {
    getPeriod() {
      return this.isAnnual ? "Annual" : "Monthly";
    }
  },
  computed: {
    taxResult() {
      return calculate(this.grossIncome, this.allowances, this.isAnnual);
    },
    inputsArePositive() {
      return isPositive(this.grossIncome) && isPositive(this.allowances);
    }
  }
};
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
