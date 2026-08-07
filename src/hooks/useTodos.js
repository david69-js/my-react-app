import { useState } from 'react'

let counter = 0

// Genera un identificador único para cada nueva tarea.
function createId() {
  counter += 1
  return `todo-${counter}`
}

// Hook personalizado que gestiona el estado de las tareas y expone todas las acciones necesarias.
export function useTodos(initialTodos = []) {
  const [todos, setTodos] = useState(initialTodos)

  // Agrega una nueva tarea no completada a la lista.
  const addTodo = (text) => {
    const trimmed = text.trim()
    if (!trimmed) return
    const newTodo = { id: createId(), text: trimmed, completed: false }
    setTodos((prev) => [...prev, newTodo])
  }

  // Alterna el estado completado de una tarea por id.
  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    )
  }

  // Elimina una tarea existente de la lista usando su id.
  const removeTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  // Actualiza el texto de una tarea existente, ignorando entradas vacías.
  const editTodo = (id, newText) => {
    const trimmed = newText.trim()
    if (!trimmed) return
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, text: trimmed } : todo)),
    )
  }

  // Elimina todas las tareas que ya han sido marcadas como completadas.
  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed))
  }

  // Cuenta cuántas tareas aún están pendientes.
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
