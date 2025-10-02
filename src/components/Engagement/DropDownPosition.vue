<template>
  <div>
    <select class="form-select" :value="userData" @change="emitChange($event.target.value)"
      aria-label="Default select example" required>

      <option disabled value="">{{ placeholder }} </option>
      <option v-for="(position, index) in positions" :key="position.positionId" :value="position.positionId" class="form-select1">
        {{ position.positionNameEn }}
      </option>
    </select>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  name: 'DropDownPosition',
  props: {
    defaultMessage: String,
    userData: String,
    positions: {  
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
    const userData = ref(props.userData);

    watch(() => props.userData, (newValue) => {
      userData.value = newValue;
    });

    const emitChange = (position) => {
      emit('handlePosition', props.fieldName, position);
    };

    return {
      emitChange,
      userData
    };
  }
}
</script>
