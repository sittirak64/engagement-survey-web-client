<template>
    <header>
        <AppHeader />
    </header>
    <main>
        <Background />
        <article>
            <QuestionQuiz/>
        </article>
    </main>
</template>
<script>
import QuestionQuiz from '../../components/QuizComponent/LiveQuestion/QuestionQuiz.vue';

export default {
    name: 'Question',
    components :{
        QuestionQuiz,
    }
}
</script>
<style scoped>

</style>