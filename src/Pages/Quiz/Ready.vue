<template>
    <header>
        <AppHeader />
    </header>
    <main>
        <Background />
        <article>
            <ReadyComponent/>
        </article>
    </main>
</template>
<script>
import ReadyComponent from '../../components/QuizComponent/LiveQuestion/ReadyComponent.vue';
 export default {
        name: 'Ready',
        components:{
            ReadyComponent,
        },
    }
</script>