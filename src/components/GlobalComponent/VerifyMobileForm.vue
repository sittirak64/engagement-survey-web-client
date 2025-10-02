<template>
  <div class="container-fluid" v-if="!loading">
    <form @submit.prevent="verify" class="form-container">
      <div class="title-container">
        <h1>Verification</h1>
        <p class="lead">
          <br />Please enter your phone number to proceed with the survey.
        </p>
      </div>
      <div class="box-container">
        <div class="grid-container">
          <div class="information-container">
            <DropDownPrefix v-model="selectedDialingPrefix" :fieldName="'dialingPrefix'"
              :ChoiceType="filterDialingPrefix()" :dialingPrefix="dialingPrefix" class="custom-dropdown" />

            <input type="text" class="form-control custom-input" id="floatingInput"
              placeholder="Your mobile number" v-model="phone" required :class="{ 'is-invalid': phoneInvalid }"
              @input="handleInput" />
          </div>
        </div>

        <div class="btn-container">
          <button type="submit" class="btn btn-secondary" :disabled="btnloading || !phone">
            <template v-if="btnloading">
              <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span>&nbsp;Loading...</span>
            </template>
            <span v-else>Verify</span>
          </button>
        </div>
      </div>
    </form>
  </div>
  <div v-else class="container-fluid bg-quinary">
    <h1 class="text-white">Loading...</h1>
  </div>

  <Modal ref="Modal" :message="invalidMessage" :modalType="modalType" />
</template>

<script>
import { ref, inject, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import ApiService from "../../services/ApiService.js";
import { setStorage } from "../../mixins/AppStorage.js";
import Modal from "@/components/Modal/Modal.vue";
import DropDownPrefix from '@/components/Engagement/DropDownPrefix.vue';

export default {
  name: "VerifyForm",
  components: {
    Modal,
    DropDownPrefix
  },

  setup() {
    const phone = ref("");
    const email = ref("");
    const phoneInvalid = ref(false);
    const router = useRouter();
    const loading = ref(false);
    const invalidMessage = ref("");
    const surveyType = ref("");
    const respondentId = ref("");
    const modalType = ref("");
    const Modal = ref(null);
    const navigateToErrorPage = inject("navigateToErrorPage");
    const dialingPrefix = ref([]);
    const btnloading = ref(false);
    const selectedDialingPrefix = ref("");
    const number = ref("");

    number.value = selectedDialingPrefix.value + phone.value;

    watch([selectedDialingPrefix, phone], () => {
      number.value = selectedDialingPrefix.value + phone.value;
    });

    const handleChange = (prefix) => {
      selectedDialingPrefix.value = prefix.dialingPrefix;
      phoneInvalid.value = false;
    };

    const filterDialingPrefix = () => {
      return dialingPrefix.value;
    };

    const getDialingPrefixes = async () => {
      const response = await ApiService.getPrefixCountry();
      dialingPrefix.value = response.data.objectValue;
    };

    const verify = async () => {
      surveyType.value = sessionStorage.getItem("surveyType");

      const body = {
        email: number.value,
        surveyId: sessionStorage.getItem("surveyId"),
      };
      sessionStorage.setItem("email", number.value);
      try {
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

            if (surveyType.value === "engagement") {
              router.push("/information");
            }
          } else {
            invalidMessage.value = response.data.message.trim();
            phoneInvalid.value = true;
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

    const handleInput = () => {
      phone.value = phone.value.replace(/[^0-9]/g, "");
    };


    onMounted(async () => {
      getDialingPrefixes();
      selectedDialingPrefix.value = "+66";
    });

    return {
      phone,
      verify,
      loading,
      phoneInvalid,
      handleChange,
      invalidMessage,
      modalType,
      Modal,
      dialingPrefix,
      filterDialingPrefix,
      btnloading,
      handleInput,
      selectedDialingPrefix,
    };
  },
};
</script>




<style scoped>
@media only screen and (min-width: 769px) {
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
    border-radius: 0px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 80%;
    width: calc(15% + 200px);
    background-color: rgb(255, 255, 255);
    gap: 5%;
  }

  .title-container {
    width: 80%;
  }

  .title-container h1 {
    font-weight: bold;
  }

  .grid-container {
    width: 100%;
    display: inline-block;
  }

  .box-container {
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .information-container {
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }


  .lead {
    font-size: 1vw;
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

  .btn-container {
    width: 100%;
    margin-top: 7%;
  }

  .btn-secondary {
    width: 100%;
    height: 50px;
    border: 0;
    color: var(--font-primary-color);
    background-color: var(--primary-color);
  }

  .btn-secondary:disabled {
    background-color: #ffffff;
    color: #000000;
    border: #000000 solid 1px;
  }

  .btn-secondary:hover {
    color: var(--font-secondary-color);
  }


  p.col-2 {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .custom-dropdown {
    width: 30%;
    padding-right: 10px;
  }

  .custom-input {
    height: 50px;
    width: 70%;
    border: #000000 solid 1px;

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

  .title-container h1 {
    font-size: 38px;
    font-weight: bold;
  }

  .grid-container {
    width: 100%;
    display: inline-block;
  }

  .box-container {
    width: 90%;
    margin: 0 5% 0 5%;
    padding-bottom: 5%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .information-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }


  .lead {
    font-size: medium;
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

  .btn-container {
    width: 100%;
    margin-top: 5%;
  }

  .btn-secondary {
    width: 100%;
    border: 0;
    color: var(--font-primary-color);
    background-color: var(--primary-color);
  }

  .btn-secondary:disabled {
    background-color: #ffffff;
    color: #000000;
    border: #000000 solid 1px;
  }

  .btn-secondary:hover {
    color: var(--font-secondary-color);
  }


  p.col-2 {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .custom-dropdown {
    width: 30%;
    padding-right: 10px;
  }

  .custom-input {
    height: 50px;
    width: 70%;
    border: #000000 solid 1px;

  }

}
</style>