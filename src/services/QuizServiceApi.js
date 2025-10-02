import axios from "../config/axios";

const QuizServiceApi = {
  checkOwnerId(params) {
    return axios.get("/verify-quiz", {
      headers: {
        accept: "application/json",
      },
      data: {},
      params: params,
    });
  },
  memberQuiz(questionSetId, sessionId) {
    return axios.get(`/quiz-member/${questionSetId}`, {
      headers: {
        accept: "application/json",
      },
      params: {
        sessionId: sessionId,
      },
    });
  },
  listQuestionBySortOrder(questionSetId, sortOrder, sessionId) {
    return axios.get(`/quiz/${questionSetId}/${sortOrder}`, {
      headers: {
        accept: "application/json",
      },
      params: {
        sessionId: sessionId, 
      },
    });
  },
  genQRcode(params) {
    return axios.get("/qr", {
      headers: {
        accept: "application/json",
      },
      data: {},
      params: params,
    });
  },

  patchUpdateQuiz(body) {
    return axios.patch("/quiz", body, {
      headers: {
        accept: "application/json",
      },
    });
  },
  listScoreBoard(questionSetId, sessionId) {
    return axios.get(`/quiz/board/${questionSetId}`, {
      headers: {
        accept: "application/json",
      },
      params: {
        sessionId: sessionId,
      },
    });
  },
  
  calculateScore(questionSetId, sessionId) {
    return axios.post(`/quiz/calculate-score/${questionSetId}`, {}, { 
      headers: {
        accept: "application/json",
      },
      params: {
        sessionId: sessionId,
      },
    });
  },
  summaryQuiz(questionSetId, questionId ,sessionId) {
    return axios.post(`/quiz/${questionSetId}/${questionId}`, {}, { 
      headers: {
        accept: "application/json",
      },
      params: {
        sessionId: sessionId,
      },
    });
  },
  storageImage(body) {
    return axios.post("/storage/download", body, {
      headers: {
        'content-type': "application/json",
      },
    });
  },
  getWordCloud(body) {
    return axios.post("/quiz/word-cloud", body, {
      headers: {
        'content-type': "application/json",
      },
    });
  },

};
export default QuizServiceApi;
