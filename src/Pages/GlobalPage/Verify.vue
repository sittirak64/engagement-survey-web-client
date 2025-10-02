<template>
  <div class="mainLayout">
    <header>
      <AppHeader />
      <!-- <ButtonLangauge /> -->
    </header>
    <main>
      <VerifyForm />
    </main>
  </div>
</template>
  
<script>
import VerifyForm from '../../components/GlobalComponent/VerifyForm.vue';

export default {
  name: 'VerifyPage',
  components: {
    VerifyForm
  },
};
</script>