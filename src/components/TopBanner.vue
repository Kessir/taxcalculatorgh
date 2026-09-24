<script setup>
import { monthlyTaxRates } from "@/lib/rates";
import { formatMonthYear } from "@/lib/dates";

const ratesMonth = formatMonthYear(monthlyTaxRates.effectiveFrom);
</script>

<template>
  <div class="bg-[#6684ea] text-white text-center my-4 rounded-xs py-2 px-2">
    Updated with
    <a target="_blank" href="https://gra.gov.gh/domestic-tax/tax-types/paye/">
      <span class="font-medium underline underline-offset-2 text-white">{{ ratesMonth }}</span></a
    >
    tax rates !
  </div>
</template>
