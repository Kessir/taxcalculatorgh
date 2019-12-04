<template>
  <div>
    <label class="block text-gray-700 text-sm font-bold mb-2" :for="id">{{
      label
    }}</label>
    <input
      class="text-2xl text-right appearance-none bg-gray-100 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      :id="id"
      :type="type"
      :placeholder="placeholder"
      :value="value"
      @input="$emit('input', $event.target.value)"
    />
  </div>
</template>

<script>
export default {
  name: "FormField",
  props: {
    type: { type: String, default: "text" },
    placeholder: { type: String, default: "" },
    value: [Number, String],
    label: { type: String, default: "" },
    name: { type: String, default: "" },
    id: { type: String, required: true }
  }
};
</script>
