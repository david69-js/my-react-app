# Todo App con Jest y React Testing Library

Este proyecto muestra una pequeña aplicación de tareas con pruebas unitarias y de integración.

## Qué incluye

- `src/components/TodoApp.jsx`: UI y control del formulario.
- `src/hooks/useTodos.js`: lógica de tareas y estado.
- `src/components/__tests__/TodoApp.test.jsx`: pruebas de flujo de usuario.
- `src/hooks/__tests__/useTodos.test.js`: pruebas de la lógica interna.

---

## Comandos principales

| Comando | Qué hace |
|---|---|
| `npm install` | Instala dependencias |
| `npm test` | Ejecuta todas las pruebas una vez |
| `npm run test:watch` | Ejecuta pruebas en modo observación |
| `npm run test:coverage` | Ejecuta pruebas y genera reporte de cobertura |

---

## ¿Qué es coverage?

La cobertura (`coverage`) indica qué partes del código se ejecutaron cuando se corrieron las pruebas.

- Si una línea está cubierta, alguna prueba la ejecutó.
- Si no está cubierta, esa parte no se probó.

No garantiza que el código esté libre de errores, pero ayuda a ver qué falta probar.

### Cómo generar coverage

```bash
npm run test:coverage
```

Esto crea una carpeta `coverage/` y un reporte HTML en `coverage/lcov-report/index.html`.

---

## Qué se espera de las pruebas

- `useTodos.test.js` debe validar la lógica del hook:
  - agregar tareas
  - rechazar entradas vacías
  - alternar completadas
  - editar tareas
  - eliminar tareas
  - limpiar tareas completadas
  - contar tareas pendientes

- `TodoApp.test.jsx` debe validar el flujo real del usuario:
  - agregar una tarea
  - marcarla como completada
  - editarla
  - eliminarla
  - limpiar completadas

---

## Cómo puede fallar un test

Un test falla cuando el comportamiento real del código no coincide con lo esperado.

Ejemplos:

- `toggleTodo` cambia todas las tareas en vez de solo la tarea correcta.
- `addTodo` acepta texto vacío o espacios en blanco.
- `removeTodo` no elimina la tarea indicada.
- `editTodo` no actualiza bien el texto.
- `clearCompleted` borra tareas que no están completadas.
- La UI no encuentra los `aria-label` o botones esperados.

Cuando fallan pruebas, el mensaje puede decir:

- `Unable to find an element with the text: ...`
- `Expected: true, Received: false`
- `Expected array length: 1, Received: 2`

---

## Cómo hacer que un test pase

Para que las pruebas pasen, el código debe:

- manejar correctamente los ids en `toggleTodo`, `removeTodo` y `editTodo`
- ignorar texto vacío en `addTodo` y `editTodo`
- mantener los `aria-label` y `role` que usan los tests
- actualizar el contador de tareas pendientes
- eliminar solo las tareas completadas con `clearCompleted()`

Después de corregir, ejecuta:

```bash
npm test
```

---

## Estructura simple del proyecto

```
src/
├── components/
│   ├── TodoApp.jsx
│   └── __tests__/TodoApp.test.jsx
├── hooks/
│   ├── useTodos.js
│   └── __tests__/useTodos.test.js
└── test/
    ├── setup.js
    └── fileMock.js
```

---

## Notas rápidas

- `@testing-library/react` sirve para renderizar componentes y buscar elementos.
- `@testing-library/user-event` simula acciones reales del usuario.
- `jest` corre las pruebas en un entorno `jsdom`.
- `@testing-library/jest-dom` agrega matchers útiles como `toBeInTheDocument()`.
