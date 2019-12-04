<template>
  <div class="w-full max-w-lg mx-auto ">
    <section id="income-tax" class="bg-white shadow-md rounded px-10 py-4">
      <div class="card content">
        <h2 class="text-4xl text-center mt-3 mb-5">Income Tax Calculator 🇬🇭</h2>
        <h6 class="text-center">
          Compute your net income,
          <a target="_blank" href="https://gra.gov.gh/index.php/tax-rates-2019/"
            >PAYE</a
          >
          income tax and SSNIT deduction
        </h6>

        <div class="main-app">
          <form class="form-horizontal" v-cloak>
            <div class="mt-6 text-left flex items-center">
              <input type="checkbox" v-model="isAnnual" id="annual-checkbox" />
              <label class="ml-3" for="annual-checkbox">
                Check this if income is annual
              </label>
            </div>
            <div class="mt-4">
              <FormField
                id="gross-income"
                v-model.number="grossIncome"
                :label="getPeriod() + ' Gross Income'"
              />
            </div>
            <div class="mt-4">
              <FormField
                id="allowances"
                v-model.number="allowances"
                :label="getPeriod() + ' Allowances*'"
              />
            </div>
            <div class="mt-4" v-if="!showDeductionField">
              +
              <a href="#" @click.prevent="showDeductionField = true">
                Add tax deductions</a
              >
            </div>
            <div class="mt-4" v-if="showDeductionField">
              <FormField
                id="deductibles"
                v-model.number="deductions"
                :label="getPeriod() + ' Tax deductibles (ie. Tier 3)'"
              />
            </div>
          </form>

          <!--results-->
          <div class="mt-6">
            <div class="text-center text-sm uppercase mt-8 font-semibold">
              Worker's Results
            </div>
            <div class="flex justify-between mt-2">
              <div>Gross salary</div>
              <div>GHS {{ taxResult.baseAmount }}</div>
            </div>
            <div class="flex justify-between mt-2">
              <div>Worker's SSNIT Contribution @ 5.5%</div>
              <div>- {{ taxResult.employeeSsnit }}</div>
            </div>
            <div class="flex justify-between mt-2">
              <div>Income tax</div>
              <div class="font-semibold">- {{ taxResult.incomeTax }}</div>
            </div>
            <div class="flex justify-between mt-2 items-center text-indigo-700">
              <div>Net income (take home)</div>
              <div class="text-3xl">GHS {{ taxResult.netIncome }}</div>
            </div>
            <div class="text-center text-sm uppercase mt-10 font-semibold">
              Cost to Employer
            </div>
            <div class="flex justify-between mt-2 items-center">
              <div>Employer Tier 1 @ 13%</div>
              <div class="">GHS {{ taxResult.employerSsnit }}</div>
            </div>
            <div class="flex justify-between mt-2 items-center">
              <div>Total cost</div>
              <div class="font-semibold">
                GHS {{ taxResult.costToEmployer }}
              </div>
            </div>
          </div>
          <!--results-->
        </div>
        <div class="mt-4 text-sm">* Allowances are also taxed</div>
      </div>
    </section>
  </div>
</template>

<script>
import FormField from "../components/FormField";
import { calculate } from "../lib/incomeTax.js";
import { sanitizeNumber } from "../lib/utils.js";

export default {
  name: "IncomeTax",
  components: {
    FormField
  },
  data: () => ({
    isAnnual: false,
    showDeductionField: false,
    grossIncome: 0,
    allowances: 0,
    deductions: 0
  }),
  methods: {
    getPeriod() {
      return this.isAnnual ? "Annual" : "Monthly";
    }
  },
  computed: {
    taxResult() {
      return calculate({
        gross: sanitizeNumber(this.grossIncome),
        allowances: sanitizeNumber(this.allowances),
        isAnnual: sanitizeNumber(this.isAnnual),
        deductions: sanitizeNumber(this.deductions)
      });
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
