<template>
  <div class="container-fluid">
    <div class="box-container">
      <div class="loader"></div>
      <h1>Waiting...</h1>
    </div>
  </div>
</template>



<script>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import QuizUserApi from '/src/services/QuizUserApi.js';

export default {
  name: "WaitingForm",
  setup() {
    const router = useRouter();
    const route = useRoute();
    const respondentId = route.query.respondentId;
    const questionId = ref('');
    const startTime = ref('');
    const endTime = ref('');
    const remainingTime = ref(0);
    let pollingInterval = null;

    const fetchQuestion = async () => {
      const questionSetId = sessionStorage.getItem("questionSetId");
      const sessionId = sessionStorage.getItem("sessionId");
      const sortOrder = 1;
      sessionStorage.setItem("sortOrder", sortOrder);

      try {
        const response = await QuizUserApi.getQuestionAnswerUser(questionSetId, sortOrder, sessionId);
        questionId.value = response.data.objectValue.questionId;
        sessionStorage.setItem("questionId", questionId.value);
      } catch (error) {
        console.error("Error fetching question:", error);
      }
    };

    const fetchGameTime = async () => {
      const body = {
        questionSetId: sessionStorage.getItem("questionSetId"),
        sessionId: sessionStorage.getItem("sessionId"),
        questionId: sessionStorage.getItem("questionId"),
      };
      try {
        const response = await QuizUserApi.postQuiz(body);
        startTime.value = response.data.objectValue.startTime;
        endTime.value = response.data.objectValue.endTime;

        if (startTime.value && endTime.value) {
          const start = new Date(startTime.value).getTime() / 1000;
          const end = new Date(endTime.value).getTime() / 1000;

          remainingTime.value = Math.max(0, Math.floor(end - start));

          if (remainingTime.value > 0) {
            clearInterval(pollingInterval);
            router.push({
              path: '/Answer',
              query: { respondentId, remainingTime: remainingTime.value }
            });
          }
        }
      } catch (error) {
        console.error("Error fetching game time:", error);
      }
    };

    onMounted(() => {
      fetchQuestion();
      pollingInterval = setInterval(() => {
        fetchGameTime();
      }, 500);
    });

    onUnmounted(() => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    });

    return {
    };
  },
};
</script>





<style scoped>
@media only screen and (min-width: 769px) {
  .container-fluid {
    display: flex;
    padding-top: 68px;
    height: 100vh;
    width: 100%;
    position: fixed;
    justify-content: center;
  }

  .box-container {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80%;
    width: 30%;
    gap: 5%;
  }

  .box-container h1 {
    font-size: 80px;
    margin-top: 380px;

  }

  .box-time {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80%;
    width: 30%;
    gap: 5%;
  }

  .box-time h1 {
    font-size: 120px;
  }

  .loader {
  color: #fff;
  font-size: 18px;
  width: 1em;
  height: 1em;
  border-radius: 50%;
  position: relative;
  text-indent: -9999em;
  animation: mulShdSpin 1.2s infinite linear;
  transform: translateZ(0);
}

@keyframes mulShdSpin {
  0%,
  100% {
    box-shadow: 0 -3em 0 0.2em, 
    2em -2em 0 0em, 3em 0 0 -1em, 
    2em 2em 0 -1em, 0 3em 0 -1em, 
    -2em 2em 0 -1em, -3em 0 0 -1em, 
    -2em -2em 0 0;
  }
  12.5% {
    box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em, 
    3em 0 0 0, 2em 2em 0 -1em, 0 3em 0 -1em, 
    -2em 2em 0 -1em, -3em 0 0 -1em, 
    -2em -2em 0 -1em;
  }
  25% {
    box-shadow: 0 -3em 0 -0.5em, 
    2em -2em 0 0, 3em 0 0 0.2em, 
    2em 2em 0 0, 0 3em 0 -1em, 
    -2em 2em 0 -1em, -3em 0 0 -1em, 
    -2em -2em 0 -1em;
  }
  37.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
     3em 0em 0 0, 2em 2em 0 0.2em, 0 3em 0 0em, 
     -2em 2em 0 -1em, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  50% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
     3em 0 0 -1em, 2em 2em 0 0em, 0 3em 0 0.2em, 
     -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  62.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
     3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 0, 
     -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em;
  }
  75% {
    box-shadow: 0em -3em 0 -1em, 2em -2em 0 -1em, 
    3em 0em 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, 
    -2em 2em 0 0, -3em 0em 0 0.2em, -2em -2em 0 0;
  }
  87.5% {
    box-shadow: 0em -3em 0 0, 2em -2em 0 -1em, 
    3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, 
    -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em;
  }
}
  
    
  h1 {
    position: absolute;
    font-weight: bold;
    color: #ffffff;
  }
}

@media only screen and (max-width: 768px) {
  .container-fluid {
    display: flex;
    padding-top: 68px;
    height: 100vh;
    width: 100%;
    position: fixed;
    justify-content: center;
  }

  .box-container {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80%;
    width: 30%;
    gap: 5%;
    margin-top: 3%;
  }

  .box-container h1 {
    font-size: 80px;

  }

  .box-time {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80%;
    width: 30%;
    gap: 5%;
  }

  .box-time h1 {
    font-size: 80px;
  }


  h1 {
    position: absolute;
    font-weight: bold;
    color: #ffffff;
  }
}

@media only screen and (max-width: 580px) {
  .container-fluid {
    display: flex;
    padding-top: 68px;
    height: 100vh;
    width: 100%;
    position: fixed;
    justify-content: center;
  }

  .box-container {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80%;
    width: 30%;
    gap: 5%;
    margin-top: 3%;
  }

  .box-container h1 {
    font-size: 51px;

  }

  .box-time {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80%;
    width: 30%;
    gap: 5%;
  }

  .box-time h1 {
    font-size: 51px;
  }


  h1 {
    position: absolute;
    font-weight: bold;
    color: #ffffff;
  }
}
</style>