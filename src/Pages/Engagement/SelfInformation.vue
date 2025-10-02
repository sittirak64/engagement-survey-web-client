<template>
  <div class="mainLayout">
    <header>
      <AppHeader/>
    </header>
    <main>
      <SelfInformationForm/>
    </main>
  </div>
</template>

<script>
import SelfInformationForm from '/src/components/Engagement/SelfInformationForm.vue';

export default {
  name: 'SelfInformation',
  components: {
    SelfInformationForm
  },
}
</script>
