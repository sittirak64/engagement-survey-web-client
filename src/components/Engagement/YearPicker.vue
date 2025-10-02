<template>
  <VueDatePicker
    class="date-picker"
    v-model="year"
    year-picker
    :year-range="[1900, currentYear]"
    @update:model-value="handleDateChange"
    :format="displayFormat"
    placeholder="Select Year"
    ignore-time-validation
    auto-apply
    required
  />
</template>
 
<script>
import { ref, watch } from 'vue';
import { format as formatDate } from 'date-fns';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
 
export default {
  name: 'DatePicker',
  components: {
    VueDatePicker
  },
  props: {
    displayFormat: {
      type: String,
      default: 'yyyy'
    },
    apiFormat: {
      type: String,
      default: "yyyy-MM-dd' '00:00:00'Z'"
    },
    setDate: {
      type: [Number, String],
      default: null,
      required: false,
    },
  },
 
  setup(props, { emit }) {
    const year = ref(props.setDate ? new Date(props.setDate).getFullYear() : null);
    const currentYear = ref(new Date().getFullYear())
 
    watch(() => props.setDate, (newDate) => {
      year.value = newDate ? new Date(newDate).getFullYear() : null;
    });
 
    const handleDateChange = (newDate) => {
      const formattedDate = formatDate(new Date(newDate, 0, 1), props.apiFormat);
      emit('handleChange', 'birthDate', formattedDate);
    };
 
    return {
      year,
      handleDateChange,
      currentYear
    };
  }
}
</script>