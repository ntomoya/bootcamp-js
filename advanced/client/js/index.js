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

async function fetchTodoList() {
  const res = await fetch('http://localhost:3000/todo')
  const { todoList } = await res.json()
  return todoList.map(todo => new Todo(...todo))
}

const main = async () => {
  console.log(await fetchTodoList())
}

main()
