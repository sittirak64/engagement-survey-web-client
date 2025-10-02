<template>
    <header>
        <AppHeader />
      </header>
      <main>
        <Background/>
        <EnterName />
      </main>
    </template>


    <script>
      import EnterName from '../../components/QuizComponent/User/EnterName.vue';

    
    export default {
        name: 'User',
        components:{
          EnterName,
        },
    }
    </script>