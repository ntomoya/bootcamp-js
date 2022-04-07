import { Todo } from './model.js'

const BASE_URL = 'http://localhost:3000'

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

  let responseData
  try {
    responseData = await res.json()
  } catch {
    responseData = {}
  }
  return responseData
}

async function fetchTodoList() {
  const { todoList } = await apiRequest('/todo', { method: 'GET' })
  return todoList.map(todo => new Todo(todo.id, todo.name, todo.done))
}

async function createTodo(newName) {
  const data = { name: newName }
  const { id, name, done } = await apiRequest('/todo', { method: 'POST', data })
  return new Todo(id, name, done) 
}

async function updateTodo(id, name, done) {
  const data = { name, done }
  const res = apiRequest(`/todo/${id}`, { method: 'PATCH', data })
  return res.ok
}

async function deleteTodo(id) {
  const res = await apiRequest(`/todo/${id}`, { method: 'DELETE' })
  return res.ok
}

export default {
  fetchTodoList,
  createTodo,
  updateTodo,
  deleteTodo,
}
