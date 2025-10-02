import axios from "../config/axios";

const QuizUserApi = {
  getQuestionAnswerUser(questionSetId, sortOrder ,sessionId) {
    return axios.get(`/quiz/${questionSetId}/${sortOrder}`, {
      headers: {
        accept: "application/json",
      },
      params: {
        sessionId: sessionId, 
      },
    });
  },

  postJoinQuiz(body) {
    return axios.post("/join-quiz", body, {
      headers: {
        accept: "application/json",
      },
    });
  },

  postQuizMember(body) {
    return axios.post("/quiz-member", body, {
      headers: {
        accept: "application/json",
      },
    });
  },

  postAnswerQuiz(body) {
    return axios.post("/answer-quiz", body, {
      headers: {
        accept: "application/json",
      },
    });
  },

  postScoreQuiz(questionSetId, sessionId) {
    return axios.get(`/quiz/calculate-score/${questionSetId}`, {
      headers: {
        accept: "application/json",
      },
      params: {
        sessionId: sessionId,
      },
    });
  },

  postQuiz(body) {
    return axios.post("/quiz", body, {
      headers: {
        accept: 'application/json',
      },
    });
  },

};

export default QuizUserApi;
