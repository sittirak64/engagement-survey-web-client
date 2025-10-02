<template>
  <div class="container-fluid" v-if="!loading">
    <h1 class="title">Self Information</h1>
    <form @submit.prevent="submitForm" class="form-container">
      <div class="grid-container">
        <div class="information-container">
          <p>Department&nbsp;:</p>
          <DropDownDepartment @handleDepartment="handleDepartment" :fieldName="'departmentId'"
            :ChoiceType="filterDepartment()" :userData="userData.departmentId"
            :defaultMessage="'Please select department'" />
        </div>
        <div class="information-container">
          <p>Gender&nbsp;:</p>
          <DropDown @handleChange="handleChange" :fieldName="'gender'" :ChoiceType="filterChoiceType('gender')"
            :userData="userData.gender" :defaultMessage="'Please select gender'" />
        </div>
        <div class="information-container">
          <p>Year of Service&nbsp;:</p>
          <DropDown @handleChange="handleChange" :fieldName="'yearOfService'"
            :ChoiceType="filterChoiceType('years_of_service')" :userData="userData.yearOfService"
            :defaultMessage="'Please select Year of Service'" />
        </div>
        <div class="information-container">
          <p>Year of Birth&nbsp;:</p>
          <YearPicker @handleChange="handleChange" :setDate="userData.birthDate" />
        </div>
      </div>
      <div class="btn-container">
        <button type="submit" class="btn btn-secondary">
          <template v-if="btnloading">
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            <span>&nbsp;Loading...</span>
          </template>
          <span v-else>Submit</span>
        </button>
      </div>
    </form>
  </div>
  <div v-else class="container-fluid bg-quinary">
    <h1 class="text-white">Loading...</h1>
  </div>
</template>

<script>
import { ref, onMounted, inject } from 'vue';
import { useRouter } from 'vue-router';
import YearPicker from './YearPicker.vue';
import DropDown from './DropDown.vue';
import DropDownDepartment from './DropDownDepartment.vue';
import { MixinsUserData } from '../../mixins/MixinsUserData.js';
import ApiService from '../../services/ApiService.js';
import { appStorage } from '../../mixins/AppStorage.js';

export default {
  name: 'SelfInformationForm',
  components: {
    YearPicker,
    DropDown,
    DropDownDepartment
  },
  setup() {
    const router = useRouter();
    const department = ref([]);
    const { getStorage, setStorage } = appStorage();
    const { userData, fetchData } = MixinsUserData();
    const answerChoice = ref([])
    const loading = ref(false);
    const btnloading = ref(false);
    const navigateToErrorPage = inject('navigateToErrorPage');

    const filterChoiceType = (type) => {
      return answerChoice.value.filter((choice) => choice.dataType === type);
    }

    const filterDepartment = () => {
      return department.value;
    }

    const submitForm = async () => {
      btnloading.value = true;
      const body = {
        respondentId: sessionStorage.getItem('respondentId'),
        surveyId: sessionStorage.getItem('surveyId'),
      }
      try {
        await ApiService.patchRespondentSubmit(body);
        router.push('/survey');
      } catch (error) {
        navigateToErrorPage(error);
      } finally {
        btnloading.value = false;
      }
    }

    const handleChange = async (key, value) => {
      userData.value[key] = value;
      const body = {
        respondentId: sessionStorage.getItem('respondentId'),
        key: key,
        value: value,
      };
      await ApiService.patchRespondentInfo(body);
    };


    const handleDepartment = async (key, value) => {

      userData.value[key] = value;
      const body = {
        respondentId: sessionStorage.getItem('respondentId'),
        key: key,
        value: value,
      }
      await ApiService.patchRespondentInfo(body);
    };

    onMounted(async () => {
      loading.value = true;
      fetchData();
      const corporateId = sessionStorage.getItem("corporateId")
      const body = {
        requestObject: {
          keyword: "all",
          corporateId: corporateId
        },
        pageValue: {
          sortBy: "departmentNameEn",
          sortDirection: "ASC"
        }
      };
      const response = await ApiService.listDepartment(body);
      department.value = response.data.objectValue;
      try {
        const response = await ApiService.listMasterData({ 
          messageKey: 'all', 
          language: sessionStorage.getItem('defaultLanguage'),
          surveyId: sessionStorage.getItem('surveyId'),
        });
        answerChoice.value = response.data.objectValue;
      }
      catch (error) {
        navigateToErrorPage(error);
      }
      loading.value = false;
    });

    return {
      department,
      userData,
      submitForm,
      handleChange,
      handleDepartment,
      filterChoiceType,
      filterDepartment,
      loading,
      btnloading,
    };
  }
};
</script>

<style scoped>
.container-fluid {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-image: url('/src/assets/images/bakertilly-bg.png');
  background-position: right bottom;
  background-repeat: no-repeat;
  background-size: cover;
  position: fixed;
}

.form-container {
  display: flex;
  width: 70%;
  height: 70%;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  padding: 0 5%;
  gap: 10%;
  background-color: white;

}

.grid-container {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 60px 10px;
}

.grid-container>*:last-child:nth-child(odd) {
  grid-column: 1 / -1;
  max-width: 50%;
  margin: auto;
}

.information-container {
  display: flex;
  align-content: stretch;
  align-items: center;
  justify-content: center;
  gap: 28px;
}

.information-container p {
  margin: 0;
  white-space: nowrap;
}

.information-container>*:not(p) {
  flex-grow: 1;
}

p {
  font-size: calc(1vw + 0.5rem);
  margin: 0;
  white-space: normal;
  overflow-wrap: break-word;
}

.title {
  margin: 0;
  padding: 15px 0;
  width: 70%;
  font-size: calc(6vw + 0.5rem);
  color: var(--font-secondary-color);
  position: relative;
  margin-top: 2.5%;

}

.birth-date-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-container {
  width: calc(30% + 80px);
  padding: 10px 0 10px 0;
}

.btn-secondary {
  width: 100%;
  border: 0;
  color: var(--font-primary-color);
  background-color: var(--primary-color);
}

.btn-secondary:disabled {
  color: var(--font-secondary-color);
}

.btn-secondary:hover {
  color: var(--font-secondary-color);
}


p.col-2 {
  display: flex;
  align-items: center;
  justify-content: center;
}

@media only screen and (max-width: 1000px) {
  .form-container {
    justify-content: space-evenly;
    gap: 0;

  }

  .information-container {
    max-width: 600px !important;
    width: 100%;
  }

  .grid-container {
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 20px 10px;

  }

  .grid-container>*:last-child:nth-child(odd) {
    margin: 0;
    max-width: none;

  }

}
</style>