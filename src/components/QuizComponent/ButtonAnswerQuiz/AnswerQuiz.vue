<template>
    <div class="container-fluid">
        <div class="container">
            <div class="box-answer icon">
                <p class="square"><i class="bi bi-square"></i>{{ choices.choice1 }}</p>
                <p class="triangular"><i class="bi bi-triangle"></i> {{ choices.choice2 }}</p>
                <p class="circle"><i class="bi bi-circle"></i> {{ choices.choice3 }}</p>
                <p class="x-cross"><i class="bi bi-x-lg"></i> {{ choices.choice4 }}</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "AnswerQuiz",
    props: {
        choices: {
            type: Object,
            required: true
        }
    }
}
</script>

<style scoped>
.container {
    position: relative;
    display: flex;
    margin-top: -5%;
    justify-content: center;
    align-items: center;
    height: 50vh;   
}

.box-answer {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 10px;
    row-gap: 10px;
}

.box-answer p {
    align-items: center;
    padding-left: 40px;
    gap: 3%;
    font-size: 26px;
    color: #ffffff;
}


.icon i {
    font-size: 5vw;
    color: #fff;
}

.icon p {
    display: flex;
    margin: 0;
    max-height: 80vh;
    max-width: 40vw;
    border-radius: none;
    text-align: left;

}

.triangular {
    background-color: #1368CE;
}

.square {
    background-color: #E31A3C;
}

.x-cross {
    background-color: #298F0E;
}

.circle {
    background-color: #D89E02;
}

@media only screen and (max-width: 1400px) {
    .box-answer p {
        font-size: 2vw;
    }
}

@media only screen and (max-width: 1024px) {
    .box-answer p {
        font-size: 2vw;
    }

    .icon p {
        max-width: 38vw;
    }

    .container {
        top: 10%;
    }
}

</style>