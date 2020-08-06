<template>
  <section id="app" class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input class="new-todo" placeholder="What needs to be done?" autocomplete="off" autofocus v-model="input"
        @keyup.enter="addTodo">
    </header>
    <section class="main" v-show="todos.length">
      <input id="toggle-all" class="toggle-all" type="checkbox" v-model="allChecked">
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <li v-for="(todo, index) in filteredTodos" :key="todo">
          <div class="view">
            <input class="toggle" type="checkbox">
            <label>{{ todo.text }}</label>
            <button class="destroy" @click="removeTodo(index)"></button>
          </div>
          <input class="edit" type="text">
        </li>
      </ul>
    </section>
  </section>
  <footer class="info">
    <p>Double-click to edit a todo</p>
    <!-- Remove the below line ↓ -->
    <p>Template by <a href="http://sindresorhus.com">Sindre Sorhus</a></p>
    <!-- Change this out with your name and url ↓ -->
    <p>Created by 教瘦</p>
    <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
  </footer>
</template>

<script>
import useLocalStorage from './useLocalStorage'
import { reactive, toRefs, ref, computed, watchEffect } from 'vue'

const KEY = 'TODOSKEY'
// 本地存储的操作
const storage = useLocalStorage()

const filters = {
  all: todos => todos,
  active: todos => todos.filter(todo => !todo.completed),
  completed: todos => todos.filter(todo => todo.completed)
}

// 添加 todo
function useAddTodo (todos) {
  const input = ref('')
  
  function addTodo () {
    const todo = {
      text: input.value && input.value.trim(),
      completed: false
    }

    if (!todo.text) return

    todos.unshift(todo)
    // 清空文本框
    input.value = ''
  }

  return {
    input,
    addTodo
  }
}

export default {
  name: 'TodoList',
  setup () {
    // reactive 的作用和 Vue.observable() 类似
    const state = reactive({
      todos: storage.getItem(KEY) || [],
      activeTodos: computed(() => filters.active(state.todos)),
      allChecked: computed({
        get: () => !state.activeTodos.length,
        set: (value) => {
          state.todos.forEach(todo => {
            todo.completed = value
            console.log(todo)
          })
        }
      }),
      visibility: 'all',
      filteredTodos: computed(() => filters[state.visibility](state.todos))
    })

    const removeTodo = (index) => {
      state.todos.splice(index, 1)
    }

    watchEffect(() => {
      storage.setItem(KEY, state.todos)
    })
    // const [ input, addTodo ] = useAddTodos(state.todos)
    // return {
    //   ...toRefs(state),
    //   input,
    //   addTodo
    // }
    return {
      ...toRefs(state),
      ...useAddTodo(state.todos),
      removeTodo
    }
  }
}
</script>

<style>

</style>