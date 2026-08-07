import { act, renderHook } from '@testing-library/react'
import { useTodos } from '../useTodos'

describe('useTodos', () => {
  test('inicia con una lista vacía por defecto', () => {
    const { result } = renderHook(() => useTodos())
    expect(result.current.todos).toEqual([])
  })

  test('inicia con las tareas iniciales que recibe', () => {
    const initial = [{ id: '1', text: 'Comprar leche', completed: false }]
    const { result } = renderHook(() => useTodos(initial))
    expect(result.current.todos).toHaveLength(1)
    expect(result.current.todos[0].text).toBe('Comprar leche')
  })

  test('agrega una tarea', () => {
    const { result } = renderHook(() => useTodos())
    act(() => result.current.addTodo('Estudiar Jest'))
    expect(result.current.todos).toHaveLength(1)
    expect(result.current.todos[0]).toMatchObject({
      text: 'Estudiar Jest',
      completed: false,
    })
  })

  test('no agrega tareas vacías o con solo espacios', () => {
    const { result } = renderHook(() => useTodos())
    act(() => result.current.addTodo('   '))
    expect(result.current.todos).toHaveLength(0)
  })

  test('marca una tarea como completada y la desmarca', () => {
    const { result } = renderHook(() =>
      useTodos([{ id: '1', text: 'Tarea', completed: false }]),
    )
    act(() => result.current.toggleTodo('1'))
    expect(result.current.todos[0].completed).toBe(true)
    act(() => result.current.toggleTodo('1'))
    expect(result.current.todos[0].completed).toBe(false)
  })

  test('elimina una tarea por su id', () => {
    const { result } = renderHook(() =>
      useTodos([{ id: '1', text: 'Tarea', completed: false }]),
    )
    act(() => result.current.removeTodo('1'))
    expect(result.current.todos).toHaveLength(0)
  })

  test('edita el texto de una tarea', () => {
    const { result } = renderHook(() =>
      useTodos([{ id: '1', text: 'Tarea', completed: false }]),
    )
    act(() => result.current.editTodo('1', 'Tarea editada'))
    expect(result.current.todos[0].text).toBe('Tarea editada')
  })

  test('no edita con texto vacío', () => {
    const { result } = renderHook(() =>
      useTodos([{ id: '1', text: 'Tarea', completed: false }]),
    )
    act(() => result.current.editTodo('1', '   '))
    expect(result.current.todos[0].text).toBe('Tarea')
  })

  test('edita solo la tarea indicada y deja las demás intactas', () => {
    const { result } = renderHook(() =>
      useTodos([
        { id: '1', text: 'Primera', completed: false },
        { id: '2', text: 'Segunda', completed: false },
      ]),
    )
    act(() => result.current.editTodo('1', 'Primera actualizada'))
    expect(result.current.todos[0].text).toBe('Primera actualizada')
    expect(result.current.todos[1].text).toBe('Segunda')
  })

  test('elimina solo las tareas completadas', () => {
    const { result } = renderHook(() =>
      useTodos([
        { id: '1', text: 'Pendiente', completed: false },
        { id: '2', text: 'Hecha', completed: true },
      ]),
    )
    act(() => result.current.clearCompleted())
    expect(result.current.todos).toHaveLength(1)
    expect(result.current.todos[0].id).toBe('1')
  })

  test('calcula la cantidad de tareas pendientes', () => {
    const { result } = renderHook(() =>
      useTodos([
        { id: '1', text: 'A', completed: false },
        { id: '2', text: 'B', completed: true },
        { id: '3', text: 'C', completed: false },
      ]),
    )
    expect(result.current.activeCount).toBe(2)
  })
})
