<template>
    <div>
        <button @click="showModal = true" class="btn btn-primary">
            <i class="bi bi-plus-lg  icon-large"></i> Add
        </button>

        <div v-if="showModal" class="modal fade show d-block" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Add Evaluator</h5>
                        <button type="button" class="close" @click="closeModal">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div>
                            <label for="exampleInputEmail1" class="form-label">Email</label>
                            <input type="email" class="form-control" id="exampleInputEmail1" v-model="email"
                                @input="debouncedFetchRespondentName" placeholder="Please enter email">
                            <ul v-if="emailResults.length > 0" class="email-suggestions">
                                <li v-for="item in emailResults" :key="item.respondentId" @click="selectEmail(item)">
                                    {{ item.email }}
                                </li>
                            </ul>
                        </div>

                        <div>
                            <label for="exampleInputName" class="form-label">Name</label>
                            <input type="text" class="form-control textbox-name" id="exampleInputName"
                                :value="respondentName" readonly placeholder="Name">
                        </div>
                        <div>
                            <label for="exampleInputRelationship" class="form-label">Relationship</label>
                            <select class="form-control" v-model="selectedRelationship"
                                @change="handleDepartment('relationship', selectedRelationship)">
                                <option value="" disabled>Select Relationship</option>
                                <option v-for="choice in answerChoice" :key="choice.dataId"
                                    :value="choice.dataDetailEn">
                                    {{ choice.dataDetailEn }}
                                </option>
                            </select>
                        </div>

                        <button type="button" class="send" @click="SendRequest" :disabled="!isFormValid"
                            :style="isFormValid ? { backgroundColor: '#28A745' } : { backgroundColor: '#D9D9D9' }">
                            Send Request
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <Modal ref="Modal" :message="invalidMessage" :modalType="modalType" />
    </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import ApiService from '../../services/ApiService.js';
import debounce from 'lodash.debounce';
import Modal from "@/components/Modal/Modal.vue";

export default {
    name: 'ButtonAdd',
    components: {
        Modal,
    },
    emits: ['save', 'send-request'],
    setup(_, { emit }) {
        const showModal = ref(false);
        const answerChoice = ref([]);
        const selectedRelationship = ref("");
        const email = ref("");
        const respondentName = ref("");
        const committeeId = ref("");
        const modalType = ref("");
        const invalidMessage = ref("");
        const Modal = ref(null);

        const emailResults = ref([]);

        const closeModal = () => {
            showModal.value = false;
            respondentName.value = '';
            email.value = '';
            emailResults.value = [];
            selectedRelationship.value = '';
        };

        const isFormValid = computed(() => {
            return email.value.trim() !== '' && selectedRelationship.value !== '';
        });

        const fetchListDepartment = async () => {
            const response = await ApiService.listMasterData({
                messageKey: '360Role',
                language: sessionStorage.getItem('defaultLanguage'),
                surveyId: sessionStorage.getItem('surveyId'),
            });
            answerChoice.value = response.data.objectValue;
        };

        const fetchRespondentName = async () => {
            if (!email.value || email.value.trim().length < 1) {
                respondentName.value = '';
                emailResults.value = [];
                return;
            }

            const response = await ApiService.getCommitteeList({
                email: email.value,
                respondentName: respondentName.value,
                surveyId: sessionStorage.getItem('surveyId'),
                corporateId: sessionStorage.getItem('corporateId'),
                respondentId: sessionStorage.getItem('respondentId'),
            });

            emailResults.value = response.data.objectValue.filter((item) =>
                item.email.toLowerCase().includes(email.value.toLowerCase())
            );
        };


        const selectEmail = (item) => {
            email.value = item.email;
            respondentName.value = item.respondentName;
            committeeId.value = item.respondentId;
            emailResults.value = [];
        };

        const SendRequest = async () => {
            modalType.value = "success";
            invalidMessage.value = "Your request was successfully sent.";
            Modal.value.openModal(modalType.value);
            showModal.value = false;
            emit('send-request');
            const selectedRole = answerChoice.value.find(item => item.dataDetailEn === selectedRelationship.value);
            const body = {
                committeeId: committeeId.value,
                committeeType: selectedRole ? selectedRole.dataId : null,
                surveyId: sessionStorage.getItem('surveyId'),
                respondentId: sessionStorage.getItem('respondentId'),
            };
            await ApiService.postSendRequest(body);
            emit('save');
            closeModal();
        };

        const handleDepartment = async (key, value) => {
            const selectedRole = answerChoice.value.find(item => item.dataDetailEn === value);
            const body = {
                respondentId: sessionStorage.getItem('respondentId'),
                key: selectedRole ? selectedRole.dataId : key,
                value: value,
            };
            await ApiService.patchRespondentInfo(body);
        };

        const debouncedFetchRespondentName = debounce(fetchRespondentName, 1000);

        onMounted(async () => {
            await fetchListDepartment();
        });

        return {
            showModal,
            closeModal,
            answerChoice,
            selectedRelationship,
            handleDepartment,
            email,
            respondentName,
            fetchRespondentName,
            SendRequest,
            emailResults,
            selectEmail,
            isFormValid,
            debouncedFetchRespondentName,
            modalType,
            invalidMessage,
            Modal
        };
    },
};
</script>


<style scoped>
.modal-dialog {
    position: relative;
    top: 30%;
    max-width: 90%;
    width: 1100px;
}

.modal-content {
    position: relative;
    height: 255px;
}

.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #D9D9D9;
}

.modal.fade {
    display: block;
    background: rgba(0, 0, 0, 0.5);
}

.modal-header {
    justify-content: space-between;
    align-items: center;
    margin-left: 2%;

}

h5 {
    font-size: 22px;
    font-weight: bold;
}

.modal-body {
    display: grid;
    grid-template-columns: auto auto auto auto;
    gap: 50px;
    margin-left: 2%;
    margin-top: 1%;
}

.form-control {
    max-height: 50px;
    font-size: 13px;
}

.textbox-name {
    background-color: #E9ECEF;
    color: #6c757d;
    pointer-events: none;
}

.btn {
    width: 100px;
    font-size: 18px;
    font-weight: bold;
}

.send {
    color: white;
    width: 116px;
    height: 37px;
    background-color: #28A745;
    border: none;
    border-radius: 6px;
    margin-top: 28px;
}

.btn-primary {
    background-color: var(--septenary-color);
    border: none;
}

.btn-primary:hover {
    opacity: 80%;
}

.close {
    font-size: 28px;
    background-color: white;
    border: none;
}

.form-label {
    display: block;
    font-size: 16px;
    font-weight: bold;
}

.email-suggestions {
    position: absolute;
    max-height: 100%;
    overflow-y: auto;
    background-color: #fff;
    border: 1px solid #ddd;
    width: 260px;
    margin-top: 5px;
    padding-left: 0;
    list-style: none;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.email-suggestions li {
    padding: 8px 12px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.icon-large {
    font-size: 20px;
    font-weight: bold;
}

@media only screen and (max-width: 768px) {

    .modal-dialog {
        position: relative;
        top: 30%;
        max-width: 90%;
        width: 80vw;
    }

    .modal-body {
        display: grid;
        grid-template-columns: repeat(1, minmax(0, 1fr));
        gap: 30px;
    }


    .modal-content {
        position: relative;
        height: 100%;
    }

    .btn {
        width: 80px;
        font-size: 10px;
        font-weight: bold;
    }

    .btn-primary {
        background-color: var(--septenary-color);
        border: none;
    }

    .btn-primary:hover {
        opacity: 80%;
    }

    .icon-large {
        font-size: 10px;
        font-weight: bold;
    }

    .send {
        color: white;
        width: 100%;
        height: 40px;
        background-color: #28A745;
        border: none;
        border-radius: 6px;
        margin-top: 10px;
        margin-bottom: 2%;
    }
}

@media only screen and (max-width: 580px) {

    .modal-dialog {
        position: relative;
        top: 20%;
        margin-left: 10%;
        max-width: 90%;
        width: 80vw;
    }

    .btn {
        width: 60px;
        font-size: 10px;
        font-weight: bold;
    }

    .btn-primary {
        background-color: var(--septenary-color);
        border: none;
        height: 25px;
    }

    .icon-large {
        font-size: 10px;
        font-weight: bold;
    }
}
</style>
