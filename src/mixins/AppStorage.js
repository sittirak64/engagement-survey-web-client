import { reactive, toRefs } from 'vue';

const storage = reactive({
  colors: null,
  surveyId: null,
  surveyType: null,
  respondentId: null,
  templateId: null, 
  isAuthenticated: null,
  isMultiLanguage: false,
  allowOpenEndComment: false,
});

export function setStorage(key, value) {
  storage[key] = value;
}

export function getStorage(key) {
  return storage[key];
}

export function appStorage() {
  return {
    ...toRefs(storage),
    setStorage,
    getStorage,
  };
}
