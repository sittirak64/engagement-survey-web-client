<template>
  <div class="mainLayout">
    <header>
      <AppHeader/>
    </header>
    <main>
      <DefaultForm/>
    </main>
  </div>
</template>

<script>
import DefaultForm from '/src/components/GlobalComponent/DefaultForm.vue';

export default {
  name: 'DefaultPage',
  components: {
    DefaultForm
  }
}
</script>
