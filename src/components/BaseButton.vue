<template>
    <div>
         <button >
          <slot/>
        </button>
    </div>
</template>

<script>
    export default {
        name: 'BaseButton'
    }
</script>

<style scoped>
button {
    margin-top:1rem;
    margin-bottom:1rem;
    background-color: rgb(52, 235, 225);
    border-width: 0;
    border-radius: 25px;
    padding: 0.5rem 2rem;
    font-weight: 600;
    color: rgb(67, 69, 69);
}
</style>