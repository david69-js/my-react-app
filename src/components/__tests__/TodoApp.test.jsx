import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoApp } from '../TodoApp'

const renderApp = () => {
  render(<TodoApp />)
}

const addTodo = async (user, text) => {
  await user.type(screen.getByLabelText('Nueva tarea'), text)
  await user.click(screen.getByRole('button', { name: 'Agregar' }))
}

describe('TodoApp', () => {
  it('permite agregar y eliminar una tarea', async () => {
    const user = userEvent.setup()
    renderApp()

    await addTodo(user, 'Preparar presentación')
    expect(screen.getByText('Preparar presentación')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Eliminar' }))
    expect(screen.queryByText('Preparar presentación')).not.toBeInTheDocument()
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
})
