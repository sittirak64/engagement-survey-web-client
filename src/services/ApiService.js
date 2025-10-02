import axios from "../config/axios";
const ApiService = {
  listMasterData(params) {
    return axios.get("/master/list", {
      headers: {
        accept: "application/json",
      },
      data: {},
      params: params,
    });
  },
  getCloseEnd(params) {
    return axios.get("/close-end/list", {
      headers: {
        accept: "application/json",
      },
      data: {},
      params: params,
    });
  },

  getPosition(params) {
    return axios.get("/position/list", {
      headers: {
        accept: "application/json",
      },
      data: {},
      params: params,
    });
  },

  getPrefixCountry() {
    return axios.get("/country/list", {
      headers: {
        accept: "application/json",
      },
      data: {},
    });
  },

  getLanguage(params) {
    return axios.get("/language/list", {
      headers: {
        accept: "application/json",
      },
      data: {},
      params: params,  
    });
  },
  getCommitteeDashboard(params) {
    return axios.get("360degree/activities/committee/dashboard", {
      headers: {
        accept: "application/json",
      },
      data: {},
      params: params,  
    });
  },

  get360degreeCommitteeGroup(params) {
    return axios.get("/360degree/activities/committee/group/status", {
      headers: {
        accept: "application/json",
      },
      data: {},
      params: params,
    });
  },

  listDepartment(body) {
    return axios.post("/department", body, {
      headers: {
        accept: "application/json",
      },
    });
  },

  listQuestionsSurvey(body) {
    return axios.post("/survey-questions", body, {
      headers: {
        accept: "application/json",
      },
    });
  },

  saveAnswerSurvey(body) {
    return axios.post("/survey-answer", body, {
      headers: {
        accept: "application/json",
      },
    });
  },

  submitSurvey(body) {
    return axios.post("/survey-submit", body, {
      headers: {
        accept: "application/json",
      },
    });
  },

  getRespondentInfo(body) {
    return axios.post("/respondent", body, {
      headers: {
        accept: "application/json",
      },
    });
  },

  getCommitteeList(body) {
    return axios.post("/360degree/committee/list", body, {
      headers: {
        accept: "application/json",
      },
    });
  },

  postSendRequest(body) {
    return axios.post("/360degree/activities/committee", body, {
      headers: {
        accept: "application/json",
      },
    });
  },

  getResendMail(body) {
    return axios.post("/mail", body, {
      headers: {
        accept: "application/json",
      },
    });
  },

  patchRespondentSubmit(body) {
    return axios.patch("/respondent-submit", body, {
      headers: {
        accept: "application/json",
      },
    });
  },

  patchRespondentInfo(body) {
    return axios.patch("/respondent", body, {
      headers: {
        accept: "application/json",
      },
    });
  },
};

export default ApiService;
