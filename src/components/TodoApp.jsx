import { useState } from 'react'
import { useTodos } from '../hooks/useTodos'

export function TodoApp() {
  const {
    todos,
    addTodo,
    toggleTodo,
    removeTodo,
    editTodo,
    clearCompleted,
    activeCount,
  } = useTodos()
  const [text, setText] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    addTodo(text)
    setText('')
  }

  const startEdit = (todo) => {
    setEditingId(todo.id)
    setDraft(todo.text)
  }

  const handleEditSubmit = (event) => {
    event.preventDefault()
    editTodo(editingId, draft)
    setEditingId(null)
  }

  const hasCompleted = todos.some((todo) => todo.completed)

  return (
    <main className="todo-app">
      <h1>Lista de Tareas</h1>
      <p className="subtitle">
        {activeCount} {activeCount === 1 ? 'tarea pendiente' : 'tareas pendientes'}
      </p>

      <form className="todo-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="¿Qué necesitas hacer?"
          aria-label="Nueva tarea"
        />
        <button type="submit" disabled={!text.trim()}>
          Agregar
        </button>
      </form>

      {todos.length === 0 ? (
        <p className="empty-state">No hay tareas. ¡Agrega la primera!</p>
      ) : (
        <ul className="todo-list">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className={`todo-item${todo.completed ? ' completed' : ''}`}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                aria-label={`Marcar ${todo.text} como completada`}
              />
              {editingId === todo.id ? (
                <form className="edit-form" onSubmit={handleEditSubmit}>
                  <input
                    type="text"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    aria-label="Editar tarea"
                  />
                  <button type="submit">Guardar</button>
                </form>
              ) : (
                <span className="todo-text">{todo.text}</span>
              )}
              <button
                type="button"
                className="edit-btn"
                onClick={() => startEdit(todo)}
              >
                Editar
              </button>
              <button
                type="button"
                className="delete-btn"
                onClick={() => removeTodo(todo.id)}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}

      {hasCompleted && (
        <button type="button" className="clear-completed" onClick={clearCompleted}>
          Eliminar completadas
        </button>
      )}
    </main>
  )
}
