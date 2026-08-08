import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoApp } from '../TodoApp'

// Estos tests leen la interfaz como si fuera un usuario real.
// Buscan elementos por etiquetas, texto y botones, y luego verifican que la app responda correctamente.
// Por ejemplo:
// - getByLabelText: encuentra un campo por su etiqueta visible.
// - getByRole: encuentra botones o controles por su rol accesible.
// - queryByText: busca texto en la pantalla y sirve para comprobar que algo ya no existe.

// Ayuda para renderizar la app en cada prueba.
const renderApp = () => {
  render(<TodoApp />)
}

// Ayuda para repetir el flujo de agregar una tarea desde la interfaz.
//Lo que hace es simular que un usuario escribe en el input y hace click en el botón de agregar.
const addTodo = async (user, text) => {

  await user.type(screen.getByLabelText('Nueva tarea'), text)
  await user.click(screen.getByRole('button', { name: 'Agregar' }))
}

describe('TodoApp', () => {
  // Prueba: agregar una tarea y luego eliminarla.
  it('permite agregar y eliminar una tarea', async () => {
    const user = userEvent.setup()
    renderApp()

    // Agrega una tarea nueva.
    await addTodo(user, 'Preparar presentación')

    expect(screen.getByText('Preparar presentación')).toBeInTheDocument()


    //eliminar
    await user.click(screen.getByRole('button', { name: 'Eliminar' }))
    expect(screen.queryByText('Preparar presentación')).not.toBeInTheDocument()
  })

  // Prueba: editar una tarea existente.
  it('permite editar una tarea existente', async () => {
    const user = userEvent.setup()
    renderApp()

    // Primero crea una tarea inicial.
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
