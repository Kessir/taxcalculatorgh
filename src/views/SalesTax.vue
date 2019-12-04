<template>
  <div class>
    <div class="w-full max-w-lg mx-auto mt-4">
      <form class="bg-white shadow-md rounded px-12 py-8">
        <h2 class="text-center text-4xl">VAT Calculator 🇬🇭</h2>

        <div class="mt-6 flex justify-center">
          <button
            @click.prevent="computationType = 'compute-vat'"
            :class="{
              'border-2 bg-blue-100 border-blue-300':
                computationType === COMPUTE_VAT
            }"
            class="flex-1 px-4 py-2 bg-gray-100 shadow rounded-full hover:bg-blue-100"
          >
            Compute VAT
          </button>
          <button
            @click.prevent="computationType = COMPUTE_BASE_AMOUNT"
            :class="{
              'border-2 bg-blue-100 border-blue-300':
                computationType === COMPUTE_BASE_AMOUNT
            }"
            class="flex-1 ml-4 px-4 py-2 bg-gray-100 rounded-full shadow hover:bg-blue-100"
          >
            Find base amount
          </button>
        </div>
        <div class="mb-6 mt-4">
          <FormField
            id="393933"
            :label="amountLabel"
            type="text"
            v-model.number="inputAmount"
          />
        </div>
        <div class>
          <div
            class="flex justify-between"
            :class="{
              'font-semibold text-xl': computationType === COMPUTE_BASE_AMOUNT
            }"
          >
            <div>Base amount</div>
            <div>GHS {{ results.baseAmount }}</div>
          </div>
          <div class="flex justify-between mt-3">
            <div>NHIL @ 2.5%</div>
            <div>GHS {{ results.nhil }}</div>
          </div>
          <div class="flex justify-between mt-3">
            <div>GETFund Levy @ 2.5%</div>
            <div>GHS {{ results.getfund }}</div>
          </div>
          <div class="flex justify-between mt-3">
            <div></div>
            <div class="pt-2 border-t">GHS {{ results.totalBeforeVat }}</div>
          </div>
          <div class="flex justify-between mt-3">
            <div>VAT @ 12.5%</div>
            <div>GHS {{ results.vat }}</div>
          </div>
          <div
            class="flex justify-between mt-4 pt-3 border-t-2"
            :class="{
              'font-semibold text-xl': computationType === COMPUTE_VAT
            }"
          >
            <div>Total amount</div>
            <div>GHS {{ results.totalAmount }}</div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import FormField from "../components/FormField";
import { grossToNet, netToGross } from "../lib/salesTax";
import { sanitizeNumber } from "../lib/utils.js";

const COMPUTE_VAT = "compute-vat";
const COMPUTE_BASE_AMOUNT = "compute-base-amount";

export default {
  name: "SalesTax",
  components: {
    FormField
  },
  data() {
    return {
      COMPUTE_VAT,
      COMPUTE_BASE_AMOUNT,
      inputAmount: 0,
      computationType: COMPUTE_VAT
    };
  },
  created() {
    if (this.$route.query.amount != null)
      this.inputAmount = sanitizeNumber(this.$route.query.amount);

    if (
      [COMPUTE_VAT, COMPUTE_BASE_AMOUNT].includes(this.$route.query.computation)
    )
      this.computationType = this.$route.query.computation;
  },
  methods: {
    updateRoute(amount, computation) {
      this.$router.replace({
        path: "/vat-calculator",
        query: {
          amount,
          computation
        }
      });
    }
  },
  watch: {
    inputAmount(val) {
      const number = sanitizeNumber(val);
      number > 0
        ? this.updateRoute(number, this.computationType)
        : this.updateRoute(null, this.computationType);
    },
    transactionType(val) {
      this.updateRoute(this.inputAmount, val);
    }
  },
  computed: {
    amountLabel() {
      if (this.computationType === COMPUTE_VAT)
        return "Base amount (before taxes)";
      return "Vat inclusive amount";
    },
    results() {
      return this.computationType === COMPUTE_VAT
        ? grossToNet(sanitizeNumber(this.inputAmount))
        : netToGross(sanitizeNumber(this.inputAmount));
    }
  }
};
</script>
