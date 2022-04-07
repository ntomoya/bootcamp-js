const BASE_URL = 'http://localhost:3000'

// Model

class Todo {
  #id
  #name
  #done

  constructor(id, name, done = false) {
    this.#id = id
    this.#name = name
    this.#done = done
  }

  get id() {
    return this.#id
  }

  get name() {
    return this.#name
  }

  get done() {
    return this.#done
  }

  toggleDone() {
    this.#done = !this.#done
  }
}

// API

async function apiRequest(path, { method = 'GET', data }) {
  let res;
  if (method === 'POST' || method === 'PATCH') {
    res = await fetch(BASE_URL + path, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  } else {
    res = await fetch(BASE_URL + path, { method })
  }
  return await res.json()
}

async function fetchTodoList() {
  const { todoList } = await apiRequest('/todo', { method: 'GET' })
  return todoList.map(todo => new Todo(todo.id, todo.name, todo.done))
}

async function createTodo(name) {
  const data = { name }
  const { id } = await apiRequest('/todo', { method: 'POST', data })
  return id
}

async function updateTodo(todo) {
  const data = { 
    name: todo.name,
    done: todo.done,
  }
  const res = apiRequest(`/todo/${todo.id}`, { method: 'PATCH', data })
  return res.ok
}

async function init() {
  const todosElement = document.querySelector('.todos')
  const todoFormElement = document.querySelector('.todo-form')
  const todoFormTextElement = document.querySelector('.todo-form input[name=name]')

  let todoList = []
  
  // FIXME: unsafe
  async function updateTodos() {
    todoList = await fetchTodoList()
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
    createTodo(name).then(() => updateTodos())
  })

  const todoCheckboxElements = document.querySelectorAll('.todo-toggle')
  for (const element of todoCheckboxElements) {
    element.addEventListener('change', () => {
      const id = parseInt(element.getAttribute('data-todo-id'))
      const todo = todoList.find(todo => todo.id === id)
      todo.toggleDone()
      updateTodo(todo)
    })
  }
}

const main = async () => {
  init()
  console.log(await fetchTodoList())
  // console.log(await createTodo('hoge'))
}

main()
