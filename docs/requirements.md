# Requerimientos

Destino canónico de toda regla funcional del proyecto. Los contratos y shapes viven en `docs/data-model.md`; los estándares técnicos, en `docs/technical.md`.

## Qué es Fulbo

Un visor de fixtures de fútbol de un solo usuario. Muestra los partidos de tres competiciones —Primera A de Argentina, Copa Libertadores y Copa Sudamericana— con su día, horario, equipos y resultado, tomados de la API externa **API-Football**.

No es una app de apuestas ni un juego.

## Alcance v1

### Dentro

| ID | Requerimiento funcional |
|----|--------------------------|
| RF-001 | La pantalla de entrada muestra los **partidos del día** de todas las competiciones cubiertas, con horario, equipos, competición y resultado cuando aplica. |
| RF-002 | Desde la pantalla de entrada se **navega día a día** (día anterior / día siguiente). |
| RF-003 | Se pueden ver **todos los partidos de una competición**, accediendo desde el nombre de la competición en un partido. |
| RF-004 | Se puede ver el **fixture propio de un equipo**, accediendo desde el nombre del equipo en un partido. |
| RF-005 | Hay un **equipo favorito predefinido**, fijado fuera de la UI (configuración del backend); no se elige desde ninguna pantalla. La app permite ver su **fixture filtrado** solo para ese equipo. |
| RF-006 | El agotamiento de la cuota diaria de la API externa (RNF-001) es **transparente para el usuario**: la app sigue sirviendo los últimos datos guardados en caché, **sin ninguna distinción** respecto de datos frescos (ni aviso, ni mensaje, ni tratamiento visual propio). Queda registrado únicamente en el logging interno del backend (`docs/technical.md` § Logging). |
| RF-007 | El usuario puede **elegir el tema** entre tres opciones —**Claro**, **Oscuro** y **Automático**— desde un control en la UI. **Automático** sigue el tema del sistema operativo y se actualiza solo si el sistema cambia mientras la app está abierta; es el estado por default hasta que el usuario elige explícitamente Claro u Oscuro, y puede volver a elegirse en cualquier momento. |
| RF-008 | En la pantalla de entrada los partidos del día se pueden ver con **dos agrupaciones conmutables**: **por torneo** —agrupa por competición y, dentro de cada una, por horario— y **por horario** —agrupa por hora de inicio y, dentro de cada una, por competición—. Son los mismos partidos del mismo día en los dos casos; lo único que cambia es cómo se agrupan. Un control en esa misma pantalla **alterna** entre ambas, y **por torneo** es el default. La elección **persiste entre sesiones en el mismo dispositivo y navegador**, guardada en el almacenamiento local del navegador: no hay cuenta de usuario ni estado en el backend (RNF-003), así que no se comparte entre dispositivos. Si el almacenamiento local no está disponible, la app usa el default y no persiste, **sin avisarle al usuario**. El control vive **solo en la pantalla de entrada**: Competición y Equipo no tienen conmutador. |

**Flujo principal end-to-end:** entrar a la app → ver los fixtures del día. Si eso no anda, el producto no existe.

**Competiciones cubiertas en la v1:** Primera A de Argentina, Copa Libertadores, Copa Sudamericana. No hay otras.

**Estado inicial:** base vacía. No hay datos preexistentes que migrar; todo dato proviene de API-Football.

**v1 terminada:** cuando los ocho requerimientos funcionales (RF-001 a RF-008) están implementados y funcionando. No hay condición adicional.

### Fuera

- **Agregar partidos al calendario del sistema** (Gmail / iPhone) — fuera de la v1, contemplado para la v2. No es un límite duro del producto.
- **Elegir el equipo favorito desde la UI** (buscador, lista o cualquier selector en pantalla) — fuera de la v1, contemplado para la v2. En la v1 el favorito viene fijado fuera de la UI (RF-005). No es un límite duro del producto.

## Reglas de negocio

| ID | Regla |
|----|-------|
| RN-001 | **Los datos son de solo lectura.** La app no hace cálculos, derivaciones ni transformaciones propias sobre los datos deportivos: muestra lo que API-Football devuelve. |
| RN-002 | **No hay escritura de datos de dominio por parte del usuario**, y por lo tanto no hay validaciones de negocio propias sobre ellos. Las únicas preferencias que el usuario define son el tema (RF-007) y la agrupación de la pantalla de entrada (RF-008); ambas son estado de presentación, viven en el cliente y no tocan los datos deportivos. |
| RN-003 | **No hay edición ni borrado** de competiciones, equipos ni partidos. |
| RN-004 | **No hay roles, permisos ni visibilidad acotada.** La app es de un solo usuario. |
| RN-005 | **Los horarios de los partidos se muestran en la zona horaria del dispositivo del usuario**, la que tenga configurada donde esté parado. No hay zona horaria fija ni selector de zona. |

## Requerimientos no funcionales

| ID | Requerimiento |
|----|----------------|
| RNF-001 | **Cuota de API-Football: 100 requests/día** (plan gratuito). La app debe llevar registro propio del consumo diario y no excederlo. Como la API no expone necesariamente ese dato, el contador es propio (ver `docs/data-model.md`). |
| RNF-002 | **Los datos se sirven desde una caché local**, no pegándole a la API en cada request del usuario — consecuencia directa de RNF-001. |
| RNF-003 | **Sin autenticación en la v1.** No hay usuarios, sesiones ni login. |
| RNF-004 | **Mobile-first.** El **viewport mínimo soportado es 320px**: toda pantalla se diseña, se implementa y se prueba arrancando en ese ancho y creciendo hacia arriba, nunca al revés. Aplica a toda la app; toda pantalla nueva o modificada mantiene esa compatibilidad. Detalle visual del breakpoint en `docs/design.md` § 1. |

> Volumen esperado, tiempo de respuesta, comportamiento offline y retención de datos: sin umbral definido por el usuario.
