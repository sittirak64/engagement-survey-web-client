<template>
    <header>
        <AppHeader />
    </header>
    <main>
        <Background />
        <article>
            <RankingBoardComponent/>
        </article>
    </main>
</template>
<script>
import RankingBoardComponent from "../../components/QuizComponent/LiveQuestion/RankingBoardComponent.vue" 

export default {
    name: 'RankingBoard',
    components: {
        RankingBoardComponent
    }
}
</script>