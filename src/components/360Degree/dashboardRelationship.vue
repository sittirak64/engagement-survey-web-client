<template>
    <div class="container-main-wrapper">
        <div v-for="(item, index) in dataList" :key="index" class="container-main"
            :class="{ 'true': item.status, 'false': !item.status }">
            <div class="layout">
                <div class="script">
                    <p>{{ item.title }}</p>
                    <p class="color-text">{{ item.description }}</p>
                </div>
                <div class="position-icon">
                    <!-- icon -->
                    <div v-if="!isMobileView">
                        <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="5" y="5" width="23" height="23" rx="5"
                                :fill="item.status ? '#28A745' : '#DC3545'" />
                            <path
                                d="M21 31.5C21 30.6716 21.6716 30 22.5 30H25.5C27.9853 30 30 27.9853 30 25.5V22.5C30 21.6716 30.6716 21 31.5 21C32.3284 21 33 21.6716 33 22.5V28C33 30.7614 30.7614 33 28 33H22.5C21.6716 33 21 32.3284 21 31.5Z"
                                :fill="item.status ? '#28A745' : '#DC3545'" />
                            <path
                                d="M31.5 12C30.6716 12 30 11.3284 30 10.5L30 7.5C30 5.01472 27.9853 3 25.5 3L22.5 3C21.6716 3 21 2.32843 21 1.5C21 0.671573 21.6716 -9.8303e-07 22.5 -1.01924e-06L28 -3.0598e-07C30.7614 -4.26685e-07 33 2.23858 33 5L33 10.5C33 11.3284 32.3284 12 31.5 12Z"
                                :fill="item.status ? '#28A745' : '#DC3545'" />
                            <path
                                d="M12 1.5C12 2.32843 11.3284 3 10.5 3L7.5 3C5.01472 3 3 5.01472 3 7.5L3 10.5C3 11.3284 2.32843 12 1.5 12C0.671572 12 -1.01239e-06 11.3284 -1.08481e-06 10.5L-6.11959e-07 5C-8.53371e-07 2.23858 2.23857 2.76072e-06 5 2.51931e-06L10.5 2.03848e-06C11.3284 1.96606e-06 12 0.671575 12 1.5Z"
                                :fill="item.status ? '#28A745' : '#DC3545'" />
                            <path
                                d="M1.5 21C2.32843 21 3 21.6716 3 22.5L3 25.5C3 27.9853 5.01472 30 7.5 30L10.5 30C11.3284 30 12 30.6716 12 31.5C12 32.3284 11.3284 33 10.5 33L5 33C2.23858 33 -4.26685e-07 30.7614 -3.0598e-07 28L-6.55671e-08 22.5C-2.93554e-08 21.6716 0.671573 21 1.5 21Z"
                                :fill="item.status ? '#28A745' : '#DC3545'" />
                        </svg>
                    </div>
                    <div v-else>
                        <svg width="20" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="5" y="5" width="23" height="23" rx="5"
                                :fill="item.status ? '#28A745' : '#DC3545'" />
                            <path
                                d="M21 31.5C21 30.6716 21.6716 30 22.5 30H25.5C27.9853 30 30 27.9853 30 25.5V22.5C30 21.6716 30.6716 21 31.5 21C32.3284 21 33 21.6716 33 22.5V28C33 30.7614 30.7614 33 28 33H22.5C21.6716 33 21 32.3284 21 31.5Z"
                                :fill="item.status ? '#28A745' : '#DC3545'" />
                            <path
                                d="M31.5 12C30.6716 12 30 11.3284 30 10.5L30 7.5C30 5.01472 27.9853 3 25.5 3L22.5 3C21.6716 3 21 2.32843 21 1.5C21 0.671573 21.6716 -9.8303e-07 22.5 -1.01924e-06L28 -3.0598e-07C30.7614 -4.26685e-07 33 2.23858 33 5L33 10.5C33 11.3284 32.3284 12 31.5 12Z"
                                :fill="item.status ? '#28A745' : '#DC3545'" />
                            <path
                                d="M12 1.5C12 2.32843 11.3284 3 10.5 3L7.5 3C5.01472 3 3 5.01472 3 7.5L3 10.5C3 11.3284 2.32843 12 1.5 12C0.671572 12 -1.01239e-06 11.3284 -1.08481e-06 10.5L-6.11959e-07 5C-8.53371e-07 2.23858 2.23857 2.76072e-06 5 2.51931e-06L10.5 2.03848e-06C11.3284 1.96606e-06 12 0.671575 12 1.5Z"
                                :fill="item.status ? '#28A745' : '#DC3545'" />
                            <path
                                d="M1.5 21C2.32843 21 3 21.6716 3 22.5L3 25.5C3 27.9853 5.01472 30 7.5 30L10.5 30C11.3284 30 12 30.6716 12 31.5C12 32.3284 11.3284 33 10.5 33L5 33C2.23858 33 -4.26685e-07 30.7614 -3.0598e-07 28L-6.55671e-08 22.5C-2.93554e-08 21.6716 0.671573 21 1.5 21Z"
                                :fill="item.status ? '#28A745' : '#DC3545'" />
                        </svg>
                    </div>
                </div>
            </div>
            <div class="count-member">
                <h3>{{ item.member }}</h3>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onUnmounted, onMounted } from 'vue';

export default {
    name: 'requestSupervisor',
    props: {
        dataDashboard: {
            type: Object,
            required: true,
            default: () => ({
                supervisor: { member: 0, status: false },
                peer: { member: 0, status: false },
                subordinates: { member: 0, status: false },
            }),
        },
    },
    setup(props) {
        const supervisorData = computed(() => props.dataDashboard.supervisor || { member: 0, status: false });
        const peerData = computed(() => props.dataDashboard.peers || { member: 0, status: false });
        const subordinatesData = computed(() => props.dataDashboard.subordinates || { member: 0, status: false });


        const dataList = computed(() => [
            {
                title: 'Supervisor',
                description: 'minimum 1 person',
                member: supervisorData.value.member || 0,
                status: supervisorData.value.status || false,
            },
            {
                title: 'Peer',
                description: 'minimum 3 persons',
                member: peerData.value.member || 0,
                status: peerData.value.status || false,
            },
            {
                title: 'Subordinates',
                description: 'minimum 3 persons',
                member: subordinatesData.value.member || 0,
                status: subordinatesData.value.status || false,
            },
        ]);
        const isMobileView = ref(window.innerWidth <= 580);

        const handleResize = () => {
            isMobileView.value = window.innerWidth <= 580;
        };

        onMounted(async () => {
            window.addEventListener('resize', handleResize);
        });
        onUnmounted(() => {
            window.removeEventListener('resize', handleResize);
        });
        return {
            supervisorData,
            peerData,
            subordinatesData,
            dataList,
            isMobileView
        };
    },
};


</script>


<style scoped>
.container-main {
    position: relative;
    background-color: #ffffff;
    width: 220px;
    height: 120px;
    border-radius: 18px;
    flex: 1 1 calc(30% - 20px);
    margin: 10px;
}

.container-main-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: space-around;
}

.layout {
    font-size: 0.8vw;
    text-align: left;
    display: flex;
    justify-content: space-between;
}

.script {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    margin-top: 10px;
    margin-left: 10px;

    p {
        margin: 0;
    }
}

.color-text {
    color: #6C757D;
}

.position-icon {
    position: relative;
    padding: 12px 12px 5px 5px;
    padding-left: 20px;
}

.count-member {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-left: 15px;
    margin-top: 20px;

    h3 {
        font-weight: bold;
        font-size: 1.5vw;
    }
}

@media only screen and (max-width: 768px) {

    .layout {
        font-size: 1.4vw;
    }

    .count-member {
        h3 {
            font-size: 3vw;
        }
    }
}

@media only screen and (max-width: 580px) {
    .container-main-wrapper {
        display: grid;
        gap: 0;
    }

    .container-main {
        position: relative;
        background-color: #ffffff;
        width: 95vw;
        height: 90px;
        border-radius: 18px;
        flex: 1 1 calc(30% - 20px);
        margin: 5px;
    }

    .count-member {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-right: 15px;
        margin-top: 0px;

        h3 {
            font-weight: bold;
            font-size: 3vw;
        }
    }

    .layout {
        /* font-size: 4vw; */
        font-weight: bold;
    }

    .script {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        margin-top: 10px;
        margin-left: 10px;

        p {
            margin: 0;
            font-size: 3vw;
        }
    }

    .position-icon {
        position: relative;
        padding: 12px 12px 5px 5px;
        bottom: 0;
        padding-left: 20px;
    }

}
</style>