<template>
    <div v-if="!loading" class="container-fluid">
        <h1>{{ surveyName }}</h1>
        <h2>{{ committeeName }}</h2>
        <form class="form-container bg-denary needs-validation" novalidate>
            <div v-if="currentPage === 1">
                <p>{{ default360 }}</p>
                <br>
                <h3>Rating Scale</h3>
                <br>
                <div class="rating-row">
                    <h4>Rarely</h4><span>Behavior is observed infrequently or almost never</span>
                </div>
                <div class="rating-row">
                    <h4>Occasionally</h4>
                    <span>Behavior is observed sometimes, but not regularly</span>
                </div>
                <div class="rating-row">
                    <h4>Sometimes</h4>
                    <span>Behavior is observed moderately, occurring on occasion</span>
                </div>
                <div class="rating-row">
                    <h4>Often</h4>
                    <span>Behavior is observed frequently, happening regularly</span>
                </div>
                <div class="rating-row">
                    <h4>Always</h4>
                    <span>Behavior is observed consistently, happening without fail</span>
                </div>
                <br>
            </div>
            <h2 class="custom-heading">{{ questions[currentPage - 1].mainTopicEn }}</h2>
            <hr>
            <div class="question-container">
                <div class="question" v-for="(question, qIndex) in questions[currentPage - 1].questionList"
                    :key="question.id">
                    <p>{{ `${currentPage}.${qIndex + 1} ${question.statement}` }}</p>
                    <!-- 360 Degree -->
                    <br>
                    <div v-if="question.type === 'selection'" class="button-container">
                        <div v-for="(answer, aIndex) in answerList" :key="answer.id">
                            <template v-if="isSmallScreen">
                                <input type="radio" :id="`radioButton:${currentPage}${qIndex}${aIndex}`"
                                    :name="`radioButton:${currentPage}${qIndex}`" autocomplete="off"
                                    v-model="question.previousChoiceAnswer"
                                    @input="handleChange('selection', question.questionId, $event.target.value)"
                                    :value="aIndex + 1" required class="radio-button">
                                <label :for="`radioButton:${currentPage}${qIndex}${aIndex}`" class="radio-label">
                                    {{ answer.dataDetailEn }}</label>
                            </template>
                            <template v-else>
                                <input type="radio" class="btn-check radio-button"
                                    :id="`radioButton:${currentPage}${qIndex}${aIndex}`"
                                    :name="`radioButton:${currentPage}${qIndex}`" autocomplete="off"
                                    v-model="question.previousChoiceAnswer"
                                    @input="handleChange('selection', question.questionId, $event.target.value)"
                                    :value="aIndex + 1" required>
                                <label class="btn" :for="`radioButton:${currentPage}${qIndex}${aIndex}`">
                                    {{ answer.dataDetailEn }}</label>
                            </template>
                        </div>
                        <div class="invalid-feedback">
                            Please select an answer.
                        </div>
                    </div>
                    <div v-else-if="question.type === 'open-end'" class="textfield-container">
                        <textarea class="form-control " maxlength="250" rows="5"
                            :id="`textarea:${currentPage}${qIndex}`" v-model="question.previousOpenEndAnswer"
                            @change="handleChange('openEnded', question.questionId, $event.target.value)"
                            :disabled="question.commentOption === 'noComment'" required></textarea>


                        <div class="switch">
                            <input type="checkbox" :id="`toggleSwitch:${currentPage}${qIndex}`"
                                v-model="question.commentOption"
                                v-on:change="handleChange('openEnded', question.questionId, '-')" true-value="noComment"
                                false-value="comment" />
                            <label :for="`toggleSwitch:${currentPage}${qIndex}`" class="switch-label">
                                <span class="switch-slider"></span>
                            </label>
                        </div>
                        <label :for="`toggleSwitch:${currentPage}${qIndex}`" class="No-Comment">
                            &nbsp;&nbsp; No Comment
                        </label>

                        <div v-if="!question.previousOpenEndAnswer && question.commentOption !== 'noComment'"
                            class="invalid-feedback">
                            Please provide an answer.
                        </div>
                    </div>
                </div>
            </div>

            <div class="pagination-container">
                <button class="btn btn-secondary" :style="{ visibility: currentPage === 1 ? 'hidden' : 'visible' }"
                    @click="prevPage" type="button">
                    <i class="bi bi-arrow-left"></i><span class="hide-on-mobile">&nbsp;Previous</span>
                </button>


                <button class="btn-primary"
                    :class="{ 'btn-primary': allQuestionsAnswered, 'btn-before': !allQuestionsAnswered }"
                    :disabled="!allQuestionsAnswered" @click="nextPage()" type="button">
                    <template v-if="currentPage < totalPages">
                        <span class="hide-on-mobile">&nbsp;Next</span><i class="bi bi-arrow-right"></i>
                    </template>
                    <template v-else>
                        Submit&nbsp;
                    </template>
                </button>
                <Modal ref="Modal" :modalType="modalType" @confirm="submitForm" />
            </div>
            <br>
            <br>
            <br>
        </form>
    </div>
    <div v-else class="container-fluid">
        <h1 class="loading">Loading...</h1>
    </div>
</template>


<script>
import { onBeforeMount, onMounted, onBeforeUnmount, inject, reactive, ref, computed } from 'vue';
import { modalMixins } from '../../mixins/modalmixins.js';
import ApiService from '../../services/ApiService.js';
import Modal from '../Modal/Modal.vue';
import { nextTick } from 'vue';



export default {
    name: 'Assessment',
    components: {
        Modal
    },
    props: {
        committeeName: {
            type: String,
            required: true
        },
        committeeId: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const committeeId = ref(props.committeeId);
        const questions = ref([]);
        const surveyName = ref([]);
        const answerList = ref([]);
        const loading = ref(false);
        const currentPage = ref(1);
        const totalPages = ref(0);
        const navigateToErrorPage = inject('navigateToErrorPage');
        const invalidSelectInput = ref(true);
        const invalidTextInput = ref(true);
        const isSmallScreen = ref(window.innerWidth < 1500);
        const { default360 } = modalMixins();
        const modalType = ref('');
        const Modal = ref(null);


        const handleResize = () => {
            isSmallScreen.value = window.innerWidth < 1500;
        };

        onMounted(() => {
            window.addEventListener('resize', handleResize);
        });

        onBeforeUnmount(() => {
            window.removeEventListener('resize', handleResize);
        });

        onBeforeMount(async () => {
            loading.value = true;

            const userData = {
                surveyId: sessionStorage.getItem('surveyId'),
                respondentId: sessionStorage.getItem('respondentId'),
            };

            const body = {
                surveyId: userData.surveyId,
                respondentId: userData.respondentId,
                answerRelationId: committeeId.value,
                language: sessionStorage.getItem("defaultLanguage")
            };
            const response = await ApiService.listQuestionsSurvey(body);
            surveyName.value = response.data.objectValue.surveyNameEn;
            questions.value = response.data.objectValue.competencyList;

            questions.value.forEach((competency) => {
                competency.questionList.forEach((question) => {
                    if (question.type === 'open-end' && question.previousOpenEndAnswer == '-') {
                        question.commentOption = "noComment";
                    } else {
                        question.commentOption = "comment";
                    }
                });
            });
            totalPages.value = Object.keys(questions.value).length;
            try {
                const response = await ApiService.listMasterData({
                    messageKey: '360_choice',
                    language: sessionStorage.getItem('defaultLanguage'),
                    surveyId: sessionStorage.getItem('surveyId'),
                });
                answerList.value = response.data.objectValue.sort((a, b) => b.dataGroupSort - a.dataGroupSort);
            } catch (error) {
                navigateToErrorPage(error);
            }
            loading.value = false;
        });


        const handleChange = async (flag, questionID, data) => {
            const body = {
                surveyId: sessionStorage.getItem('surveyId'),
                respondentId: sessionStorage.getItem('respondentId'),
                questionId: questionID,
                answerRelationId: committeeId.value,
                openEndAnswer: '',
                choiceAnswer: ''
            };
            if (flag === 'openEnded') {
                body.openEndAnswer = data;
            } else if (flag === 'selection') {
                body.choiceAnswer = data;
            } else {
                throw new Error("NO type of answer match");
            }
            await ApiService.saveAnswerSurvey(body);
        };

        const allQuestionsAnswered = computed(() => {
            const currentPageQuestions = questions.value[currentPage.value - 1]
                .questionList;
            return currentPageQuestions.every((question) => {
                if (question.type === "selection") {
                    return question.previousChoiceAnswer;
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
                return true;
            });
        });

        const nextPage = () => {
            if (allQuestionsAnswered.value) {
                if (currentPage.value < totalPages.value) {
                    currentPage.value++;
                    nextTick(() => {
                        scrollToTopic();
                    });
                } else {
                    if (Modal.value.openModal(modalType.value = true)) {
                        submitForm();
                    }
                    modalType.value = 'confirm';
                    Modal.value.openModal(modalType.value);
                }
            }
        };

        const scrollToTopic = () => {
            nextTick(() => {
                const mainTopic = document.querySelector('.custom-heading');
                if (mainTopic) {
                    mainTopic.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        };
        const prevPage = () => {
            if (currentPage.value > 1) {
                currentPage.value--;
            }
        };

        const submitForm = async () => {
            const body = {
                respondentId: sessionStorage.getItem('respondentId'),
                surveyId: sessionStorage.getItem('surveyId'),
                templateId: sessionStorage.getItem("templateId"),
                answerRelationId: committeeId.value
            };
            await ApiService.submitSurvey(body);
        };



        return {
            questions,
            surveyName,
            answerList,
            submitForm,
            handleChange,
            loading,
            currentPage,
            nextPage,
            prevPage,
            totalPages,
            invalidSelectInput,
            invalidTextInput,
            isSmallScreen,
            allQuestionsAnswered,
            default360,
            Modal,
            modalType,
        };
    }
};
</script>

<style scoped>
@media only screen and (min-width: 769px) {

    .container-fluid {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 15px;
        height: 100%;
        max-width: 100%;
        padding: 2% 15%;
        margin-top: 50px;
        position: fixed;
        background-image: url('/src/assets/images/bakertilly-bg.png');
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;

    }

    .loading {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
    }

    .text-openended {
        color: red;
    }

    .form-container {
        width: 100%;
        padding: 2% 5%;
        overflow-y: scroll;
        height: 1152px;

    }

    .container-fluid h1 {
        font-size: calc(1em + 2vw);
        color: rgb(255, 255, 255);


    }

    .radio-button {
        max-width: 100%;
        width: 1cm;
        margin-left: 15px;
    }

    .radio-label {
        font-size: 15px;
        margin-right: 30vw;
        padding: 4px;

    }

    h2 {
        font-size: 28px;
        text-align: center;
        color: #ffff;

    }

    .form-container p {

        font-size: 18px;
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
        gap: 2.5%;
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
        /* gap: 30px; */
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
        width: 11vw;

    }

    .btn-check:checked+.btn {
        border-color: var(--septenary-color);
        background-color: var(--septenary-color);
        border-width: 1.5px;
        color: rgb(72, 42, 42);
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

    }

    .content {
        width: 100%;
        height: 100%;
    }

    .rating-row {
        display: grid;
        grid-template-columns: 140px 1fr;
        align-items: left;
    }

    .rating-row h4 {
        font-size: 18px;
        text-align: left;
        font-weight: bold;
    }

    .form-container h3 {
        font-size: 24px;
        text-align: left;
        font-weight: bold;
    }

    .rating-row span {
        font-size: 18px;
        font-weight: normal;
        text-align: left;
    }

    .custom-heading {
        font-family: 'Arial', sans-serif;
        font-size: 32px;
        color: #000000;
        text-align: center;
        background-color: var(--octonary-color);
        padding: 10px 20px;
        border-radius: 8px;
        margin-bottom: 20px;
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
        background-color: #6a6a6a;
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

}

@media only screen and (max-width: 768px) {

    .container-fluid {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 15px;
        height: 100%;
        max-width: 100%;
        padding: 2% 15%;
        background-color: #ffff;
        margin-top: 50px;
        position: fixed;
        background-color: rgb(255, 255, 255);

    }

    .loading {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
    }

    .custom-heading {
        font-family: 'Arial', sans-serif;
        font-size: 32px;
        color: #000000;
        text-align: center;
        background-color: var(--octonary-color);
        padding: 10px 20px;
        border-radius: 8px;
        margin-bottom: 20px;
    }

    .form-container {
        width: 100%;
        overflow-y: scroll;
        padding: 1% 1%;
        height: 100%;

    }

    .container-fluid h1 {
        font-size: calc(1em + 2vw);
        color: rgb(0, 0, 0);
        margin-top: 2%;
    }

    .question-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 50px;
        font-size: 20px;
    }

    .radio-button {
        max-width: 100%;
        width: 1cm;
        margin-left: 15px;
    }

    .radio-label {
        font-size: 15px;
        margin-right: 33vw;
        padding: 4px;


    }

    .form-container p {

        font-size: 18px;
        margin: 0;
        text-align: left;
        overflow-y: auto;
        max-height: calc(100vh - 100px);
        background-color: rgba(255, 255, 255, 0.9);
    }


    .rating-row {
        display: grid;
        grid-template-columns: 140px 1fr;
        align-items: left;
    }

    .rating-row h4 {
        font-size: 18px;
        text-align: left;
        font-weight: bold;
    }

    .form-container h3 {
        font-size: 22px;
        text-align: left;
        font-weight: bold;
    }

    .rating-row span {
        font-size: 15px;
        font-weight: normal;
        text-align: left;
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
    }

    .btn {
        display: flexbox;
        border-color: var(--septenary-color);
        border-width: 1.5px;
        width: 11vw;

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

    .content {
        width: 100%;
        height: 100%;
    }

    .pagination-container {
        width: 100%;
        max-height: 100%;
        display: flex;
        justify-content: space-between;
        user-select: none;
        margin-top: 50px;
    }

    .hide-on-mobile {
        display: none;
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
        background-color: #6a6a6a;
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

    .No-Comment {
        font-size: 15px;
    }

    .textfield-container textarea {
        resize: none;
        height: 180px;
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
        padding: 2% 15%;
        margin-top: 60px;
        position: fixed;
        background-color: rgb(255, 255, 255);

    }

    .loading {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
    }

    .custom-heading {
        font-family: 'Arial', sans-serif;
        font-size: 23px;
        color: #000000;
        text-align: center;
        background-color: var(--octonary-color);
        padding: 10px 20px;
        border-radius: 8px;
        margin-bottom: 20px;
    }

    .form-container {
        width: 100%;
        overflow-y: scroll;
        height: 100%;

    }

    .radio-button {
        max-width: 100%;
        width: 1cm;
        margin-left: 15px;
    }

    .radio-label {
        font-size: 13px;
        margin-right: 15vw;
        padding: 4px;
    }

    .form-container p {

        font-size: 12px;
        margin: 0;
        text-align: left;
        overflow-y: auto;
        max-height: calc(100vh - 100px);
        background-color: rgba(255, 255, 255, 0.9);
    }



    .rating-row {
        display: grid;
        grid-template-columns: 140px 1fr;
        align-items: left;
    }

    .rating-row h4 {
        font-size: 15px;
        text-align: left;
        font-weight: bold;
    }

    .form-container h3 {
        font-size: 22px;
        text-align: left;
        font-weight: bold;
    }

    .rating-row span {
        font-size: 12px;
        font-weight: normal;
        text-align: left;
    }


    .btn-primary {
        background-color: var(--primary-color);
        color: black;
        border: none;
        font-size: calc(0.5em + 0.5vw);
        width: 20vw;
        height: 4vh;
        border-radius: 6px;
    }

    .btn-secondary {
        font-size: calc(0.5em + 0.3vw);
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

    .hide-on-mobile {
        display: none;
    }

    .switch {
        position: relative;
        display: inline-block;
        padding-top: 17px;
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
        background-color: #6a6a6a;
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

    .No-Comment {
        font-size: 15px;
    }


    .textfield-container textarea {
        resize: none;
        height: 150px;
    }


}
</style>
