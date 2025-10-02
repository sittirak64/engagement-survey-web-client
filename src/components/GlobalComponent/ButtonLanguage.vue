<template>
  <div class="position-toggle">
    <img src="/src/assets/images/united-kingdom.png" alt="Flag" Flag class=" flag flag-left" />
    <div @click="toggleSwitch" class="toggle-switch" :class="{ active: isActive }">
      <div class="toggle-thumb"></div>
    </div>
    <img src="/src/assets/images/flag.png" alt="Thai Flag" class="flag flag-right" />
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue'

const emit = defineEmits(['update:isActive'])
const isActive = ref(false)

onMounted(() => {
  isActive.value = sessionStorage.getItem('defaultLanguage') === 'TH'
})

const toggleSwitch = () => {
  isActive.value = !isActive.value
  const defaultLanguage = isActive.value ? 'TH' : 'EN' 
  sessionStorage.setItem('defaultLanguage', defaultLanguage) 
  emit('update:isActive', isActive.value)
}

</script>


<style scoped>
.position-toggle {
  display: flex;
  align-items: center;
  position: absolute;
  top: 20px;
  right: 10px;
  z-index: 1000;
}

.toggle-switch {
  width: 50px;
  height: 25px;
  background-color: #43a7ea;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.3s;
  position: relative;
  margin: 0 10px;
}

.toggle-switch.active {
  background-color: #43a7ea;
}

.toggle-thumb {
  width: 23px;
  height: 23px;
  background-color: #fff;
  border-radius: 50%;
  position: absolute;
  top: 1px;
  left: 1px;
  transition: transform 0.3s;
}

.toggle-switch.active .toggle-thumb {
  transform: translateX(25px);
}

.flag {
  width: 24px;
  height: auto;
}

.flag-left {
  margin-right: 2px;
}

.flag-right {
  margin-left: 2px;
}
</style>
