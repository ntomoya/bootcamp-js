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
}

// API

async function apiRequest(path, { method = 'GET', data }) {
  if (data !== undefined) {
    method = 'POST'
  }

  let res;
  if (method === 'POST') {
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
  const { id } = await apiRequest('/todo', { data })
  return id
}

function init() {
  const todosElement = document.querySelector('.todos')
  const todoFormElement = document.querySelector('.todo-form')
  const todoFormTextElement = document.querySelector('.todo-form input[name=name]')
  
  // FIXME: unsafe
  async function updateTodos() {
    const todoList = await fetchTodoList()
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

  // Event listeners
  todoFormElement.addEventListener('submit', event => {
    event.preventDefault()
    const name = todoFormTextElement.value
    createTodo(name).then(() => updateTodos())
  })

  updateTodos()
}

const main = async () => {
  init()
  console.log(await fetchTodoList())
  // console.log(await createTodo('hoge'))
}

main()
