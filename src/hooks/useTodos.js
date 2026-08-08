import { useState } from 'react'

let counter = 0

function createId() {
  counter += 1
  return `todo-${counter}`
}

export function useTodos(initialTodos = []) {
  const [todos, setTodos] = useState(initialTodos)

  const addTodo = (text) => {
    const trimmed = text.trim()
    if (!trimmed) return
    const newTodo = { id: createId(), text: trimmed }

    setTodos((prev) => {
      const exists = prev.some((todo) => todo.id === newTodo.id)
      if (exists) return prev
      return [...prev, newTodo]
    })
  }

  const removeTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  const editTodo = (id, newText) => {
    const trimmed = newText.trim()
    if (!trimmed) return
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, text: trimmed } : todo)),
    )
  }

  return { todos, addTodo, removeTodo, editTodo }
}
