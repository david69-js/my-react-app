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
    const newTodo = { id: createId(), text: trimmed, completed: false }
    setTodos((prev) => [...prev, newTodo])
  }

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    )
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

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed))
  }

  const activeCount = todos.filter((todo) => !todo.completed).length

  return {
    todos,
    addTodo,
    toggleTodo,
    removeTodo,
    editTodo,
    clearCompleted,
    activeCount,
  }
}
