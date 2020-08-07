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
        <li v-for="(todo, index) in filteredTodos" :key="todo"
          :class="{ completed: todo.completed, editing: todo === editingTodo }">
          <div class="view">
            <input class="toggle" type="checkbox" v-model="todo.completed">
            <label @dblclick="editTodo(todo)">{{ todo.text }}</label>
            <button class="destroy" @click="removeTodo(index)"></button>
          </div>
          <input
            class="edit"
            type="text"
            v-focus="todo === editingTodo"
            v-model="todo.text"
            @blur="updateTodo(todo, index)"
            @keyup.enter="updateTodo(todo, index)"
            @keyup.escape="cancelTodo(todo)"
            >
        </li>
      </ul>
    </section>

    <footer class="footer" v-show="todos.length">
      <span class="todo-count">
        <strong>{{ activeTodosCount }}</strong> {{ pluralize(activeTodosCount) }} left
      </span>
      <ul class="filters">
        <li><a href="#/all" :class="{ selected: visibility === 'all' }">All</a></li>
        <li><a href="#/active" :class="{ selected: visibility === 'active' }">Active</a></li>
        <li><a href="#/completed" :class="{ selected: visibility === 'completed' }">Completed</a></li>
      </ul>
      <button class="clear-completed" @click="removeCompleted" v-show="todos.length > activeTodosCount">
        Clear completed
      </button>
    </footer>
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
// 功能列表
// 1. 添加 todo
// 2. 删除 todo
// 3. 点击全选反选
//    3.1  全部选中
//    3.2  点击某一个 todo
//    3.3  footer 中显示剩余多少个 todo 未完成,  pluralize 函数
// 4. 双击 todo 实现编辑功能
//    4.1  li 绑定 editingTodo
//    4.2  li 绑定事件，文本框绑定 todo.text
//    4.3  编辑的时候文本框获取焦点,自定义指令
// 5. 实现路由切换
//  


import useLocalStorage from './useLocalStorage'
import { reactive, toRefs, ref, computed, watchEffect, onMounted, onUnmounted } from 'vue'

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

// 编辑 todo
function useEditTodo (removeTodo) {
  let beforeEditText = null
  let editingTodo = ref(null)

  function editTodo (todo) {
    editingTodo.value = todo
    beforeEditText = todo.text
  }

  function updateTodo (todo, index) {
    if (!editingTodo.value) return
    todo.text = todo.text.trim()
    // 如果文本被删除，直接删除 todo
    todo.text || removeTodo(index)
    editingTodo.value = null
  }

  function cancelEdit (todo) {
    editingTodo = null
    todo.text = beforeEditText
  }

  return {
    editTodo,
    updateTodo,
    cancelEdit,
    editingTodo
  }
}

// 实现切换查看 todo 状态
function useTodoChangeState () {  
  // const state = reactive({
  //   visibility: 'all'
  // })
  const visibility = ref('all')

  function onHashChange () {
    // window.location.hash.replace(/#\/?/, '')
    visibility.value = window.location.hash.replace(/#\//, '')

    if (!filters[visibility.value]) {
      console.log(visibility.value)

      visibility.value = 'all'
      window.location.hash = ''
    }
  }

  function addHashChangeEvent () {
    window.addEventListener('hashchange', onHashChange)
  }

  function removeHashChangeEvent () {
    window.removeEventListener('hashchange', onHashChange)
  }

  return {
    visibility,
    addHashChangeEvent,
    removeHashChangeEvent
  }
}

export default {
  name: 'TodoList',
  setup () {
    const { visibility, addHashChangeEvent, removeHashChangeEvent } = useTodoChangeState()

    // reactive 的作用和 Vue.observable() 类似
    const state = reactive({
      todos: storage.getItem(KEY) || [],
      activeTodosCount: computed(() => filters.active(state.todos).length),
      allChecked: computed({
        get: () => !state.activeTodosCount,
        set: (value) => {
          state.todos.forEach(todo => {
            todo.completed = value
            console.log(todo)
          })
        }
      }),
      filteredTodos: computed(() => filters[visibility.value](state.todos))
    })

    const removeTodo = (index) => {
      state.todos.splice(index, 1)
    }

    const removeCompleted = () => {
      state.todos = filters.active(state.todos)
    }

    const pluralize = (count) => {
      return count === 0 ? 'item' : 'items'
    }

    onMounted(() => {
      addHashChangeEvent()
    })

    onUnmounted(() => {
      removeHashChangeEvent()
    })

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
      ...useEditTodo(removeTodo),
      removeTodo,
      visibility,
      removeCompleted,
      pluralize
    }
  },
  directives: {
    focus: (el, { value }) => value && el.focus()
    // focus: (el, binding) => {
    // // binding.value 是指令传过来的参数
    //   binding.value && el.focus()
    // }
  }
}
</script>

<style>

</style>
