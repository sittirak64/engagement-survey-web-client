<template>
  <div class="mainLayout">
    <header>
      <AppHeader/>
    </header>
    <main>
      <ErrorComponent :error_status="error_status" :error_message="error_message"/>
    </main>
  </div>
</template>

<script>
import ErrorComponent from '/src/components/GlobalComponent/Error.vue';

export default {
  name: 'ErrorPage',
  components: {
    ErrorComponent
  },
  props: ['error_status','error_message'],
}
</script>
