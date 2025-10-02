<template>
  <div>
    <div v-if="isShowModal" class="modal-overlay">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <i :class="[modalIcon, modalIconClass]" class="icon "></i>
            <h1>{{ modalTitle }}</h1>
          </div>
          <div class="modal-body">
            <p v-if="modalType === 'info' || modalType === 'error'">{{ message }}</p>
            <p v-else>{{ modalBody }}</p>
          </div>
          <div class="modal-footer">
            <ModalButton v-for="(button, index) in modalButtons" :key="index" :type="button.type" :label="button.label"
              :onClick="button.onClick" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ModalButton from './ModalButton.vue';
import languagesData from '/src/language/languagesData.json'

export default {
  props: ['message'],
  components: {
    ModalButton,
  },


  setup(props, { emit }) {
    const isShowModal = ref(false);
    const modalType = ref('');
    const router = useRouter();
    const surveyType = ref('');
    const surveyTypeEngagement = ref('');
    const respondentIdMobile = ref('');
    const selectedLanguage = ref(sessionStorage.getItem('defaultLanguage') || 'en');

    surveyType.value = sessionStorage.getItem('surveyType');
    respondentIdMobile.value = sessionStorage.getItem('respondentIdMobile');
    surveyTypeEngagement.value = sessionStorage.getItem('surveyTypeEngagement');
    
    const translations = computed(() => languagesData[selectedLanguage.value] || languagesData['en']);

    const changeLanguage = (newLanguage) => {
      selectedLanguage.value = newLanguage;
      sessionStorage.setItem('defaultLanguage', newLanguage);
    };
    const showModal = () => {
      isShowModal.value = true;
      if (modalType.value === 'success') {
        setTimeout(() => {
          isShowModal.value = false;

          if (respondentIdMobile.value === 'mobile' && surveyType.value === 'engagement') {
            router.push('/verifyMobile');
          } else if (surveyType.value === 'engagement') {
            router.push('/verify');
          } else if (surveyType.value === '360degree') {
            router.push('/360HomePage');
          } else if (surveyType.value === 'shortQuiz') {
            router.push('/verify');
          } else if (surveyTypeEngagement.value === 'engagement') {
            localStorage.clear();
            router.push('/DefaultPage');
          } else {
            router.push('/error');
          }

        }, 3000);
      }
    };

    const hideModal = () => {
      isShowModal.value = false;
      modalType.value = '';
    };

    const openModal = (type) => {
      modalType.value = type;
      showModal();
    };

    const handleConfirm = () => {
      hideModal();
      modalType.value = 'success';
      emit('confirm', true);
      showModal();
    };

    const modalTitle = computed(() => {
      switch (modalType.value) {
        case 'success':
          return translations.value.titleSuccess;
        case 'error':
          return translations.value.titleError;
        case 'warning':
          return translations.value.titleWarning;
        case 'confirm':
          return translations.value.titleConfirm;
        case 'info':
          return translations.value.titleInfo;
        default:
          return 'Modal Title';
      }
    });

    const modalBody = computed(() => {
      switch (modalType.value) {
        case 'success':
          return translations.value.scriptSuccess;
        case 'error':
          return translations.value.scriptError;
        case 'warning':
          return translations.value.scriptWarning;
        case 'confirm':
          return translations.value.scriptConfirm;
        default:
          return 'Default Modal Content';
      }
    });

    const modalIcon = computed(() => {
      switch (modalType.value) {
        case 'success':
          return 'bi bi-check-circle-fill';
        case 'error':
          return 'bi bi-x-circle-fill';
        case 'warning':
          return 'bi bi-exclamation-triangle-fill';
        case 'confirm':
          return 'bi bi-question-circle-fill';
        case 'info':
          return 'bi bi-info-circle-fill';
        default:
          return 'bi bi-question-circle-fill';
      }
    });

    const modalIconClass = computed(() => {
      switch (modalType.value) {
        case 'success':
          return 'icon-success';
        case 'error':
          return 'icon-error';
        case 'warning':
          return 'icon-warning';
        case 'confirm':
          return 'icon-confirm';
        case 'info':
          return 'icon-info';
        default:
          return 'icon-default';
      }
    });

    const modalButtons = computed(() => {
      if (modalType.value === 'success') {
        return [];
      }

      switch (modalType.value) {
        case 'confirm':
          return [
            { type: 'cancel', label: translations.value.cancel, onClick: hideModal, value: false },
            { type: 'confirm', label: translations.value.confirm, onClick: handleConfirm, value: true },
          ];
        default:
          return [{ type: modalType.value, label: 'OK', onClick: hideModal }];
      }
    });
    onMounted(async () => {
      changeLanguage(selectedLanguage.value);
    });

    return {
      isShowModal,
      modalIconClass,
      modalType,
      modalTitle,
      modalIcon,
      modalBody,
      modalButtons,
      showModal,
      hideModal,
      openModal,
    };
  },
};
</script>

<style scoped>
@media only screen and (min-width: 769px) {
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal-overlay h1 {
    color: #000000;
    margin-top: 10px;
    font-weight: bold;
  }

  .modal-dialog-centered {
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 100%;
    max-height: 100%;
  }

  .modal-content {
    background-color: #ffffff;
    border-radius: 8px;
    height: 350px;
    width: 600px;
  }

  .modal-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .logo {
    width: 80px;
    height: 80px;
    margin-top: 2%;
  }

  .modal-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .modal-footer {
    display: flex;
    justify-content: center;
    padding: 20px;
  }

  .icon {
    font-size: 80px;
    margin-top: 1%;
    max-height: 100%;
    max-width: 100%;
    padding-bottom: 3%;
  }

  .icon-success {
    color: #28a745;
  }

  .icon-error {
    color: #dc3545;
  }

  .icon-warning {
    color: #ffc107;
  }

  .icon-confirm {
    color: #17a2b8;
  }

  .icon-info {
    color: #0d6efd;
  }

  .icon-default {
    color: #6c757d;
  }


}

@media only screen and (max-width: 768px) {
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal-overlay h1 {
    font-size: 28px;
    color: #000000;
    margin-top: 10px;
    font-weight: bold;
  }

  .modal-dialog-centered {
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 100%;
    max-height: 100%;
  }

  .modal-content {
    background-color: #ffffff;
    border-radius: 8px;
    height: 270px;
    width: 450px;
  }

  .modal-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .logo {
    width: 80px;
    height: 80px;
    margin-top: 2%;
  }

  .modal-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .modal-footer {
    display: flex;
    justify-content: center;
    padding: 20px;
  }


  .icon {
    font-size: 50px;
    margin-top: 1%;
    max-height: 100%;
    max-width: 100%;
    padding-bottom: 1%;
  }

  .icon-success {
    color: #28a745;
  }

  .icon-error {
    color: #dc3545;
  }

  .icon-warning {
    color: #ffc107;
  }

  .icon-confirm {
    color: #17A2B8;
  }

  .icon-info {
    color: #0d6efd;
  }

  .icon-default {
    color: #6c757d;
  }


}


@media only screen and (max-width: 580px) {
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal-overlay h1 {
    font-size: 18px;
    color: #000000;
    margin-top: 10px;
    font-weight: bold;
  }

  .modal-dialog-centered {
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 100%;
    max-height: 100%;
  }

  .modal-content {
    background-color: #ffffff;
    border-radius: 8px;
    height: 200px;
    width: 320px;
  }

  .modal-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .logo {
    width: 60px;
    height: 60px;
    margin-top: 2%;
  }

  .modal-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .modal-body p {
    font-size: 10px;
  }

  .modal-footer {
    display: flex;
    justify-content: center;
    padding: 20px;
  }

  .icon {
    font-size: 40px;
    margin-top: 1%;
    max-height: 100%;
    max-width: 100%;
    padding-bottom: 1%;
  }

  .icon-success {
    color: #28a745;
  }

  .icon-error {
    color: #dc3545;
  }

  .icon-warning {
    color: #ffc107;
  }

  .icon-confirm {
    color: #17a2b8;
  }

  .icon-info {
    color: #0d6efd;
  }

  .icon-default {
    color: #6c757d;
  }


}
</style>
