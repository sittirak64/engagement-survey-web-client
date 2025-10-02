<template>
    <header>
        <AppHeader />
    </header>
    <main>
        <Background />
        <QRAndShowUser/>
    </main>
</template>
<script>
import QRAndShowUser from '../../components/QuizComponent/LiveQuestion/QRAndShowUser.vue';

export default {
    name: 'QRCode',
    components :{
        QRAndShowUser
    }
}
</script>
<style scoped>

</style>