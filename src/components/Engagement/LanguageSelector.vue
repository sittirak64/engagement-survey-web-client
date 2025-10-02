<template>
  <div class="language-selector">
    <div class="custom-dropdown">
      <div class="dropdown-label" @click="toggleDropdown">
        <FlagIcon :code="selected.flag" class="flag-icon" />
        {{ selected.name }}
      </div>
      <div v-if="isOpen" class="dropdown-list">
        <div v-for="lang in languageOptions" :key="lang.code" class="dropdown-item" @click="selectLanguage(lang)">
          <FlagIcon :code="lang.flag"  class="flag-icon" />
          {{ lang.name }}
        </div>
      </div>
    </div>
  </div>
</template>
 
<script>
import { ref, computed, onMounted } from 'vue';
import ApiService from '../../services/ApiService.js';
import languagesData from '/src/language/languagesData.json';
import FlagIcon from 'vue3-flag-icons';
 
export default {
  components: {
    FlagIcon,
  },
  props: {
    label: {
      type: String,
      default: 'Select Language'
    },
    modelValue: {
      type: String,
      default: 'en'
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const languageOptions = ref([]);
    const selectedLanguage = ref((sessionStorage.getItem('defaultLanguage') || props.modelValue).toLowerCase());
    const isOpen = ref(false);
 
    const translations = ref({});
 
    const selected = computed(() => {
      const selectedLang = languageOptions.value.find(lang => lang.code === selectedLanguage.value);
      return {
        flag: selectedLang ? selectedLang.flag : 'us',
        name: selectedLang ? selectedLang.name : 'English',
        code: selectedLang ? selectedLang.code : 'en',
 
      };
    });
 
 
    const toggleDropdown = () => {
      isOpen.value = !isOpen.value;
    };
 
    const selectLanguage = (lang) => {
      selectedLanguage.value = lang.code;
      emit('update:modelValue', lang.code);
      sessionStorage.setItem('defaultLanguage', lang.code);
      translations.value = languagesData[lang.code] || languagesData['en'];
      isOpen.value = false;
    };
 
    const fetchLanguage = async () => {
      const response = await ApiService.getLanguage({
        surveyId: sessionStorage.getItem("surveyId"),
      });
 
      languageOptions.value = response.data.objectValue.map(lang => ({
        code: lang.languageCode,
        name: lang.languageName,
        flag: lang.countryCode,
      }));
    };
 
 
    onMounted(async () => {
      await fetchLanguage();
    });
 
    return {
      selectedLanguage,
      languageOptions,
      translations,
      selected,
      toggleDropdown,
      selectLanguage,
      isOpen,
    };
  }
};
</script>
 
<style scoped>
.language-selector {
  display: flex;
  align-items: center;
  position: absolute;
  top: 10px;
  right: 50px;
  z-index: 1000;
}
 
.language-selector label {
  font-size: 15px;
}
 
.custom-dropdown {
  position: relative;
  display: inline-block;
}
 
.dropdown-label {
  font-size: 20px;
  padding: 10px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 150px;
  height: 50px;
}
 
.flag-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}
 
.dropdown-list {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  z-index: 1001;
  width: 180px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
 
.dropdown-item {
  padding: 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
  background-color: #f1f1f1;
 
}
 
.dropdown-item:hover {
  background-color: #f1f1f1;
}
 
@media only screen and (max-width: 580px) {
  .language-selector {
    display: flex;
    right: 0;
  }
 
  .language-selector label {
    font-size: 15px;
  }
 
  .custom-dropdown {
    position: relative;
    display: inline-block;
  }
 
  .dropdown-label {
    font-size: 11px;
    padding: 10px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    cursor: pointer;
    width: 100px;
    height: 60px;
 
  }
 
  .flag-icon {
    width: 18px;
    height: 18px;
  }
 
  .dropdown-list {
    position: absolute;
    top: 100%;
    right: 0;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    z-index: 1001;
    width: 90px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
 
  .dropdown-item {
    font-size: 10px;
    padding: 8px;
    display: flex;
    align-items: center;
    cursor: pointer;
    background-color: #f1f1f1;
 
  }
 
  .dropdown-item:hover {
    background-color: #f1f1f1;
  }
}
</style>