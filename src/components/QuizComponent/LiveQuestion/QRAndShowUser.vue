<template>
    <div class="container-object">
        <div class="box-icon">
            <div class="icon-count">
                <i class="bi bi-person-fill"></i>
                <p>{{ userCount }}</p>
            </div>
        </div>
        <div class="container">
            <div class="title">
                <h1>Scan this</h1>
            </div>
            <div class="showQR-box">
                <img v-if="qrCodeUrl" :src="qrCodeUrl" alt="QR Code" />
            </div>
            <div class="showUser">
                <p class="box-name" v-for="(user, index) in displayedUsers" :key="user.respondentId">
                    {{ user.respondentName }}
                </p>
                <p v-if="users.length > 30" class="box-name">...... + {{ users.length - 30 }} more</p>
            </div>
            <button type="button"  
                :class="{ 'disabled-btn': userCount === 0, 'btn-start': userCount > 0 }" @click="StartQuiz"> Start
            </button>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import QuizServiceApi from '/src/services/QuizServiceApi.js';

export default {
    name: "QRAndShowUser",

    setup() {
        const router = useRouter();
        const users = ref([]);
        const qrCodeUrl = ref('');

        // Count User
        const userCount = computed(() => users.value.length);

        // Show only the first 30 users
        const displayedUsers = computed(() => users.value.slice(0, 30));


        const fetchQRCode = async () => {
            const link = sessionStorage.getItem("Link")
            const params = {
                text: link,
                qrSize: 400,
                fileType: 'png'
            };
            const response = await QuizServiceApi.genQRcode(params);
            qrCodeUrl.value = `data:image/png;base64,${response.data}`;
        };

        const fetchUsers = async () => {
            const questionSetId = sessionStorage.getItem('questionSetId');
            const sessionId = sessionStorage.getItem('sessionId');
            if (questionSetId) {
                const response = await QuizServiceApi.memberQuiz(questionSetId, sessionId);
                users.value = response.data.objectValue;
            }
        };  

        let pollingInterval = null;

        onMounted(() => {
            fetchUsers();
            fetchQRCode();
            pollingInterval = setInterval(() => {
                fetchUsers();
            }, 500);
        });

        onUnmounted(() => {
            if (pollingInterval) {
                clearInterval(pollingInterval);
            }
        });

        const StartQuiz = async () => {

            const sortOrder = 1;
            sessionStorage.setItem('sortOrder', sortOrder);

            router.push({ path: '/Ready' });
        };

        return {
            StartQuiz,
            userCount,
            users,
            displayedUsers,
            qrCodeUrl
        };
    }
}
</script>


<style scoped>
.container-object {
    position: relative;
    display: flex;
    top: 8vh;
    height: 90vh;
    width: 100%;
    justify-content: center;
    overflow-y: scroll; 
}

.container-object::-webkit-scrollbar {
    display: none; 
}
.container-object {
    scrollbar-width: none; 
}


.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: auto; 
    justify-content: flex-start; 
}

.title {
    display: flex;
    position: relative;
    /* top: 4vh; */
    justify-content: center;
    width: 100%;
}

.btn-start {
    font-size: 25px;
    font-weight: bold;
    height: 50px;
    width: 275px;
    border: none;
    border-radius: 10px;
    background-color: #D1EC51;
    color: #000000;
    margin-top: 20px;
}

.disabled-btn {
    font-size: 25px;
    font-weight: bold;
    height: 50px;
    width: 275px;
    border: none;
    border-radius: 10px;
    background-color: #858585;
    color: #000000;
    margin-top: 20px;
}

h1 {
    font-size: 5vh;
    color: #ffffff;
    font-weight: bold;
    padding-top: 3%;
}

.box-name {
    color: #ffffff;
    width: 10vw;
    height: 70px;
    border-radius: 8px;
    font-size: 2vh;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #0C9996;
}

.showQR-box {
    position: relative;
    top: 5px;
    margin: 4vh;
    background-color: #ffffff;
}

.icon {
    font-size: 300px;
    color: #fff;
}

.icon-count p {
    position: absolute;
    display: flex;
    top: 60%;
    right: 0;
    font-size: 15px;
    width: 30px;
    height: 30px;
    color: #fff;
    background-color: #E94646;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
}

.icon-count {
    position: fixed;
    top: 8%;
    right: 30px;
    font-size: 50px;
    color: #fff;
}

.showUser {
    display: flex;
    flex-wrap: wrap;
    padding-top: 5%;
    gap: 20px;
    justify-content: center;
    width: 100%;
}
</style>
