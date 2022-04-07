import api from './api.js'
import { escapeHtml } from './lib.js'

const currentState = {
  todoList: []
}

async function updateState(func) {
  await func()
  await updateView()
}

async function registerEventListeners() {
  const todoCheckboxElements = document.querySelectorAll('.todo-toggle')
  for (const element of todoCheckboxElements) {
    element.addEventListener('change', () => {
      const id = parseInt(element.getAttribute('data-todo-id'), 10)
      const todo = currentState.todoList.find(todo => todo.id === id)
      api.updateTodo(todo.id, todo.name, todo.done).then(() => {
        updateState(async () => {
          todo.toggleDone()
        })
      })
    })
  }

  const todoDeleteButtonElement = document.querySelectorAll('.todo-remove-button')
  for (const element of todoDeleteButtonElement) {
    element.addEventListener('click', () => {
      const id = parseInt(element.getAttribute('data-todo-id'), 10)
      api.deleteTodo(id).then(() => {
        updateState(async () => {
          currentState.todoList = currentState.todoList.filter(todo => todo.id !== id)
        })
      })
    })
  }
}

async function updateView() {
  async function updateTodos() {
    const { todoList } = currentState
    let newHtml = ''
    for (const todo of todoList) {
      newHtml += `
        <li class="todo-item">
          <label class="todo-toggle__container">
            <input
              data-todo-id="${escapeHtml(todo.id)}"
              type="checkbox"
              class="todo-toggle"
              value="checked"
              ${todo.done ? "checked" : ""}
            />
            <span class="todo-toggle__checkmark"></span>
          </label>
          <div class="todo-name">${escapeHtml(todo.name)}</div>
          <div data-todo-id="${escapeHtml(todo.id)}" class="todo-remove-button">x</div>
        </li>
        `
    }
    document.querySelector('.todos').innerHTML = newHtml
  }

  async function updateItemCount() {
    const { todoList } = currentState
    document.querySelector('.done-items-num').innerHTML = `
      <span class="done-items-num__value">${todoList.filter(t => t.done).length}</span><span> items done</span>
      `
  }

  updateTodos()
  updateItemCount()

  registerEventListeners()
}

async function init() {
  api.fetchTodoList().then(todoList => {
    updateState(() => {
      currentState.todoList = todoList
    })
  })

  const todoFormElement = document.querySelector('.todo-form')
  todoFormElement.addEventListener('submit', event => {
    event.preventDefault()
    const name = document.querySelector('.todo-form input[name=name]').value
    api.createTodo(name).then(todo => {
      updateState(async () => {
        currentState.todoList.push(todo)
      })
    })
  })
}

const main = async () => {
  init()
}

main()
