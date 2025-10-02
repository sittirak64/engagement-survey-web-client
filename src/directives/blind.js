export default {
  mounted(el, binding) {
    if (binding.value) {
      el.classList.add('blind');
    } else {
      el.classList.remove('blind');
    }
  },
  updated(el, binding) {
    if (binding.value) {
      el.classList.add('blind');
    } else {
      el.classList.remove('blind');
    }
  }
}
