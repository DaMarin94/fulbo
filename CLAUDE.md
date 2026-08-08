# Fulbo — Contexto del proyecto

## Stack

- **Frontend:** React + Vite + TypeScript + Tailwind CSS (`localhost:5173`)
- **Backend:** Node.js + Express + TypeScript (`localhost:3001`)
- **DB / ORM:** SQLite + Prisma (caché local de API-Football + contador de cuota)
- **Fuente de datos:** API-Football (api-football.com), plan gratuito
- **Auth:** no hay — la v1 es single user, sin autenticación
- **Gestor de paquetes:** npm

## Regla de oro — No escaparse de lo definido

Implementá / documentá **EXACTAMENTE** lo que está definido en la documentación del proyecto (`docs/requirements.md`, `docs/screens.md`, `docs/data-model.md`, `docs/technical.md` y las decisiones ya cerradas). No inventes, no agregues alcance, no cambies rutas, nombres, comportamientos ni decisiones por tu cuenta, ni "para destrabar".

Si aparece un conflicto entre la spec y el código existente, una ambigüedad, una decisión no tomada, o cualquier duda → **FRENÁ TODO y preguntá** (al orquestador) antes de continuar. Nunca improvises una solución ni asumas un default no escrito.

**Ante la duda, se pregunta; no se inventa.**

## Agentes

El workflow de este proyecto está manejado por agentes en `.claude/agents/`:

- **`orchestrator`** — agente por defecto. Analiza, propone, delega y maneja git.
- **`analyst`** — análisis funcional, requerimientos y definición de pantallas; escriba de la documentación funcional y técnica (`docs/` y `.claude/agents/`), excepto la documentación de diseño. Invocado por el orquestador cuando: (a) un pedido agrega o cambia un requerimiento funcional o una pantalla (antes de cerrar la decisión), o (b) hay que escribir/actualizar documentación.
- **`design`** — diseño visual: define el lenguaje visual (color, tipografía, ubicación, tamaño, jerarquía, comportamiento visual) y produce especificaciones de diseño que `frontend` implementa. Único escriba de `docs/design.md` y de las specs visuales. No escribe código de la app, no toca implementación, no hace git. Invocado por el orquestador.
- **`frontend`** — implementa cambios en el frontend. Invocado por el orquestador.
- **`backend`** — implementa cambios en el backend. Invocado por el orquestador.

## Decisiones de diseño

- **Es un visor de fixtures, no una app de apuestas ni un juego.** No proponer cuotas, pronósticos, puntajes de usuario ni mecánicas de juego.
- **Los datos son de solo lectura, espejo de API-Football.** La app no calcula, no deriva ni valida datos de dominio: muestra lo que la API devuelve. No inventar campos ni lógica de negocio propia sobre los fixtures.
- **La cuota es de 100 requests/día (plan gratuito de API-Football).** Todo acceso a datos pasa por la caché local; nada le pega a la API por request de usuario. Toda feature nueva que consuma la API declara su costo en requests.
- **Backend separado del frontend.** No mover la lógica de datos ni el acceso a API-Football al frontend: el backend independiente es lo que habilita un cliente mobile futuro consumiendo la misma API.
- **Sin autenticación en la v1.** Single user. No proponer usuarios, roles, permisos ni scoping por usuario.
- **Mobile-first, siempre.** Se diseña e implementa arrancando en el viewport mínimo soportado (320px) y se crece hacia arriba — nunca al revés, nunca "se adapta después". Toda pantalla y todo cambio tienen que mantener compatibilidad mobile. Detalle visual del breakpoint en `docs/design.md` § 1; requerimiento no funcional en `docs/requirements.md`.
- **El diseño visual tiene su propio agente (`design`).** El workflow para features visuales/UI es **design → frontend**: `design` produce el spec visual (color, tipografía, tamaño, ubicación, jerarquía) y `frontend` lo implementa. La guía viva del lenguaje visual vive en `docs/design.md`, de la que `design` es el único escriba.
- **QA visual al cierre de tareas con UI.** Para toda tarea con superficie visual/UI, el orquestador corre un QA visual per-feature (paso 5.5 del flujo): lo ejecuta él directo contra el navegador conectado vía `/chrome`, con hand-off del prompt al usuario en la extensión Claude para Chrome como fallback si el navegador no está disponible. El asset vivo (prompt genérico + plantilla per-feature) vive en `docs/qa-visual.md`.
