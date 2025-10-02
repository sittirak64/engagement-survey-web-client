<template>
    <div class="container-fluid">
        <FireWork />
        <div class="main-content">
            <table class="group">
                <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Score</th>
                </tr>
                <tr v-for="data in scoreUser" :key="data.name">
                    <td>{{ data.rank }}</td>
                    <td>{{ data.name }}</td>
                    <td>{{ data.score }}</td>
                </tr>
                <th></th>
                <button class="button-close" @click="Close">
                    Close
                </button>
                <th></th>
            </table>
        </div>
    </div>
</template>

<script>
import { useRouter } from 'vue-router';
import QuizServiceApi from '/src/services/QuizServiceApi.js';
import FireWork from '../../GlobalComponent/FireWork.vue';
import { ref, onMounted, onUnmounted } from 'vue';

export default {
    name: 'RankingBoardComponent',
    components: {
        FireWork
    },
    setup() {
        const scoreUser = ref([]);
        const router = useRouter();

        const fetchScore = async () => {
            const questionSetId = sessionStorage.getItem('questionSetId');
            const sessionId = sessionStorage.getItem('sessionId');
            if (questionSetId && sessionId) {
                const response = await QuizServiceApi.listScoreBoard(questionSetId, sessionId);
                scoreUser.value = response.data.objectValue;
            }
        };

        const Close = async () => {
            router.push({ path: '/Thx' });
        };

        let pollingInterval = null;

        onMounted(() => {
            pollingInterval = setInterval(() => {
                fetchScore();
            }, 500);
        });

        onUnmounted(() => {
            if (pollingInterval) {
                clearInterval(pollingInterval);
            }
        });

        return {
            scoreUser,
            Close
        };
    }
};
</script>

<style scoped>
.main-content {
    position: absolute;
    display: flex;
    justify-content: center;
    width: calc(30% + 200px);
    gap: 5%;
    margin-top: 5%;
    border: 1px solid #fff;
}

table {
    background-color: #fff;
}

table tr:nth-child(odd) {
    background-color: #d9d9d9;
}

table tr:nth-child(even) {
    background-color: #ffff;
}

table th {
    background-color: #fff;
    margin-top: 20px;
    border-radius: 5px;
    width: 878px;
    height: 10vh;
    text-align: center;
    border-bottom: 1px solid #000;
}

table td {
    background-color: inherit;
    text-align: center;
}


.group {
    position: relative;
    font-size: 30px;
    gap: 15px;
    font-family: "Carnac", Arial;
    text-align: center;
}

.button-close {
    position: relative;
    font-size: 20px;
    color: #ffffff;
    background-color: #000;
    border-radius: 8px;
    margin-top: 20px;
    width: 154px;
    height: 40px;
    border: none;

}

.button-close:hover {
    background-color: #000000;
    border: none;
    opacity: 70%;
}
</style>
