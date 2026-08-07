# Modelo de datos

Destino canónico de entidades, shapes de request/response y contratos de API. Las reglas funcionales viven en `docs/requirements.md`.

## Naturaleza del modelo

- La base local (SQLite vía Prisma) es una **caché de solo lectura de API-Football**, no una fuente de verdad. Los datos deportivos entran únicamente desde la API externa (RN-001, RN-002).
- **No hay auditoría de usuario** (creado/modificado por quién) sobre los datos deportivos: no hay usuarios ni escritura de dominio.
- **No hay borrado lógico** de datos deportivos: lo que se guarda es espejo de la API y se refresca contra ella.
- La única entidad que **no** es espejo de la API es el contador de consumo (ver más abajo).

## Entidades

Espejo de lo que expone API-Football:

| Entidad | Qué representa |
|---------|----------------|
| **Competición** | Un torneo cubierto por la app: Primera A de Argentina, Copa Libertadores, Copa Sudamericana. |
| **Equipo** | Un club que participa en alguna de las competiciones cubiertas. |
| **Partido / Fixture** | Un encuentro entre dos equipos dentro de una competición, con fecha, horario, estado y resultado cuando aplica. |

Relación mínima conocida: un **Partido** pertenece a una **Competición** y vincula (al menos) dos **Equipos**.

> **PENDIENTE — relevamiento técnico, no decisión de producto.** Falta consultar la documentación real de API-Football para cerrar:
> - Campos de cada entidad: obligatorios vs. opcionales, y cuál es la identidad (el ID de API-Football como clave natural, o clave técnica propia).
> - Relaciones y cardinalidad exactas más allá de la relación mínima de arriba.
> - **Estados/enums de partido**: los valores reales que devuelve la API (programado, en juego, finalizado, postergado/suspendido y los que existan) y las transiciones válidas.
> - Set exacto de entidades: puede haber más de tres si la API expone algo necesario (temporadas, rondas/jornadas, etc.).
> - Formato de fechas y horarios que devuelve la API, y paginación si la hay.
>
> Este relevamiento se hace antes o durante el arranque de la implementación del backend, y su resultado se vuelca acá.

## Consumo de la cuota de API-Football

RNF-001 exige llevar registro propio de los requests consumidos por día contra API-Football, porque la API no expone necesariamente ese dato. Eso requiere **una entidad propia de la app** (tipo `ApiUsage` o similar) que registre el consumo diario, fuera del espejo de datos deportivos.

> **PENDIENTE — relevamiento técnico:** el shape concreto (granularidad por día vs. por request, qué se guarda de cada llamado) se cierra junto con el relevamiento de la API y con la estrategia de caché del backend. Si API-Football sí expone el consumo restante en las respuestas, se evalúa usarlo como fuente y el contador propio queda como respaldo.

## Contratos de API (backend → clientes)

Forma de las respuestas de error: `{ error }` con el status HTTP correspondiente (ver `docs/technical.md` § Manejo de errores).

> **PENDIENTE:** los endpoints y sus shapes de respuesta se definen al implementar el backend y se documentan acá. Este es el contrato que consumen tanto el frontend web como el futuro cliente mobile (`docs/architecture.md`).
