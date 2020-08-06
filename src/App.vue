<template>
  <!-- <h1>{{ $root.title }}</h1> -->
  <todo-list></todo-list>
</template>

<script>
import TodoList from './components/03-composition-api/TodoList'
export default {
  name: 'App',
  components: {
    TodoList
  }
}
</script>

<style>
</style>
