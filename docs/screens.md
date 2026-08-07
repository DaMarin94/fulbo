# Pantallas

Definición **funcional**: contenido, acciones, navegación y estados. El lenguaje visual (color, tipografía, layout, breakpoints) vive en `docs/design.md`.

## Navegación general

- **Pantalla de entrada:** Inicio.
- **Sin navegación persistente** (ni sidebar ni tabs). La navegación es por **drill-down**: desde un partido se entra a Competición o a Equipo clickeando su nombre, y se vuelve atrás.
- **Configuración** es la única pantalla que no se entra desde un partido: se llega desde Inicio y se vuelve atrás.
- **Nada se abre en modal u overlay** en la v1: no hay formularios ni confirmaciones destructivas, todo es navegación entre pantallas de lectura.

## Estados comunes

Aplican a las pantallas de fixtures (Inicio, Competición, Equipo), salvo que se indique lo contrario:

| Estado | Qué se muestra |
|--------|----------------|
| Cargando | Indicador de carga simple (skeleton o spinner). |
| Vacío | Mensaje de que no hay partidos para ese contexto. |
| Error | Mensaje con acción de **reintentar**. |
| Error por cuota agotada | Mensaje **específico** de cuota diaria de API-Football agotada (RF-006), no el error genérico. |

## Inicio

**Propósito:** ver los partidos de un día, de todas las competiciones cubiertas.

**Contenido** — por cada partido: horario, los dos equipos, resultado (si aplica) y la competición a la que pertenece. Datos servidos por el backend desde su caché de API-Football.

**Acciones**
- Ir al **día anterior** / **día siguiente**.
- Click en el nombre de la **competición** → pantalla Competición.
- Click en el nombre de un **equipo** → pantalla Equipo.

**Estado vacío:** "no hay partidos este día".

## Competición

**Propósito:** ver todos los partidos de una competición.

**Contenido:** lista de partidos de esa competición, con los mismos datos por partido que Inicio.

**Acciones**
- Click en el nombre de un **equipo** → pantalla Equipo.
- Volver atrás.

**Se accede desde:** el nombre de la competición en un partido (Inicio o Equipo).

## Equipo

**Propósito:** ver el fixture propio de un equipo, incluido el equipo favorito.

**Contenido:** lista de partidos de ese equipo, con los mismos datos por partido que Inicio, filtrada solo para ese equipo.

**Acciones**
- Click en el nombre de la **competición** de un partido → pantalla Competición.
- Volver atrás.

**Se accede desde:** el nombre de un equipo en un partido (Inicio o Competición).

## Configuración

**Propósito:** que el usuario defina sus preferencias. Es una pantalla propia, no un modal ni un panel dentro de Inicio.

**Contenido y acciones**
- **Elegir el tema** (RF-007): control segmentado de tres opciones (Claro / Oscuro / Automático). La tercera opción se llama **Automático** —nombre canónico y accesible, el mismo de RF-007— y su rótulo visible en el control es **"Auto"**. Es el único lugar del producto donde vive este control. Detalle visual en `docs/design.md` § 3.6 y § 6.1.
- **Línea de ayuda del control de tema:** texto estático bajo el control, *«Automático» usa el tema de tu sistema.* No cambia según la opción elegida ni según el modo que resuelva Automático.

**Se accede desde:** Inicio.

> **PENDIENTE (no bloqueante):** qué más vive en esta pantalla y por qué control concreto de Inicio se llega acá. Se cierra con `design` cuando se construya la pieza.

## Equipo favorito

El equipo favorito viene predefinido y se fija fuera de la UI (RF-005): no hay pantalla, control ni onboarding para elegirlo. Su fixture se ve en la pantalla Equipo, filtrado solo para ese equipo.

> **PENDIENTE (no bloqueante):** cómo se navega hasta el fixture del equipo favorito —el punto de acceso directo a la pantalla Equipo con el favorito ya cargado— queda sin definir. Es una decisión de navegación, no de selección. Se resuelve con `design` / `frontend` cuando se construya esa pieza.

> El detalle fino de qué campos hay disponibles por partido depende del relevamiento de API-Football (ver `docs/data-model.md`).
