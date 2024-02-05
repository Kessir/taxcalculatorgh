<template>
  <div>
    <label class="block text-md leading-6 text-gray-900" :for="id">{{ label }}</label>
    <div
      class="mt-2 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
      <span class="flex select-none items-center pl-3 text-gray-500 sm:text-md">GH₵</span>
      <input
        class="block flex-1 border-0 bg-transparent py-2 pl-1 text-gray-900 placeholder:text-gray-500 focus:ring-0 sm:text-xl sm:leading-6 text-right"
        placeholder="0"
        :id="id"
        type="text"
        inputmode="decimal"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </div>
  </div>
</template>
<script setup>
defineProps({
  modelValue: [String, Number],
  label: String,
  id: String
});

defineEmits(["update:modelValue"]);
</script>