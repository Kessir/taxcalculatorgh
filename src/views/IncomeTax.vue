<template>
  <section id="container" class="container grid-480">
    <span class="tax-alert"
      >Updated with the income tax amendment (Act 979) of Jan. 2019 !</span
    >
    <div class="card content">
      <h2 class="text-center">Tax Calculator 🇬🇭</h2>
      <h6 class="text-center">
        Compute your net income,
        <a target="_blank" href="https://gra.gov.gh/index.php/tax-rates-2019/"
          >PAYE</a
        >
        income tax and SSNIT deduction
      </h6>

      <div class="main-app">
        <form class="form-horizontal" v-cloak>
          <div class="form-group text-center">
            <label class="form-switch">
              <input type="checkbox" v-model="isAnnual" />
              Check this if income is annual
              <i class="form-icon"></i>
            </label>
          </div>
          <div class="form-group">
            <div class="col-5">
              <label class="form-label" for="gross-income"
                >{{ getPeriod() }} Gross Income</label
              >
            </div>
            <div class="col-7">
              <div class="input-group">
                <span class="input-group-addon">GH¢</span>
                <input
                  class="form-input"
                  id="gross-income"
                  type="number"
                  v-model.number="grossIncome"
                />
              </div>
            </div>
          </div>

          <div class="form-group">
            <div class="col-5">
              <label
                class="form-label tooltip"
                for="allowances"
                data-tooltip="Like transport allowance etc"
                >{{ getPeriod() }} Allowances*</label
              >
            </div>
            <div class="col-7">
              <div class="input-group">
                <span class="input-group-addon">GH¢</span>
                <input
                  class="form-input"
                  id="allowances"
                  type="number"
                  v-model.number="allowances"
                />
              </div>
            </div>
          </div>
          <div class="form-group">
            <div class="col-5">
              <label
                class="form-label tooltip"
                for="deductions"
                data-tooltip="Like transport allowance etc"
                >Tax deductibles (ie. Tier 3)</label
              >
            </div>
            <div class="col-7">
              <div class="input-group">
                <span class="input-group-addon">GH¢</span>
                <input
                  class="form-input"
                  id="deductions"
                  type="number"
                  v-model.number="deductions"
                />
              </div>
            </div>
          </div>
        </form>
        <div id="results" v-cloak>
          <div class="columns">
            <div class="column col-12 primary-result-color">
              <div class="text-center" v-if="inputsArePositive">
                Monthly Net Income (take home)
              </div>
              <h1 class="text-center" v-if="inputsArePositive">
                GH¢ {{ taxResult.netIncome }}
              </h1>
              <h2 class="text-center text-danger" v-else>
                Please input valid amounts
              </h2>
            </div>
          </div>

          <div
            class="divider text-center"
            data-content="MONTHLY DEDUCTIONS"
          ></div>

          <div class="columns text-center">
            <div class="column col-6 primary-result-color">
              <span v-if="inputsArePositive">
                Income Tax:
                <strong>GH¢ {{ taxResult.incomeTax }}</strong>
              </span>
              <span v-else>Income Tax: N/A</span>
            </div>
            <div class="column col-6 primary-result-color">
              <span
                class="tooltip"
                data-tooltip="Contributes towards your pension"
                v-if="inputsArePositive"
              >
                SSNIT (5+0.5%):
                <strong>GH¢ {{ taxResult.ssnit }}</strong>
              </span>
              <span v-else>SSNIT: N/A</span>
            </div>
          </div>
          <div class="columns">
            <div class="column col-12 text-center">
              <button class="btn" @click="showDetails = !showDetails">
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
                  <tr
                    v-for="(band, index) in taxResult.computationBreakdown"
                    :key="index"
                  >
                    <td>GHC {{ band.amountTaxed }}</td>
                    <td>{{ band.taxRate }} %</td>
                    <td>GHC {{ band.taxAmount }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="disclaimer">* Allowances are also taxed</div>
    </div>
    <!--        <section><p class="text-center">Help us answer a few questions in the survey below.</p></section>-->
    <!--        <section class="survey">-->
    <!--          <div class="typeform-widget" data-url="https://kessir.typeform.com/to/XkIaUp" style="width: 100%; height: 400px;"></div> <script> (function() { var qs,js,q,s,d=document, gi=d.getElementById, ce=d.createElement, gt=d.getElementsByTagName, id="typef_orm", b="https://embed.typeform.com/"; if(!gi.call(d,id)) { js=ce.call(d,"script"); js.id=id; js.src=b+"embed.js"; q=gt.call(d,"script")[0]; q.parentNode.insertBefore(js,q) } })() </script> <div style="font-family: Sans-Serif;font-size: 12px;color: #999;opacity: 0.5; padding-top: 5px;"> powered by <a href="https://admin.typeform.com/signup?utm_campaign=XkIaUp&utm_source=typeform.com-13391761-Basic&utm_medium=typeform&utm_content=typeform-embedded-poweredbytypeform&utm_term=EN" style="color: #999" target="_blank">Typeform</a> </div>-->
    <!--        </section>-->
  </section>
</template>

<script>
import { isPositive, calculate } from "../lib/core.js";

export default {
  name: "IncomeTax",
  data: () => ({
    isAnnual: false,
    grossIncome: 0,
    allowances: 0,
    deductions: 0,
    showDetails: false
  }),
  methods: {
    getPeriod() {
      return this.isAnnual ? "Annual" : "Monthly";
    }
  },
  computed: {
    taxResult() {
      return calculate({
        gross: this.grossIncome,
        allowances: this.allowances,
        isAnnual: this.isAnnual,
        deductions: this.deductions
      });
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
