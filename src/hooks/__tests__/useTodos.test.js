import { act, renderHook } from '@testing-library/react'
import { useTodos } from '../useTodos'

const setup = (initial = []) => renderHook(() => useTodos(initial)).result

const todo = (overrides) => ({
  id: '1',
  text: 'Tarea',
  ...overrides,
})

describe('useTodos', () => {
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
    })
  })

  it('no agrega tareas vacías', () => {
    const result = setup()
    act(() => result.current.addTodo('   '))
    expect(result.current.todos).toHaveLength(0)
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
})
