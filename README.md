# Todo App con Jest y React Testing Library

Aplicación simple de tareas con pruebas para:

- crear tareas
- editar tareas
- eliminar tareas

## Qué contiene

- `src/components/TodoApp.jsx`: interfaz de usuario y manejo de formularios.
- `src/hooks/useTodos.js`: lógica de tareas y estado.
- `src/components/__tests__/TodoApp.test.jsx`: pruebas del flujo de usuario.
- `src/hooks/__tests__/useTodos.test.js`: pruebas de la lógica del hook.

## Comandos

- `npm install`: instala dependencias.
- `npm test`: corre todos los tests.
- `npm run test:coverage`: genera el reporte de cobertura.

## Coverage

La cobertura muestra qué líneas de código fueron ejecutadas durante los tests.

Para generar el reporte:

```bash
npm run test:coverage
```

Después de ejecutar el comando, abre el resultado en:

```bash
coverage/lcov-report/index.html
```

## Qué comprueban los tests

- `useTodos.test.js`: crear tarea, editar tarea, eliminar tarea, rechazar texto vacío.
- `TodoApp.test.jsx`: agregar tarea en la UI, editarla y eliminarla.

## Cómo reconocer fallos

Un test falla cuando el comportamiento real no coincide con lo que espera la prueba.

Casos típicos:

- la tarea creada no aparece en pantalla.
- editar no cambia el texto mostrado.
- eliminar no borra la tarea correcta.

## Qué debe hacer el código para pasar

- crear solo tareas con texto válido.
- editar la tarea indicada.
- eliminar la tarea indicada.
- mantener los botones y labels que usan las pruebas.

Ejecuta:

```bash
npm test
```
