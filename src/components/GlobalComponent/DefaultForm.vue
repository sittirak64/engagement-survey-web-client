<template>
  <div class="thankyou-container">
    <h1>Thank You!</h1>
    <h3>Your feedback is greatly appreciated and will help us improve your organization.</h3>
  </div>
</template>

<script>
  export default {
    name: 'ThankYouPage'
  }
</script>

<style scoped>

@media only screen and (min-width: 769px) {
  .thankyou-container {
    display: flex;
    justify-content: center;
    align-items: center; 
    flex-direction: column;
    gap: 1.5%;
    height: 100vh;
    width: 100%;
    background-image: url('/src/assets/images/bakertilly-bg.png');
    background-position: right bottom;
    background-repeat: no-repeat;
    background-size: cover;
    padding: 20px;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.5); /* Add a subtle overlay */
  }

  .thankyou-container h1 {
    font-size: calc(2em + 5vw);
    color: #ffffff; 
    font-weight: bold;
    margin-bottom: 20px;
  }

  .thankyou-container h3 {  
    font-size: calc(1.3em + 1.1vw);
    color: #FFFFFF; 
    max-width: 80%;
  }
}

@media only screen and (max-width: 768px) {
  .thankyou-container {
    display: flex;
    justify-content: center;
    align-items: center; 
    flex-direction: column;
    gap: 1.5%;
    height: 100vh;
    width: 100%;
    background-image: url('/src/assets/images/bakertilly-bg.png');
    background-position: right bottom;
    background-repeat: no-repeat;
    background-size: cover;
    padding: 20px;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.5); /* Add a subtle overlay */
  }

  .thankyou-container h1 {
    font-size: calc(2em + 5vw);
    color: #ffffff; 
    font-weight: bold;
    margin-bottom: 20px;
  }

  .thankyou-container h3 {  
    font-size: calc(1.3em);
    color: #FFFFFF; 
    max-width: 80%;
  }

 
}

@media only screen and (max-width: 580px) {
  .thankyou-container {
    display: flex;
    justify-content: center;
    align-items: center; 
    flex-direction: column;
    gap: 1.5%;
    height: 100vh;
    width: 100%;
    background-image: url('/src/assets/images/bakertilly-bg.png');
    background-position: right bottom;
    background-repeat: no-repeat;
    background-size: cover;
    padding: 20px;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.5); /* Add a subtle overlay */
  }

  .thankyou-container h1 {
    font-size: calc(2em + 5vw);
    color: #ffffff; 
    font-weight: bold;
    margin-bottom: 20px;
  }

  .thankyou-container h3 {  
    font-size: calc(1em);
    color: #FFFFFF; 
    max-width: 80%;
  }
}

</style>
