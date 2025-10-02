<template>
  <div class="container-fluid">
    <div class="box-container">
      <button v-for="(choice, index) in shuffledPositions" :key="index" :class="[
        'answer-button',
        choice.color,
        {
          selected: selectedAnswer === choice.choice,
          dimmed: isAnswered && selectedAnswer !== choice.choice
        }
      ]" @click="isAnswered ? null : saveAnswer(choice.choice)" :disabled="isAnswered">
        <div>
          <i :class="['symbol', choice.icon]"></i>
        </div>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";

export default {
  name: "AnswerButton",
  props: {
    selectedAnswer: Number,
    isAnswered: Boolean,
  },
  setup(props, { emit }) {
    const choices = ref([
      { choice: 0, icon: "bi-square", color: "red" },
      { choice: 1, icon: "bi-triangle", color: "blue" },
      { choice: 2, icon: "bi-circle", color: "yellow" },
      { choice: 3, icon: "bi-x-lg", color: "green" },
    ]);

    const shuffledPositions = ref([]);

    const shuffleArray = (array) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    const initializeShuffledPositions = () => {
      shuffledPositions.value = shuffleArray(choices.value);
    };

    onMounted(() => {
      initializeShuffledPositions();
    });

    watch(
      () => props.isAnswered,
      (newVal, oldVal) => {
        if (!newVal && oldVal) {
          initializeShuffledPositions();
        }
      }
    );

    const saveAnswer = (index) => {
      if (props.isAnswered) return;

      emit("saveAnswer", index);
    };

    return {
      saveAnswer,
      shuffledPositions
    };
  },
};
</script>




<style scoped>
@media only screen and (min-width: 769px) {
  .container-fluid {
    display: flex;
    padding-top: 68px;
    height: 100%;
    width: 100%;
    position: fixed;
    justify-content: center;
  }

  .box-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    margin-top: 15px;
    grid-gap: 15px;
    width: 70vw;
    height: 70vh;
  }

  .answer-button {
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    cursor: pointer;
    width: 100%;
    height: 100%;
    transition: opacity 0.3s ease, transform 0.2s ease;
  }

  .answer-button:active {
    transform: scale(0.95);
  }

  .blue {
    background-color: #3498db;
  }

  .red {
    background-color: #e74c3c;
  }

  .green {
    background-color: #298F0E;
  }

  .yellow {
    background-color: #f1c40f;
  }

  .selected {
    opacity: 100%;
  }

  .dimmed {
    opacity: 0.3;
  }

  .symbol {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #ffffff;
    font-size: 150px;

  }
}

@media only screen and (max-width: 768px) {
  .container-fluid {
    display: flex;
    padding-top: 68px;
    height: 100%;
    width: 100%;
    position: fixed;
    justify-content: center;
  }

  .box-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 20px;
    width: 90vw;
    height: 70vh;
  }

  .answer-button {
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    cursor: pointer;
    width: 100%;
    height: 100%;
    transition: opacity 0.3s ease, transform 0.2s ease;
  }

  .answer-button:active {
    transform: scale(0.95);
  }

  .blue {
    background-color: #3498db;
  }

  .red {
    background-color: #e74c3c;
  }

  .green {
    background-color: #298F0E;
  }

  .yellow {
    background-color: #f1c40f;
  }

  .selected {
    opacity: 100%;
  }

  .dimmed {
    opacity: 0.3;
  }

  .symbol {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #ffffff;
    font-size: 150px;

  }
}

@media only screen and (max-width: 580px) {
  .container-fluid {
    display: flex;
    padding-top: 68px;
    height: 100%;
    width: 100%;
    position: fixed;
    justify-content: center;
  }

  .box-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 15px;
    width: 90vw;
    height: 70vh;
  }

  .answer-button {
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    cursor: pointer;
    width: 100%;
    height: 100%;
    transition: opacity 0.3s ease, transform 0.2s ease;
  }

  .answer-button:active {
    transform: scale(0.95);
  }

  .blue {
    background-color: #3498db;
  }

  .red {
    background-color: #e74c3c;
  }

  .green {
    background-color: #298F0E;
  }

  .yellow {
    background-color: #f1c40f;
  }

  .selected {
    opacity: 100%;
  }

  .dimmed {
    opacity: 0.3;
  }

  .symbol {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #ffffff;
    font-size: 100px;

  }
}
</style>
