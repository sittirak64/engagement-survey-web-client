<template>
    <div ref="wordCloud" class="word-cloud-container"></div>
</template>
 
<script setup>
import { onMounted, ref, watch } from 'vue'
import * as d3 from 'd3'
import cloud from 'd3-cloud'
import { defineProps } from 'vue'
 
// Define props to receive data from the parent component
const props = defineProps({
    words: {
        type: Array,
        required: true,
        default: () => []
    }
});
 
const wordCloud = ref(null)
 
onMounted(() => {
    createWordCloud(props.words)
})
 
// Debounce function to limit how often the word cloud redraws
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}
 
// Watch for changes in the words prop and redraw the word cloud
watch(
    () => props.words,
    debounce((newWords) => {
        updateWordCloud(newWords);
    }, 500),
    { deep: true, immediate: true }
);
 

function getRandomColor() {
    const colors = ['#61dafb', '#e36209', '#a5d6a7', '#ff7043', '#b39ddb', '#ffca28'];
    return colors[Math.floor(Math.random() * colors.length)];
}
 
function createWordCloud(wordData) {
    const containerWidth = wordCloud.value.clientWidth;
    const containerHeight = wordCloud.value.clientHeight;

    const layout = cloud()
        .size([containerWidth, containerHeight]) 
        .words(wordData.map(d => ({ text: d.text, size: d.value })))
        .padding(15)
        .fontSize(d => Math.max(24, d.size * 5))
        .rotate(0)
        .spiral('rectangular')
        .on('end', draw);

    layout.start();

    function draw(words) {
        const svg = d3.select(wordCloud.value)
            .append('svg')
            .attr('width', containerWidth)
            .attr('height', containerHeight);

        const g = svg.append('g')
            .attr('transform', `translate(${containerWidth / 2},${containerHeight / 2})`);

        g.selectAll('text')
            .data(words)
            .enter().append('text')
            .style('font-size', d => `${d.size}px`)
            .style('fill', () => getRandomColor())
            .style('font-weight', 'bold')
            .attr('text-anchor', 'middle')
            .attr('transform', d => {
                const x = Math.min(
                    Math.max(d.x, -containerWidth / 2 + d.size), 
                    containerWidth / 2 - d.size
                );
                const y = Math.min(
                    Math.max(d.y, -containerHeight / 2 + d.size),
                    containerHeight / 2 - d.size
                );
                return `translate(${x},${y})`;
            })
            .text(d => d.text)
            .on('click', (event, d) => {
                console.log(`Clicked on word: ${d.text}`);
            });
    }
}

 
function updateWordCloud(wordData) {
    const svg = d3.select(wordCloud.value).select('svg g');

    wordData.forEach((newWord) => {
        const existingText = svg.selectAll('text').filter(d => d.text === newWord.text);

        if (!existingText.empty()) {
            const oldSize = existingText.datum().size;
            if (oldSize !== newWord.value) {
                existingText.datum().size = newWord.value;
                existingText
                    .transition()
                    .duration(600)
                    .ease(d3.easeCubicOut)
                    .style('font-size', `${Math.max(36, newWord.value * 5)}px`)
                    .attr('transform', d => `translate(${d.x},${d.y}) scale(2)`) 
                    .transition()
                    .duration(400)
                    .ease(d3.easeCubicIn)
                    .attr('transform', d => `translate(${d.x},${d.y}) scale(1)`); 
            }
        } else {
            const layout = cloud()
                .size([window.innerWidth * 0.8, window.innerHeight * 0.7])
                .words([newWord].map(d => ({ text: d.text, size: d.value })))
                .padding(10)
                .fontSize(d => Math.max(36, d.size * 2.5))
                .rotate(0)
                .spiral('rectangular')
                .on('end', draw);

            layout.start();
        }
    });

    function draw(words) {
        svg.selectAll('text')
            .data(words, d => d.text)
            .enter().append('text')
            .style('font-size', d => `${d.size}px`)
            .style('fill', () => getRandomColor())
            .style('font-weight', 'bold')
            .attr('text-anchor', 'middle')
            .attr('transform', d => `translate(${d.x},${d.y}) scale(1)`) 
            .text(d => d.text);
    }
}

</script>
 
<style scoped>
.word-cloud-container {
    position: relative;
    width: 90%;
    height: 60%;
    background: linear-gradient(to right, #ffffff, #ffffff);
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}
 
svg {
    overflow: visible;
}
 
text {
    transition: all 0.2s ease;
}
</style>