<template>
    <header>
        <AppHeader />
      </header>
      <main>
        <Background/>
        <AnswerForm />
      </main>
    </template>


    <script>
      import AnswerForm from '../../components/QuizComponent/User/AnswerForm.vue';

    
    export default {
        name: 'Answer',
        components:{
            AnswerForm,
        },
    }
    </script>