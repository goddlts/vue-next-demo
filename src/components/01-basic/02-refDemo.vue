<template>
  <div ref="root">this is ref demo</div>
  <setup-demo ref="demo"></setup-demo>
</template>

<script>
import setupDemo from './01-Setup'
import { onMounted, ref } from 'vue'
export default {
  name: 'refDemo',
  components: { setupDemo },
  setup () {
    const r = ref(null)
    // 创建一个引用对象，这个引用对象的初始值是 null
    // 确保外部可以获取到这个引用对象
    const demo = ref(null)
    
    onMounted(() => {
      // console.log(r)
      console.dir(r.value)
      // console.log(demo.value.$options.name)
    })
    return {
      root: r,
      demo
    }
  }
}
</script>

<style>

</style>