<template>
  <div class="container-fluid">
    <div class="box-bar">
      <h1> {{ respondentName }}</h1>
      <h2 class="totalPage">{{ questions.sortOrder }} of {{ totalPage }}</h2>
      <p class="score hide-mobile" v-if="questionType === 'multiple choice'"> {{ totalScore }}</p>
      <p class="time" v-if="questionType === 'multiple choice'">
        <i class="bi bi-stopwatch"></i> : {{ countdown }}s
      </p>
    </div>

    <div class="container-form">
      <div class="container">
        <div class="bg-multiple">
          <AnswerButton v-if="!isLastQuestion && questionType === 'multiple choice'" :key="'answer-button'"
            :selectedAnswer="selectedAnswer" :isAnswered="isAnswered" @saveAnswer="saveAnswer" />
        </div>
        <div v-if="questionType === 'frequency'" class="bg-frequency">
          <button v-for="choice in choice" :key="choice.choiceId" :class="{
            'selected-button': selectedAnswer === choice.choiceId,
            'dimmed-button': isAnswered && selectedAnswer !== choice.choiceId
          }" :disabled="isAnswered" class="choice-button" @click="selectAnswer(choice.choiceId)">
            {{ choice.choice }}
          </button>
        </div>

        <div v-if="questionType === 'word cloud'" class="container-fluid">
          <div class="box-container">
            <div v-if="!isAnswered">
              <div class="form-group">
                <label for="exampleInputEmail1">&nbsp;Answer :</label>
                <input type="text" class="form-control" id="exampleInputEmail1" placeholder="Please enter your answer."
                  v-model="answerText" @input="validateInput" :disabled="isAnswered" />
              </div>
            </div>
            <div v-else class="thank-massage">
              <label>&nbsp;Thank you!</label>
            </div>
            <button type="button" :class="answerText ? 'btn-primary' : 'btn-secondary'"
              :disabled="!answerText || isAnswered" v-if="!isAnswered" @click="sendAnswer">
              Send
            </button>
            <button type="button" class="btn-danger" v-if="showCloseButton" @click="closeQuiz">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import QuizUserApi from "/src/services/QuizUserApi.js";
import AnswerButton from "/src/components/QuizComponent/User/AnswerButton.vue";
import { useRoute, useRouter } from "vue-router";

export default {
  name: "AnswerForm",
  components: {
    AnswerButton
  },
  setup() {
    const route = useRoute();
    const respondentId = route.query.respondentId;
    const respondentName = ref("");
    const totalScore = ref(0);
    let remainingTime = Number(route.query.remainingTime);
    const countdown = ref(remainingTime);
    const questionId = ref('');
    const selectedAnswer = ref(null);
    const isAnswered = ref(false);
    const questions = ref([]);
    const totalPage = ref(0);
    const isLastQuestion = ref(false);
    const sortOrder = ref(parseInt(sessionStorage.getItem("sortOrder")) || 1);
    const newSortOrder = ref(2);
    let interval = null;
    let apiPollingInterval = null;
    const startTime = ref('');
    const endTime = ref(Date.now() + remainingTime);
    const newStartTime = ref('');
    const newEndTime = ref('');
    const newQuestionId = ref('');
    const questionType = ref('');
    const choice = ref([]);
    const answerText = ref("");
    const router = useRouter();
    const showCloseButton = ref(false);
    const questionTypeMultiple = ref('');
    const questionTypeFrequency = ref('');
    const questionTypeWordCloud = ref('');


    const respondentInfo = async () => {
      const body = {
        questionSetId: sessionStorage.getItem("questionSetId"),
        respondentId,
      };
      const response = await QuizUserApi.postQuizMember(body);
      respondentName.value = response.data.objectValue.respondentName;
      totalScore.value = response.data.objectValue.totalScore;
    };

    const fetchQuestion = async () => {
      const questionSetId = sessionStorage.getItem("questionSetId");
      const sessionId = sessionStorage.getItem("sessionId");

      if (questionSetId && sessionId) {
        const response = await QuizUserApi.getQuestionAnswerUser(questionSetId, sortOrder.value, sessionId);
        questions.value = response.data.objectValue;
        choice.value = response.data.objectValue.choiceList;
        questionType.value = response.data.objectValue.questionType;
        sessionStorage.setItem("questionType", questionType.value);
        totalPage.value = Number(response.data.pageValue.total);
        questionId.value = response.data.objectValue.questionId;
        sessionStorage.setItem("questionId", questionId.value);
        await fetchStartTime(questionId.value);
        if (questionType.value === 'multiple choice') {
          questionTypeMultiple.value = questionType.value === 'multiple choice';
        } else if (questionType.value === 'frequency') {
          questionTypeFrequency.value = questionType.value === 'frequency';
        } else if (questionType.value === 'word cloud') {
          questionTypeWordCloud.value = questionType.value === 'word cloud';
        }
        isAnswered.value = false;
        selectedAnswer.value = null;
        resetCountdown();



      }
    };

    const fetchNewQuestion = async () => {
      const questionSetId = sessionStorage.getItem("questionSetId");
      const sessionId = sessionStorage.getItem("sessionId");

      if (newSortOrder.value > totalPage.value) {
        sortOrder.value = newSortOrder.value;
        sessionStorage.setItem("sortOrder", sortOrder.value);
        clearInterval(apiPollingInterval);
        return;
      }

      if (questionSetId && sessionId) {
        const response = await QuizUserApi.getQuestionAnswerUser(questionSetId, newSortOrder.value, sessionId);
        newQuestionId.value = response.data.objectValue.questionId;
        await fetchNewStartTime(newQuestionId.value);
      }
    };

    const fetchStartTime = async () => {
      const body = {
        questionSetId: sessionStorage.getItem("questionSetId"),
        sessionId: sessionStorage.getItem("sessionId"),
        questionId: sessionStorage.getItem("questionId"),
      };
      const response = await QuizUserApi.postQuiz(body);
      startTime.value = response.data.objectValue.startTime;
      endTime.value = response.data.objectValue.endTime;
    };

    const fetchNewStartTime = async () => {
      const body = {
        questionSetId: sessionStorage.getItem("questionSetId"),
        sessionId: sessionStorage.getItem("sessionId"),
        questionId: newQuestionId.value,

      };
      const response = await QuizUserApi.postQuiz(body);
      newStartTime.value = response.data.objectValue.startTime;
      newEndTime.value = response.data.objectValue.endTime;


      if (newStartTime.value && newStartTime.value !== startTime.value) {
        startTime.value = newStartTime.value;
        newStartTime.value = null;
        sortOrder.value = newSortOrder.value;
        sessionStorage.setItem("sortOrder", sortOrder.value);
        newSortOrder.value++;
        countdown.value = remainingTime;
        questionId.value = newQuestionId.value;
        await fetchQuestion();
        isAnswered.value = false;
        selectedAnswer.value = null;

      }
    };

    const sendAnswer = () => {
      saveAnswer(answerText.value);
      isAnswered.value = true;
      answerText.value = "";

      if (sortOrder.value >= totalPage.value) {
        showCloseButton.value = true;
      }
    };



    const saveAnswer = async (choiceId) => {
      if (isAnswered.value) return;

      selectedAnswer.value = choiceId;
      isAnswered.value = true;

      const body = {
        questionId: sessionStorage.getItem("questionId"),
        questionSetId: sessionStorage.getItem("questionSetId"),
        sessionId: sessionStorage.getItem("sessionId"),
        answerBy: respondentId,
        answerChoice: "",
        answerFrequency: "",
        answerWordCloud: "",
      };

      if (questionType.value === 'multiple choice') {
        body.answerChoice = choiceId + 1;
      } else if (questionType.value === 'frequency') {
        body.answerFrequency = choiceId;
      } else if (questionType.value === 'word cloud') {
        body.answerWordCloud = choiceId;
      }

      await QuizUserApi.postAnswerQuiz(body);
      await respondentInfo();
    };


    const resetCountdown = () => {
      clearInterval(interval);

      if (questionType.value === 'multiple choice') {
        countdown.value = remainingTime;
        interval = setInterval(() => {
          if (countdown.value > 0) {
            countdown.value--;
          } else {
            clearInterval(interval);
            isAnswered.value = true;
            if (sortOrder.value >= totalPage.value) {
              showCloseButton.value = true;
              respondentInfo();
              clearInterval(apiPollingInterval);
            }
          }
        }, 1000);
      } else {
        countdown.value = 0;
        clearInterval(interval);
      }
    };

    const selectAnswer = (choiceId) => {
      selectedAnswer.value = choiceId;
      saveAnswer(choiceId);
    };



    const closeQuiz = () => {
      if (questionTypeMultiple.value && questionTypeFrequency.value && questionTypeWordCloud.value) {
        router.push('/RankingBoard');
      } else {
        localStorage.clear();
        router.push('/Thx');
      }
    };
    const validateInput = () => {
      const regex = /^[a-zA-Z\s]*$/;
      if (!regex.test(answerText.value)) {
        answerText.value = answerText.value.replace(/[^a-zA-Z\s]/g, '');
      }
    };

    onMounted(async () => {
      await fetchQuestion();
      apiPollingInterval = setInterval(async () => {
        await respondentInfo();
        if (newSortOrder.value <= totalPage.value) {
          await fetchNewQuestion();
        } else {
          clearInterval(apiPollingInterval);
        }
      }, 500);
    });

    onUnmounted(() => {
      clearInterval(interval);
      clearInterval(apiPollingInterval);
    });

    return {
      respondentName,
      totalScore,
      countdown,
      selectedAnswer,
      isAnswered,
      questions,
      totalPage,
      isLastQuestion,
      saveAnswer,
      endTime,
      sortOrder,
      questionType,
      choice,
      selectAnswer,
      answerText,
      sendAnswer,
      closeQuiz,
      showCloseButton,
      validateInput

    };
  },
};
</script>

<style scoped>
.container-fluid {
  display: flex;
  padding-top: 68px;
  height: 100vh;
  max-width: 100%;
  position: fixed;
  justify-content: center;
}

.box-bar {
  display: flex;
  height: 80px;
  position: absolute;
  width: 100%;
  align-items: center;
  background-color: rgb(255, 255, 255);

}

.container-form {
  position: relative;
  top: 80px;
  align-items: center;
  width: 100%;
  height: 5vh;
  justify-self: center;
}

.box-bar p {
  position: absolute;
  font-size: 26px;
  font-weight: bold;
}

.box-bar h1 {
  position: absolute;
  font-size: 30px;
  font-weight: bold;
  margin-top: 15px;
  right: 20%;
  transform: translateX(-60%);

}

.score {
  background-color: black;
  color: aliceblue;
  width: 159px;
  height: 40px;
  margin-top: 15px;
  border-radius: 10px;
  right: 10px;
  position: absolute;

}

.time {
  position: absolute;
  margin-top: 18px;
  left: 10px;
}

.form-container {
  display: flex;
  justify-content: center;
  margin-top: 3%;
}

.totalPage {
  position: absolute;
  font-size: 26px;
  font-weight: bold;
  margin-top: 17px;
  left: 18%;
  transform: translateX(30%);
}

.container {
  display: flex;
  justify-content: center;
  margin-top: 5vh;
  position: relative;
  align-items: center;
  width: 100vw;
  height: 70vh;
  overflow: hidden;
}

.bg-multiple {
  display: flex;
  justify-content: center;
  height: 70vh;
  margin-bottom: 12%;

}


.bg-frequency {
  display: grid;
  grid-template-columns: repeat(2, 2fr);
  grid-gap: 5px;
  justify-content: center;
  width: 100vw;
}

.choice-button {
  font-size: 1vw;
  border-radius: 10px;
  border-color: var(--septenary-color);
  color: rgb(0, 0, 0);
  background-color: white;
  margin: 1% 0% 0% 0%;
  height: 80px;
}

.choice-button:hover {
  background-color: var(--septenary-color);
  color: white;
}

.choice-button {
  transition: opacity 0.3s ease;
}


.selected-button {
  background-color: var(--septenary-color);
  color: white;
}

.dimmed-button {
  opacity: 0.5;
  pointer-events: none;
}


.box-container {
  position: relative;
  justify-content: center;
  align-items: center;
  height: 80%;
  overflow: hidden;
  margin-top: 15vh;
}

.form-group {
  font-size: 50px;
  color: #ffff;
  font-weight: bold;
  margin-bottom: 3%;
  overflow: hidden;
}

.thank-massage {
  font-size: 50px;
  color: #ffff;
  margin-bottom: 15%;
}

.form-control {
  border-radius: 21px;
  height: 100px;
  width: 586px;
  text-align: left;
}

input::placeholder {
  color: rgb(161, 157, 157);
}

input:placeholder-shown {
  font-size: 40px;
  font-weight: bold;
}

input[type="text"] {
  font-size: 30px;
}

.btn-primary {
  font-size: 25px;
  position: relative;
  font-weight: bold;
  margin-top: 10%;
  left: 25%;
  height: 60px;
  width: 275px;
  border: none;
  border-radius: 10px;
  background-color: var(--primary-color);
  color: #000000;

}

.btn-secondary {
  font-size: 25px;
  position: relative;
  font-weight: bold;
  height: 50px;
  width: 275px;
  margin-top: 10%;
  border: none;
  border-radius: 10px;
  background-color: gray;
  color: #fff;
  left: 25%;
}

.btn-primary:hover {
  opacity: 70%;
}

.btn-secondary:hover {
  opacity: 100%;
}

.text-danger {
  color: red;
}

.btn-danger {
  font-size: 25px;
  position: relative;
  font-weight: bold;
  height: 50px;
  width: 275px;
  border: none;
  border-radius: 10px;
  background-color: #e74c3c;
  color: #fff;
}


@media only screen and (max-width: 1200px) {
  .box-bar {
    height: 60px;
    width: 100%;
    justify-content: space-between;
  }


  .box-bar h1 {
    font-size: 25px;
    margin-top: 15px;
    right: 25%;

  }

  .box-bar h2 {
    font-size: 25px;
    font-weight: bold;
    margin-bottom: 14px;
  }

  .time {
    margin-top: 27px;
  }

  .totalPage {
    margin-top: 23px;
  }


  .box-container {
    margin-top: 15vh;
  }



  .form-control {
    border-radius: 21px;
    height: 100px;
    width: 450px;
    text-align: left;

  }

  input:placeholder-shown {
    font-size: 25px;
  }

  input[type="text"] {
    font-size: 25px;
    padding: 10px;

  }

  input::placeholder {
    color: rgb(161, 157, 157);
  }

  .form-group {
    font-size: 38px;
    margin-bottom: 3%;
    padding: 10px;

  }

  .btn-primary {
    font-size: 25px;
    height: 50px;
    width: 275px;
  }

  .btn-secondary {
    font-size: 25px;
    height: 50px;
    width: 275px;

  }

  .bg-multiple {
    margin-bottom: 20%;

  }

  .bg-frequency {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-auto-rows: min-content;
    gap: 3px;
    width: 100%;
    max-height: 100%;
    overflow-y: auto;
  }

  .choice-button {
    font-size: 3vw;
    height: 60px;
  }
}

@media only screen and (max-width: 768px) {
  .box-bar {
    height: 60px;
    width: 100%;
    justify-content: space-between;
  }


  .box-bar h1 {
    font-size: 25px;
    margin-top: 15px;
    right: 30%;

  }

  .box-bar h2 {
    font-size: 25px;
    font-weight: bold;
    margin-bottom: 14px;
  }

  .time {
    margin-top: 27px;
  }

  .totalPage {
    margin-top: 23px;
  }


  .box-container {
    margin-top: 15vh;
  }

  .form-control {
    border-radius: 21px;
    height: 100px;
    width: 450px;
    text-align: left;

  }

  input:placeholder-shown {
    font-size: 25px;
  }

  input[type="text"] {
    font-size: 25px;
    padding: 10px;

  }

  input::placeholder {
    color: rgb(161, 157, 157);
  }

  .form-group {
    font-size: 38px;
    margin-bottom: 3%;
    padding: 10px;

  }

  .btn-primary {
    font-size: 25px;
    height: 50px;
    width: 275px;
  }

  .btn-secondary {
    font-size: 25px;
    height: 50px;
    width: 275px;

  }

  .bg-multiple {
    margin-bottom: 20%;

  }

  .bg-frequency {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-auto-rows: min-content;
    gap: 3px;
    width: 100%;
    max-height: 100%;
    overflow-y: auto;
  }

}

@media only screen and (max-width: 580px) {

  .container-form {
    top: 60px;
    height: 5vh;
  }

  .box-bar {
    height: 60px;
    width: 100%;
    justify-content: space-between;
  }


  .box-bar h1 {
    font-size: 16px;
    margin-top: 20px;
    right: 0;

  }

  .box-bar h2 {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 14px;
  }

  .time {
    margin-top: 27px;
    left: 10px;

  }

  .box-bar p {
    font-size: 16px;
  }

  .totalPage {
    margin-top: 27px;
    left: 30vw;

  }


  .box-container {
    margin-top: 15vh;
  }

  .container {
    width: 90%;
  }


  .form-control {
    border-radius: 21px;
    height: 80px;
    width: 80vw;
    text-align: left;

  }

  input:placeholder-shown {
    font-size: 25px;
  }

  input[type="text"] {
    font-size: 5vw;
    padding: 10px;

  }

  input::placeholder {
    color: rgb(161, 157, 157);
  }

  .form-group {
    font-size: 7vw;
    margin-bottom: 3%;
    padding: 10px;

  }

  .btn-primary {
    font-size: 5vw;
    height: 50px;
    width: 40vw;
  }

  .btn-secondary {
    font-size: 5vw;
    height: 50px;
    width: 40vw;
  }

  .bg-multiple {
    margin-bottom: 35%;

  }

  .choice-button {
    font-size: 3vw;
    height: 55px;
  }

  .hide-mobile {
    display: none;
  }
}

@media only screen and (max-width: 251px) {

.box-bar h1 {
  font-size: 6vw;
  margin-top: 20px;
  right: 0;

}

.box-bar h2 {
  font-size: 6vw;
  font-weight: bold;
  margin-bottom: 14px;
}

.time {
  margin-top: 27px;
  left: 10px;

}

.box-bar p {
  font-size: 6vw;
}

.totalPage {
  margin-top: 27px;
  left: 30vw;

}

}

</style>