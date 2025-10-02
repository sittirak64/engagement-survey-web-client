import { ref } from 'vue';
import { getStorage, setStorage } from './AppStorage.js'; 

export function MixinsUserData() {
  const userData = ref({
    surveyId: null,
    respondentId: null,
    templateId: null,
  });

  function fetchData() {
    const storedData = getStorage('userData');
    if (storedData) {
      userData.value = JSON.parse(storedData);
    }
    return userData;
  }

  function updateData(newData) {
    userData.value = { ...userData.value, ...newData };
    setStorage('userData', JSON.stringify(userData.value)); 
  }

  return {
    userData,
    fetchData,
    updateData,
  };
}
