<template>
  <div>
    <select class="form-select" :value="localValue" @change="updateValue($event.target.value)" required
      aria-label="Default select example" style="border: #000000 1px solid; height: 50px">

      <option v-for="(prefix, index) in dialingPrefix" :key="prefix.prefixId" :value="prefix.dialingPrefix">
        {{ prefix.dialingPrefix }}
      </option>
    </select>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  name: 'DropDownPrefix',
  props: {
    modelValue: String,
    dialingPrefix: {
      type: Array,
      required: true
    },
  },
  setup(props, { emit }) {
    const localValue = ref(props.modelValue);

    watch(() => props.modelValue, (newValue) => {
      localValue.value = newValue;
    });

    const updateValue = (choice) => {
      localValue.value = choice;
      emit('update:modelValue', choice);
    };

    return {
      updateValue,
      localValue,
    };
  }
};
</script>
