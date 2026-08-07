# Arquitectura

Stack resumido en `CLAUDE.md` § Stack. Acá viven las decisiones estructurales y su porqué.

## Partición

**Frontend y backend separados**, en paquetes propios (`frontend/`, `backend/`).

El backend expone la API que consume el frontend web hoy y que consumirá un **cliente mobile a futuro**, sin tocar el backend cuando eso llegue. Por eso la lógica de datos y el acceso a API-Football viven en el backend, nunca en el frontend.

## Piezas

| Pieza | Stack | Local |
|-------|-------|-------|
| Frontend | React + Vite + TypeScript + Tailwind CSS | `localhost:5173` |
| Backend | Node.js + Express + TypeScript | `localhost:3001` |
| Base de datos | SQLite vía Prisma | archivo local |

Gestor de paquetes: **npm** en ambos paquetes. Los comandos canónicos (`dev`, `build`, `test`) se fijan en el scaffold inicial de cada paquete.

## Fuente de datos y caché

- La única fuente de datos deportivos es la API externa **API-Football** (api-football.com), consumida **solo desde el backend**. La API key nunca llega al frontend.
- El plan gratuito limita a **100 requests/día** (RNF-001). Por eso la base local existe: es **caché de fixtures + contador de consumo diario**, no una base de dominio propia. Ningún request del usuario le pega directo a la API externa (RNF-002).
- Migraciones: `prisma migrate` (ver `docs/technical.md`).

> **PENDIENTE:** la estrategia concreta de caché (qué se cachea, cuándo se refresca, cómo se reparten los 100 requests diarios) se define al implementar el backend.

## Autenticación

**No hay.** La v1 es de un solo usuario (RNF-003): sin login, sin sesión, sin scoping por usuario.

## Hosting

Solo local por ahora. **PENDIENTE (no bloqueante):** hosting definitivo de frontend, backend y base de datos.
