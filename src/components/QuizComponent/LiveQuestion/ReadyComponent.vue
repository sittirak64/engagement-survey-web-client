<template>
  <div class="container-fluid">
    <div v-if="ready" class="box-time">
      <h1 v-if="countdown === 4">Ready</h1>
      <h1 v-else>{{ countdown }}</h1>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "ReadyComponent",
  setup() {
    const ready = ref(false);
    const countdown = ref(4); 
    const router = useRouter();
    const interval = ref(null);

    const startCountdown = () => {
      ready.value = true;

      interval.value = setInterval(() => {
        if (countdown.value > 1) {
          countdown.value--;
        } else {
          clearInterval(interval.value);
          localStorage.removeItem("Link");
          router.push({
            path: '/Question', 
          });
        }
      }, 1000);
    };

    onMounted(() => {
      startCountdown(); 
    });

    onUnmounted(() => {
      if (interval.value) {
        clearInterval(interval.value); 
      }
    });

    return {
      ready,
      countdown,
    };
  },
};
</script>

<style scoped>
.container-fluid {
  display: flex;
  padding-top: 68px;
  height: 100vh;
  width: 100%;
  position: fixed;
  justify-content: center;
}

.box-time {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80%;
  width: 30%;
}

.box-time h1 {
  font-size: 120px;
  color: #ffffff;
}
</style>
