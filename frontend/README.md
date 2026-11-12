# Urbanística ERP V2 — Frontend

React, React Router y Tailwind CSS v4. Diseño y componentes compatibles reutilizados de V1.

```sh
npm install
npm run dev
npm run build
npm run lint
node --test tests/roles.test.js
```

Copiar `.env.example` a `.env` para configurar `VITE_API_URL`. Para desplegar, servir `dist/` con fallback de las rutas del navegador a `index.html`.

El backend V2 implementa autenticación JWT y API de empresas. Configure la conexión y utilice usuarios reales con rol global; no hay datos ni sesiones de demostración. Ver [etapas, componentes reutilizados y contrato pendiente](docs/MIGRACION-V1.md).
