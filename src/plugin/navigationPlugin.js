let router = null;

export default {
  install(app, router) {
    const navigateToErrorPage = (error) => {
      let errorCode = 'Unknown Error';
      let errorMessage = 'An unexpected error occurred';

      if (error.response) {
        errorCode = `${error.response.status} ${error.response.statusText}`;
      }

      if (error.message) {
        errorMessage = error.message;
      }

      router.push({
        path: '/error', 
        query: { error_code: errorCode, error_message: errorMessage }
      });
    };

    app.provide('navigateToErrorPage', navigateToErrorPage);
  }
};
