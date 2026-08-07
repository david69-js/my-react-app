import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoApp } from '../TodoApp'

describe('TodoApp', () => {
  test('agrega, completa y elimina una tarea (flujo completo)', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    await user.type(screen.getByLabelText('Nueva tarea'), 'Preparar presentación')
    await user.click(screen.getByRole('button', { name: 'Agregar' }))
    expect(screen.getByText('Preparar presentación')).toBeInTheDocument()

    const checkbox = screen.getByLabelText('Marcar Preparar presentación como completada')
    await user.click(checkbox)
    expect(checkbox).toBeChecked()
    expect(screen.getByText('0 tareas pendientes')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Eliminar' }))
    expect(screen.queryByText('Preparar presentación')).not.toBeInTheDocument()
    expect(screen.getByText(/no hay tareas/i)).toBeInTheDocument()
  })

  test('edita una tarea existente', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    await user.type(screen.getByLabelText('Nueva tarea'), 'Tarea inicial')
    await user.click(screen.getByRole('button', { name: 'Agregar' }))

    await user.click(screen.getByRole('button', { name: 'Editar' }))
    const input = screen.getByLabelText('Editar tarea')
    await user.clear(input)
    await user.type(input, 'Tarea corregida')
    await user.click(screen.getByRole('button', { name: 'Guardar' }))

    expect(screen.getByText('Tarea corregida')).toBeInTheDocument()
    expect(screen.queryByText('Tarea inicial')).not.toBeInTheDocument()
  })

  test('actualiza el contador de tareas pendientes', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    expect(screen.getByText('0 tareas pendientes')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Nueva tarea'), 'Hacer ejercicio')
    await user.click(screen.getByRole('button', { name: 'Agregar' }))

    expect(screen.getByText('1 tarea pendiente')).toBeInTheDocument()
  })

  test('elimina todas las tareas completadas', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    await user.type(screen.getByLabelText('Nueva tarea'), 'Tarea A')
    await user.click(screen.getByRole('button', { name: 'Agregar' }))
    await user.type(screen.getByLabelText('Nueva tarea'), 'Tarea B')
    await user.click(screen.getByRole('button', { name: 'Agregar' }))

    await user.click(screen.getByLabelText('Marcar Tarea A como completada'))
    await user.click(screen.getByRole('button', { name: 'Eliminar completadas' }))

    expect(screen.queryByText('Tarea A')).not.toBeInTheDocument()
    expect(screen.getByText('Tarea B')).toBeInTheDocument()
  })
})
