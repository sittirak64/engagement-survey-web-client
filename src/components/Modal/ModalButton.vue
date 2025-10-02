<template>
  <button :class="buttonClass" @click="handleClick">
    {{ label }}
  </button>
</template>

<script setup>
import { computed, toRefs } from 'vue';

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: 'OK',
  },
  onClick: {
    type: Function,
    default: () => { },
  },
});

const { type, label, onClick } = toRefs(props);

const buttonClass = computed(() => {
  switch (type.value) {
    case 'success':
      return 'btn btn-success';
    case 'error':
      return 'btn btn-error';
    case 'warning':
      return 'btn btn-warning';
    case 'confirm':
      return 'btn btn-confirm';
    case 'cancel':
      return 'btn btn-cancel';
    case 'info':
      return 'btn btn-info';
    default:
      return 'btn btn-default';
  }
});

const handleClick = () => {
  onClick.value();
};
</script>

<style scoped>
.btn-success {
  background-color: #28a745;
  color: #ffffff;
}

.btn-error {
  background-color: #dc3545;
  color: #ffffff;
  opacity: 100%;

}

.btn-error:hover {
  background-color: #dc3545;
  color: #ffffff;
  opacity: 70%;

}

.btn-warning {
  background-color: #ffc107;
  color: #ffffff;
  opacity: 100%;

}

.btn-warning:hover {
  background-color: #ffc107;
  color: #ffffff;
  opacity: 70%;

}

.btn-confirm {
  background-color: #17A2B8;
  color: #ffffff;
  margin-left: 5%;
  opacity: 100%;

}

.btn-confirm:hover {
  background-color: #17a2b8;
  color: #ffffff;
  margin-left: 5%;
  opacity: 70%;

}

.btn-cancel {
  color: var(--septenary-color);
  border-color: var(--septenary-color);
  background-color: rgb(255, 255, 255);
  opacity: 100%;

}

.btn-cancel:hover {
  color: var(--septenary-color);
  border-color: var(--septenary-color);
  background-color: rgb(255, 255, 255);
  opacity: 70%;

}

.btn-info {
  background-color: #0d6efd;
  color: #ffffff;
  opacity: 100%;
}

.btn-info:hover {
  background-color: #0d6efd;
  color: #ffffff;
  opacity: 70%;
}


.btn-default {
  background-color: #6c757d;
  color: #ffffff;
}

@media only screen and (min-width: 769px){

.btn {
  border-radius: 5px;
  font-size: 16px;
  width: 157px;
  height: 40px;
}

}

@media only screen and (max-width: 768px){

.btn {
  border-radius: 5px;
  font-size: 16px;
  width: 140px;
  height: 35px;
}

}

@media only screen and (max-width: 580px){

.btn {
  border-radius: 5px;
  font-size: 13px;
  width: 90px;
  height: 30px;
}

}
</style>