# Guía de Testing para Todo App

Este archivo sirve para practicar cómo hacer que una prueba falle y luego corregirla.

## 1. Qué probar

La app debe permitir:

- crear tareas
- editar tareas
- eliminar tareas

## 2. Archivos importantes

- `src/hooks/useTodos.js`: lógica de las tareas
- `src/components/TodoApp.jsx`: interfaz de usuario
- `src/hooks/__tests__/useTodos.test.js`: pruebas del hook
- `src/components/__tests__/TodoApp.test.jsx`: pruebas de la UI

## 3. Cómo romper una función

### Ejemplo: romper `removeTodo`

Abre `src/hooks/useTodos.js` y cambia la función así:

```js
const removeTodo = (id) => {
  setTodos((prev) => prev.filter((todo) => todo.id === id))
}
```

¿Por qué falla?

Porque la prueba espera que al eliminar una tarea se borre la que coincide con su `id`. En este ejemplo, la función está haciendo lo contrario: en lugar de borrar la tarea correcta, deja la que debería eliminarse.

¿Qué significa `prev`?

`prev` es el estado anterior de la lista de tareas. Cuando haces `setTodos((prev) => ...)`, estás recibiendo el valor actual de `todos` y puedes devolver una nueva lista basada en ese valor.

En otras palabras:

- `prev` = lo que había antes en la lista
- `setTodos(...)` = reemplazar esa lista por una nueva versión

Luego ejecuta:

```bash
npm test
```

Verás que una prueba falla.

### Ejemplo: romper `editTodo`

Cambia la lógica para que no actualice el texto:

```js
const editTodo = (id, newText) => {
  const trimmed = newText.trim()
  if (!trimmed) return
  setTodos((prev) => prev.map((todo) => todo))
}
```

¿Por qué falla?

Porque la prueba espera que la tarea cambie de texto. En este ejemplo, el código devuelve las tareas sin modificar ninguna, así que el texto sigue igual.

Ejecuta otra vez:

```bash
npm test
```

## 4. Cómo romper la interfaz

En `src/components/TodoApp.jsx`, puedes cambiar el botón de eliminar para usar un id incorrecto:

```jsx
<button onClick={() => removeTodo('otro-id')}>Eliminar</button>
```

Luego corre:

```bash
npm test
```

## 5. Cómo arreglarlo

Después del fallo, vuelve al código y deja la lógica correcta.

### Forma correcta de `removeTodo`

```js
const removeTodo = (id) => {
  setTodos((prev) => prev.filter((todo) => todo.id !== id))
}
```

### Forma correcta de `editTodo`

```js
const editTodo = (id, newText) => {
  const trimmed = newText.trim()
  if (!trimmed) return
  setTodos((prev) =>
    prev.map((todo) => (todo.id === id ? { ...todo, text: trimmed } : todo)),
  )
}
```

## 6. Verificar que todo funciona

Ejecuta nuevamente:

```bash
npm test
```

Si todo está bien, verás algo similar a:

```bash
Test Suites: 2 passed, 2 total
Tests: 9 passed, 9 total
```

## 7. Coverage

Si quieres ver qué parte del código fue probada:

```bash
npm run test:coverage
```
