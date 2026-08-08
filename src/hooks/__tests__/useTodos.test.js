import { act, renderHook } from '@testing-library/react'
import { useTodos } from '../useTodos'

// Este módulo prueba el comportamiento del hook useTodos.
// Su propósito es verificar que la lógica para agregar, editar, eliminar y validar tareas funcione correctamente.
// Las funciones clave aquí son:
// - setup: prepara el hook para cada prueba.
// - todo: crea un objeto de tarea con datos por defecto.
// - act: ejecuta cambios de estado como si fueran acciones reales del usuario.
// - expect: comprueba que el resultado coincide con lo esperado.
// En resumen, estos tests aseguran que el hook se comporte bien en los casos normales y en los casos límite.

// Ayuda para crear el hook de forma rápida en cada prueba.
const setup = (initial = []) => renderHook(() => useTodos(initial)).result

// Función pequeña para construir un objeto de tarea con valores por defecto.
const todo = (overrides) => ({
  id: '1',
  text: 'Tarea',
  ...overrides,
})

describe('useTodos', () => {
  // Verifica que el hook empiece con una lista vacía si no se pasa nada.
  it('inicia con una lista vacía por defecto', () => {
    expect(setup().current.todos).toEqual([])
  })

  // Verifica que el hook acepte una lista inicial de tareas.
  it('acepta tareas iniciales', () => {
    const initial = [todo({ id: '1', text: 'Comprar leche' })]
    expect(setup(initial).current.todos).toEqual(initial)
  })

  // Verifica que agregar una tarea nueva cambie el estado.
  it('agrega una tarea nueva', () => {
    const result = setup()
    act(() => result.current.addTodo('Estudiar Jest'))
    expect(result.current.todos).toHaveLength(1)
    expect(result.current.todos[0]).toMatchObject({
      text: 'Estudiar Jest',
    })
  })

  // Verifica que no se agreguen tareas si el texto está vacío o solo tiene espacios.
  it('no agrega tareas vacías', () => {
    const result = setup()
    act(() => result.current.addTodo('   '))
    expect(result.current.todos).toHaveLength(0)
  })

  // Verifica que eliminar una tarea por su id la quite de la lista.
  it('elimina una tarea por id', () => {
    const result = setup([todo({ id: '1', text: 'Tarea' })])
    act(() => result.current.removeTodo('1'))
    expect(result.current.todos).toHaveLength(0)
  })

  // Verifica que editar una tarea cambie su texto.
  it('edita el texto de una tarea existente', () => {
    const result = setup([todo({ id: '1', text: 'Tarea' })])
    act(() => result.current.editTodo('1', 'Tarea editada'))
    expect(result.current.todos[0].text).toBe('Tarea editada')
  })

  // Verifica que no se modifique la tarea si el nuevo texto está vacío.
  it('no edita con texto vacío', () => {
    const result = setup([todo({ id: '1', text: 'Tarea' })])
    act(() => result.current.editTodo('1', '   '))
    expect(result.current.todos[0].text).toBe('Tarea')
  })
})
