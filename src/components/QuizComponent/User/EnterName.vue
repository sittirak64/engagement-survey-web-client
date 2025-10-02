<template>
  <div class="container-fluid">
    <div class="box-container">
      <div class="form-group">
        <label for="exampleInputEmail1">&nbsp;Name :</label>
        <input maxlength="8" type="text" class="form-control" id="exampleInputEmail1" placeholder="Enter Your Name"
          v-model="name" />
      </div>
      <button type="button" :class="name ? 'btn-primary' : 'btn-secondary'" :disabled="!name" @click="JoinForm">
        Join
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import QuizServiceApi from '/src/services/QuizUserApi.js';

export default {
  name: "EnterName",

  setup() {
    const name = ref('');
    const respondentId = ref('')
    const router = useRouter();

    const JoinForm = async () => {
      const body = {
        questionSetId: sessionStorage.getItem("questionSetId"),
        sessionId: sessionStorage.getItem("sessionId"),
        respondentName: name.value

      };
      const response = await QuizServiceApi.postJoinQuiz(body);
      respondentId.value = response.data.objectValue;


      router.push({
        path: '/Waiting',
        query: { respondentId: respondentId.value }
      });
    };

    return {
      name,
      JoinForm
    };
  }
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
    gap: 5%;
    margin-top: 3%;
  }

  .form-group {
    font-size: 50px;
    color: #ffff;
    font-weight: bold;
    margin-top: -260px;
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
    position: absolute;
    margin-top: 500px;
    font-weight: bold;
    height: 60px;
    width: 275px;
    border: none;
    border-radius: 10px;
    background-color: var(--primary-color);
    color: #000000;
  }

  .btn-secondary {
    font-size: 25px;
    position: absolute;
    margin-top: 500px;
    font-weight: bold;
    height: 50px;
    width: 275px;
    border: none;
    border-radius: 10px;
    background-color: gray;
    color: #fff;
  }

  .btn-primary:hover {
    opacity: 70%;
  }

  .btn-secondary:hover {
    opacity: 100%;
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
    gap: 5%;
    margin-top: 3%;
  }

  .form-group {
    font-size: 45px;
    color: #ffff;
    font-weight: bold;
    margin-top: -260px;
  }

  .form-control {
    border-radius: 21px;
    height: 100px;
    width: 586px;
    text-align: left;
  }

  input:placeholder-shown {
    font-size: 40px;
    font-weight: bold;
  }

  input[type="text"] {
    font-size: 30px;
  }

  input::placeholder {
    color: rgb(161, 157, 157);
  }

  .btn-primary {
    font-size: 25px;
    position: absolute;
    margin-top: 500px;
    font-weight: bold;
    height: 50px;
    width: 275px;
    border: none;
    border-radius: 10px;
    background-color: var(--primary-color);
    color: #000000;
  }

  .btn-secondary {
    font-size: 25px;
    position: absolute;
    margin-top: 500px;
    font-weight: bold;
    height: 50px;
    width: 275px;
    border: none;
    border-radius: 10px;
    background-color: gray;
    color: #fff;
  }

  .btn-primary:hover {
    opacity: 70%;
  }

  .btn-secondary:hover {
    opacity: 100%;
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
    gap: 5%;
    margin-top: 3%;
  }

  .form-group {
    font-size: 7vw;
    margin-bottom: 3%;
    padding: 10px;
  }

  .form-control {
    border-radius: 21px;
    height: 80px;
    width: 80vw;
    text-align: left;

  }

  input:placeholder-shown {
    font-size: 14px;
    font-weight: bold;
  }

  input[type="text"] {
    font-size: 14px;
  }

  input::placeholder {
    color: rgb(161, 157, 157);
  }

  .btn-primary {
    font-size: 5vw;
    height: 50px;
    width: 50vw;
  }

  .btn-secondary {
    font-size: 5vw;
    height: 50px;
    width: 50vw;
  }

  .btn-primary:hover {
    opacity: 70%;
  }

  .btn-secondary:hover {
    opacity: 100%;
  }
}
</style>
