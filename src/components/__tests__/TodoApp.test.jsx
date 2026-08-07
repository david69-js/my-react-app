// `render` monta el componente en memoria para poder interactuar con él.
// `screen` ofrece selectores accesibles que simulan lo que ve el usuario.
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoApp } from '../TodoApp'

const renderApp = () => {
  render(<TodoApp />)
}

// `async`/`await` se usa aquí porque userEvent hace acciones asíncronas
// que simulan eventos reales del usuario en el DOM.
const addTodo = async (user, text) => {
  await user.type(screen.getByLabelText('Nueva tarea'), text)
  await user.click(screen.getByRole('button', { name: 'Agregar' }))
}

describe('TodoApp', () => {
  it('permite agregar, completar y eliminar una tarea', async () => {
    // userEvent.setup() crea un simulador de interacciones de usuario.
    const user = userEvent.setup()
    renderApp()

    await addTodo(user, 'Preparar presentación')
    // getByText busca el texto exacto; falla si no lo encuentra.
    expect(screen.getByText('Preparar presentación')).toBeInTheDocument()

    const checkbox = screen.getByLabelText('Marcar Preparar presentación como completada')
    await user.click(checkbox)
    expect(checkbox).toBeChecked()
    expect(screen.getByText('0 tareas pendientes')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Eliminar' }))
    // queryByText devuelve null si no existe, perfecto para verificar eliminación.
    expect(screen.queryByText('Preparar presentación')).not.toBeInTheDocument()
    expect(screen.getByText(/no hay tareas/i)).toBeInTheDocument()
  })

  it('permite editar una tarea existente', async () => {
    const user = userEvent.setup()
    renderApp()

    await addTodo(user, 'Tarea inicial')

    await user.click(screen.getByRole('button', { name: 'Editar' }))
    const input = screen.getByLabelText('Editar tarea')
    await user.clear(input)
    await user.type(input, 'Tarea corregida')
    await user.click(screen.getByRole('button', { name: 'Guardar' }))

    expect(screen.getByText('Tarea corregida')).toBeInTheDocument()
    expect(screen.queryByText('Tarea inicial')).not.toBeInTheDocument()
  })

  it('actualiza el contador de tareas pendientes', async () => {
    const user = userEvent.setup()
    renderApp()

    expect(screen.getByText('0 tareas pendientes')).toBeInTheDocument()

    await addTodo(user, 'Hacer ejercicio')
    expect(screen.getByText('1 tarea pendiente')).toBeInTheDocument()
  })

  it('elimina todas las tareas completadas', async () => {
    const user = userEvent.setup()
    renderApp()

    await addTodo(user, 'Tarea A')
    await addTodo(user, 'Tarea B')

    await user.click(screen.getByLabelText('Marcar Tarea A como completada'))
    await user.click(screen.getByRole('button', { name: 'Eliminar completadas' }))

    expect(screen.queryByText('Tarea A')).not.toBeInTheDocument()
    expect(screen.getByText('Tarea B')).toBeInTheDocument()
  })
})
