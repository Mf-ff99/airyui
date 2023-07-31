<script setup>
    defineProps({
        content: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        subtitle: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
    })
</script>

<template>
    <div class="homeCard">
        <div class="cardHeader">
            <div class="title">
                <h1>{{ title }}</h1>
                <h3>{{ subtitle }}</h3>
            </div>
        </div>
        <div class="cardBody">
            <div class="image">
                <img :src="image" alt="image">
            </div>
            <div class="content">
                <p>{{ content }}</p>
            </div>
        </div>
    </div>
</template>

<style>

.homeCard {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);
    overflow: hidden;
    padding: 5px;
    color: #6D6875;
    margin: 20px 5px 10px 10px;
}

.cardHeader {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 5px;
}

</style>