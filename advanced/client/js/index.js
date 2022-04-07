const BASE_URL = 'http://localhost:3000'

class Todo {
  #id
  #name
  #done

  constructor(id, name, done = False) {
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
  return todoList.map(todo => new Todo(...todo))
}

async function createTodo(name) {
  const data = { name }
  const { id } = await apiRequest('/todo', { data })
  return id
}

const main = async () => {
  console.log(await fetchTodoList())
  // console.log(await createTodo('hoge'))
}

main()
