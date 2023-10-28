<script setup>
defineProps({
  allowances: [String, Number],
  grossIncome: [String, Number],
  taxRelief: [String, Number]
});

defineEmits(["update:gross-income", "update:allowances", "update:tax-relief"]);
</script>

<template>
  <form v-cloak>
    <div class="form-group">
      <div class="">
        <label class="form-label" for="gross-income">Monthly gross income</label>
      </div>
      <div class="">
        <div class="input-group ">
          <span class="input-group-addon addon-lg">GH₵</span>
          <input
            class="form-input input-lg text-right"
            id="gross-income"
            type="text"
            inputmode="decimal"
            :value="grossIncome"
            @input="$emit('update:gross-income', $event.target.value)"
          />
        </div>
      </div>
    </div>

    <div class="form-group">
      <div class="">
        <label
          class="form-label tooltip"
          for="allowances"
          data-tooltip="Like transport allowance etc"
        >Monthly allowances*</label
        >
      </div>
      <div class="">
        <div class="input-group">
          <span class="input-group-addon addon-lg">GH₵</span>
          <input
            class="form-input input-lg text-right"
            id="allowances"
            type="text"
            inputmode="decimal"
            :value="allowances"
            @input="$emit('update:allowances', $event.target.value)"
          />
        </div>
      </div>
    </div>
    <div class="form-group">
      <div class="">
        <label class="form-label tooltip" for="relief" data-tooltip="Like mortgage etc"
        >Tax relief</label>
      </div>
      <div class="">
        <div class="input-group">
          <span class="input-group-addon addon-lg">GH₵</span>
          <input
            class="form-input input-lg text-right"
            id="relief"
            type="text"
            inputmode="decimal"
            :value="taxRelief"
            @input="$emit('update:tax-relief', $event.target.value)"
          />
        </div>
      </div>
    </div>
  </form>
</template>
