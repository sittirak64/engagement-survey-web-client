<template>
  <div class="error-container   ">
    <h1>Opps!</h1>
    <h3>{{ error_status }}</h3>
    <p>{{ error_message }}</p>
    <div class="btn-container">
      <button class="btn btn-secondary bg-septenary" @click="handleChange">
        Back&nbsp;to&nbsp;Home
      </button>
    </div>
  </div>
</template>

<script>
  import { useRouter } from 'vue-router';

  export default {
    name: 'ErrorComponent',
    props: {
      error_status: {
        type: String,
        required: true
      },
      error_message: {
        type: String,
        required: true
      }
    },
    setup() {
      const router = useRouter();

      const handleChange = () => {
        router.push('/');
      }
      return {
        handleChange
      }
    }
  }
</script>

<style scoped>
  .error-container{
    display: flex;
    justify-content: center;
    align-items: center; 
    flex-direction: column;
    gap: 2%;
    height: 100%;
    width: 100%;
    background-image: url('/src/assets/images/bakertilly-bg.png');
    background-position: right bottom;
    background-repeat: no-repeat;
    background-size: cover;
  }

  .error-container h1{
    font-size: calc(1.5em + 9vw);
    color: white;
    font-weight: bold;
  }

  .error-container h3{  
    font-size: calc(1.5em + 2vw);
    color: white;
    font-weight: bold;
  }

  .error-container p{
    font-size: calc(0.5em + 1vw);
    color: white;
  }

  .btn-container{
    width: calc(25% + 40px);
    padding: 10px 0 10px 0;
  }

  .btn-secondary {
    border: 0;
    color:black;
    width: 100%;
  }
</style>