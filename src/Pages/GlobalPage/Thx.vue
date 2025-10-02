<template>
  <div class="mainLayout">
    <header>
      <AppHeader/>
    </header>
    <main>
      <ThxFrom/>
    </main>
  </div>
</template>

<script>
import ThxFrom from '/src/components/GlobalComponent/ThxFrom.vue';

export default {
  name: 'Thx',
  components: {
    ThxFrom
  }
}
</script>
