# Todo App con Jest y React Testing Library

## App Todo

- Crear tareas.
- Editar tareas.
- Eliminar tareas.

## Tests

- `useTodos.test.js`: verifica la lógica de crear, editar y eliminar.
- `TodoApp.test.jsx`: verifica el flujo de usuario en la UI.

## Comandos

- `npm test`: corre todos los tests.
- `npm run test:coverage`: genera coverage.

## Coverage

Muestra qué líneas del código se ejecutaron durante las pruebas.

Generar coverage:

```bash
npm run test:coverage
```

## Cuando un test falla

Un test falla si el código no hace lo que espera la prueba.

Ejemplos:

- la tarea creada no aparece.
- editar no cambia el texto.
- eliminar no quita la tarea correcta.

## Cuando un test pasa

- crear tareas válidas.
- editar la tarea correcta.
- eliminar la tarea correcta.

Ejecuta:

```bash
npm test
```
