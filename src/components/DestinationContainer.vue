<template>
    <div>
        <destination v-for="(dest, idx) in destinations" 
                    :destination="dest" 
                    :shortcut_num="idx"
                    v-on:remove-destination="remove_destination"
                    v-on:move-file="move_file"
                    :key="dest.directory_path"></destination>
    </div>
</template>

<script>
import Destination from './Destination.vue'
    export default {
	components: { Destination },
        name: 'DestinationContainer',
        props: {
            destinations: Array
        },
        methods: {
            remove_destination(directory_path){
                this.$emit('remove-destination', directory_path)
            },
             move_file(directory_path) {
                this.$emit('move-file', directory_path)
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>