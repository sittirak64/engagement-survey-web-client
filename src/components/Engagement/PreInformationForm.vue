<template>
  <LanguageSelector :modelValue="selectedLanguage" @update:modelValue="(newLang) => {
    changeLanguage(newLang);
  }" :label="translations.selectLanguage" @click="fetchListDepartment" />
  <div class="container-fluid" v-if="!loading">
    <h1 class="title">{{ translations.title }}</h1>
    <form @submit.prevent="submitForm" class="form-container">
      <div class="grid-container">
        <div class="information-container" v-if="Email">
          <p>{{ translations.email }}&nbsp;:</p>
          <input class="form-control" type="text" :value="userData.email" aria-label="readonly input example" readonly>
        </div>
        <div class="information-container" v-if="Department">
          <p>{{ translations.department }}&nbsp;:</p>
          <DropDownDepartment @handleDepartment="handleDepartment" :fieldName="'departmentId'"
            :choiceType="filterDepartment(true)" :userData="userData.departmentId"
            ::defaultMessage="translations.selectDepartment" :placeholder="translatedOptionSelection" />
        </div>
        <div class="information-container" v-if="Gender">
          <p>{{ translations.gender }}&nbsp;:</p>
          <DropDown @handleChange="handleChange" :fieldName="'gender'" :choiceType="filterChoiceType('gender', false)"
            :userData="userData.gender" :defaultMessage="translations.selectGender"
            :placeholder="translatedOptionSelection" />
        </div>
        <div class="information-container" v-if="YearOfService">
          <p>{{ translations.yearOfService }}&nbsp;:</p>
          <DropDown @handleChange="handleChange" :fieldName="'yearOfService'"
            :choiceType="filterChoiceType('years_of_service', false)" :userData="userData.yearOfService"
            :defaultMessage="translations.selectYearOfService" :placeholder="translatedOptionSelection" />
        </div>
        <div class="information-container" v-if="country">
          <p>{{ translations.country }}&nbsp;:</p>
          <DropDown @handleChange="handleChange" :fieldName="'countryId'"
            :choiceType="filterChoiceType('countryLocation', true)" :userData="userData.countryId"
            :defaultMessage="translations.selectCountryLocation" :placeholder="translatedOptionSelection" />
        </div>
        <div class="information-container" v-if="Position">
          <p>{{ translations.position }}&nbsp;:</p>
          <DropDownPosition @handlePosition="handlePosition" :fieldName="'positionId'" :positions="filterPosition(true)"
            :userData="userData.positionId" :defaultMessage="translations.selectPosition"
            :placeholder="translatedOptionSelection" />
        </div>
        <div class="information-container" v-if="YearOfBirth">
          <p>{{ translations.birthdate }}&nbsp;:</p>
          <DatePicker @handleChange="handleChange" :setDate="userData.birthDate" :placeholder="translatedSelectDate" />
        </div>
      </div>
      <div class="btn-container">
        <button type="submit" class="btn btn-secondary">
          <template v-if="btnloading">
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            <span>&nbsp;{{ translations.loading }}</span>
          </template>
          <span v-else>{{ translations.save }}</span>
        </button>
      </div>
    </form>
    <div class="footer">
      <p>{{ translations.footer }}</p>
    </div>
  </div>
  <div v-else class="container-fluid bg-quinary">
    <h1 class="text-white">{{ translations.loading }}</h1>
  </div>
</template>

<script>
import { ref, onMounted, inject, watch, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import DropDown from '../Engagement/DropDown.vue';
import DropDownDepartment from '../Engagement/DropDownDepartment.vue';
import DropDownPosition from '../Engagement/DropDownPosition.vue';
import { MixinsUserData } from '../../mixins/MixinsUserData.js';
import ApiService from '../../services/ApiService.js';
import { appStorage } from '../../mixins/AppStorage.js';
import languagesData from '/src/language/languagesData.json'
import DatePicker from '@/components/Engagement/DatePicker.vue';
import LanguageSelector from '../Engagement/LanguageSelector.vue';
import { useI18n } from 'vue-i18n';

export default {
  name: 'SelfInformationForm',
  components: {
    DatePicker,
    DropDown,
    DropDownDepartment,
    DropDownPosition,
    LanguageSelector
  },
  setup() {
    const router = useRouter();
    const departmentList = ref([]);
    const { getStorage, setStorage } = appStorage();
    const { userData, fetchData } = MixinsUserData();
    const answerChoice = ref([]);
    const loading = ref(false);
    const btnloading = ref(false);
    const navigateToErrorPage = inject('navigateToErrorPage');
    const selectedLanguage = ref((sessionStorage.getItem('defaultLanguage') || 'en').toLowerCase());
    const translations = ref({});
    const country = ref(null);
    const Gender = ref(null);
    const YearOfService = ref(null);
    const YearOfBirth = ref(null);
    const Email = ref(null);
    const Position = ref(null);
    const Department = ref(null);
    const PositionList = ref([]);
    const email = ref("");
    const respondentId = ref("");
    const aIndex = ref(0);
    const { t, locale } = useI18n();
    const translatedOptionSelection = ref(t('optionsSelection'));
    const translatedSelectDate = ref(t('selectDate'));

    const changeLanguage = (newLanguage) => {
      if (newLanguage === 'th' || newLanguage === 'en') {
        selectedLanguage.value = newLanguage;
        sessionStorage.setItem('defaultLanguage', newLanguage);
        translations.value = languagesData[selectedLanguage.value];
        locale.value = newLanguage;
      } else {
        selectedLanguage.value = newLanguage;
        sessionStorage.setItem('defaultLanguage', newLanguage);
        translations.value = languagesData[selectedLanguage.value];
        locale.value = newLanguage;
      }
    };

    watch(() => locale.value, () => {
      translatedOptionSelection.value = t('optionsSelection');
      translatedSelectDate.value = t('selectDate');
    });
    const loadUserData = async () => {
      const savedEmail = sessionStorage.getItem('email');

      const response = await ApiService.getRespondentInfo({
        email: savedEmail,
        surveyId: sessionStorage.getItem('surveyId'),
      });

      if (response && response.data && response.data.objectValue) {
        const userDataFromApi = response.data.objectValue;
        userData.value = userDataFromApi;
        email.value = userDataFromApi.email;
        respondentId.value = userDataFromApi.respondentId;
      }
    };

    const filterChoiceType = (type, isOnlyEn) => {
      const filterResult = answerChoice.value.filter((choice) => choice.dataType === type);
      const result = [];
      let count = 1;
      for (const idx in filterResult) {
        if (isOnlyEn == true) {
          result.push({
            'id': idx, 'dataId': filterResult[idx].dataId, 'dataDetail': filterResult[idx].dataDetailEn !== null
              ? filterResult[idx].dataDetailEn
              : filterResult[idx].dataDetailTh
          });
        } else {
          if (sessionStorage.getItem('defaultLanguage').toLowerCase() === 'en') {
            result.push({ 'id': idx, 'dataId': filterResult[idx].dataId, 'dataDetail': filterResult[idx].dataDetailEn });
          }
          else if (sessionStorage.getItem('defaultLanguage').toLowerCase() === 'th') {
            result.push({ 'id': idx, 'dataId': filterResult[idx].dataId, 'dataDetail': filterResult[idx].dataDetailTh });
          } else {
            result.push({ 'id': idx, 'dataId': filterResult[idx].dataId, 'dataDetail': t(`${type}.${type}${count}`) });
          }
        }

        count++;
      }
      return result;
    };

    const filterPosition = () => {
      return PositionList.value;
    }

    const filterDepartment = () => {
      return departmentList.value;
    }


    const submitForm = async () => {
      btnloading.value = true;
      const body = {
        respondentId: sessionStorage.getItem('respondentId'),
        surveyId: sessionStorage.getItem('surveyId'),
      };
      try {
        await ApiService.patchRespondentSubmit(body);
        router.push('/survey');
      } catch (error) {
        navigateToErrorPage(error);
      } finally {
        btnloading.value = false;
      }
    };

    const updateUserDataAndSend = async (key, value) => {
      userData.value[key] = value;
      const body = {
        respondentId: sessionStorage.getItem('respondentId'),
        key: key,
        value: value,
      };
      await ApiService.patchRespondentInfo(body);
    };

    const handleChange = async (key, value) => {
      await updateUserDataAndSend(key, value);
    };

    const handlePosition = async (key, value) => {

      userData.value[key] = value;
      const body = {
        respondentId: sessionStorage.getItem('respondentId'),
        key: key,
        value: value,
      }
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
    const fetchRespondent = async () => {
      const body = {
        email: sessionStorage.getItem('email'),
        surveyId: sessionStorage.getItem("surveyId"),
      };
      const response = await ApiService.getRespondentInfo(body);
      if (response.data.code === "2002") {
        invalidMessage.value = response.data.message.trim();
        phoneInvalid.value = true;
        modalType.value = "error";
        Modal.value.openModal(modalType.value);
      } else {
        email.value = response.data.objectValue.email;
        respondentId.value = response.data.objectValue.respondentId;
        sessionStorage.setItem("respondentId", respondentId.value);
        if (response.data.status) {
          setStorage("userData", JSON.stringify(response.data.objectValue));
          setStorage("isAuthenticated", "true");
          sessionStorage.setItem("templateId", response.data.objectValue.templateId);
        }
      }
    }
    const fetchListDepartment = async () => {
      try {
        const corporateId = sessionStorage.getItem("corporateId");
        const body = {
          requestObject: {
            keyword: "all",
            corporateId: corporateId,
          },
          pageValue: {
            sortBy: "departmentNameEn",
            sortDirection: "ASC",
          },
        };
        const response = await ApiService.listMasterData({
          messageKey: 'all',
          language: sessionStorage.getItem('defaultLanguage'),
          surveyId: sessionStorage.getItem('surveyId'),
        });
        answerChoice.value = response.data.objectValue;
      } catch (error) {
        navigateToErrorPage(error);
      }
    };

    const fetchListPosition = async () => {
      const response = await ApiService.getPosition({
        corporateId: sessionStorage.getItem("corporateId"),
        language: sessionStorage.getItem("defaultLanguage"),
      });
      PositionList.value = response.data.objectValue;
    };

    const fetchDepartment = async () => {
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
      departmentList.value = response.data.objectValue;
    };


    onMounted(async () => {
      // Initialize language translations
      translations.value = languagesData[selectedLanguage.value];
      country.value = JSON.parse(sessionStorage.getItem('country'));
      Gender.value = JSON.parse(sessionStorage.getItem('Gender'));
      YearOfService.value = JSON.parse(sessionStorage.getItem('YearOfService'));
      YearOfBirth.value = JSON.parse(sessionStorage.getItem('YearOfBirth'));
      Email.value = JSON.parse(sessionStorage.getItem('Email'));
      Position.value = JSON.parse(sessionStorage.getItem('Position'));
      Department.value = JSON.parse(sessionStorage.getItem('Department'));
      loading.value = true;
      fetchData();
      loadUserData();
      fetchListDepartment();
      fetchListPosition();
      fetchRespondent();
      fetchDepartment();
      loading.value = false;
    });
    return {
      userData,
      submitForm,
      handleChange,
      filterChoiceType,
      loading,
      btnloading,
      selectedLanguage,
      translations,
      changeLanguage,
      fetchListDepartment,
      country,
      Gender,
      YearOfService,
      YearOfBirth,
      Email,
      Position,
      Department,
      filterPosition,
      handlePosition,
      filterDepartment,
      handleDepartment,
      translatedOptionSelection,
      translatedSelectDate,
    };
  }
};
</script>


<style scoped>
@media only screen and (min-width: 1501px) {
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
    width: 70vw;
    height: 65%;
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
 
 
  .information-container {
    display: flex;
    align-content: stretch;
    align-items: center;
    justify-content: center;
    gap: 28px;
  }
 
  .information-container p {
    white-space: nowrap;
    width: 200px;
    text-align: right;
    font-size: 1vw;
  }
 
  .information-container>*:not(p) {
    flex-grow: 1;
    margin-left: 2%;
    width: 380px;
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
    font-size: calc(4vw + 0.5rem);
    color: var(--font-secondary-color);
    position: relative;
    margin-top: 2.5%;
 
  }

  .footer {
    margin-top:2%;
  }

  .footer p {
    color: white;
    font-size: 0.75vw;
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

  
}
 
@media only screen and (max-width: 1500px) {
 
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
    width: 70vw;
    height: 700px;
    flex-flow: column wrap;
    justify-content: center;
    align-items: center;
    padding: 0 5%;
    gap: 0;
    background-color: white;
    justify-content: space-evenly;
  }
 
  .grid-container {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 20px 10px;
 
  }
 
  .grid-container>*:last-child:nth-child(odd) {
    margin: 0;
    max-width: none;
 
  }
 
  .information-container {
    display: flex;
    align-content: stretch;
    align-items: center;
    justify-content: center;
    gap: 28px;
    width: 100%;
  }
 
  .information-container p {
    white-space: nowrap;
    width: 200px;
    text-align: right;
    font-size: 1.5vw;
 
  }
 
  .information-container>*:not(p) {
    flex-grow: 1;
    margin-left: 2%;
    width: 380px;
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
    font-size: calc(4vw + 0.5rem);
    color: var(--font-secondary-color);
    position: relative;
    margin-top: 2.5%;
 
  }

  .footer {
    margin-top:2%;
  }

  .footer p {
    color: white;
    font-size: 0.75vw;
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
}
 
@media only screen and (max-width: 1200px) {
 
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
    width: 70vw;
    height: 600px;
    flex-flow: column wrap;
    justify-content: center;
    align-items: center;
    padding: 0 5%;
    gap: 0;
    background-color: white;
    justify-content: space-evenly;
  }
 
  .grid-container {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 20px 10px;
    /* background-color: red; */
 
  }
 
  .grid-container>*:last-child:nth-child(odd) {
    margin: 0;
    max-width: none;
 
  }
 
  .information-container {
    display: flex;
    align-content: stretch;
    align-items: center;
    justify-content: center;
    gap: 28px;
    width: 100%;
 
  }
 
  .information-container p {
    white-space: nowrap;
    width: 150px;
    text-align: right;
    font-size: 1.5vw;
 
  }
 
  .information-container>*:not(p) {
    flex-grow: 1;
    margin-left: 2%;
    width: 380px;
  }
 
  p {
    font-size: 16px;
    margin: 0;
    white-space: normal;
    overflow-wrap: break-word;
  }
 
  .title {
    margin: 0;
    padding: 15px 0;
    width: 70%;
    font-size: 50px;
    color: var(--font-secondary-color);
    position: relative;
    margin-top: 2.5%;
 
  }

  .footer {
    margin-top:2%;
  }

  .footer p {
    color: white;
    font-size: 0.75vw;
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
}
 
@media only screen and (max-width: 768px) {
 
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
    width: 70vw;
    height: 700px;
    flex-flow: column wrap;
    justify-content: center;
    align-items: center;
    padding: 0 5%;
    gap: 0;
    background-color: white;
    justify-content: space-evenly;
  }
 
  .grid-container {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 20px 10px;
  }
 
  .grid-container>*:last-child:nth-child(odd) {
    margin: 0;
    max-width: none;
 
  }
 
  .information-container {
    display: flex;
    align-content: stretch;
    align-items: center;
    justify-content: center;
    gap: 28px;
    width: 100%;
  }
 
  .information-container p {
    white-space: nowrap;
    width: 200px;
    text-align: right;
    font-size: 2vw;
 
  }
 
  .information-container>*:not(p) {
    flex-grow: 1;
    margin-left: 2%;
    width: 380px;
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
    font-size: calc(4vw + 0.5rem);
    position: relative;
    margin-top: 2.5%;
    color: white;
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
}
 
@media only screen and (max-width: 580px) {
 
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
    width: 90vw;
    height: 500px;
    flex-flow: column wrap;
    justify-content: center;
    align-items: center;
    padding: 0 5%;
    gap: 0;
    background-color: white;
    justify-content: space-evenly;
  }
 
  .grid-container {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 20px 10px;
  }
 
  .grid-container>*:last-child:nth-child(odd) {
    margin: 0;
    max-width: none;
 
  }

  .form-control {
    width: 380px !important;
  }
 
  .information-container {
    display: flex;
    align-content: stretch;
    align-items: center;
    justify-content: center;
    gap: 28px;
    width: 100%;
  }
 
  .information-container p {
    white-space: nowrap;
    width: 200px;
    text-align: right;
    font-size: 2.7vw;
 
  }
 
  .information-container>*:not(p) {
    flex-grow: 1;
    margin-left: 2%;
    width: 380px;
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
    font-size: calc(4vw + 0.5rem);
    position: relative;
    margin-top: 2.5%;
    color: white;
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
}

@media only screen and (max-width: 430px) {
  .form-control {
    width: 47vw !important;
  }

  /* .footer {
    width: 70vw;
    position: fixed;
    bottom: 8vh;
  }

  .footer p {
    color: white;
    font-size: 1vw;
  } */

}
</style>
