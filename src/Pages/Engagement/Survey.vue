<template>
  <div class="mainLayout">
    <header>
      <AppHeader/>
    </header>
    <main>
      <QuestionSurveyItem/>
    </main>
  </div>
</template>

<script>
import QuestionSurveyItem from '/src/components/Engagement/QuestionSurveyItem.vue';

export default {
  name: 'SurveyPage',
  components: {
    QuestionSurveyItem
  },
}
</script>
