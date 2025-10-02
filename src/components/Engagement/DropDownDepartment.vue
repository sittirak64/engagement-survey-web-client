<template>
  <div>
    <select class="form-select" :value="userData" @change="emitChange($event.target.value)"
      aria-label="Default select example" required>
      <!-- Option default -->
      <option disabled value=""> {{ placeholder }} </option>
      <option v-for="(choice, index) in choiceType" :key="choice.departmentId" :value="choice.departmentId" class="form-select1">
        {{ choice.departmentNameEn }}
      </option>
    </select>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  name: 'DropDownDepartment',
  props: {
    defaultMessage: String,
    userData: String,
    choiceType: {
      type: Array,
      required: true
    },
    fieldName: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      required: true
    },
  },

  setup(props, { emit }) {
    const userData = ref(props.userData)

    watch(() => props.userData, (newValue) => {
      userData.value = newValue;
    });

    const emitChange = (choice) => {
      emit('handleDepartment', props.fieldName, choice);
    };

    return {
      emitChange,
      userData
    };
  }
}
</script>
