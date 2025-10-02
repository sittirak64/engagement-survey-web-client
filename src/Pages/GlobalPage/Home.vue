<template>
  <header>
    <AppHeader/>
  </header>
  <main>
    <h1 @click="redirectToVerify">Hello World!</h1>
  </main>
</template>

<script>
import { useRouter } from 'vue-router';
  export default {
    name: 'HomePage',

    setup() {
      const router = useRouter();
      const redirectToVerify = () => {
        router.push('/verify');
      };

      return {
        redirectToVerify
      };
    },
  };
</script>