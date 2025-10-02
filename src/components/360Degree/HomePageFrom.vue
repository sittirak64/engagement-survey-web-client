<template>
    <div class="container-fluid">
        <div class="main-container">
            <div class="scroll">
                <div class="main-content">
                    <h1><strong> Welcome </strong></h1>
                    <h2>{{ respondentName }}</h2>
                    <div v-if="!isMobileView">
                        <p>We’re glad you're here</p>
                        <p>This is a 360-Degree Assessment that measures your </p>
                    </div>
                    <div v-else>
                        <p>We’re glad you're here This is a 360-Degree Assessment that measures your</p>
                    </div>
                    <p>capabilities working as a team!</p>
                    <div class="dashboard">
                        <dashboardRelationship :dataDashboard="dataDashboard" />
                    </div>
                </div>
                <div v-if="!isMobileView">
                    <div class="Group-Member">
                        <h3>Group Member</h3>
                        <ButtonAdd @send-request="fetchData" />
                    </div>
                    <table class="group ">
                        <tr>
                            <th>Name</th>
                            <th class="hide-on-mobile">Email</th>
                            <th>Relationship</th>
                            <th>Status</th>
                            <th>Email Sending</th>
                            <th class="hide-on-mobile"></th>
                            <th></th>
                            <th></th>
                        </tr>
                        <tr v-for="data in groupMemberList" :key="data.committeeName">
                            <td class="table-th">{{ data.committeeName }}</td>
                            <td class="table-th hide-on-mobile">{{ data.email }}</td>
                            <td class="table-th">{{ data.relationshipEn }}</td>
                            <td class="text-status table-th">
                                <StatusIcon :status="data.status" /> {{ data.status }}
                            </td>
                            <td class="table-th"> <button
                                    v-if="data.status !== 'complete' && data.status !== 'in-progress'"
                                    class="button-resend" @click="resend(data)">Resend</button>
                            </td>
                            <td class="hide-on-mobile"></td>
                            <td class="hide-on-mobile"></td>
                        </tr>
                    </table>
                    <h3>To do Assessment</h3>
                    <table class="group">
                        <tr>
                            <th>Name</th>
                            <th class="hide-on-mobile">Email</th>
                            <th class="">Type</th>
                            <th class="hide-on-mobile">Assign Date</th>
                            <th>Status</th>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                        <td class="table-th">{{ respondentName }}</td>
                        <td class="table-th hide-on-mobile"> - </td>
                        <td class="table-th">{{ selfAssessment.assessmentTagEn }}</td>
                        <td class="hide-on-mobile"> - </td>
                        <td class="text-status table-th">
                            <StatusIcon :status="selfAssessment.selfStatus" /> {{ selfAssessment.selfStatus }}
                        </td>
                        <td> <button v-if="selfAssessment.selfStatus !== 'complete'" class="button"
                                @click="click(null)">Make
                                survey</button></td>
                        <td></td>
                        <tr v-for="data in committeeGroup  " :key="data.committeeName">
                            <td class="table-th">{{ data.committeeName }}</td>
                            <td class="table-th hide-on-mobile">{{ data.email }}</td>
                            <td class="table-th">{{ data.assessmentTagEn }}</td>
                            <td class="hide-on-mobile assign-date">{{ setFormatDate(data.assignDate, null) }}</td>
                            <td class="text-status table-th">
                                <StatusIcon :status="data.status" /> {{ data.status }}
                            </td>
                            <td> <button v-if="data.status !== 'complete'" class="button" @click="click(data)">Make
                                    survey</button></td>
                            <td></td>
                        </tr>
                    </table>
                </div>
                <div v-else>
                    <!-- Group Member Section -->
                    <div class="Group-Member">
                        <h3>Group Member</h3>
                        <ButtonAdd @send-request="fetchData" />
                    </div>
                    <div class="dropdown-list">

                        <div v-for="(data, index) in groupMemberList" :key="data.committeeId" class="dropdown-item">
                            <button class="dropdown-toggle" @click="toggleGroupDropdown(index)">
                                {{ data.committeeName }}
                            </button>
                            <div v-if="activeGroupDropdown === index" class="dropdown-content">
                                <p class="box-content"><strong>Email:</strong>{{ data.email }}</p>
                                <p class="box-content"><strong>Relationship:</strong> {{ data.relationshipEn }}</p>
                                <p class="box-content">
                                    <strong>Status:</strong>
                                    <span>
                                        <StatusIcon class="text-status" :status="data.status" />
                                        {{ data.status }}
                                    </span>
                                </p>

                                <p class="box-sending"><strong>Email Sending:</strong>
                                    <button v-if="data.status !== 'complete' && data.status !== 'in-progress'"
                                        class="button-resend" @click="resend(data)">
                                        Resend
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- To Do Assessment Section -->
                    <h3>To do Assessment</h3>
                    <div class="dropdown-list">
                        <div class="dropdown-item">
                            <button class="dropdown-toggle" @click="toggleSelfDropdown">
                                {{ respondentName }}
                            </button>
                            <div v-if="activeSelfDropdown" class="dropdown-content">
                                <p class="box-content"><strong>Email:</strong> - </p>
                                <p class="box-content"><strong>Type:</strong> {{ selfAssessment.assessmentTagEn }}</p>
                                <p class="box-content"><strong>Assign Date:</strong> - </p>
                                <p class="box-content">
                                    <strong>Status:</strong>
                                    <span>
                                        <StatusIcon :status="selfAssessment.selfStatus" class="text-status" /> {{
                                            selfAssessment.selfStatus }}
                                    </span>
                                </p>
                                <button v-if="selfAssessment.selfStatus !== 'complete'" class="button"
                                    @click="click(null)">
                                    Make Survey
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="dropdown-list">
                        <div v-for="(data, index) in committeeGroup" :key="data.committeeId" class="dropdown-item">
                            <button class="dropdown-toggle" @click="toggleDropdown(index)">
                                {{ data.committeeName }}
                            </button>
                            <div v-if="activeDropdown === index" class="dropdown-content">
                                <p class="box-content"><strong>Email:</strong> {{ data.email }}</p>
                                <p class="box-content"><strong>Type:</strong> {{ data.assessmentTagEn }}</p>
                                <p class="box-content"><strong>Assign Date:</strong> {{ setFormatDate(data.assignDate, null) }}
                                </p>
                                <p class="box-content">
                                    <strong>Status:</strong>
                                    <span>
                                        <StatusIcon class="text-status" :status="data.status" />
                                        {{ data.status }}
                                    </span>
                                </p>
                                <button v-if="data.status !== 'complete'" class="button" @click="click(data)">
                                    Make Survey
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import StatusIcon from '@/components/360Degree/StatusIcon.vue';
import ApiService from '../../services/ApiService.js';
import dashboardRelationship from './dashboardRelationship.vue';
import ButtonAdd from './ButtonAdd.vue';
import { useDateFormat } from '@vueuse/core'

export default {
    name: 'HomePageForm',
    components: {
        StatusIcon,
        ButtonAdd,
        dashboardRelationship
    },
    setup() {
        const respondentName = ref('');
        const committeeName = ref('');
        const committeeId = ref('');
        const committeeGroup = ref([]);
        const groupMemberList = ref([]);
        const router = useRouter()
        const selfAssessment = ref([]);
        const dataDashboard = ref([]);
        const isMobileView = ref(window.innerWidth <= 580);
        const activeSelfDropdown = ref(false);
        const activeDropdown = ref(null);
        const activeGroupDropdown = ref(null);

        const toggleDropdown = (index) => {
            activeDropdown.value = activeDropdown.value === index ? null : index;
        };

        const toggleGroupDropdown = (index) => {
            activeGroupDropdown.value = activeGroupDropdown.value === index ? null : index;
        };

        const toggleSelfDropdown = () => {
            activeSelfDropdown.value = !activeSelfDropdown.value;
        };

        const handleResize = () => {
            isMobileView.value = window.innerWidth <= 580;
        };

        const click = (data) => {
            if (data === null) {
                committeeName.value = respondentName.value;
                committeeId.value = sessionStorage.getItem('respondentId');
            } else {
                committeeName.value = data.committeeName;
                committeeId.value = data.committeeId;
            }
            router.push({
                path: '/360Degree',
                query: {
                    committeeName: committeeName.value,
                    committeeId: committeeId.value
                }
            });
        };
        const resend = async (data) => {
            committeeId.value = data.committeeId;
            const body = {
                recipientType: "single",
                templateType: "reminder360Evaluated",
                respondentId: [committeeId.value],
                surveyId: sessionStorage.getItem('surveyId'),
                committeeId: sessionStorage.getItem('respondentId')
            };
            const response = await ApiService.getResendMail(body);
        };
        const fetchData = async () => {
            await fetchDashboard();
            await fetchCommitteeGroup();
        };

        const fetchDashboard = async () => {
            const params = {
                respondentId: sessionStorage.getItem('respondentId'),
            };
            const response = await ApiService.getCommitteeDashboard(params);
            dataDashboard.value = response.data.objectValue;
        }
        const setFormatDate = (timestamp, formatDate) => {
            const date = new Date(timestamp);
            formatDate = (formatDate == null) ? 'DD-MMM-YYYY HH:mm:ss' : formatDate
            return useDateFormat(date, formatDate).value
        };
        const fetchCommitteeGroup = async () => {
            const params = {
                respondentId: sessionStorage.getItem('respondentId'),
            };
            const response = await ApiService.get360degreeCommitteeGroup(params);
            respondentName.value = response.data.objectValue.respondentName;
            selfAssessment.value = response.data.objectValue;
            committeeGroup.value = response.data.objectValue.committeesList;
            groupMemberList.value = response.data.objectValue.groupMemberList;
        }
        let intervalId = null;
        onMounted(async () => {
            await fetchCommitteeGroup();
            await fetchDashboard();
            window.addEventListener('resize', handleResize);
            intervalId = setInterval(async () => {
                await fetchCommitteeGroup();
                await fetchDashboard();
            }, 60000);
        });
        onUnmounted(() => {
            window.removeEventListener('resize', handleResize);
            if (intervalId) {
                clearInterval(intervalId);
            }
        });
        return {
            click,
            respondentName,
            committeeGroup,
            groupMemberList,
            setFormatDate,
            selfAssessment,
            committeeId,
            committeeName,
            dataDashboard,
            resend,
            fetchData,
            isMobileView,
            toggleDropdown,
            toggleGroupDropdown,
            activeGroupDropdown,
            activeDropdown,
            toggleSelfDropdown,
            activeSelfDropdown
        };
    }
};
</script>

<style scoped>
.main-container {
    margin: 30px 30px 1px 30px;
    padding: 20px;
    border-radius: 15px;
    background-color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.main-content {
    background-color: #e0f2ef;
    border-radius: 15px;
    padding: 5px;
}

.scroll {
    overflow-y: auto;
    max-height: 100%;
}


.Group-Member {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 95vw;
}

h1,
h2 {
    display: flex;
    padding-left: 10px;
    font-size: 3.5vw;
}

h3 {
    font-size: 2vw;
    display: flex;
    padding: 10px;
    font-weight: bold;

}

p {
    display: flex;
    font-size: 1.3vw;
    padding-left: 10px;
}

table th {
    width: calc(101.5% - 30px);
    margin-top: 20px;
    border-radius: 5px;
    border-collapse: collapse;
    width: 150vw;
    height: 3vw;
    background-color: #e0f2ef;
    text-align: center;
    justify-content: center;
    font-size: 1vw;
}

.assign-date {
    text-align: center;
    width: 15%;
}

table td {
    text-align: center;
    padding-top: 10px;
    font-size: 1vw;
}

.group {
    gap: 15px;
}

.button {
    border: none;
    color: #0D6EFD;
    text-decoration: underline;
    padding-top: 15px;
    background-color: white;

}

.button-resend {
    border: none;
    color: #0D6EFD;
    text-decoration: underline;
    padding-top: 15px;
    background-color: white;
}

.text-status {
    text-align: left;
    padding-top: 30px;
}

.table-th {
    text-align: left;
    padding-left: 4vw;
}

.dashboard {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

@media only screen and (max-width: 768px) {
    .main-content {
        background-color: #e0f2ef;
        border-radius: 15px;
        padding: 10px;
    }

    .scroll {
        overflow-y: auto;
        max-height: 100%;

    }

    .Group-Member {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }


    h1,
    h2 {
        display: flex;
        padding-left: 10px;
        font-size: 50px;
    }

    h3 {

        display: flex;
        padding: 10px;
        margin-top: 3%;
        font-size: 2.5vw;
    }

    p {
        display: flex;
        font-size: 20px;
        padding-left: 10px;
    }

    table th {
        width: calc(101.5% - 30px);
        margin-top: 20px;
        border-radius: 5px;
        border-collapse: collapse;
        width: 150vw;
        height: 3vw;
        background-color: #e0f2ef;
        text-align: center;
        font-size: 1.5vw;
    }

    table td {
        text-align: center;
        padding-top: 10px;
        font-size: 1.5vw;
    }

    .group {
        gap: 15px;
    }

    .button {
        border: none;
        color: #0D6EFD;
        text-decoration: underline;
        padding-top: 15px;
        background-color: white;

    }


    .table-th {
        text-align: left;
        padding-left: 50px;
    }

    .hide-on-mobile {
        display: none;
    }

}

@media only screen and (max-width: 580px) {
    .container-fluid {
        background-color: #e0f2ef;
    }

    .main-container {
        background-color: #e0f2ef;
        box-shadow: none;
        margin: 0px 30px 1px 30px;
    }

    .main-content {
        width: 100vw;
    }

    h1,
    h2 {
        padding-left: 10px;
        font-size: 7vw;
    }

    h3 {
        font-size: 5vw;
        padding: 10px;
        font-weight: bold;

    }

    p {
        font-size: 3.8vw;
        padding-left: 10px;
        text-align: left;
    }

    .dropdown-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .dropdown-item {
        border-radius: 5px;
        padding: 7px;
        /* padding: 8px 16px; */
    }

    .dropdown-toggle {
        background-color: #ffffff;
        color: #000000;
        border: none;
        padding: 10px;
        border-radius: 10px;
        cursor: pointer;
        width: 100%;
        height: 60px;
        justify-content: space-between;
        display: flex;
        align-items: center;

    }

    .dropdown-toggle:hover {
        background-color: #ffffff;
    }

    .dropdown-content {
        margin-top: 10px;
        padding: 10px;
        background-color: #fff;
        border: 1px solid #ffffff;
        border-radius: 5px;
    }

    .dropdown-enter-active,
    .dropdown-leave-active {
        transition: max-height 0.3s ease, opacity 0.3s ease;
    }

    .dropdown-enter-from,
    .dropdown-leave-to {
        max-height: 0;
        opacity: 0;
        overflow: hidden;
    }

    .dropdown-enter-to,
    .dropdown-leave-from {
        max-height: 500px;
        opacity: 1;
        overflow: hidden;
    }

    .box-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 16px;
    }

    .box-content1 {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 16px;

    }

    .status-box {
        display: flex;
        align-items: center;
        gap: 8px;
    }


    .text-status {
        text-align: right;
        padding-top: 1px;

    }


    .box-sending {
        display: flex;
        justify-content: space-between;
        font-size: 16px;
    }

    .button {
        border: none;
        color: #ffffff;
        text-decoration: none;
        border-radius: 6px;
        padding-top: 1px;
        background-color: #00BAB3AB;
        font-size: 18px;
        width: 100%;
        height: 40px;

    }

    .button-resend {
        border: none;
        color: #0D6EFD;
        text-decoration: underline;
        padding-top: 0px;
        background-color: white;
    }
}
</style>
