import { act, renderHook } from '@testing-library/react'
import { useTodos } from '../useTodos'

// Renderiza el hook useTodos con un estado inicial opcional.
const setup = (initial = []) => renderHook(() => useTodos(initial)).result

// Crea una tarea de prueba con valores por defecto y permite sobreescribirlos.
const todo = (overrides) => ({
  id: '1',
  text: 'Tarea',
  completed: false,
  ...overrides,
})

describe('useTodos', () => {
  // Comprueba el comportamiento del hook en cada acción disponible.

  it('inicia con una lista vacía por defecto', () => {
    expect(setup().current.todos).toEqual([])
  })

  it('acepta tareas iniciales', () => {
    const initial = [todo({ id: '1', text: 'Comprar leche' })]
    expect(setup(initial).current.todos).toEqual(initial)
  })

  it('agrega una tarea nueva', () => {
    const result = setup()
    act(() => result.current.addTodo('Estudiar Jest'))
    expect(result.current.todos).toHaveLength(1)
    expect(result.current.todos[0]).toMatchObject({
      text: 'Estudiar Jest',
      completed: false,
    })
  })

  it('no agrega tareas vacías', () => {
    const result = setup()
    act(() => result.current.addTodo('   '))
    expect(result.current.todos).toHaveLength(0)
  })

  it('alterna el estado completado de una tarea', () => {
    const result = setup([todo({ id: '1', text: 'Tarea', completed: false })])
    act(() => result.current.toggleTodo('1'))
    expect(result.current.todos[0].completed).toBe(true)
    act(() => result.current.toggleTodo('1'))
    expect(result.current.todos[0].completed).toBe(false)
  })

  it('elimina una tarea por id', () => {
    const result = setup([todo({ id: '1', text: 'Tarea' })])
    act(() => result.current.removeTodo('1'))
    expect(result.current.todos).toHaveLength(0)
  })

  it('edita el texto de una tarea existente', () => {
    const result = setup([todo({ id: '1', text: 'Tarea' })])
    act(() => result.current.editTodo('1', 'Tarea editada'))
    expect(result.current.todos[0].text).toBe('Tarea editada')
  })

  it('no edita con texto vacío', () => {
    const result = setup([todo({ id: '1', text: 'Tarea' })])
    act(() => result.current.editTodo('1', '   '))
    expect(result.current.todos[0].text).toBe('Tarea')
  })

  it('limpia solo las tareas completadas', () => {
    const result = setup([
      todo({ id: '1', text: 'Pendiente', completed: false }),
      todo({ id: '2', text: 'Hecha', completed: true }),
    ])
    act(() => result.current.clearCompleted())
    expect(result.current.todos).toHaveLength(1)
    expect(result.current.todos[0].id).toBe('1')
  })

  it('calcula el número de tareas pendientes', () => {
    const result = setup([
      todo({ id: '1', text: 'A' }),
      todo({ id: '2', text: 'B', completed: true }),
      todo({ id: '3', text: 'C' }),
    ])
    expect(result.current.activeCount).toBe(2)
  })
})
