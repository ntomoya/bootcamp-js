import api from './api.js'

async function init() {
  const todosElement = document.querySelector('.todos')
  const todoFormElement = document.querySelector('.todo-form')
  const todoFormTextElement = document.querySelector('.todo-form input[name=name]')

  let todoList = []
  
  // FIXME: unsafe
  async function updateTodos() {
    todoList = await api.fetchTodoList()
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
            />
            <span class="todo-toggle__checkmark"></span>
          </label>
          <div class="todo-name">${todo.name}</div>
          <div data-todo-id="${todo.id}" class="todo-remove-button">x</div>
        </li>
        `
    }
    todosElement.innerHTML = newHtml
  }

  await updateTodos()

  // Event listeners
  todoFormElement.addEventListener('submit', event => {
    event.preventDefault()
    const name = todoFormTextElement.value
    api.createTodo(name).then(() => updateTodos())
  })

  const todoCheckboxElements = document.querySelectorAll('.todo-toggle')
  for (const element of todoCheckboxElements) {
    element.addEventListener('change', () => {
      const id = parseInt(element.getAttribute('data-todo-id'))
      const todo = todoList.find(todo => todo.id === id)
      todo.toggleDone()
      api.updateTodo(todo)
    })
  }

  const todoDeleteButtonElement = document.querySelectorAll('.todo-remove-button')
  for (const element of todoDeleteButtonElement) {
    element.addEventListener('click', () => {
      const id = parseInt(element.getAttribute('data-todo-id'))
      todoList = todoList.filter(todo => todo.id !== id)
      api.deleteTodo(id).then(() => updateTodos())
    })
  }
}

const main = async () => {
  init()
}

main()
