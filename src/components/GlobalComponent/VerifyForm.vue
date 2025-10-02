<template>
  <div class="container-fluid">
    <div class="box-container">
      <div class="title-container">
        <h1>Verify Your Email Address</h1>
        <p class="lead">
          <br />Please verify your email address to proceed with the survey.
        </p>
      </div>
      <div class="form-container">
        <form class="needs-validation" @submit.prevent="verify" novalidate>
          <div class="form-floating mb-3">
            <input
              type="email"
              class="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              v-model="email"
              required
              :class="{ 'is-invalid': emailInvalid }"
              @click="handleChange"
            />
            <label for="floatingInput">Email address</label>
          </div>
          <button
            type="submit"
            class="btn btn-secondary"
            :disabled="loading || !email"
          >
            <template v-if="loading">
              <span
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              <span>&nbsp;Loading...</span>
            </template>
            <span v-else>Verify</span>
          </button>
        </form>
      </div>
    </div>
  </div>
  <Modal ref="Modal" :message="invalidMessage" :modalType="modalType" />
</template>
 
<script>
import { ref, inject } from "vue";
import { useRouter } from "vue-router";
import ApiService from "../../services/ApiService.js";
import { setStorage } from "../../mixins/AppStorage.js";
import Modal from "@/components/Modal/Modal.vue";
 
export default {
  name: "VerifyForm",
  components: {
    Modal,
  },
 
  setup() {
    const email = ref("");
    const emailInvalid = ref(false);
    const router = useRouter();
    const loading = ref(false);
    const invalidMessage = ref("");
    const surveyType = ref("");
    const respondentId = ref("");
    const modalType = ref("");
    const Modal = ref(null);
    const navigateToErrorPage = inject("navigateToErrorPage");
 
    const handleChange = () => {
      emailInvalid.value = false;
    };
 
    const verify = async () => {
      surveyType.value = sessionStorage.getItem("surveyType");
 
      if (!validateEmail(email.value)) {
        invalidMessage.value = "Please provide a valid email address.";
        emailInvalid.value = true;
        modalType.value = "warning";
        Modal.value.openModal(modalType.value);
        return;
      }
      const body = {
        email: email.value,
        surveyId: sessionStorage.getItem("surveyId"),
      };
      sessionStorage.setItem("email", email.value);
      try {
        const response = await ApiService.getRespondentInfo(body);
        if (response.data.code === "2002") {
          invalidMessage.value = response.data.message.trim();
          emailInvalid.value = true;
          modalType.value = "error";
          Modal.value.openModal(modalType.value);
        } else {
          respondentId.value = response.data.objectValue.respondentId;
          if (respondentId.value !== sessionStorage.getItem("respondentId")) {
            invalidMessage.value = "You are not authorized.";
            modalType.value = "warning";
            Modal.value.openModal(modalType.value);
          } else if (response.data.status) {
            setStorage("userData", JSON.stringify(response.data.objectValue));
            setStorage("isAuthenticated", "true");
            sessionStorage.setItem(
              "templateId",
              response.data.objectValue.templateId
            );
            if (surveyType.value === "engagement") {
              router.push("/information");
            } else if (surveyType.value === "360degree") {
              router.push("/360HomePage");
            } else if (surveyType.value === "shortQuiz") {
              router.push("/ShortQuiz");
            }
          } else {
            invalidMessage.value = response.data.message.trim();
            emailInvalid.value = true;
            const message = invalidMessage.value.toLowerCase();
            if (message === "completed survey.") {
              modalType.value = "info";
            } else if (message === "data not found.") {
              modalType.value = "error";
            } else {
              modalType.value = "warning";
            }
            Modal.value.openModal(modalType.value);
          }
        }
      } catch (error) {
        navigateToErrorPage(error);
      } finally {
        loading.value = false;
      }
    };
 
    const validateEmail = (email) => {
      const re =
        /^(([^<>()\[\]\.,;:\s@"]+(\.[^<>()\[\]\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i;
      return re.test(String(email).toLowerCase());
    };
 
    return {
      email,
      verify,
      loading,
      emailInvalid,
      handleChange,
      invalidMessage,
      modalType,
      Modal,
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
    background-image: url("/src/assets/images/bakertilly-bg.png");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
 
  .box-container {
    border-radius: 0px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 80%;
    width: calc(15% + 200px);
    background-color: rgb(255, 255, 255);
    gap: 5%;
    margin-top: 5%;
  }
 
  .title-container {
    width: 80%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
 
  .form-container {
    width: 90%;
    margin: 0 5% 0 5%;
    padding-bottom: 5%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
 
  .form-container form {
    width: 90%;
  }
 
  .form-container p {
    width: 90%;
    margin: 2% 0 0 0;
  }
 
  .lead {
    font-size: medium;
  }
 
  .btn-secondary {
    width: 100%;
    height: 40%;
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
 
  .form-control {
    text-align: left;
  }
}
 
@media only screen and (max-width: 768px) {
  .container-fluid {
    display: flex;
    /* padding-top: 68px; */
    height: 100vh;
    width: 100%;
    position: fixed;
    justify-content: center;
    background-image: url("/src/assets/images/bakertilly-bg.png");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
 
  .box-container {
    border-radius: 0px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    background-color: rgb(255, 255, 255);
    gap: 5%;
    margin-top: 5%;
  }
 
  .title-container {
    width: 80%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
 
  .form-container {
    width: 90%;
    margin: 0 5% 0 5%;
    padding-bottom: 5%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
 
  .form-container form {
    width: 90%;
  }
 
  .form-container p {
    width: 90%;
    margin: 2% 0 0 0;
  }
 
  .lead {
    font-size: medium;
  }
 
  .btn-secondary {
    width: 100%;
    height: 40%;
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
  .form-control {
    text-align: left;
  }
}
</style>