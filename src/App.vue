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
    <section id="container" class="max-w-sm m-auto">
      <Banner />
      <div class="card content" style="padding: 1rem;">
        <h2 class="text-2xl text-center">Tax Calculator 🇬🇭</h2>
        <p class="text-center mt-3">
          Compute your <span class="font-medium">net income</span>,
          <a target="_blank" href="https://gra.gov.gh/domestic-tax/tax-types/paye/">PAYE</a> <span class="font-medium">income
          tax</span> and <span class="font-medium">SSNIT deduction</span>.
        </p>

        <InputForm class="sm:px-10 py-4"
          v-model:gross-income="grossIncome"
          v-model:allowances="allowances"
          v-model:tax-relief="taxRelief"
        />

        <div class="my-2 text-center text-red-400" v-if="taxResult.errorMessage">{{ taxResult.errorMessage }}</div>

        <ResultSection :tax-result="taxResult" v-else />

        <div class="mt-4">* Allowances are also taxed</div>
      </div>
    </section>
    <div class="text-center" style="margin: 2rem 0">Last updated: February 1st, 2024</div>
    <hr />
    <footer id="footer" class="text-gray-600">
      <div class="text-center mt-4">
        Disclaimer: We do our best to ensure the accuracy of this tool but we cannot be held
        responsible for any errors.
      </div>
      <div class="text-center mt-4">
        Send <strong>feedback</strong> and suggestions to
        <a class="underline underline-offset-2" target="_blank" href="mailto:tax.calculator@kessir.com?subject=Tax%20calculator"
        >tax.calculator@kessir.com</a
        >
      </div>

      <SocialShare />

    </footer>
  </div>
</template>
