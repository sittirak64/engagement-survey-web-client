<template>
  <div class="mainLayout">
    <header>
      <AppHeader />
      <!-- <ButtonLangauge /> -->
    </header>
    <main>
      <VerifyMobileForm />
    </main>
  </div>
</template>
  
<script>
import VerifyMobileForm from '../../components/GlobalComponent/VerifyMobileForm.vue';

export default {
  name: 'VerifyMobile',
  components: {
    VerifyMobileForm
  },
};
</script>