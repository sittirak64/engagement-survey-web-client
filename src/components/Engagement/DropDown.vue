<template>
  <div>
    <select class="form-select" :value="userData" @change="emitChange($event.target.value)" required
      aria-label="Default select example">
      <!-- Option default as placeholder -->
      <option disabled value=""> {{ placeholder }}</option>

      <!-- Loop through choices -->
      <option v-for="(choice, index) in choiceType" :key="choice.id" :value="choice.dataId">
        <div>
          {{ choice.dataDetail }}
        </div>
      </option>
    </select>
  </div>
</template>



<script>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

export default {
  name: 'DropDown',
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
    const { t, locale } = useI18n();
    const userData = ref(props.userData)
    const selectedLanguage = ref((sessionStorage.getItem('defaultLanguage') || 'en').toLowerCase());


    watch(() => props.userData, (newValue) => {
      userData.value = newValue;
    });

    watch(() => selectedLanguage.value, (newLanguage) => {
      selectedLanguage.value = newLanguage;
      sessionStorage.setItem('defaultLanguage', newLanguage);
      locale.value = newLanguage;
    });

    const emitChange = (choice) => {
      emit('handleChange', props.fieldName, choice);
    };

    return {
      emitChange,
      userData,
      selectedLanguage,
      t
    };
  }
}
</script>
