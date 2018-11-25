<template>
    <div id="app">
        <section id="container" class="container grid-480">
            <span class="tax-alert">Updated with the income tax amendment of Aug. 2018 !</span>
            <div class="card content">

                <h2 class="text-center">Tax Calculator 🇬🇭</h2>
                <h6 class="text-center">Compute your net income, <a target="_blank"
                                                                    href="http://www.gra.gov.gh/index.php/tax-information/income-tax">PAYE</a>
                    income tax and SSNIT deduction</h6>
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
                            <h2 class=" text-center text-danger" v-else>Please input positive numbers.</h2>
                        </div>
                    </div>

                    <div class="divider text-center" data-content="MONTHLY DEDUCTIONS"></div>

                    <div class="columns">
                        <div class="column col-6">
                            <span v-if="inputsArePositive">Income Tax: GH¢ {{taxResult.incomeTax}}</span>
                            <span v-else>Income Tax: N/A</span>
                        </div>
                        <div class="column col-6">
                            <span class="tooltip" data-tooltip="Contributes towards your pension"
                                  v-if="inputsArePositive">SSNIT: GH¢ {{ taxResult.ssnit }}</span>
                            <span v-else>SSNIT: N/A</span>
                        </div>
                    </div>
                    <div class="columns">
                        <div class="column col-12">
                            <h5>Show detailed</h5>
                            <table class="table table-striped table-scroll">
                                <thead>
                                <tr>
                                    <th>Taxed Amount</th>
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
                <div class="disclaimer">* Allowances are also taxed</div>
            </div>
        </section>
        <hr>
        <section id="footer">
            <div class="text-center disclaimer" style="margin-top: 0;">Disclaimer: We do our best to ensure
                the accuracy of this tool but we cannot be held responsible for any errors.
            </div>
            <div class="text-center">Send <strong>feedback</strong> and suggestions to <a target="_blank"
                                                                                          href="mailto:tax.calculator@kessir.com?subject=Tax%20calculator">tax.calculator@kessir.com</a>
            </div>

            <div class="social text-center">
                Share with others:
                <ul class="share-buttons">
                    <li>
                        <a href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fkessir.github.io%2Ftaxcalculatorgh&t=Compute%20take-home%20income%2C%20income%20tax%20and%20SSNIT"
                           title="Share on Facebook" target="_blank">
                            <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd"
                                 clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="1.414">
                                <path d="M15.117 0H.883C.395 0 0 .395 0 .883v14.234c0 .488.395.883.883.883h7.663V9.804H6.46V7.39h2.086V5.607c0-2.066 1.262-3.19 3.106-3.19.883 0 1.642.064 1.863.094v2.16h-1.28c-1 0-1.195.48-1.195 1.18v1.54h2.39l-.31 2.42h-2.08V16h4.077c.488 0 .883-.395.883-.883V.883C16 .395 15.605 0 15.117 0"
                                      fill-rule="nonzero"/>
                            </svg>
                        </a></li>
                    <li>
                        <a href="https://twitter.com/intent/tweet?source=https%3A%2F%2Fkessir.github.io%2Ftaxcalculatorgh&text=A%20tool%20to%20compute%20take-home%20income%2C%20income%20tax%20and%20SSNIT:%20https%3A%2F%2Fkessir.github.io%2Ftaxcalculatorgh&via=kessir_"
                           target="_blank" title="Tweet">
                            <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd"
                                 clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="1.414">
                                <path d="M16 3.038c-.59.26-1.22.437-1.885.517.677-.407 1.198-1.05 1.443-1.816-.634.37-1.337.64-2.085.79-.598-.64-1.45-1.04-2.396-1.04-1.812 0-3.282 1.47-3.282 3.28 0 .26.03.51.085.75-2.728-.13-5.147-1.44-6.766-3.42C.83 2.58.67 3.14.67 3.75c0 1.14.58 2.143 1.46 2.732-.538-.017-1.045-.165-1.487-.41v.04c0 1.59 1.13 2.918 2.633 3.22-.276.074-.566.114-.865.114-.21 0-.41-.02-.61-.058.42 1.304 1.63 2.253 3.07 2.28-1.12.88-2.54 1.404-4.07 1.404-.26 0-.52-.015-.78-.045 1.46.93 3.18 1.474 5.04 1.474 6.04 0 9.34-5 9.34-9.33 0-.14 0-.28-.01-.42.64-.46 1.2-1.04 1.64-1.7z"
                                      fill-rule="nonzero"/>
                            </svg>
                        </a></li>
                    <li>
                        <a href="mailto:?subject=A%20tool%20to%20compute%20take-home%20income%2C%20income%20tax%20and%20SSNIT&body=This%20tool%20helps%20compute%20your%20take-home%20income%2C%20income%20tax%20and%20SSNIT%20contribution%20based%20on%20your%20gross%20income.:%20https%3A%2F%2Fkessir.github.io%2Ftaxcalculatorgh"
                           target="_blank" title="Send email">
                            <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 3v10c0 .567-.433 1-1 1h-1V4.925L8 9.233 2 4.925V14H1c-.567 0-1-.433-1-1V3c0-.283.108-.533.287-.712C.467 2.107.718 2 1 2h.333L8 6.833 14.667 2H15c.283 0 .533.108.713.288.179.179.287.429.287.712z"
                                      fill-rule="evenodd"/>
                            </svg>
                        </a></li>
                </ul>
            </div>
        </section>
    </div>
</template>

<script>
// import HelloWorld from "./components/HelloWorld.vue";
import { isPostive, calculate } from "./lib/core.js";

export default {
  name: "app",
  data: () => ({
    isAnnual: false,
    grossIncome: 0,
    allowances: 0
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
      return isPostive(this.grossIncome) && isPostive(this.allowances);
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
