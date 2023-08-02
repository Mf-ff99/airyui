<template>
    <div>
        <span v-if="!sender">{{ name }}</span>
        <div>
            <div class="">
                <slot />
            </div>
        </div>
    </div>

</template>

<script setup>
defineProps({
        name: {
            type: String,
            required: true,
            default: ''
        },
        sender: {
            type: Boolean,
            default: false
        }
    })
</script>