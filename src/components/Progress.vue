<template>
    <div>
        <ve-progress :progress="progress" :size="60" color="#42b983"
                      :legend="50" :legend-formatter="progress_formatter"
                      font-color="#42b983" />
    </div>
</template>

<script>
import { veProgress } from "vue-ellipse-progress";
    export default {
        name: "Progress",
        components: { veProgress },
        props: {
            current: Number,
            total: Number,
            size: Number
        },
        computed: {
            progress: function() {
                return this.current / this.total;
            }
        },
        methods: {
            progress_formatter() {
                return `${this.current} / ${this.total}`
            }
        }
    }
</script>

<style scoped>
.legend-custom-style {
    color: white
    
}
</style>