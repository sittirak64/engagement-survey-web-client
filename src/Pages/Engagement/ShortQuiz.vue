<template>
<header>
    <AppHeader />
  </header>
  <section>
    <ShortQuizFrom />
  </section>
</template>
<script>
import ShortQuizFrom from '/src/components/Engagement/QuestionSurveyItem.vue';

export default {
    name: 'ShortQuiz',
    components:{
        ShortQuizFrom
    }
}
</script>