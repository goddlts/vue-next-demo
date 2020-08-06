import { createApp, provide, h } from 'vue'
import componentSetup from './components/01-basic/01-Setup.vue'

// createApp(component, { name: 'root - props - abc' }).mount('#app')
createApp({
  components: { componentSetup },
  // data () {
  //   return {
  //     title: 'MyFirstProject'
  //   }
  // },
  setup () {
    provide('book', '倚天屠龙记'),
    provide('bookPrice', 100)
  },
  render () {
    return h(componentSetup)
  }
}, { name: 'root - props - abc' }).mount('#app')
