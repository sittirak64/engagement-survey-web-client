<template>
 <VueDatePicker
  class="date-picker"
  v-model="localDate"
  :year-range="[1900, currentYear]"
  @update:model-value="handleDateChange"
  :format="displayformat"
  :max-date="new Date()"
  :placeholder="placeholder"
  ignore-time-validation
  auto-apply
  required
  :clearable="false"
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
    displayformat: {
      type: String,
      default: 'dd/MM/yyyy'
    },
    apiformat: {
      type: String,
      default: "yyyy-MM-dd' '00:00:00'Z'"
    },
    setDate: {
      type: [Number, String],
      default: null,
      required: false,
    },
    placeholder: {  
      type: String,
      default: 'Select Date' 
    }
  },

  setup(props, { emit }) {
    const localDate = ref(props.setDate);
    const currentYear = ref(new Date().getFullYear())


    watch(() => props.setDate, (newDate) => {
      localDate.value = new Date(newDate);
    });

    const handleDateChange = (newDate) => {
      const formattedDate = formatDate(newDate, props.apiformat);
      emit('handleChange', 'birthDate', formattedDate);
    };

    return {
      handleDateChange,
      localDate,
      currentYear
    };
  }
}
</script>
