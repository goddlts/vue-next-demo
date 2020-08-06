<template>
  <h1>Setup Demo</h1>
  <p>{{ name }}</p>
</template>

<script>
import { inject } from 'vue'
export default {
  name: 'Setup',
  // props 是响应式的数据
  props: {
    name: {
      type: String
    }
  },
  // setup 是组合 API 的入口
  // setup 执行时，还没有创建组件实例，所以 setup 参数中没有该组件实例
  // 那么我们无法在 setup 函数内部获取组件中的任何属性，例如：data、computed、methods 等
  // setup 有两个参数
  //    第一个参数是 props，外部传入的参数
  //    第二个参数是 context，具有三个成员 attrs、emit、slots

  // setup 返回的对象会暴露给组件中的其它位置
  //    例如：computed properties, methods, lifecycle hooks, 以及组件的模板中 
  setup (props, context) {
    // inject
    const book = inject('book')
    const bookPrice = inject('bookPrice')

    console.log(book)
    console.log(bookPrice)

    // 响应式的数据不可以解构
    const obj = {
      ...props
    }
    console.log(obj)
    console.log(props)
    // context --> attrs emit slots
    console.log(context)
  }
}
</script>

<style>

</style>