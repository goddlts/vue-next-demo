<template>
  <h1>{{ state.title }}</h1>
  <div id="t"></div>
  <button @click="handleClick">按钮</button>
</template>

<script>
import { reactive, watchEffect, onMounted } from 'vue'
export default {
  name: 'weDemo',
  setup () {
    const state = reactive({
      title: 'watchEffect',
      count: 1
    })

    function handleClick () {
      state.title = 'kkk'
      state.count++
    }

    onMounted(() => {
      watchEffect(() => {
        document.querySelector('#t').innerHTML = `${state.title}-${state.count}`
      })
    })

    return {
      state,
      handleClick
    }
  }
}
</script>

<style>

</style>