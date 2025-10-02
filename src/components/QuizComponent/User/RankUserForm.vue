<template>
    <div class="container-fluid">
        <div class="main-content">
            <table class="group">
                <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Score</th>
                </tr>

                <tr>
                    <td>1</td>
                    <td>Name 001</td>
                    <td>1000</td>
                </tr>
                <tr>
                    <td></td>
                    <td class="button-close" @click="Close"> Close</td>
                    <td></td>
                </tr>
            </table>
        </div>
    </div>
</template>
<script>
import { useRouter } from 'vue-router';
export default {
    name: 'RankUserForm',
    setup() {
        const router = useRouter();  

        const Close = async () => {
            router.push({ path: '/User' });
        };

        return {
            Close,
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

table th {
    margin-top: 20px;
    border-radius: 5px;
    width: 878px;
    height: 3vw;
    text-align: center;
    border-bottom: 1px solid #000;
}

table td {
    background-color: #fff;
    border-bottom: 1px solid #000;
    text-align: center;
}

.group {
    font-size: 30px;
    gap: 15px;
    font-family: "Carnac", Arial;
}

.button-close {
    position: relative;
    font-size: 100%;
    bottom: 0;
    color: #ffff;
    background-color: #000;
    border-radius: 8px;
    width: 5vw;
    height: 2vh;
}

.button-table {
    /* border-bottom: 1px solid #000; */
    text-align: center;
    height: 4vh;

}
</style>