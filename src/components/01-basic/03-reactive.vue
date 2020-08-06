<template>
  <h1>Reactive&Ref</h1>

  {{ pos.x }} -- {{ pos.y }}

  <br>
  <button @click="pos.x = 50">按钮</button>
</template>

<script>
import { reactive } from 'vue'

function useMousePosition () {
  const position = reactive({
    x: 10,
    y: 20
  })
  return position
}

export default {
  name: 'reactiveDemo',
  setup () {
    const position = useMousePosition()
    // const x = position.x
    // const y = position.y

    return {
      pos: position
    }
  }
}
</script>

<style>

</style>