<template>
  <header class="header-container bg-primary">
    <img v-if="imageUrl" :src="imageUrl" alt="Dynamic logo" />
    <img v-else src="/src/assets/images/bakertilly-logo.png" alt="Default logo" />
  </header>
</template>

<script>
import QuizService from "/src/services/QuizServiceApi.js";
import { ref, onMounted } from "vue";

export default {
  name: "AppHeader",

  setup() {
    const imageUrl = ref(sessionStorage.getItem("storedImageUrl"));
    const fileId = ref(sessionStorage.getItem("logoUrl"));

    const fetchImage = async () => {
      const body = {
        fileId: fileId.value,
        container: "image",
      };
      const response = await QuizService.storageImage(body);
      if (response.data.objectValue) {
        const base64Image = `data:image/png;base64,${response.data.objectValue.content}`;
        imageUrl.value = base64Image;
        sessionStorage.setItem("storedImageUrl", base64Image); 
      }
    };

    onMounted(async () => {
      if (fileId.value && !sessionStorage.getItem("storedImageUrl")) {
        await fetchImage();
      }
    });

    return {
      imageUrl,
    };
  },
};
</script>


<style scoped>
.header-container {
  display: flex;
  justify-content: start;
  padding: 0 5%;
  height: 68px;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.header-container img {
  max-height: 80%;
  width: auto;
}

.header-container:after {
  content: '';
  height: 15px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: -7.5px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
  opacity: 0.1;
}
</style>
