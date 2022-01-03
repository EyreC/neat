<template>
    <div class="main-img-container">
        <p>Preview</p>
        <img v-if="img_display_tag !== ''" :src='img_display_tag' class="main-img">
    </div>
</template> 

<script>
    export default {
        name: 'Preview',
        props: {
            img_display_tag: String
        }    
    }
</script>

<style scoped>
p {
    text-align: left;
    margin-top: 0.2rem;
    margin-left: 0.5rem;
    color:white;
}
.main-img-container{
    border-style: solid;
    border-width: 2px;
    border-color:  rgb(52, 235, 225);;
    min-height:20px;
    max-width: 82vw;
    margin:auto;
    border-radius: 5px;
}
.main-img {
  max-width: 80vw;
}
</style>