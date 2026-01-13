# Proyecto de Práctica: Servidor Node.js con TypeScript

Este proyecto es un ejercicio práctico para aprender a configurar un entorno de desarrollo profesional con **TypeScript** y **Node.js** desde cero, crear un servidor HTTP nativo (sin frameworks como Express), servir archivos estáticos (HTML/CSS) y construir una API RESTful básica. También abarca conceptos de **refactorización** y organización de código.

## 🚀 Guía Paso a Paso: Creación del Entorno

A continuación se detallan los pasos para crear este entorno dadesde cero.

### 1. Preparación del Directorio

Creamos la carpeta del proyecto y entramos en ella. Esto aísla nuestro código y dependencias.

```bash
mkdir mi-proyecto-ts
cd mi-proyecto-ts
```

### 2. Inicialización del Proyecto

Generamos el archivo `package.json` con los valores por defecto. Este archivo gestionará nuestras dependencias y scripts de ejecución.

```bash
npm init -y
```

### 3. Instalación de Dependencias

Instalamos las herramientas necesarias para trabajar con TypeScript en Node.js:

```bash
npm install --save-dev typescript ts-node ts-node-dev @types/node
```

- **typescript**: El compilador principal.
- **ts-node**: Permite ejecutar archivos `.ts` directamente en Node sin compilar manualmente.
- **ts-node-dev**: Reinicia el servidor automáticamente cuando detecta cambios (hot-reloading).
- **@types/node**: Proporciona los tipos de datos para las APIs nativas de Node.js (http, fs, path, etc.).

### 4. Configuración de TypeScript

Generamos el archivo `tsconfig.json`. Este archivo le dice al compilador cómo procesar nuestro código.

```bash
npx tsc --init
```

Configuración recomendada para este proyecto (`tsconfig.json`):

```json
{
  "compilerOptions": {
    "target": "ES2020", // Versión moderna de JS
    "module": "CommonJS", // Estándar de módulos de Node.js
    "rootDir": "src", // Dónde está nuestro código fuente
    "outDir": "dist", // Dónde se guardará el código compilado
    "strict": true, // Tipado estricto para mayor seguridad
    "esModuleInterop": true, // Compatibilidad entre módulos CommonJS y ES
    "resolveJsonModule": true, // Permitir importar archivos JSON
    "sourceMap": true, // Ayuda para depurar el código
    "noImplicitAny": true // Evitar el tipo 'any' implícito
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### 5. Estructura de Archivos y Scripts

Organizaremos el código dentro de la carpeta `src` para mantener el proyecto limpio.

```bash
mkdir src
```

Configuramos los scripts en `package.json` para facilitar el desarrollo:

```json
"scripts": {
  "build": "tsc",                                                 // Compila el proyecto a JS
  "start": "node dist/index.js",                                  // Ejecuta el proyecto compilado (Producción)
  "dev": "ts-node-dev --respawn --transpile-only src/index.ts",   // Modo desarrollo con recarga automática
  "tsc:watch": "tsc -w"                                           // Compila en segundo plano
}
```

## 🛠️ Cómo Funciona el Código

El proyecto consta de un servidor HTTP nativo que maneja tanto la lógica de la API como el servicio de archivos estáticos.

### `src/index.ts` (El Servidor)

Este archivo es el punto de entrada. Utiliza el módulo nativo `http` de Node.js.

- **Servidor HTTP**: Se crea con `http.createServer`. Intercepta cada petición (`req`) y decide qué responder (`res`).
- **API (`/api/marines`)**: Si la URL coincide con las rutas de la API, consulta los datos en memoria y responde con JSON.
- **Archivos Estáticos**: Si la URL no es de API (ej. `/`, `/styles.css`), lee el archivo correspondiente de la carpeta `public` usando `fs.readFile` y lo envía al navegador con el `Content-Type` adecuado.

### `src/data/marines.ts` (Los Datos)

Originalmente, estos datos podían estar mezclados en el código. Como ejercicio de **Refactorización**, los hemos movido a su propio módulo.

- Define la interfaz `Marine` (Tipado fuerte).
- Exporta un array `marines` que actúa como nuestra base de datos en memoria.

### Cliente Web (`src/public`)

Contiene `index.html`, `styles.css` y `main.js`.

- **HTML/CSS**: Estructura y estilo visual.
- **JS (`main.js`)**: Realiza una petición `fetch('/api/marines')` al servidor, recibe el JSON y manipula el DOM para mostrar las tarjetas de los marines dinámicamente.

## 🔄 Refactorización

El proceso de refactorización realizado incluyó:

1.  **Separación de Responsabilidades**: Mover los datos de los soldados (`soldiers.ts`) a una capa de datos dedicada (`data/marines.ts`).
2.  **Consolidación del Servidor**: Unificar la lógica de servir HTML y la API en un solo archivo (`index.ts`), eliminando la necesidad de correr dos servidores separados.
3.  **Tipado Consistente**: Renombrar las entidades a `Marine` para mantener coherencia con el dominio del problema en todo el proyecto.

## ▶️ Ejecución

1.  **Instalar dependencias**:
    ```bash
    npm install
    ```
2.  **Modo Desarrollo** (Recomendado):
    ```bash
    npm run dev
    ```
    El servidor iniciará en `http://localhost:3000`.
3.  **Modo Producción**:
    ```bash
    npm run build
    npm start
    ```
