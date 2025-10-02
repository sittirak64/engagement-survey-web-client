<template>
  <div class="mainLayout">
    <header>
      <AppHeader/>
    </header>
    <main>
      <Assessment :committeeName="committeeName" :committeeId="committeeId" />
    </main>
  </div>
</template>

<script>
import Assessment from '/src/components/360Degree/Assessment.vue';


export default {
  name: '360Degree',
  components: {
    Assessment
  },
  props: ['committeeName','committeeId'],
}
</script>
