export class Todo {
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
