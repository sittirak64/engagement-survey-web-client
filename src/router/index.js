import { createRouter, createWebHistory } from "vue-router";
//Engagement Router----------------------------------------------------------------
import SurveyPage from "../Pages/Engagement/Survey.vue";
import ShortQuiz from "../Pages/Engagement/ShortQuiz.vue";
import PreInformationPage from "../Pages/Engagement/PreInformation.vue";
//360 Degree Router ----------------------------------------------------------------
import HomePage from "../Pages/360Degree/360HomePage.vue";
import Degree from "../Pages/360Degree/360Degree.vue";  
//Quiz Router---------------------------------------------------------------------
import User from "../Pages/Quiz/User.vue";
import QRCode from "../Pages/Quiz/QRCode.vue";
import Question from "../Pages/Quiz/Question.vue";
import RankingBoard from "../Pages/Quiz/RankingBoard.vue";
import Answer from "../Pages/Quiz/Answer.vue";
import Waiting from "../Pages/Quiz/Waiting.vue";
import Ready from "../Pages/Quiz/Ready.vue";

//Global Router ---------------------------------------------------------------------
import ErrorPage from "../Pages/GlobalPage/Error.vue";
import DefaultPage from "../Pages/GlobalPage/DefaultPage.vue";
import Thx from "../Pages/GlobalPage/Thx.vue";
import VerifyPage from "../Pages/GlobalPage/Verify.vue";
import VerifyMobile from "../Pages/GlobalPage/VerifyMobile.vue";
import axios from "../config/axios";
import { setStorage, getStorage } from "@/mixins/AppStorage.js";
const routes = [
  {
    path: "/",
    name: "root",
    redirect: "/verify",
  },
  {
    path: "/:surveyType/:param1/:param2/:param3",
    name: "rootWithParam",
    beforeEnter: async (to, from, next) => {
      localStorage.clear();
      try {
        switch (to.params.surveyType) {
          case "360degree":
          case "engagement":
          case "shortQuiz":
            let corporateId = to.params.param1;
            let surveyId = to.params.param2;
            let respondentId = to.params.param3;
            const response = await axios.get(
              `/survey/${to.params.surveyType}?corporateId=${corporateId}&surveyId=${surveyId}&respondentId=${respondentId}`,
              {
                headers: {
                  "Content-Type": "application/json",
                },
                data: {},
              }
            );

            const responseConfig = await axios.get(
              `/survey/config?surveyId=${surveyId}`,
              {
                headers: { "Content-Type": "application/json" },
                data: {},
              }
            );
            
            if (responseConfig.data.objectValue) {
              const { isCountryLocation, isGender, isYearOfService, isYearOfBirth, isEmail, isPosition, isDepartment } = responseConfig.data.objectValue;
              const fields = {
                country: isCountryLocation,
                Gender: isGender,
                YearOfService: isYearOfService,
                YearOfBirth: isYearOfBirth,
                Email: isEmail,
                Position: isPosition,
                Department: isDepartment,
              };
            
              Object.entries(fields).forEach(([key, value]) => {
                sessionStorage.setItem(key, value);
              });
            }
            if (response.data.status) {
              setStorage("colors", response.data.objectValue.colorSetResponse);
              sessionStorage.setItem(
                "isMultiLanguage",
                response.data.objectValue.surveyConfigResponse.isMultiLanguage
              );
              sessionStorage.setItem(
                "allowOpenEndComment",
                response.data.objectValue.surveyConfigResponse.allowOpenEndComment
              );
              sessionStorage.setItem(
                "defaultLanguage",
                response.data.objectValue.surveyConfigResponse.isMultiLanguage == true
                  ? "multi"
                  : response.data.objectValue.surveyConfigResponse.defaultLanguage.toLowerCase()
              );
              updateColor(response.data.objectValue.colorSetResponse);
              if(response.data.objectValue.logoUri){
                const url = ( response.data.objectValue.logoUri)
                sessionStorage.setItem("logoUrl",url)
              }
              sessionStorage.setItem("surveyType", to.params.surveyType);
              sessionStorage.setItem("corporateId", to.params.param1);
              sessionStorage.setItem("surveyId", to.params.param2);
              sessionStorage.setItem("respondentId", to.params.param3);
    
              if (respondentId === "mobile") {
                sessionStorage.setItem("respondentIdMobile", respondentId);
                next({ name: "VerifyMobile" }); 
              } else {
                next({ name: "verify" });
              }
            } else {
              next({
                path: "/error",
                query: {
                  message: "An issue occurred. Please check the link and try again.",
                },
              });
            }
            break;
          case "quiz":
            let join = to.params.param1;
            let questionSetId = to.params.param2;
            let sessionId = to.params.param3;
            sessionStorage.setItem("surveyType", to.params.surveyType);
            sessionStorage.setItem("join", join);
            sessionStorage.setItem("questionSetId", questionSetId);
            sessionStorage.setItem("sessionId", sessionId);
            next({ name: "User" });
            break;
          default:
            next({
              path: "/error",
              query: {
                message:
                  "An issue occurred. Please check the link and try again.",
              },
            });
        }
      } catch (error) {
        let errorCode = "";
        let errorMessage = "";

        if (error.response) {
          errorCode = `${error.response.status} ${error.response.statusText}`;
        }
        if (error.message) {
          errorMessage = error.message;
        }
        next({
          path: "/error",
          query: { error_code: errorCode, error_message: errorMessage },
        });
      }
    },
  },
  {
    path: "/:surveyType/:param1/:param2",
    name: "root",
    beforeEnter: async (to, from, next) => {
      localStorage.clear();
      switch (to.params.surveyType) {
        case "quiz":
          let questionSetId = to.params.param1;
          let ownerId = to.params.param2;

          sessionStorage.setItem("questionSetId", questionSetId);
          sessionStorage.setItem("ownerId", ownerId);

          if (to.params.surveyType === "quiz") {
            const response = await axios.get("/verify-quiz", {
              params: {
                surveyType: to.params.surveyType,
                questionSetId: sessionStorage.getItem("questionSetId"),
                ownerId: sessionStorage.getItem("ownerId"),
              },
              headers: { "Content-Type": "application/json" },
            });

            const Link = response.data.objectValue.quizLink;
            sessionStorage.setItem("Link", Link);
            const parts = Link.split("/");
            const sessionId = parts[6];
            sessionStorage.setItem("sessionId", sessionId);
            next({ name: "QRCode" });
          } else {
            next({
              path: "/error",
              query: { message: "Invalid survey data." },
            });
          }
          break;

        case "engagement":
          let corporateId = to.params.param1;
          let surveyId = to.params.param2;

          sessionStorage.setItem("surveyTypeEngagement", to.params.surveyType);
          sessionStorage.setItem("corporateId", to.params.param1);
          sessionStorage.setItem("surveyId", to.params.param2);
          const response = await axios.get(
            `/survey/${to.params.surveyType}?corporateId=${corporateId}&surveyId=${surveyId}&respondentId`,
            {
              headers: {
                "Content-Type": "application/json",
              },
              data: {},
            }
          );
          
          const responseConfig = await axios.get(
            `/survey/config?surveyId=${surveyId}`,
            {
              headers: { "Content-Type": "application/json" },
              data: {},
            }
          );
          
          if (responseConfig.data.objectValue) {
            const { isCountryLocation, isGender, isYearOfService, isYearOfBirth, isEmail, isPosition, isDepartment } = responseConfig.data.objectValue;
            const fields = {
              country: isCountryLocation,
              Gender: isGender,
              YearOfService: isYearOfService,
              YearOfBirth: isYearOfBirth,
              Email: isEmail,
              Position: isPosition,
              Department: isDepartment,
            };
          
            Object.entries(fields).forEach(([key, value]) => {
              sessionStorage.setItem(key, value);
            });
          }
          

          if (response.data.status) {
            setStorage("colors", response.data.objectValue.colorSetResponse);
            sessionStorage.setItem(
              "isMultiLanguage",
              response.data.objectValue.surveyConfigResponse.isMultiLanguage
            );
            sessionStorage.setItem(
              "allowOpenEndComment",
              response.data.objectValue.surveyConfigResponse.allowOpenEndComment
            );
            sessionStorage.setItem(
              "defaultLanguage",
              response.data.objectValue.surveyConfigResponse.defaultLanguage.toLowerCase()
            );
            updateColor(response.data.objectValue.colorSetResponse);

            const respondentId = response.data.objectValue.respondentId;
            sessionStorage.setItem("respondentId", respondentId);
          }
          next({ name: "preinformation" });
          break;
        default:
          next({
            path: "/error",
            query: { message: "Invalid survey data." },
          });
      }
    },
  },

  //Global Path----------------------------------------------------------------
  {
    path: "/verify",
    name: "verify",
    component: VerifyPage,
  },
  {
    path: "/VerifyMobile",
    name: "VerifyMobile",
    component: VerifyMobile,
  },
  {
    path: "/error",
    name: "error",
    component: ErrorPage,
    props: (route) => ({
      error_status: route.query.error_status,
      error_message: route.query.error_message,
    }),
    beforeEnter: (to, from, next) => {
      const defaultStatus = "404 Not Found";
      const defaultMessage = "Request failed with status code 404";
      if (
        (to.query.error_status && to.query.error_message) ||
        (to.query.error_status === defaultStatus &&
          to.query.error_message === defaultMessage)
      ) {
        next();
      } else {
        next({
          path: "/error",
          query: { error_status: defaultStatus, error_message: defaultMessage },
        });
      }
    },
  },
  {
    path: "/:catchAll(.*)",
    redirect: "error",
  },
  {
    path: "/DefaultPage",
    name: "DefaultPage",
    component: DefaultPage,
  },
  {
    path: "/Thx",
    name: "Thx",
    component: Thx,
  },

  //360 Degree Path ----------------------------------------------------------------
  {
    path: "/360Homepage",
    name: "HomePage",
    component: HomePage,
  },
  {
    path: "/360Degree",
    name: "360Degree",
    component: Degree,
    props: (route) => ({
      committeeName: route.query.committeeName,
      committeeId: route.query.committeeId,
    }),
  },

  // Quiz Path ----------------------------------------------------------------
  {
    path: "/User",
    name: "User",
    component: User,
  },
  {
    path: "/Ready",
    name: "Ready",
    component: Ready,
  },
  {
    path: "/QRCode",
    name: "QRCode",
    component: QRCode,
  },
  {
    path: "/Question",
    name: "Question",
    component: Question,
  },
  {
    path: "/RankingBoard",
    name: "RankingBoard",
    component: RankingBoard,
  },
  {
    path: "/Waiting",
    name: "Waiting",
    component: Waiting,
  },
  {
    path: "/Answer",
    name: "Answer",
    component: Answer,
  },

  //Engagement Path -------------------------------------------------------------
  {
    path: "/survey",
    name: "survey",
    component: SurveyPage,
  },
  {
    path: "/information",
    name: "preinformation",
    component: PreInformationPage,
  },
  {
    path: "/ShortQuiz",
    name: "ShortQuiz",
    component: ShortQuiz,
  },
  {
    path: "/:catchAll(.*)",
    redirect: "error",
  },
];

function updateColor(colors) {
  document.documentElement.style.setProperty(
    "--primary-color",
    colors.primaryColor
  );
  document.documentElement.style.setProperty(
    "--secondary-color",
    colors.secondaryColor
  );
  document.documentElement.style.setProperty(
    "--tertiary-color",
    colors.tertiaryColor
  );
  document.documentElement.style.setProperty(
    "--quaternary-color",
    colors.quaternaryColor
  );
  document.documentElement.style.setProperty(
    "--quinary-color",
    colors.quinaryColor
  );
  document.documentElement.style.setProperty(
    "--senary-color",
    colors.senaryColor
  );
  document.documentElement.style.setProperty(
    "--septenary-color",
    colors.septenaryColor
  );
  document.documentElement.style.setProperty(
    "--octonary-color",
    colors.octonaryColor
  );
  document.documentElement.style.setProperty("--nonary-color", colors.nonary);
  document.documentElement.style.setProperty(
    "--denary-color",
    colors.denaryColor
  );
  document.documentElement.style.setProperty(
    "--font-primary-color",
    colors.fontColorPrimary
  );
  document.documentElement.style.setProperty(
    "--font-secondary-color",
    colors.fontColorSecondary
  );
}

const public_path = ["home", "verify", "error"];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (
    getStorage("isAuthenticated") === "false" &&
    !public_path.includes(to.name)
  ) {
    next({ name: "verify" });
  } else {
    next();
  }
});

export default router;
