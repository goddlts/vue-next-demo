<template>
  <section id="app" class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input class="new-todo" placeholder="What needs to be done?" autocomplete="off" autofocus v-model="input"
        @keyup.enter="addTodo">
    </header>
    <section class="main" v-show="todos.length">
      <input id="toggle-all" class="toggle-all" type="checkbox" v-model="allDone">
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <li v-for="todo in filteredTodos" :key="todo"
          :class="{ completed: todo.completed, editing: todo === editingTodo }">
          <div class="view">
            <input class="toggle" type="checkbox" v-model="todo.completed">
            <label @dblclick="editTodo(todo)">{{ todo.text }}</label>
            <button class="destroy" @click="removeTodo(todo)"></button>
          </div>
          <input class="edit" type="text" v-model="todo.text" v-edit-focus="todo === editingTodo" @blur="doneEdit(todo)"
            @keyup.enter="doneEdit(todo)" @keyup.escape="cancelEdit(todo)">
        </li>
      </ul>
    </section>
    <footer class="footer" v-show="todos.length">
      <span class="todo-count">
        <strong>{{ remaining }}</strong> {{ pluralize(remaining) }} left
      </span>
      <ul class="filters">
        <li><a href="#/all" :class="{ selected: visibility === 'all' }">All</a></li>
        <li><a href="#/active" :class="{ selected: visibility === 'active' }">Active</a></li>
        <li><a href="#/completed" :class="{ selected: visibility === 'completed' }">Completed</a></li>
      </ul>
      <button class="clear-completed" @click="removeCompleted" v-show="todos.length > remaining">
        Clear completed
      </button>
    </footer>
  </section>
  <footer class="info">
    <p>Double-click to edit a todo</p>
    <!-- Remove the below line ↓ -->
    <p>Template by <a href="http://sindresorhus.com">Sindre Sorhus</a></p>
    <!-- Change this out with your name and url ↓ -->
    <p>Created by 教瘦
    <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
  </footer>
</template>

<script>
const storage = {
  get: () => JSON.parse(localStorage.getItem('latest_todos') || '[]'),
  set: value => localStorage.setItem('latest_todos', JSON.stringify(value))
}

const filters = {
  all: todos => todos,
  active: todos => todos.filter(todo => !todo.completed),
  completed: todos => todos.filter(todo => todo.completed)
}

export default {
  name: 'TodoList',
  data: () => ({
    todos: storage.get(),
    input: '',
    visibility: 'all'
  }),

  computed: {
    remaining() {
      return filters.active(this.todos).length
    },
    filteredTodos() {
      return filters[this.visibility](this.todos)
    },
    allDone: {
      get () {
        return !this.remaining
      },
      set (value) {
        this.todos.forEach(todo => {
          todo.completed = value
        })
      }
    }
  },

  watch: {
    todos() {
      storage.set(this.todos)
    }
  },

  mounted() {
    window.addEventListener('hashchange', this.onHashChange)
    this.onHashChange()
  },

  unmounted() {
    window.removeEventListener('hashchange', this.onHashChange)
  },

  methods: {
    onHashChange() {
      const visibility = window.location.hash.replace(/#\/?/, '')
      if (filters[visibility]) {
        this.visibility = visibility
      } else {
        this.visibility = 'all'
        window.location.hash = ''
      }
    },

    addTodo() {
      const text = this.input && this.input.trim()
      if (!text) return
      this.todos.push({ text, completed: false })
      this.input = ''
    },

    removeTodo(todo) {
      this.todos.splice(this.todos.indexOf(todo), 1)
    },

    editTodo(todo) {
      this.editingTodo = todo
      this.beforeEditText = todo.text
    },

    doneEdit(todo) {
      if (!this.editingTodo) return
      todo.text = todo.text.trim()
      todo.text || this.removeTodo(todo)
      this.editingTodo = null
    },

    cancelEdit(todo) {
      this.editingTodo = null
      todo.text = this.beforeEditText
    },

    removeCompleted() {
      this.todos = filters.active(this.todos)
    },

    pluralize(count) {
      return count === 1 ? 'item' : 'items'
    }
  },

  directives: {
    editFocus: (el, { value }) => value && el.focus()
  }
}
</script>
