# Estándares transversales

Patrones que aplican a todo el código. Si algo no está acá, se pregunta antes de inventarlo.

## Manejo de errores

**Centralizado y DRY.** No se maneja error por endpoint ni por componente.

**Backend**
- Toda excepción se convierte en una respuesta `{ error }` con el status HTTP que corresponda.
- La conversión la hace un **middleware central de errores de Express**, no cada handler.

**Frontend**
- Todas las llamadas al backend pasan por una **capa central de HTTP**. Ningún componente hace `fetch` suelto.
- El error se le muestra al usuario en **toast**.
- La cuota de API-Football agotada **no es un caso especial de esta capa**: no produce mensaje ni tratamiento propio en el frontend (RF-006).

## Validación

**No se usa librería de validación** (ni zod ni equivalente). La app no tiene inputs de usuario más allá de la selección del equipo favorito (RF-005), y no hay escritura de datos de dominio (RN-002).

Si aparece un input que justifique validación, se decide antes de implementarlo.

## Logging

**Centralizado y robusto.** Un único logger; nada de `console.log` disperso.

Debe cubrir explícitamente el **consumo de la cuota de API-Football** (RNF-001): cada llamada a la API externa queda registrada, con el consumo acumulado del día.

> **PENDIENTE (no bloqueante):** la librería concreta de logging (pino, winston u otra) se elige al implementar el backend.

## Mobile-first

RNF-004 es una regla de desarrollo, no solo de diseño:

- Se implementa y se verifica **primero a 320px**, el ancho mínimo soportado. No se construye para escritorio y se "prueba después en mobile".
- Los estilos base son los del ancho mínimo; los anchos mayores se agregan con media queries hacia arriba, nunca con `max-width` para parchear.
- Toda pantalla nueva o modificada se revisa a 320px antes de darse por terminada.

Breakpoints y detalle visual: `docs/design.md` § 1.

## Testing

- **Framework: Vitest**, en frontend y backend.
- **Desde el día 1**, con filosofía de cobertura **exhaustiva**: no se difiere para después.
- Toda feature se entrega **con sus tests en el mismo commit/PR**.

## Env y secretos

- La **API key de API-Football** vive en `.env` y **no se commitea**.
- El `.env` es de cada entorno; no hay diferencias entre entornos identificadas más allá de eso.

## Migraciones y semillas

- Migraciones: las que maneja **Prisma** (`prisma migrate`).
- **Datos semilla:** las tres competiciones cubiertas por la v1 — Primera A de Argentina, Copa Libertadores y Copa Sudamericana.

> **PENDIENTE — relevamiento técnico:** los IDs de esas competiciones en API-Football, a completar con el mismo relevamiento de la API que pide `docs/data-model.md`.
