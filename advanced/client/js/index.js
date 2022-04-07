import api from './api.js'

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
      const id = parseInt(element.getAttribute('data-todo-id'))
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
      const id = parseInt(element.getAttribute('data-todo-id'))
      api.deleteTodo(id).then(() => {
        updateState(async () => {
          currentState.todoList = todoList.filter(todo => todo.id !== id)
        })
      })
    })
  }
}

async function updateView() {
  // FIXME: unsafe
  async function updateTodos() {
    const { todoList } = currentState
    let newHtml = ''
    for (const todo of todoList) {
      newHtml += `
        <li class="todo-item">
          <label class="todo-toggle__container">
            <input
              data-todo-id="${todo.id}"
              type="checkbox"
              class="todo-toggle"
              value="checked"
              ${todo.done ? "checked" : ""}
            />
            <span class="todo-toggle__checkmark"></span>
          </label>
          <div class="todo-name">${todo.name}</div>
          <div data-todo-id="${todo.id}" class="todo-remove-button">x</div>
        </li>
        `
    }
    document.querySelector('.todos').innerHTML = newHtml
  }

  updateTodos()
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
