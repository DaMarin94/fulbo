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

La cuota agotada de API-Football **no es un estado de pantalla** (RF-006): la pantalla muestra los datos que hay en caché, sin bifurcación visual respecto de datos frescos.

## Inicio

**Propósito:** ver los partidos de un día, de todas las competiciones cubiertas.

**Contenido** — por cada partido: horario, los dos equipos, resultado (si aplica) y la competición a la que pertenece. Datos servidos por el backend desde su caché de API-Football.

**Dos vistas de agrupación (RF-008).** Los partidos del día se muestran agrupados de una de dos formas, a elección del usuario:

| Vista | Agrupa por | Dentro de cada grupo |
|-------|-----------|----------------------|
| **Por torneo** (default) | competición | subgrupos por horario |
| **Por horario** | hora de inicio | subgrupos por competición |

- Las dos vistas muestran **los mismos partidos del mismo día**, con los mismos datos por partido: solo cambia la agrupación.
- El **conmutador de vista** vive en esta pantalla y alterna entre las dos. Es el único lugar del producto donde existe: Competición y Equipo no lo tienen.
- La vista elegida **se mantiene al navegar día a día**: cambiar de día no la reinicia. También se mantiene al volver a Inicio desde Competición o Equipo, y **persiste entre sesiones** en el mismo dispositivo y navegador (RF-008).
- Ninguna de las dos vistas divide la lista entre partidos jugados y partidos por jugar: la agrupación es la única estructura de la lista.

**Acciones**
- Ir al **día anterior** / **día siguiente**.
- **Cambiar la vista** entre por torneo y por horario.
- Click en el nombre de la **competición** → pantalla Competición.
- Click en el nombre de un **equipo** → pantalla Equipo.

**Estado vacío:** "no hay partidos este día". Es el mismo en las dos vistas.

## Competición

**Propósito:** ver todos los partidos de una competición.

**Contenido:** lista de partidos de esa competición, con los mismos datos por partido que Inicio, **agrupada por fecha** y, dentro de cada fecha, en **subgrupos por horario**. El horario de un partido se lee en el subgrupo al que pertenece. No hay conmutador de vista: la agrupación es siempre esta.

**Acciones**
- Click en el nombre de un **equipo** → pantalla Equipo.
- Volver atrás.

**Se accede desde:** el nombre de la competición en un partido (Inicio o Equipo).

## Equipo

**Propósito:** ver el fixture propio de un equipo, incluido el equipo favorito.

**Contenido:** lista de partidos de ese equipo, con los mismos datos por partido que Inicio, filtrada solo para ese equipo. La lista no se agrupa: cada partido trae su propio contexto —**fecha, horario y competición**, juntos— además de los equipos y el resultado.

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
