<template>
  <div>
    <LanguageSelector :modelValue="selectedLanguage" @update:modelValue="(newLang) => {
      changeLanguage(newLang);
      fetchSurveyData();
    }" :label="translations.selectLanguage" />
  </div>
  <div v-if="!loading" class="container-fluid">
    <div v-if="surveyConfig.isMultiLanguage">
      <h1>{{ surveyName.nameTh }}</h1>
      <h1>{{ surveyName.nameEn }}</h1>
    </div>
    <div v-else>
      <div v-if="selectedLanguage === 'th'">
        <h1>{{ surveyName.nameTh }}</h1>
      </div>
      <div v-else>
        <h1>{{ surveyName.nameEn }}</h1>
      </div>
    </div>

    <form class="form-container bg-denary needs-validation" novalidate>
      <div v-if="surveyConfig.isMultiLanguage">
        <h4>{{ questions[currentPage - 1].mainTopicTh }}</h4>
        <h4>{{ questions[currentPage - 1].mainTopicEn }}</h4>
      </div>
      <div v-else>
        <div v-if="selectedLanguage === 'th'">
          <h4>{{ questions[currentPage - 1].mainTopicTh }}</h4>
        </div>
        <div v-else>
          <h4>{{ questions[currentPage - 1].mainTopicEn }}</h4>
        </div>
      </div>
      <hr>
      <div class="question-container">
        <div class="question" v-for="(question, qIndex) in questions[currentPage - 1].questionList" :key="question.id">
          <div v-if="surveyConfig.isMultiLanguage">
            <p>{{ `${qIndex + 1}. ${question.statement}` }}</p>
            <p class="White-Space">{{ `${question.statement}` }}</p>
          </div>
          <div v-else>
            <div v-if="surveyConfig.defaultLanguage">
              <p>{{ `${qIndex + 1}. ${question.statement}` }}</p>
            </div>
            <div v-else>
              <p>{{ `${qIndex + 1}.${question.statement}` }}</p>
            </div>
          </div>

          <!-- Yes no -->
          <div v-if="question.type === 'yes-or-no'" class="button-radio">
            <div v-for="(answer, aIndex) in answerYesOrNoList" :key="answer.id" class="radio-group">
              <input type="radio" class="radio-button" :id="`radioButton:${currentPage}${qIndex}${aIndex}`"
                :name="`radioButton:${currentPage}${qIndex}`" autocomplete="off"
                v-model="question.previousYesOrNoAnswer"
                @input="handleChange('yes-or-no', question.questionId, $event.target.value)" required :value="aIndex" />
              <label :for="`radioButton:${currentPage}${qIndex}${aIndex}`" class="radio-label">
                <div style="font-size: 1.6vh; margin-left: 0.5vw;">
                  {{ selectedLanguage === 'th' ? answer.dataDetailTh : answer.dataDetailEn }}
                </div>
              </label>
            </div>
          </div>


          <!-- selection -->
          <div v-else-if="question.type === 'selection'" class="button-container">
            <div v-for="(answer, aIndex) in answerSelectionList" :key="answer.id">
              <input type="radio" class="btn-check" :id="`radioButton:${currentPage}${qIndex}${aIndex}`"
                :name="`radioButton:${currentPage}${qIndex}`" autocomplete="off" v-model="question.previousChoiceAnswer"
                @input="handleChange('selection', question.questionId, $event.target.value)" :value="aIndex + 1"
                required />
              <div v-if="surveyConfig.isMultiLanguage">
                <div v-if="isSmallScreen">
                  <label :class="{ 'btn-selected': question.previousChoiceAnswer == (aIndex + 1), 'btn': true }"
                    :for="`radioButton:${currentPage}${qIndex}${aIndex}`">
                    <span v-if="selectedLanguage === 'en'">
                      {{ answer.dataDetailEn }}
                    </span>
                    <span v-else-if="selectedLanguage === 'th'">
                      {{ answer.dataDetailTh }}
                    </span>
                    <span v-else>
                      {{ $t(`selections.selection${aIndex + 1}`) }}
                    </span>
                  </label>
                </div>
                <div v-else>
                  <label :class="{ 'btn-selected': question.previousChoiceAnswer == (aIndex + 1), 'btn': true }"
                    :for="`radioButton:${currentPage}${qIndex}${aIndex}`">
                    <p class="selection-label" v-if="selectedLanguage === 'en'">
                      {{ answer.dataDetailEn }}
                    </p>
                    <p class="selection-label" v-else-if="selectedLanguage === 'th'">
                      {{ answer.dataDetailTh }}
                    </p>
                    <p class="selection-label" v-else>
                      {{ $t(`selections.selection${aIndex + 1}`) }}
                    </p>
                  </label>
                </div>
              </div>
              <div v-else>
                <label :class="{ 'btn-selected': question.previousChoiceAnswer == (aIndex + 1), 'btn': true }"
                  :for="`radioButton:${currentPage}${qIndex}${aIndex}`">
                  <span v-if="selectedLanguage === 'en'">
                    {{ answer.dataDetailEn }}
                  </span>
                  <span v-else-if="selectedLanguage === 'th'">
                    {{ answer.dataDetailTh }}
                  </span>
                  <span v-else>
                    <div>
                      {{ $t(`selections.selection${aIndex + 1}`) }}
                    </div>
                  </span>
                </label>
              </div>
            </div>
          </div>

          <!-- open-end -->
          <div v-else-if="question.type === 'open-end'" class="textfield-container">
            <textarea class="form-control" :maxlength="surveyType === 'ShortQuiz' ? 2500 : ''"
              :id="`textarea:${currentPage}${qIndex}`" v-model="question.previousOpenEndAnswer"
              @focusout="textareaSave(question.questionId, $event.target.value, question.commentOption)"
              :disabled="question.commentOption === 'noComment'" :placeholder="placeholderText"></textarea>
            <div v-if="surveyConfig.allowOpenEndComment">
              <div class="switch">
                <input type="checkbox" :id="`toggleSwitch:${currentPage}${qIndex}`" v-model="question.commentOption"
                  v-on:change="handleToggleSwitch(question)" true-value="noComment" false-value="comment" />
                <label :for="`toggleSwitch:${currentPage}${qIndex}`" class="switch-label">
                  <span class="switch-slider"></span>
                </label>
              </div>
              <label :for="`toggleSwitch:${currentPage}${qIndex}`" class="No-Comment">
                &nbsp;&nbsp; {{ textSwitch }}
              </label>
            </div>
          </div>

          <!-- close-end -->
          <div v-else-if="question.type === 'close-end'" class="button-container">
            <div v-for="(answer, aIndex) in answerCloseEnd" :key="answer.id" class="form-check checkbox-option">
              <input type="checkbox" :id="`checkboxButton:${currentPage}${qIndex}${aIndex}`"
                :name="`checkboxButton:${currentPage}${qIndex}`" autocomplete="off" :value="aIndex + 1"
                v-model="answer.previousCloseEndAnswer"
                @input="handleChange('closeEnd', question.questionId, answer.choiceId)"
                class="form-check-input custom-checkbox" required />
              <label
                :class="{ 'checkbox-option': question.previousCloseEndAnswer == (aIndex + 1), 'form-check-label': true }"
                :for="`checkboxButton:${currentPage}${qIndex}${aIndex}`">
                {{ surveyConfig.defaultLanguage ? answer.choiceDetailEn : answer.choiceDetailTh }}
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-container">
        <button class="btn btn-secondary" :style="{ visibility: currentPage === 1 ? 'hidden' : 'visible' }"
          @click="prevPage" type="button">
          <i class="bi bi-arrow-left"></i><span class="hide-on-mobile">&nbsp;{{ translations.previous }}</span>
        </button>
        <button class="btn-primary"
          :class="{ 'btn-primary': allQuestionsAnswered, 'btn-before': !allQuestionsAnswered }"
          :disabled="!allQuestionsAnswered" @click="nextPage" type="button">
          <template v-if="currentPage < totalPages"><span class="hide-on-mobile">{{ translations.next }}&nbsp;</span><i
              class="bi bi-arrow-right"></i></template>
          <template v-else>{{ translations.submit }}&nbsp;
          </template>
        </button>
        <Modal ref="Modal" :modalType="modalType" @confirm="submitForm" />
      </div>
      <br />
      <br />
      <br />
    </form>
  </div>
  <div v-else class="container-fluid">
    <h1 class="loading">{{ translations.loading }}</h1>
  </div>
</template>

<script>
import {
  onBeforeMount,
  onMounted,
  onBeforeUnmount,
  inject,
  ref,
  computed,
  watch,
} from "vue";
import ApiService from "../../services/ApiService.js";
import Modal from "@/components/Modal/Modal.vue";
import ButtonLanguage from "../GlobalComponent/ButtonLanguage.vue";
import LanguageSelector from '../Engagement/LanguageSelector.vue';
import languagesData from '/src/language/languagesData.json';
import { useI18n } from 'vue-i18n';

export default {
  name: "QuestionSurveyItem",
  components: {
    Modal,
    ButtonLanguage,
    LanguageSelector
  },
  setup() {
    const questions = ref([]);
    const surveyName = ref({
      nameTh: "Default name TH",
      nameEn: "Default name EN"
    });
    const answerSelectionList = ref([]);
    const surveyType = ref(sessionStorage.getItem("surveyType"));
    const answerYesOrNoList = ref([]);
    const answerCloseEnd = ref([]);
    const loading = ref(false);
    const currentPage = ref(1);
    const totalPages = ref(0);
    const navigateToErrorPage = inject("navigateToErrorPage");
    const isSmallScreen = ref(window.innerWidth < 1201);
    const modalType = ref("");
    const placeholderText = ref('');
    const textSwitch = ref('');
    const Modal = ref(null);
    const surveyConfig = ref({
      isMultiLanguage: false,
      allowOpenEndComment: false,
      defaultLanguage: false
    });
    const selectedLanguage = ref((sessionStorage.getItem('defaultLanguage') || 'en').toLowerCase());
    const translations = ref(languagesData[selectedLanguage.value] || {});
    const currentTranslations = ref({});
    const { t, locale } = useI18n();

    const changeLanguage = (newLanguage) => {
      if (newLanguage === 'th' || newLanguage === 'en') {
        selectedLanguage.value = newLanguage;
        sessionStorage.setItem('defaultLanguage', newLanguage);
        translations.value = languagesData[selectedLanguage.value];
      } else {
        selectedLanguage.value = newLanguage;
        sessionStorage.setItem('defaultLanguage', newLanguage);
        translations.value = languagesData[selectedLanguage.value];
        locale.value = newLanguage;
      }
    };
    watch(selectedLanguage, (newLanguage) => {
      changeLanguage(newLanguage);
    });
    const updatePlaceholderAndTextSwitch = () => {
      const language = sessionStorage.getItem('defaultLanguage')?.toLowerCase();
      if (language === 'th') {
        placeholderText.value = 'กรุณากรอกข้อมูล';
        textSwitch.value = 'ไม่เเสดงความคิดเห็น';
      } else if (language === 'en') {
        placeholderText.value = 'Please fill in the information.';
        textSwitch.value = 'No Comment';
      } else {
        placeholderText.value = translations.value.placeholderText || 'Please fill in the information.';
        textSwitch.value = translations.value.noComment || 'No Comment';
      }
    };


    const handleResize = () => {
      isSmallScreen.value = window.innerWidth < 1201;
      answerSelectionList.value = isSmallScreen.value
        ? answerSelectionList.value.sort((a, b) => b.dataGroupSort - a.dataGroupSort)
        : answerSelectionList.value.sort((a, b) => a.dataGroupSort - b.dataGroupSort);
    };
    onMounted(() => {
      window.addEventListener("resize", handleResize);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", handleResize);
    });

    const fetchSurveyData = async () => {
      loading.value = true;
      const userData = {
        surveyId: sessionStorage.getItem("surveyId"),
        respondentId: sessionStorage.getItem("respondentId"),
      };
      const body = {
        surveyId: userData.surveyId,
        respondentId: userData.respondentId,
        answerRelationId: userData.respondentId,
        language: sessionStorage.getItem("defaultLanguage")
      };

      try {
        surveyConfig.value.isMultiLanguage = sessionStorage.getItem('isMultiLanguage') === 'true';
        surveyConfig.value.allowOpenEndComment = sessionStorage.getItem('allowOpenEndComment') === 'true';
        surveyConfig.value.defaultLanguage = sessionStorage.getItem('defaultLanguage') === 'EN';

        const response = await ApiService.listQuestionsSurvey(body);
        surveyName.value.nameEn = response.data.objectValue.surveyNameEn;
        surveyName.value.nameTh = response.data.objectValue.surveyNameTh;
        questions.value = response.data.objectValue.competencyList;

        questions.value.forEach((competency) => {
          if (surveyConfig.value.allowOpenEndComment) {
            competency.questionList.forEach((question) => {
              question.commentOption = question.type === 'open-end' && question.previousOpenEndAnswer === '-' ? "noComment" : "comment";
            });
          } else {
            competency.questionList.forEach((question) => {
              if (question.type === 'open-end') question.commentOption = "comment";
              if (question.type === 'yes-or-no' && question.previousYesOrNoAnswer != null) {
                question.previousYesOrNoAnswer = question.previousYesOrNoAnswer ? 0 : 1;
              }
            });
          }
        });
        totalPages.value = questions.value.length;
      } catch (error) {
        navigateToErrorPage(error);
      }

      try {
        const selectionList = await ApiService.listMasterData({
          messageKey: "selection",
          language: sessionStorage.getItem('defaultLanguage'),
          surveyId: sessionStorage.getItem('surveyId'),
        });
        answerSelectionList.value = selectionList.data.objectValue;
        handleResize();
        updatePlaceholderAndTextSwitch();


        const yesOrNoChoice = await ApiService.listMasterData({
          messageKey: "yesno_choice",
          language: sessionStorage.getItem('defaultLanguage'),
          surveyId: sessionStorage.getItem('surveyId'),
        });
        answerYesOrNoList.value = yesOrNoChoice.data.objectValue;

        const closeEndQuestion = questions.value[0].questionList.find(question => question.type === 'close-end');
        if (closeEndQuestion) {
          const closeEnd = await ApiService.getCloseEnd({
            questionId: closeEndQuestion.questionId,
            language: sessionStorage.getItem('defaultLanguage')
          });
          answerCloseEnd.value = closeEnd.data.objectValue;
        }
      } catch (error) {
        navigateToErrorPage(error);
      }
      loading.value = false;
    };
    onBeforeMount(async () => {
      await fetchSurveyData();
    });
    const textareaSave = async (questionId, data, commentState) => {
      let body = {
        surveyId: sessionStorage.getItem("surveyId"),
        respondentId: sessionStorage.getItem("respondentId"),
        questionId: questionId,
        answerRelationId: sessionStorage.getItem("respondentId"),
        openEndAnswer: "",
        closeEndAnswer: "",
      };
      if (commentState === 'comment') {
        body.openEndAnswer = data;
      } else {
        body.openEndAnswer = '-';
      }
      await ApiService.saveAnswerSurvey(body);
    }
    const handleChange = async (flag, questionId, data) => {
      let body = {
        surveyId: sessionStorage.getItem("surveyId"),
        respondentId: sessionStorage.getItem("respondentId"),
        questionId: questionId,
        answerRelationId: sessionStorage.getItem("respondentId"),
        openEndAnswer: "",
        choiceAnswer: "",
        yesOrNoAnswer: null,
        closeEndAnswer: "",
      };
      if (flag === "openEnded") {
        body.openEndAnswer = data;
      } else if (flag === "selection") {
        body.choiceAnswer = data;
      } else if (flag === "closeEnd") {
        body.closeEndAnswer = data;
      }
      else if (flag === "yes-or-no") {
        if (data == 1) {
          body.yesOrNoAnswer = false;
        } else {
          body.yesOrNoAnswer = true;
        }

      }
      await ApiService.saveAnswerSurvey(body);

    };
    const getConfig = async (type) => {
      switch (type) {
        case 'language':
          if (surveyConfig.value.isMultiLanguage === 'true') {
            return true;
          } else {
            return false;
          }
        case 'comment':
          if (surveyConfig.value.allowOpenEndComment === 'true') {
            return true;
          } else {
            return false;
          }
      }
    }

    const allQuestionsAnswered = computed(() => {
      const currentPageQuestions = questions.value[currentPage.value - 1]
        .questionList;
      return currentPageQuestions.every((question) => {
        if (question.type === "selection") {
          return question.previousChoiceAnswer;
        }
        if (question.type === "yes-or-no" && question.previousYesOrNoAnswer == null) {
          return true;
        }
        if (question.type === "open-end") {
          if (question.commentOption === "noComment") {
            return true;
          }
          return (
            (question.previousOpenEndAnswer &&
              question.previousOpenEndAnswer.trim() !== "")
          );
        }
        if (question.type === "close-end") {
          return answerCloseEnd.value.some((answer) => answer.previousCloseEndAnswer);
        }
        return true;
      });
    });

    const nextPage = () => {
      if (allQuestionsAnswered.value) {
        if (currentPage.value < totalPages.value) {
          currentPage.value++;
          scrollToTop();
        } else {
          if (Modal.value.openModal(modalType.value = true)) {
            submitForm();
          }
          modalType.value = "confirm";
          Modal.value.openModal(modalType.value);
        }
      }
    };
    const scrollToTop = () => {
      const mainTopic = document.querySelector('.form-container h4');
      if (mainTopic) {
        mainTopic.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    const handleToggleSwitch = (question) => {
      if (question.commentOption === 'noComment') {
        question.previousOpenEndAnswer = '';

        handleChange('openEnded', question.questionId, '-');
      } else {
        handleChange('openEnded', question.questionId, question.previousOpenEndAnswer);
      }
    };


    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    const submitForm = async () => {
      const body = {
        respondentId: sessionStorage.getItem("respondentId"),
        surveyId: sessionStorage.getItem("surveyId"),
        templateId: sessionStorage.getItem("templateId"),
        answerRelationId: sessionStorage.getItem("respondentId")
      };
      await ApiService.submitSurvey(body);
    };

    return {
      questions,
      submitForm,
      handleChange,
      getConfig,
      answerSelectionList,
      answerYesOrNoList,
      answerCloseEnd,
      loading,
      currentPage,
      nextPage,
      prevPage,
      totalPages,
      isSmallScreen,
      allQuestionsAnswered,
      surveyName,
      Modal,
      modalType,
      textareaSave,
      surveyConfig,
      surveyType,
      fetchSurveyData,
      placeholderText,
      textSwitch,
      handleToggleSwitch,
      selectedLanguage,
      translations,
      changeLanguage,
      currentTranslations,
      t,
    };
  }
};
</script>


<style scoped>
@media only screen and (min-width: 1601px) {

  .container-fluid {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 15px;
    height: 100%;
    max-width: 100%;
    padding: 2% 5%;
    margin-top: 65px;
    position: fixed;
    background-image: url('/src/assets/images/bakertilly-bg.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: auto;

  }

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
  }


  .form-container {
    width: 100%;
    padding: 2% 3%;
    overflow-y: scroll;
    overflow-x: hidden;
    height: 1152px;

  }

  .form-container h4 {
    font-size: calc(0.25em + 1.5vw);
    text-align: left;
  }

  .form-container h2 {
    font-size: calc(1em + 1.5vw);
    text-align: left;
  }

  .container-fluid h1 {
    font-size: calc(1em + 2vw);
    margin-right: auto;
    color: rgb(255, 255, 255);
  }

  .radio-label {
    margin-left: 8px;
  }

  .radio-group {
    display: flex;
    align-items: center;
  }

  .radio-button {
    margin-right: 8px;
  }

  .button-radio {
    display: block;
    font-size: 150px !important;
  }

  .form-container p {
    font-size: calc(0.5em + 0.8vw);
    margin: 0;
    text-align: left;
    overflow-y: auto;
    max-height: calc(100vh - 100px);
    background-color: rgba(255, 255, 255, 0.9);
  }

  .button-container {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    gap: 10px;
  }

  .question-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 50px;
  }

  .question {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }

  .pagination-container {
    width: 100%;
    max-height: 100%;
    display: flex;
    justify-content: space-between;
    user-select: none;
    margin-top: 50px;
  }

  .icon-link-hover:hover {
    cursor: pointer;

  }

  .icon-link-hover:hover .bi-arrow-left {
    transform: translateX(-5px);
    transition: transform 0.3s ease;
  }

  .icon-link-hover:hover .bi-arrow-right {
    transform: translateX(5px);
    transition: transform 0.3s ease;
  }

  .form-control {
    flex-grow: 1;
    border: 1px solid rgb(168, 166, 166);
  }

  .btn {
    display: flexbox;
    border-color: var(--septenary-color);
    border-width: 1.5px;
    /* height: 60px; */
    width: 16vw;
    font-size: 15px;

  }

  .btn-selected {
    background-color: var(--septenary-color);
    color: white;
  }

  .btn:hover {
    background-color: var(--septenary-color);
    color: white;
  }


  .btn .selection-label {
    font-size: 16px;
    text-align: center;
  }

  .btn-check:checked+.btn {
    border-color: var(--septenary-color);
    background-color: var(--septenary-color);
    border-width: 1.5px;
    color: white;
  }

  .btn-check:hover+.btn {
    border-color: var(--septenary-color);
    background-color: var(--septenary-color);
    border-width: 1.5px;
    color: white;
    opacity: 0.9;
  }

  .btn-primary {
    background-color: var(--primary-color);
    color: black;
    border: none;
    font-size: calc(0.5em + 0.5vw);
    width: 13vw;
    border-radius: 6px;
    margin-left: 60%;
  }

  .btn-primary:hover {
    color: rgb(255, 255, 255);

  }

  .btn-secondary {
    font-size: calc(0.5em + 0.5vw);
    color: rgb(0, 0, 0);
    width: 13vw;
    border-color: var(--primary-color);
    background-color: rgb(255, 255, 255);
    margin-left: 1%;
  }

  .btn-before {
    background-color: #b8c0c0;
    color: rgb(0, 0, 0);
    font-size: calc(0.5em + 0.5vw);

  }

  .p {
    text-align: left;
  }

  .content {
    width: 100%;
    height: 100%;
  }

  .switch {
    position: relative;
    display: inline-block;
    padding-top: 15px;
    width: 50px;
    height: 25px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .switch-label {
    position: absolute;
    cursor: pointer;
    background-color: #ccc;
    transition: .4s;
    border-radius: 34px;
    width: 100%;
    height: 100%;
  }

  .switch-slider {
    position: absolute;
    cursor: pointer;
    background-color: #fff;
    border-radius: 50%;
    transition: .4s;
    height: 18px;
    width: 18px;
    left: 4px;
    bottom: 4px;
  }

  input:checked+.switch-label {
    background-color: #4caf50;
  }

  input:checked+.switch-label .switch-slider {
    transform: translateX(26px);
  }

  .switch-label {
    background-color: #ccc;
  }

  .switch-slider {
    background-color: #fff;
  }

  .textfield-container textarea {
    resize: none;
    height: 180px;
  }

  .White-Space {
    padding-top: 2%;
  }

  .checkbox-option {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
    cursor: pointer;
  }

  .checkbox-option input[type="checkbox"] {
    width: 16px;
    height: 16px;
    margin-right: 20px;
    accent-color: #00bab3;
    border: rgb(118, 116, 116) 1px solid;
  }

  .checkbox-option input[type="checkbox"] {
    -webkit-transform: scale(1.5);
    -moz-transform: scale(1.5);
    -ms-transform: scale(1.5);
    -o-transform: scale(1.5);
    transform: scale(1.5);
  }

  .checkbox-option label {
    font-size: 16px;
    color: #000000;
    margin-top: 8px;
    width: 100vh;
  }

  .checkbox-option input[type="checkbox"]:checked {
    background-color: #00bab3;
    appearance: none;
    border-radius: 3px;
    border: none;
  }

  .custom-checkbox:focus {
    outline: none;
    box-shadow: none;
  }
}

@media only screen and (max-width: 1600px) {

  .container-fluid {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 15px;
    height: 100%;
    max-width: 100%;
    padding: 2% 5%;
    margin-top: 65px;
    position: fixed;
    background-image: url('/src/assets/images/bakertilly-bg.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: auto;
  }

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
  }

  .form-container {
    width: 100%;
    padding: 2% 3%;
    overflow-y: scroll;
    overflow-x: hidden;
    height: 1152px;
  }

  .form-container h4 {
    font-size: calc(0.25em + 1.5vw);
    text-align: left;
  }

  .form-container h2 {
    font-size: calc(1em + 1.5vw);
    text-align: left;
  }

  .container-fluid h1 {
    font-size: calc(1em + 2vw);
    margin-right: auto;
    color: rgb(255, 255, 255);


  }

  .form-container p {

    font-size: calc(0.5em + 0.8vw);
    margin: 0;
    text-align: left;
    overflow-y: auto;
    max-height: calc(100vh - 100px);
    background-color: rgba(255, 255, 255, 0.9);
  }

  .button-container {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    gap: 10px;
  }

  .question-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 50px;
  }

  .question {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }

  .pagination-container {
    width: 100%;
    max-height: 100%;
    display: flex;
    justify-content: space-between;
    user-select: none;
    margin-top: 50px;
  }

  .icon-link-hover:hover {
    cursor: pointer;

  }

  .icon-link-hover:hover .bi-arrow-left {
    transform: translateX(-5px);
    transition: transform 0.3s ease;
  }

  .icon-link-hover:hover .bi-arrow-right {
    transform: translateX(5px);
    transition: transform 0.3s ease;
  }

  .form-control {
    flex-grow: 1;
    border: 1px solid rgb(168, 166, 166);
  }

  .btn {
    display: flexbox;
    border-color: var(--septenary-color);
    border-width: 1.5px;
    /* height: 60px; */
    width: 16vw;
    font-size: 15px;

  }

  .btn-selected {
    background-color: var(--septenary-color);
    color: white;
  }

  .btn:hover {
    background-color: var(--septenary-color);
    color: white;
  }


  .btn .selection-label {
    font-size: 16px;
    text-align: center;
  }

  .btn-check:checked+.btn {
    border-color: var(--septenary-color);
    background-color: var(--septenary-color);
    border-width: 1.5px;
    color: white;
  }

  .btn-check:hover+.btn {
    border-color: var(--septenary-color);
    background-color: var(--septenary-color);
    border-width: 1.5px;
    color: white;
    opacity: 0.9;
  }

  .btn-primary {
    background-color: var(--primary-color);
    color: black;
    border: none;
    font-size: calc(0.5em + 0.5vw);
    width: 13vw;
    border-radius: 6px;
    margin-left: 62%;
  }

  .btn-primary:hover {
    color: rgb(255, 255, 255);

  }

  .btn-secondary {
    font-size: calc(0.5em + 0.5vw);
    color: rgb(0, 0, 0);
    width: 13vw;
    border-color: var(--primary-color);
    background-color: rgb(255, 255, 255);
    margin-left: 1%;
  }

  .btn-before {
    background-color: #b8c0c0;
    color: rgb(0, 0, 0);
    font-size: calc(0.5em + 0.5vw);

  }

  .p {
    text-align: left;
  }

  .content {
    width: 100%;
    height: 100%;
  }

  .switch {
    position: relative;
    display: inline-block;
    padding-top: 15px;
    width: 50px;
    height: 25px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .switch-label {
    position: absolute;
    cursor: pointer;
    background-color: #ccc;
    transition: .4s;
    border-radius: 34px;
    width: 100%;
    height: 100%;
  }

  .switch-slider {
    position: absolute;
    cursor: pointer;
    background-color: #fff;
    border-radius: 50%;
    transition: .4s;
    height: 18px;
    width: 18px;
    left: 4px;
    bottom: 4px;
  }

  input:checked+.switch-label {
    background-color: #4caf50;
  }

  input:checked+.switch-label .switch-slider {
    transform: translateX(26px);
  }

  .switch-label {
    background-color: #ccc;
  }

  .switch-slider {
    background-color: #fff;
  }

  .textfield-container textarea {
    resize: none;
    height: 180px;
  }

  .White-Space {
    padding-top: 2%;
  }

  .checkbox-option {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
    cursor: pointer;
  }

  .checkbox-option input[type="checkbox"] {
    width: 16px;
    height: 16px;
    margin-right: 20px;
    accent-color: #00bab3;
    border: rgb(118, 116, 116) 1px solid;
  }

  .checkbox-option input[type="checkbox"] {
    -webkit-transform: scale(1.5);
    -moz-transform: scale(1.5);
    -ms-transform: scale(1.5);
    -o-transform: scale(1.5);
    transform: scale(1.5);
  }

  .checkbox-option label {
    font-size: 16px;
    color: #000000;
    margin-top: 8px;
    width: 100vh;
  }

  .checkbox-option input[type="checkbox"]:checked {
    background-color: #00bab3;
    appearance: none;
    border-radius: 3px;
    border: none;
  }

  .custom-checkbox:focus {
    outline: none;
    box-shadow: none;
  }
}

@media only screen and (max-width: 1200px) {

  .container-fluid {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 15px;
    height: 100%;
    background-color: #ffff;
    max-width: 100%;
    padding: 2% 15%;
    margin-top: 65px;
    position: fixed;
  }

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
  }

  .form-container {
    width: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    padding: 1% 1%;
    height: 100%;
  }

  .form-container h2 {
    font-size: calc(1em + 1.5vw);
    text-align: left;

  }

  .container-fluid h1 {
    font-size: calc(1em + 1.5vw);
    margin-right: auto;
    color: rgb(255, 255, 255);
    margin-top: 2%;
  }

  .form-container h4 {
    font-size: calc(0.5em + 1.5vw);
    text-align: left;
  }

  .question-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 50px;
    font-size: 20px;
  }

  .form-container p {

    font-size: calc(0.5em + 0.8vw);
    margin: 0;
    text-align: left;
    overflow-y: auto;
    max-height: calc(100vh - 100px);
    background-color: rgba(255, 255, 255, 0.9);
  }

  .button-container {
    flex-flow: row wrap;
    align-items: center;
    gap: 2.5%;
    display: grid;
    grid-template-columns: 2fr;
  }

  .question-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 50px;
  }

  .question {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }

  .pagination-container {
    width: 100%;
    max-height: 100%;
    display: flex;
    justify-content: space-between;
    user-select: none;
    margin-top: 50px;
  }

  .icon-link-hover:hover {
    cursor: pointer;

  }

  .icon-link-hover:hover .bi-arrow-left {
    transform: translateX(-5px);
    transition: transform 0.3s ease;
  }

  .icon-link-hover:hover .bi-arrow-right {
    transform: translateX(5px);
    transition: transform 0.3s ease;
  }

  .form-control {
    flex-grow: 1;
    border: 1px solid rgb(168, 166, 166);
  }

  .btn {
    display: flexbox;
    border-color: var(--septenary-color);
    border-width: 1.5px;
    width: 100%;

  }

  .btn-selected {
    background-color: var(--septenary-color);
    color: white;
  }

  .btn:hover {
    background-color: var(--septenary-color);
    color: white;
  }

  .btn-check:checked+.btn {
    border-color: var(--septenary-color);
    background-color: var(--septenary-color);
    border-width: 1.5px;
    color: white;
  }

  .btn-check:hover+.btn {
    border-color: var(--septenary-color);
    background-color: var(--septenary-color);
    border-width: 1.5px;
    color: white;
    opacity: 0.9;
  }

  .btn-primary {
    background-color: var(--primary-color);
    color: black;
    border: none;
    font-size: calc(0.5em + 0.5vw);
    width: 12vw;
    border-radius: 6px;
    margin-left: 60%;
  }

  .btn-primary:hover {
    color: rgb(255, 255, 255);

  }

  .btn-secondary {
    font-size: calc(0.5em + 0.5vw);
    color: rgb(0, 0, 0);
    width: 12vw;
    border-color: var(--primary-color);
    background-color: rgb(255, 255, 255);
  }

  .btn-before {
    background-color: #b8c0c0;
    color: rgb(0, 0, 0);
    font-size: calc(0.5em + 0.5vw);
    width: 12vw;


  }

  .p {
    text-align: left;
  }

  .content {
    width: 100%;
    height: 100%;
  }

  .switch {
    position: relative;
    display: inline-block;
    padding-top: 15px;
    width: 50px;
    height: 25px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .switch-label {
    position: absolute;
    cursor: pointer;
    background-color: #ccc;
    transition: .4s;
    border-radius: 34px;
    width: 100%;
    height: 100%;
  }

  .switch-slider {
    position: absolute;
    cursor: pointer;
    background-color: #fff;
    border-radius: 50%;
    transition: .4s;
    height: 18px;
    width: 18px;
    left: 4px;
    bottom: 4px;
  }

  input:checked+.switch-label {
    background-color: #4caf50;
    margin-top: 5px;
  }

  input:checked+.switch-label .switch-slider {
    transform: translateX(26px);
  }

  .switch-label {
    background-color: #ccc;
    margin-top: 5px;

  }

  .switch-slider {
    background-color: #fff;
  }

  .hide-on-mobile {
    display: none;
  }

  .No-Comment {
    font-size: 15px;
  }

  .textfield-container textarea {
    resize: none;
    height: 180px;
  }

  .White-Space {
    padding-top: 2%;
  }

  .btn .selection-label {
    font-size: 16px;
    text-align: center;
  }

  .checkbox-option {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
    cursor: pointer;
  }

  .checkbox-option input[type="checkbox"] {
    width: 16px;
    height: 16px;
    margin-right: 20px;
    accent-color: #00bab3;
    border: rgb(118, 116, 116) 1px solid;
  }

  .checkbox-option input[type="checkbox"] {
    -webkit-transform: scale(1.5);
    -moz-transform: scale(1.5);
    -ms-transform: scale(1.5);
    -o-transform: scale(1.5);
    transform: scale(1.5);
  }

  .checkbox-option label {
    font-size: 16px;
    color: #000000;
    margin-top: 15px;
  }

  .checkbox-option input[type="checkbox"]:checked {
    background-color: #00bab3;
    appearance: none;
    border-radius: 3px;
    border: none;
  }

  .checkbox-option {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
    cursor: pointer;
  }

  .checkbox-option input[type="checkbox"] {
    width: 15px;
    height: 15px;
    margin-right: 20px;
    accent-color: #00bab3;
    border: rgb(118, 116, 116) 1px solid;
  }

  .checkbox-option input[type="checkbox"] {
    -webkit-transform: scale(1.5);
    -moz-transform: scale(1.5);
    -ms-transform: scale(1.5);
    -o-transform: scale(1.5);
    transform: scale(1.5);
  }

  .checkbox-option label {
    font-size: 16px;
    color: #000000;
    margin-top: 8px;
    width: 100vh;

  }

  .checkbox-option input[type="checkbox"]:checked {
    background-color: #00bab3;
    appearance: none;
    border-radius: 3px;
    border: none;
  }

  .custom-checkbox:focus {
    outline: none;
    box-shadow: none;
  }


}

@media only screen and (max-width: 580px) {
  .container-fluid {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 15px;
    background-color: #ffff;
    height: 100%;
    max-width: 100%;
    padding: 2% 14%;
    margin-top: 70px;
    position: fixed;

  }

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
  }

  .form-container {
    width: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    height: 100%;
    padding: 1% 4%;
  }

  .container-fluid h1 {
    font-size: 23px;
    margin-right: auto;
    color: rgb(255, 255, 255);
  }

  .form-container h2 {
    text-align: left;
    font-size: 18px;
  }


  .form-container h4 {
    font-size: calc(0.5em + 1.5vw);
    text-align: left;
  }

  .btn-primary {
    background-color: var(--primary-color);
    color: black;
    border: none;
    font-size: calc(0.5em + 0.5vw);
    width: 20vw;
    height: 3vh;
    border-radius: 6px;
  }

  .btn-secondary {
    font-size: calc(0.5em + 0.5vw);
    color: rgb(0, 0, 0);
    width: 20vw;
    height: 3vh;
    border-color: var(--primary-color);
    background-color: rgb(255, 255, 255);
  }

  .form-container p {

    font-size: calc(0.5em + 0.8vw);
    margin: 0;
    text-align: left;
    overflow-y: auto;
    max-height: calc(100vh - 100px);
    background-color: rgba(255, 255, 255, 0.9);
  }

  .button-container {
    flex-flow: row wrap;
    align-items: center;
    gap: 3.5%;
    grid-template-columns: 2fr;

  }

  .question-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 50px;
  }

  .question {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }

  .pagination-container {
    width: 100%;
    max-height: 100%;
    display: flex;
    justify-content: space-between;
    user-select: none;
    margin-top: 50px;
  }

  .icon-link-hover:hover {
    cursor: pointer;

  }

  .icon-link-hover:hover .bi-arrow-left {
    transform: translateX(-5px);
    transition: transform 0.3s ease;
  }

  .icon-link-hover:hover .bi-arrow-right {
    transform: translateX(5px);
    transition: transform 0.3s ease;
  }

  .form-control {
    flex-grow: 1;
    border: 1px solid rgb(168, 166, 166);
  }

  .btn {
    display: flexbox;
    border-color: var(--septenary-color);
    border-width: 1.5px;
    width: 100%;
  }

  .btn-check:checked+.btn {
    border-color: var(--septenary-color);
    background-color: var(--septenary-color);
    border-width: 1.5px;
    color: white;
  }

  .btn-check:hover+.btn {
    border-color: var(--septenary-color);
    background-color: var(--septenary-color);
    border-width: 1.5px;
    color: white;
    opacity: 0.9;
  }

  .btn-primary {
    background-color: var(--primary-color);
    color: black;
    border: none;
    font-size: calc(0.5em + 0.5vw);
    width: 20vw;
    height: 4vh;
    border-radius: 6px;
    margin-left: 60%;
  }

  .btn-primary:hover {
    color: rgb(255, 255, 255);

  }

  .btn-secondary {
    font-size: calc(0.5em + 0.5vw);
    color: rgb(0, 0, 0);
    width: 20vw;
    height: 4vh;
    border-color: var(--primary-color);
    background-color: rgb(255, 255, 255);
  }

  .btn-before {
    background-color: #b8c0c0;
    color: rgb(0, 0, 0);
    font-size: calc(0.5em + 0.5vw);
    width: 20vw;
    height: 4vh;

  }

  .p {
    text-align: left;
  }

  .content {
    width: 100%;
    height: 100%;
  }


  .switch {
    position: relative;
    display: inline-block;
    padding-top: 15px;
    width: 50px;
    height: 20px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .switch-label {
    position: absolute;
    cursor: pointer;
    background-color: #ccc;
    transition: .4s;
    border-radius: 30px;
    width: 100%;
    height: 100%;
  }

  .switch-slider {
    position: absolute;
    cursor: pointer;
    background-color: #fff;
    border-radius: 50%;
    transition: .4s;
    height: 15px;
    width: 15px;
    left: 4px;
    bottom: 3px;
  }

  input:checked+.switch-label {
    background-color: #4caf50;
    margin-top: 7px;
  }

  input:checked+.switch-label .switch-slider {
    transform: translateX(26px);
  }

  .switch-label {
    background-color: #ccc;
    margin-top: 7px;

  }

  .switch-slider {
    background-color: #fff;
  }

  .hide-on-mobile {
    display: none;
  }

  .textfield-container textarea {
    resize: none;
    height: 150px;
  }

  .No-Comment {
    font-size: 15px;
  }

  .White-Space {
    padding-top: 2%;
  }

  .btn-selected {
    background-color: var(--septenary-color);
    color: white;
  }

  .btn:hover {
    background-color: var(--septenary-color);
    color: white;
  }

  .checkbox-option {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
    cursor: pointer;
  }

  .checkbox-option input[type="checkbox"] {
    width: 15px;
    height: 15px;
    margin-right: 20px;
    accent-color: #00bab3;
    border: rgb(118, 116, 116) 1px solid;
  }

  .checkbox-option input[type="checkbox"] {
    -webkit-transform: scale(1.5);
    -moz-transform: scale(1.5);
    -ms-transform: scale(1.5);
    -o-transform: scale(1.5);
    transform: scale(1.5);
  }

  .checkbox-option label {
    font-size: 16px;
    color: #000000;
    margin-top: 8px;
    width: 100vh;

  }

  .checkbox-option input[type="checkbox"]:checked {
    background-color: #00bab3;
    appearance: none;
    border-radius: 3px;
    border: none;
  }

  .custom-checkbox:focus {
    outline: none;
    box-shadow: none;
  }


}
</style>
