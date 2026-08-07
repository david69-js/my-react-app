# Todo App con Jest y React Testing Library

Proyecto académico sencillo que demuestra el ciclo completo de testing con **Jest** y **React Testing Library**:

**crear pruebas → ejecutarlas → romper el código → observar el fallo → corregir → volver a ejecutar → reporte de cobertura**.

---

## Requisitos

- Node.js 20+ (probado con Node 26)
- npm

## Instalación

```bash
npm install
```

## 1. Crear el proyecto con Vite

```bash
npm create vite@latest my-react-app -- --template react
cd my-react-app
npm install
```

## 2. Configurar Jest y React Testing Library

```bash
npm install -D jest babel-jest jest-environment-jsdom \
  @babel/core @babel/preset-env @babel/preset-react \
  @testing-library/react @testing-library/jest-dom \
  @testing-library/user-event identity-obj-proxy
```

| Paquete | Rol |
|---|---|
| `jest` | Corredor de pruebas |
| `babel-jest` + presets | Traduce JSX/ES moderno para Jest |
| `jest-environment-jsdom` | Navegador simulado |
| `@testing-library/react` | Renderizar e interactuar con componentes |
| `@testing-library/jest-dom` | Matchers extra (`toBeInTheDocument`, ...) |
| `@testing-library/user-event` | Simular eventos reales (escribir, clic) |
| `identity-obj-proxy` | Finge los archivos CSS en las pruebas |

**`babel.config.js`** (traduce el JSX):

```js
export default {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
}
```

**`jest.config.js`**:

```js
export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEach: ['<rootDir>/src/test/setup.js'],
  transform: { '^.+\\.(js|jsx)$': 'babel-jest' },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(png|jpg|jpeg|gif|svg|webp|ico)$': '<rootDir>/src/test/fileMock.js',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/main.jsx',
    '!src/test/**',
  ],
  coverageDirectory: 'coverage',
}
```

**`src/test/setup.js`**:

```js
import '@testing-library/jest-dom'
```

**Scripts** (`package.json`):

```json
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
}
```

## 3. Estructura del proyecto

```
src/
├── main.jsx                    # Punto de entrada (renderiza TodoApp)
├── App.css / index.css         # Estilos
├── components/
│   ├── TodoApp.jsx             # Todo el UI (formulario, lista, edición)
│   └── __tests__/TodoApp.test.jsx   # Pruebas de integración
├── hooks/
│   ├── useTodos.js             # Toda la lógica (estado + CRUD)
│   └── __tests__/useTodos.test.js   # Pruebas unitarias de la lógica
└── test/
    ├── setup.js                # Config de Jest
    └── fileMock.js             # Stub para imágenes
```

Solo **2 archivos de código** y **2 archivos de prueba**.

## 4. Implementar la Todo App

- **`useTodos.js`**: hook con `useState` y las operaciones `addTodo`, `toggleTodo`, `removeTodo`, `editTodo`, `clearCompleted` y `activeCount`. Genera IDs con un contador interno.
- **`TodoApp.jsx`**: un solo componente que usa el hook, controla el input del formulario, pinta la lista y maneja el modo edición por tarea.

Los `aria-label` de los elementos interactivos son la vía por la que las pruebas localizan los elementos.

## 5. Pruebas

**Unitaria de lógica** (`useTodos.test.js`) — sin renderizar UI:

```js
import { act, renderHook } from '@testing-library/react'
import { useTodos } from '../useTodos'

test('marca una tarea como completada y la desmarca', () => {
  const { result } = renderHook(() =>
    useTodos([{ id: '1', text: 'Tarea', completed: false }]),
  )
  act(() => result.current.toggleTodo('1'))
  expect(result.current.todos[0].completed).toBe(true)
  act(() => result.current.toggleTodo('1'))
  expect(result.current.todos[0].completed).toBe(false)
})
```

**De integración** (`TodoApp.test.jsx`) — flujo real del usuario:

```js
test('agrega, completa y elimina una tarea', async () => {
  const user = userEvent.setup()
  render(<TodoApp />)

  await user.type(screen.getByLabelText('Nueva tarea'), 'Preparar presentación')
  await user.click(screen.getByRole('button', { name: 'Agregar' }))
  expect(screen.getByText('Preparar presentación')).toBeInTheDocument()

  const checkbox = screen.getByLabelText('Marcar Preparar presentación como completada')
  await user.click(checkbox)
  expect(checkbox).toBeChecked()

  await user.click(screen.getByRole('button', { name: 'Eliminar' }))
  expect(screen.queryByText('Preparar presentación')).not.toBeInTheDocument()
})
```

## 6. Qué verifica cada prueba y por qué importa

| Archivo | Nivel | Qué verifica |
|---|---|---|
| `useTodos.test.js` | Unitaria (lógica) | Agregar y rechazar vacíos, toggle, eliminar, editar, limpiar completadas, contador |
| `TodoApp.test.jsx` | Integración | Agregar→completar→eliminar, editar, contador, "Eliminar completadas" |

## 7. Ejecutar las pruebas

```bash
npm test -- --verbose
```

Resultado: `Test Suites: 2 passed` · `Tests: 15 passed`.

## 8. Introducir un error intencional

Se rompe `toggleTodo` quitando la condición del `id` (todas las tareas cambian de estado):

```js
const toggleTodo = (id) => {
  setTodos((prev) =>
    prev.map((todo) => ({ ...todo, completed: !todo.completed })),
  )
}
```

## 9. Analizar el mensaje de error

```
Unable to find an element with the text: Tarea B
```

El fallo aparece en la prueba de integración "elimina todas las tareas completadas". **Solo se manifiesta con más de una tarea**: al marcar `Tarea A`, el bug también completa `Tarea B`, y "Eliminar completadas" borra ambas.

**Lección:** las pruebas con múltiples datos atrapan bugs que las de un solo dato no ven.

## 10. Corregir el error

```js
const toggleTodo = (id) => {
  setTodos((prev) =>
    prev.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo,
    ),
  )
}
```

## 11. Ejecutar hasta que pasen

```bash
npm test
```

Resultado: `Tests: 15 passed`.

## 12. Reporte de cobertura

```bash
npm run test:coverage
```

```
--------------|---------|----------|---------|---------|-------------------
File          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------|---------|----------|---------|---------|-------------------
All files     |     100 |      100 |     100 |     100 |
 components   |     100 |      100 |     100 |     100 |
  TodoApp.jsx |     100 |      100 |     100 |     100 |
 hooks        |     100 |      100 |     100 |     100 |
  useTodos.js |     100 |      100 |     100 |     100 |
--------------|---------|----------|---------|---------|-------------------
```

### Cómo interpretar cada métrica

| Métrica | Qué mide |
|---|---|
| **Statements** | % de sentencias ejecutables que se ejecutaron al menos una vez |
| **Branches** | % de ramas de cada condición (`if`, ternarios) que se tomaron |
| **Functions** | % de funciones que fueron llamadas |
| **Lines** | % de líneas de código ejecutables cubiertas |

La cobertura indica **qué tanto** código se ejecutó, no **qué tan bien** se verificó. Un 100% no garantiza ausencia de bugs, pero una cobertura baja (< 80%) en código crítico es señal de alerta. El reporte HTML interactivo está en `coverage/lcov-report/index.html`.

## Comandos útiles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compila para producción |
| `npm test` | Ejecuta las pruebas una vez |
| `npm run test:watch` | Ejecuta las pruebas en modo observación |
| `npm run test:coverage` | Ejecuta las pruebas y genera el reporte de cobertura |
| `npm run lint` | ESLint |
