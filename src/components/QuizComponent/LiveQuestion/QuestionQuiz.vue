<template>
    <div class="container-form">
        <div class="column-container">
            <div class="showQuestion">
                <h4>
                    {{ questions.sortOrder }}. {{ questions.questionEn }}
                </h4>
            </div>
        </div>
        <div v-if="questionType === 'multiple choice'" class="iconClock">
            <div class="circle-timer">
                <p class="countdown">{{ countdown }} s</p>
            </div>
        </div>
        <transition name="fade" mode="out-in">
            <template v-if="countdown !== 0 && questionType === 'multiple choice'">
                <div class="show-image">
                    <img class="image" :src="imageUrl || imageDefault" alt="Image" />
                </div>
            </template>
            <template v-else-if="questionType === 'multiple choice'">
                <div class="show-chart">
                    <div class="graph-container">
                        <div class="showAnswer" v-for="(answer, index) in totalAnswers" :key="index">
                            <div :class="['rectangle big', { 'no-transition': isResetting }]"
                                :style="{ height: (answer / (maxAnswer || 1)) * 170 + 'px', backgroundColor: getBarColor(index) }">
                                <div class="number-background">
                                    <div class="number">{{ answer }}</div>
                                </div>
                            </div>
                            <div class="rectangle small" :style="{ backgroundColor: getBarColor(index) }"></div>
                        </div>
                    </div>
                </div>
            </template>
        </transition>

        <!-- Frequency chart -->
        <div v-if="questionType === 'frequency'" v-show="isChartVisible && totalAnswers.length" class="showChart">
            <div class="container">
                <div class="showAnswer" v-for="(answer, index) in totalAnswers" :key="index">
                    <div class="chart-big" :style="{
                        height: (answer / (maxAnswer || 1)) * 45 + 'vh',
                        backgroundColor: answer === maxAnswer ? '#d1ec51' : 'gray',
                        position: 'relative',
                        margin: '0 7px'
                    }">
                        <div v-if="questions.enablePercentage">
                            <div class="number"
                                style="position: absolute; top: -7vh; left: 50%; transform: translateX(-50%);">
                                {{ totalMember > 0 ? Math.round((answer / totalMember) * 100) : '0' }}%
                            </div>
                        </div>
                        <div v-else>
                            <div class="number"
                                style="position: relative; top: -7vh; left: 50%; transform: translateX(-50%);">
                                {{ answer }}
                            </div>
                        </div>
                    </div>
                    <div v-if="answer === 0" class="base small" :style="{ backgroundColor: 'gray' }"></div>
                    <div class="number">
                        {{ (index + 1) }}
                    </div>
                </div>

            </div>
        </div>
        <WordCloud v-if="questionType === 'word cloud'" :words="wordData" class="word-cloud-container" />
    </div>
    <AnswerQuiz v-if="questionType === 'multiple choice'" :choices="choices" :correct-answer="correctAnswer"
        class="button-multi" />
    <div class="frame-button">
        <button v-show="countdown === 0 || questionType !== 'multiple choice'" :disabled="isNextButtonDisabled"
            type="button" class="btn-next" @click="NextQuiz">
            <p> Next </p>
        </button>

    </div>
</template>

<script>
import { ref, onMounted, computed, onUnmounted, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import QuizServiceApi from '/src/services/QuizServiceApi.js';
import AnswerQuiz from '../ButtonAnswerQuiz/AnswerQuiz.vue';
import WordCloud from './WordCloud.vue';

export default {
    name: "QuestionQuiz",
    components: {
        AnswerQuiz,
        WordCloud,
    },
    setup() {
        const imageUrl = ref('');
        const image = ref("");
        const questions = ref({});
        const choices = ref({
            choice1: '',
            choice2: '',
            choice3: '',
            choice4: ''
        });
        const totalPage = ref(0);
        const correctAnswer = ref(0);
        const countdown = ref(0);
        const questionId = ref('');
        const startTime = ref('');
        const endTime = ref('');
        const questionType = ref('');
        const wordData = ref([]);
        const choice = ref([]);
        const totalAnswers = ref([]);
        const sortOrder = ref(parseInt(sessionStorage.getItem("sortOrder")) || 1);
        const colors = ['#E31A3C', '#1368CE', '#D89E02', '#298F0E'];
        const showChart = ref(false);
        const showImageDefault = ref(true);
        const router = useRouter();
        const isChartVisible = ref(false);
        let apiPollingInterval = null;
        const totalMember = ref(0);
        const questionTypeMultiple = ref('');
        const questionTypeFrequency = ref('');
        const questionTypeWordCloud = ref('');
        const imageDefault = ref("src/assets/images/question.png");
        const isResetting = ref(false);
        const isNextButtonDisabled = ref(false);


        const getBarColor = (index) => {
            return colors[index % colors.length];
        };

        const highestIndex = computed(() => {
            if (totalAnswers.value.length === 0) return -1;
            return totalAnswers.value.indexOf(Math.max(...totalAnswers.value));
        });
        const maxAnswer = computed(() => {
            return totalAnswers.value.length > 0 ? Math.max(...totalAnswers.value) : 1;
        });

        const resetGraphValues = async () => {
            isResetting.value = true;
            totalAnswers.value = [];
            await nextTick();
            isResetting.value = false;
        };


        const updateChoices = () => {
            if (questions.value && questions.value.choiceList) {
                choices.value = {
                    choice1: questions.value.choiceList.find(choice => choice.sortOrder === 1)?.choice || 'default1',
                    choice2: questions.value.choiceList.find(choice => choice.sortOrder === 2)?.choice || 'default2',
                    choice3: questions.value.choiceList.find(choice => choice.sortOrder === 3)?.choice || 'default3',
                    choice4: questions.value.choiceList.find(choice => choice.sortOrder === 4)?.choice || 'default4'
                };
            }
        };

        const highlightCorrectAnswer = () => {
            const correctIndex = correctAnswer.value - 1;
            const answerElements = document.querySelectorAll('.box-answer p');

            answerElements.forEach((element, index) => {
                if (index === correctIndex) {
                    element.style.backgroundColor = '';
                    element.style.opacity = '1';
                } else {
                    element.style.backgroundColor = '';
                    element.style.opacity = '0.5';
                }
            });
        };
        const resetAnswerColors = () => {
            const answerElements = document.querySelectorAll('.box-answer p');
            answerElements.forEach((element) => {
                element.style.backgroundColor = '';
                element.style.opacity = '1';
            });
        };

        const updateCountdown = async () => {
            if (countdown.value > 0) {
                countdown.value--;

                if (questionType.value === 'frequency') {
                    isChartVisible.value = true;
                    await fetchSummary();
                } else if (questionType.value === 'word cloud') {
                    showChart.value = false;
                    isChartVisible.value = false;
                } else {
                    isChartVisible.value = false;
                }
            } else {
                if (questionType.value === 'multiple choice') {
                    isChartVisible.value = true;
                    showImageDefault.value = false;
                    highlightCorrectAnswer();
                    await fetchSummary();
                    fetchCalculateScore();
                } else {
                    isChartVisible.value = true;
                }
            }
        };

        const resetState = () => {
            showChart.value = false;
            isChartVisible.value = false;
            showImageDefault.value = true;
        };
        const NextQuiz = async () => {
            if (isNextButtonDisabled.value) return
            isNextButtonDisabled.value = true
            resetState();
            resetGraphValues();
            showChart.value = false;
            isChartVisible.value = false;
            showImageDefault.value = true;
            if (sortOrder.value >= totalPage.value) {
                if (questionTypeMultiple.value && questionTypeFrequency.value && questionTypeWordCloud.value) {
                    localStorage.removeItem("sortOrder", "questionId", "ownerId");
                    router.push('/RankingBoard');
                } else {
                    localStorage.clear();
                    router.push('/Thx');
                }
            } else {
                sortOrder.value++;
                sessionStorage.setItem("sortOrder", sortOrder.value);
                localStorage.removeItem("imageId");
                imageUrl.value = null;
                await fetchQuestion();
                totalAnswers.value = [];
                await fetchSummary();
                fetchTime();
                resetAnswerColors();
                fetchCalculateScore();
            }
            isNextButtonDisabled.value = false;
        };

        let countdownInterval;

        const startCountdown = () => {
            countdownInterval = setInterval(updateCountdown, 1000);
        };

        onUnmounted(() => {
            clearInterval(countdownInterval);
            clearInterval(apiPollingInterval);
        });

        const fetchTime = async () => {
            const body = {
                questionSetId: sessionStorage.getItem("questionSetId"),
                sessionId: sessionStorage.getItem("sessionId"),
                questionId: sessionStorage.getItem("questionId"),
            };
            const response = await QuizServiceApi.patchUpdateQuiz(body);
            startTime.value = response.data.objectValue.startTime;
            endTime.value = response.data.objectValue.endTime;

            const start = new Date(startTime.value).getTime() / 1000;
            const end = new Date(endTime.value).getTime() / 1000;

            countdown.value = Math.max(0, end - start);
        };

        const fetchCalculateScore = async () => {
            const questionSetId = sessionStorage.getItem("questionSetId");
            const sessionId = sessionStorage.getItem("sessionId");

            await QuizServiceApi.calculateScore(questionSetId, sessionId);
        };

        const fetchSummary = async () => {
            const questionSetId = sessionStorage.getItem("questionSetId");
            const questionId = sessionStorage.getItem("questionId");
            const sessionId = sessionStorage.getItem("sessionId");

            const response = await QuizServiceApi.summaryQuiz(questionSetId, questionId, sessionId);
            choice.value = response.data.objectValue.choice;
            totalAnswers.value = response.data.objectValue.totalAnswers;
            totalMember.value = response.data.objectValue.totalMember;
        };
        const fetchImage = async () => {
            const body = {
                fileId: sessionStorage.getItem("imageId"),
                container: "image",
            }
            const response = await QuizServiceApi.storageImage(body);
            if (response.data.objectValue) {
                imageUrl.value = `data:image/png;base64,${response.data.objectValue.content}`;
            }
        };

        const fetchQuestion = async () => {
            const questionSetId = sessionStorage.getItem("questionSetId");
            const sessionId = sessionStorage.getItem("sessionId");

            if (questionSetId && sortOrder.value) {
                const response = await QuizServiceApi.listQuestionBySortOrder(
                    questionSetId,
                    sortOrder.value,
                    sessionId
                );
                if (response.data.objectValue) {
                    questions.value = response.data.objectValue;
                    questionId.value = response.data.objectValue.questionId;
                    correctAnswer.value = response.data.objectValue.answer;
                    questionType.value = response.data.objectValue.questionType;
                    sessionStorage.setItem("questionId", questionId.value);
                    updateChoices();
                }

                if (response.data.pageValue) {
                    totalPage.value = response.data.pageValue.total;
                }
                if (response.data.objectValue.imageId) {
                    image.value = response.data.objectValue.imageId
                    sessionStorage.setItem("imageId", image.value);
                    fetchImage();
                }
                if (questionType.value === 'multiple choice') {
                    questionTypeMultiple.value = questionType.value === 'multiple choice';
                } else if (questionType.value === 'frequency') {
                    questionTypeFrequency.value = questionType.value === 'frequency';
                } else if (questionType.value === 'word cloud') {
                    questionTypeWordCloud.value = questionType.value === 'word cloud';
                }
            }
        };
        const fetchWordCloud = async () => {
            const body = {
                questionSetId: sessionStorage.getItem("questionSetId"),
                questionId: sessionStorage.getItem("questionId"),
                sessionId: sessionStorage.getItem("sessionId"),
            }
            const response = await QuizServiceApi.getWordCloud(body);

            if (response.data && response.data.objectValue && Array.isArray(response.data.objectValue)) {
                wordData.value = response.data.objectValue.map(item => ({
                    text: item.word,
                    value: item.frequency
                }));
            } else {
                wordData.value = [];
            }
        };
        document.addEventListener('keydown', function (e) {
            if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '=')) {
                e.preventDefault();
            }
        });

        document.addEventListener('wheel', function (e) {
            if (e.ctrlKey) {
                e.preventDefault();
            }
        }, { passive: false });

        onMounted(async () => {
            await fetchQuestion();
            await fetchTime();
            startCountdown();
            await fetchCalculateScore();
            showImageDefault.value = true;
            apiPollingInterval = setInterval(async () => {
                if (questionType.value == 'frequency' || questionType.value == 'word cloud') {
                    await fetchSummary();
                    await fetchWordCloud();
                }
            }, 500);
            if (questionType.value !== 'multiple choice') {
                watch(totalAnswers, (newVal) => {
                    isChartVisible.value = newVal.length > 0;
                });
            }
        });
        watch(sortOrder, async (newSortOrder, oldSortOrder) => {
            if (newSortOrder !== oldSortOrder) {
                sessionStorage.setItem("sortOrder", newSortOrder);
                resetAnswerColors();
                await fetchQuestion();
                await fetchSummary();
                await fetchTime();
            }
        });

        return {
            imageUrl,
            image,
            questions,
            choices,
            totalPage,
            correctAnswer,
            countdown,
            questionId,
            startTime,
            endTime,
            questionType,
            wordData,
            choice,
            totalAnswers,
            sortOrder,
            colors,
            showChart,
            showImageDefault,
            router,
            isChartVisible,
            totalMember,
            questionTypeMultiple,
            questionTypeFrequency,
            questionTypeWordCloud,
            imageDefault,
            getBarColor,
            highlightCorrectAnswer,
            updateCountdown,
            resetState,
            NextQuiz,
            fetchCalculateScore,
            fetchSummary,
            fetchWordCloud,
            highestIndex,
            maxAnswer,
            isResetting,
            isNextButtonDisabled,
        };
    },
};
</script>


<style scoped>
.container-form {
    position: relative;
    display: block;
    top: 5%;
    align-items: center;
    width: 90%;
    height: 85vh;
    justify-self: center;
}

.show-image {
    display: flex;
    justify-content: center;
}

.image {
    width: 45%;
    height: 35vh;
    z-index: 50;
}


.show-chart {
    position: relative;
    border-radius: 15px;
    background-color: #ffff;
    width: 45%;
    height: 35vh;
    justify-content: center;
    align-items: center;
    margin-left: auto;
    margin-right: auto;
}

.showChart {
    position: relative;
    /* top: 2vh; */
    align-items: center;
    width: 100%;
    height: 65vh;
    border-radius: 15px;
    border: #cdccce 2px solid;
    justify-self: center;
}

.graph-container {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    max-width: 100%;
    width: 100%;
    padding: 10px 5px;
    height: 100%;
    gap: 10%;
}

.container {
    display: flex;
    position: relative;
    justify-content: center;
    align-items: flex-end;
    max-width: 100%;
    padding: 10px 5px;
    height: 100%;
    gap: 2%;
}

.showAnswer {
    display: inline-block;
    text-align: center;
}

.rectangle.big {
    width: 7vw;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    border-radius: 8px;
    max-height: 170px;

}

.number {
    font-size: 1.5vw;
    font-weight: bold;
    color: #ffffff;
    text-align: center;
    padding: 5px 2px;
}

.rectangle.small {
    width: 7vw;
    height: 32px;
    margin-top: 10px;
    border-radius: 6px;
}

.base.small {
    background-color: #95a5a6;
    width: 7vw;
    height: 20px;
    border-radius: 6px;
}

.chart-big {
    border-radius: 18px;
    width: 6vw;
    max-height: 45vh;
    transition: height 0.3s ease;
}

.no-transition {
    transition: none !important;
}

.column-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 63px;
    width: 100%;
    padding-bottom: 4vh;
}

.frame-button {
    position: relative;
    align-items: center;
    width: 100vw;
    height: 6vh;
    justify-self: center;
}

.btn-next {
    position: fixed;
    font-size: 1.5vw;
    font-weight: bold;
    width: 8%;
    height: 5vh;
    border: none;
    border-radius: 10px;
    background: var(--primary-color);
    /* margin-top: 1vh; */
    right: 15px;
}

.btn-next p {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    margin: 0;
    text-align: center;
}

.showQuestion h4 {
    margin-top: 2%;
    font-size: 2.5vw;
    color: #fff;
}

.show-img {
    position: absolute;
    top: 10vh;
    align-items: center;
    width: 100%;
    height: 30vh;
}

.iconClock {
    position: absolute;
    top: 9vh;
    right: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1em;
}

.circle-timer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #e10a0a;
}

.countdown {
    position: absolute;
    top: 5px;
    right: 7px;
    font-size: 1.5rem;
    color: #fff;
    text-align: center;
}

.form-container {
    display: flex;
    justify-content: center;
    margin-top: 1.5%;
}

.btn-danger {
    font-size: 25px;
    position: absolute;
    font-weight: bold;
    height: 50px;
    width: 80px;
    border: none;
    border-radius: 10px;
    background-color: #e74c3c;
    color: #fff;
    bottom: 30px;
    right: 30px;
}

.word-cloud-container {
    position: relative;
    width: 80%;
    height: 65vh;
    background: linear-gradient(to right, #ffffff, #ffffff);
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    margin: 0 auto;
}

.word-cloud-content {
    width: 100%;
    height: 100%;
    text-align: center;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease-in-out;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.button-multi {
    top: 53vh;
}

@media only screen and (max-width: 1400px) {
    .show-chart {
        width: 50%;
    }

    .rectangle.small {
        width: 6vw;
        margin-top: 5px;
    }

    .rectangle.big {
        width: 6vw;
        max-height: 130px;
    }

    .chart-big {
        border-radius: 6px;
    }

    .showQuestion h4 {
        font-size: 2.5vw;
    }

    .button-multi {
        top: 52vh;
    }
}

@media only screen and (max-width: 1024px) {
    .show-chart {
        width: 60%;
        height: 40vh;
    }

    .showChart {
        width: 95vw;
        height: 65vh;
        border-radius: 15px;
        justify-self: center;
        top: 5vh;
    }

    .button-multi {
        top: 50vh;
    }

    .rectangle.small {
        width: 7vw;
        margin-top: 2px;
    }

    .rectangle.big {
        width: 7vw;
        max-height: 100px;

    }

    .chart-big {
        border-radius: 6px;
    }

    .showQuestion h4 {
        font-size: 2.5vw;
    }

}

@media only screen and (max-width: 880px) {

    .container {
        gap: 1%;
    }

    .showChart {
        width: 100%;
        height: 65vh;
        border-radius: 15px;
        justify-self: center;
        top: 5vh;
    }

    .base.small {
        width: 5vw;
        justify-self: center;
    }

    .number {
        font-size: 1.5vw;
        font-weight: bold;
        color: #ffffff;
        text-align: center;
        padding: 5px 5px;
    }

    .chart-big {
        max-height: 30vh;
        border-radius: 6px;

    }

    .rectangle.big {
        width: 7vw;
        max-height: 75px;
    }

    .rectangle.small {
        width: 7vw;
        height: 22px;
        margin-top: 2px;
    }

    .word-cloud-container {
        height: 70vh;
    }

    .button-multi {
        top: 40vh;
    }
}

@media only screen and (max-width: 580px) {
    .container {
        padding: 10px 10vw;
        gap: 1%;
    }

    .showAnswer {
        display: inline-block;
        text-align: center;
    }

    .showChart {
        width: 95vw;
        height: 65vh;
        border-radius: 15px;
        justify-self: center;
        top: 5vh;
    }

    .base.small {
        width: 5vw;
        justify-self: center;
    }

    .number {
        font-size: 1.5vw;
        font-weight: bold;
        color: #ffffff;
        text-align: center;
        padding: 5px 10px;
    }

    .chart-big {
        max-height: 30vh;
        border-radius: 6px;
    }

    .rectangle.big {
        width: 7vw;
        max-height: 75px;
    }

    .rectangle.small {
        width: 7vw;
        height: 22px;
        margin-top: 2px;
    }

}

@media only screen and (max-width: 450px) {
    .container {
        padding: 10px 40vw;
        gap: 1%;
    }

    .showChart {
        width: 95vw;
        height: 65vh;
        border-radius: 15px;
        justify-self: center;
        top: 5vh;
    }

    .base.small {
        width: 5vw;
        justify-self: center;
    }

    .number {
        font-size: 1.5vw;
        font-weight: bold;
        color: #ffffff;
        text-align: center;
        padding: 5px 10px;
    }

    .chart-big {
        max-height: 30vh;
        border-radius: 6px;

    }

    .rectangle.big {
        width: 9vw;
        max-height: 75px;

    }

    .rectangle.small {
        width: 9vw;
        height: 18px;
        margin-top: 2px;
    }

}
</style>
