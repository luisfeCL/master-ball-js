# master-ball-js

Librería npm para utilidades JS con temática Master Ball.

## Instalación

```bash
npm install master-ball-js
```

## Uso

### CommonJS

```js
const { capturarPokemon } = require('master-ball-js');
console.log(capturarPokemon('Pikachu'));
```

### ES Modules / TypeScript

```ts
import { capturarPokemon } from 'master-ball-js';
console.log(capturarPokemon('Pikachu'));
```

## Scripts

- `npm test`: ejecuta tests con Jest
- `npm run build`: transpila `src` a `dist` con Babel
- `npm run clean`: elimina `dist`

## Estructura

- `src/`: código fuente
- `dist/`: archivos generados (build)
- `test/`: tests
- `package.json`: metadatos y scripts

## Contribuir

1. Clona el repo
2. `npm install`
3. `npm test`
4. `npm run build`

## Licencia

MIT

