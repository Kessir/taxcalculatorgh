<script setup>
import Banner from "./components/TopBanner.vue";
import SocialShare from "./components/SocialShare.vue";
import { useHead } from "@vueuse/head";
import InputForm from "@/components/InputForm.vue";
import ResultSection from "@/components/ResultSection.vue";
import { calculate } from "@/lib/core";
import { computed, ref } from "vue";

useHead({
  title: "Tax Calculator Ghana 🇬🇭",
  meta: [
    {
      name: "description",
      content:
        "This tool helps compute your take-home income, income tax and SSNIT contribution based on your gross income."
    }
  ]
});

const grossIncome = ref(0);
const taxRelief = ref(0);
const allowances = ref(0);
// a computed ref
const taxResult = computed(() => {
  return calculate(grossIncome.value, allowances.value, taxRelief.value);
});

</script>

<template>
  <div>
    <section id="container" class="container grid-xs">
      <Banner />
      <div class="card content" style="padding: 1rem;">
        <h2 class="text-center">Tax Calculator 🇬🇭</h2>
        <h6 class="text-center">
          Compute your net income,
          <a target="_blank" href="https://gra.gov.gh/domestic-tax/tax-types/paye/">PAYE</a> income
          tax and SSNIT deduction
        </h6>

        <InputForm
          v-model:gross-income="grossIncome"
          v-model:allowances="allowances"
          v-model:tax-relief="taxRelief"
        />

        <div class="my-2 text-center text-danger" v-if="taxResult.errorMessage">{{ taxResult.errorMessage }}</div>
        <ResultSection :tax-result="taxResult" v-else />

        <div class="disclaimer">* Allowances are also taxed</div>
      </div>
    </section>
    <div class="text-center" style="margin: 2rem 0">Last updated: April 29, 2023</div>
    <hr />
    <section id="footer">
      <div class="text-center disclaimer" style="margin-top: 0">
        Disclaimer: We do our best to ensure the accuracy of this tool but we cannot be held
        responsible for any errors.
      </div>
      <div class="text-center">
        Send <strong>feedback</strong> and suggestions to
        <a target="_blank" href="mailto:tax.calculator@kessir.com?subject=Tax%20calculator"
        >tax.calculator@kessir.com</a
        >
      </div>

      <SocialShare />
    </section>
  </div>
</template>
