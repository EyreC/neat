<template>
    <div class="dest-box">
        <div @click="move_file">
            <p>{{label}}</p>
            <p>{{shortcut_str}}</p>
        </div>
        <base-button @click="remove_destination">X</base-button>
    </div>
</template>

<script>
import BaseButton from './BaseButton.vue'
    export default {
        name: "Destination",
        props: {
            destination: Object,
            shortcut_num: Number

        },
        components: {
            BaseButton
        },
        computed: {
            shortcut_str: function() {
                return `Ctrl + ${this.shortcut_num}`
            },
            // label is the directory name
            label: function() {
                const path_split = this.destination.directory_path.split('/');
                const last_idx = path_split.length - 1;
                return path_split[last_idx];
            },
            directory_path: function() {
                return this.destination.directory_path
            },

        },
        methods: {
            remove_destination() {
                this.$emit('remove-destination', this.destination.directory_path)
            },
            move_file() {
                this.$emit('move-file', this.destination.directory_path)
            }
        }
    }
</script>

<style scoped>
p {
    color:  rgb(52, 235, 225);
    margin-top:0.2 rem;
    margin-bottom: 0.2rem;
}
.dest-box {
    display: flex;
    justify-content: space-around;
    border-style: solid;
    border-width: 2px;
    border-color:  rgb(52, 235, 225);;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem
}
.dest-box:hover {
    cursor: pointer
}

</style>