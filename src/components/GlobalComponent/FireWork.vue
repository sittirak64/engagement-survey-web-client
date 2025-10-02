<template>
  <canvas id="canvas" ref="canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const canvas = ref(null);
let ctx;
let cx, cy;
let confetti = [];
const confettiCount = 100;
const gravity = 0.5;
const terminalVelocity = 5;
const drag = 0.055;
const colors = [
  { front: 'red', back: 'darkred' },
  { front: 'green', back: 'darkgreen' },
  { front: 'blue', back: 'darkblue' },
  { front: 'yellow', back: 'darkyellow' },
  { front: 'orange', back: 'darkorange' },
  { front: 'pink', back: 'darkpink' },
  { front: 'purple', back: 'darkpurple' },
  { front: 'turquoise', back: 'darkturquoise' },
];

const randomRange = (min, max) => Math.random() * (max - min) + min;

const initConfetti = () => {
  for (let i = 0; i < confettiCount; i++) {
    confetti.push({
      color: colors[Math.floor(randomRange(0, colors.length))],
      dimensions: {
        x: randomRange(10, 20),
        y: randomRange(10, 30),
      },
      position: {
        x: randomRange(0, canvas.value.width),
        y: randomRange(-canvas.value.height, 0), 
      },
      rotation: randomRange(0, 2 * Math.PI),
      scale: {
        x: 1,
        y: 1,
      },
      velocity: {
        x: randomRange(-5, 5), 
        y: randomRange(2, 5),
      },
    });
  }
};

const render = () => {
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

  confetti.forEach((confetto, index) => {
    let width = confetto.dimensions.x * confetto.scale.x;
    let height = confetto.dimensions.y * confetto.scale.y;

    ctx.translate(confetto.position.x, confetto.position.y);
    ctx.rotate(confetto.rotation);

    confetto.velocity.x -= confetto.velocity.x * drag;
    confetto.velocity.y = Math.min(confetto.velocity.y + gravity, terminalVelocity);
    confetto.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();

    confetto.position.x += confetto.velocity.x;
    confetto.position.y += confetto.velocity.y;

    if (confetto.position.y >= canvas.value.height) {
      confetto.position.y = randomRange(-canvas.value.height, 0);
      confetto.position.x = randomRange(0, canvas.value.width); 
    }

    if (confetto.position.x > canvas.value.width) confetto.position.x = 0;
    if (confetto.position.x < 0) confetto.position.x = canvas.value.width;

    confetto.scale.y = Math.cos(confetto.position.y * 0.1);
    ctx.fillStyle = confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;

    ctx.fillRect(-width / 2, -height / 2, width, height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  });

  if (confetti.length <= 10) initConfetti();

  window.requestAnimationFrame(render);
};

const resizeCanvas = () => {
  canvas.value.width = window.innerWidth;
  canvas.value.height = window.innerHeight;
  cx = ctx.canvas.width / 2;
  cy = ctx.canvas.height / 2;
};

onMounted(() => {
  const canvasEl = canvas.value;
  ctx = canvasEl.getContext('2d');
  canvasEl.width = window.innerWidth;
  canvasEl.height = window.innerHeight;
  cx = ctx.canvas.width / 2;
  cy = ctx.canvas.height / 2;

  initConfetti();
  render();

  window.addEventListener('resize', resizeCanvas);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCanvas);
});
</script>

<style>
body {
  overflow: hidden;
  margin: 0;
  background: linear-gradient(to bottom, skyblue, dodgerblue);
}
canvas {
  display: block;
}
</style>
