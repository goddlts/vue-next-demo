<template>
  <!-- <h1>{{ $root.title }}</h1> -->
  <todo-list></todo-list>
</template>

<script>
// import TodoList from './components/03-composition-api/TodoList'
import TodoList from './components/04-demo'
export default {
  name: 'App',
  components: {
    TodoList
  }
}
</script>

<style>
</style>
