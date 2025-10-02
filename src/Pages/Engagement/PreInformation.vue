<template>
  <div class="mainLayout">
    <header>
      <AppHeader/>
    </header>
    <main>
      <PreInformationForm/>
    </main>
  </div>
</template>

<script>
import PreInformationForm from '/src/components/Engagement/PreInformationForm.vue';

export default {
  name: 'PreInformationPage',
  components: {
    PreInformationForm
  },
}
</script>
