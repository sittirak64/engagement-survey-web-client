<template>
    <header>
        <AppHeader />
      </header>
      <main>
        <Background/>
        <WaitingForm />
      </main>
    </template>


    <script>
      import WaitingForm from '../../components/QuizComponent/User/WaitingForm.vue';

    
    export default {
        name: 'Waiting',
        components:{
            WaitingForm,
        },
    }
    </script>