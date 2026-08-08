# Diseño — guía viva del lenguaje visual

Guía **curada y vigente** del lenguaje visual de Fulbo. Es el destino canónico de color, tipografía, espaciado, jerarquía, estados visuales y contención responsive. Único escriba: el agente `design`.

Lo funcional (qué muestra cada pantalla, qué acciones expone) vive en `docs/screens.md` y `docs/requirements.md`; la implementación, en `docs/frontend.md`. **Ante conflicto sobre algo visual, manda este doc.**

**Sobre `docs/design-handoff/`:** es **material crudo de origen** (prototipo externo), no la guía. Ya fue auditado y curado hacia acá — lo que sobrevivió está en este documento, y donde difiere, **manda este documento**. `frontend` implementa contra `docs/design.md`, no contra el handoff. `tokens.css` sí está verificado y coincide valor por valor con § 3.4 / § 4.3 / § 5.

> **El handoff quedó desactualizado en el patrón de fila.** `maqueta.html` y `spec.md` dibujan la **grilla vieja de tres columnas** (`48px hora | 1fr equipos | 24px marcador`, marcadores apilados en columna angosta, franja de estado en versalitas, tarjeta por grupo). Ese patrón **está derogado**: rige § 7.0 (dos líneas de equipo con su propio marcador, sin columna de hora, estado en línea propia, sin tarjetas) y § 8.4 para pantalla ancha. Al leer el handoff, **todo lo que hable de la fila, de sus columnas, de las tarjetas de grupo o del vocabulario de estados hay que descartarlo**. Sobreviven los tokens, la paleta, la tipografía y el espaciado. Salvedades que ya estaban y siguen valiendo: los escudos rayados son marcas de "asset pendiente" y no un tratamiento a portar (§ 7.4).

## 1. Punto de partida

**Qué es Fulbo, visualmente:** un lector de listas. Tres pantallas de datos (Inicio, Competición, Equipo), solo lectura, sin modales, sin acciones destructivas. La única tarea del usuario es **escanear una lista de partidos y encontrar rápido el dato que busca** (hora, quién juega, cómo salió). Todo el lenguaje visual se subordina a eso.

Hay una cuarta pantalla, **Configuración** (`docs/screens.md`), que concentra la **única preferencia** del usuario —el tema (RF-007)— y es la única con controles de entrada. El equipo favorito **no** es una preferencia de la UI: viene predefinido fuera de ella (RF-005) y no tiene selector. Configuración es deliberadamente la excepción: sacando el control de preferencia de las pantallas de datos, esas tres siguen siendo lectura pura.

**Principios de partida**

| Principio | Consecuencia concreta |
|-----------|------------------------|
| **Mobile-first, literal** | El diseño arranca en el **ancho mínimo soportado (320px)** y crece hacia arriba. Nunca se diseña el escritorio primero y se "achica después". Hay un cliente mobile nativo planeado (`docs/architecture.md`): el lenguaje visual tiene que sobrevivir a esa mudanza. **No es solo una guía de estilo: es `RNF-004` de `docs/requirements.md`**, que fija el viewport mínimo de 320px para **toda** la app y obliga a que cada pantalla nueva o modificada mantenga esa compatibilidad. Este documento aporta el detalle visual (§ 8); el requisito manda igual aunque acá no se dijera nada. |
| **El dato es el protagonista** | Hora, equipos y resultado son lo primero que se ve. El cromo (marca, bordes, iconos) se subordina y nunca compite con ellos. |
| **Densidad media-alta** | Referencias del usuario: 365Scores y TenisTemple. Se ven muchos partidos por pantalla sin scroll, pero el target tocable nunca baja de 44px. |
| **Cero decoración inventada** | Sin ilustraciones, sin degradés, sin sombras dramáticas. Una lista sobria lee más rápido. |
| **Ambos modos siempre** | Claro y oscuro son ciudadanos de primera. Ningún componente se especifica en un solo modo. |

## 2. Reglas duras del DS

Invariantes. No se negocian sin decisión explícita del usuario. Están replicadas en `.claude/agents/design.md`.

- **Verde = en vivo / éxito. Rojo = error / falla / destructivo. Ámbar = advertencia / dato anómalo.** Reservados **estrictamente** para ese significado. No se usan para nada más, en ningún modo.
- **El acento de marca (violeta) es solo marca y afordancia.** NUNCA tiñe un dato ni comunica estado: prohibido en resultados, horarios, nombres de equipo, nombres de competición y badges de estado.
- **Los resultados son neutros: el ganador no se pinta de verde ni el perdedor de rojo.** La diferencia se comunica con peso tipográfico, jamás con color semántico.
- **Todo dato numérico usa números tabulares** (`tabular-nums`): horarios, marcadores, minuto de juego, fechas numéricas.
- **Nada se comunica solo por color.** Todo estado con color lleva además texto, icono o forma (regla que también cubre daltonismo).
- **Los escudos y logos de equipos/competiciones se muestran tal cual los provee la fuente.** No se recolorean, no se tiñen con la marca, no se les aplica filtro por modo.
- **Todo spec declara el comportamiento en pantalla chica** (§ 8).

## 3. Color

### 3.1 Semántica reservada

El usuario dejó la semántica abierta; se cierra acá. Tres significados, ninguno más:

| Color | Significado **único** | Dónde aparece en Fulbo |
|-------|----------------------|------------------------|
| **Verde** (`--color-live`) | En vivo / éxito | Partido en juego: punto + palabra `En vivo` + minuto, en la línea de estado del bloque (§ 7.2). |
| **Rojo** (`--color-danger`) | Error / falla / destructivo | Estado de error de la app, fallo de carga, backend caído. |
| **Ámbar** (`--color-warn`) | Advertencia / dato anómalo | Partido postergado, suspendido o cancelado (§ 7.2). **Es el único uso del ámbar en la v1**: no hay ningún otro estado del sistema que lo dispare. |

Decisiones que se desprenden y que son parte de la regla:

- **Un partido cancelado no es un error de la app** → va en ámbar, no en rojo. El rojo queda para "algo falló y podés reintentar".
- **El marcador nunca se colorea.** Verde en un marcador significaría "este resultado es bueno", cosa que depende de a quién le hinchás. Se resuelve con peso: **el ganador va en 700, el perdedor en 400 y `--color-text-2`**. Empate: ambos en 500. **Partido en curso (en vivo o entretiempo): ambos en 600** — todavía no hay ganador que distinguir, así que los dos números pesan igual; el 600 (en vez del 500 del empate) le da a la fila que más importa una pizca de peso sin recurrir a color. Los tres casos están cubiertos: no queda ninguna combinación donde el frontend tenga que elegir un peso.
- **Estados neutros (programado, finalizado) no llevan color semántico.** Si todo grita, nada grita.

### 3.2 Acento de marca — **violeta** (cerrado)

El usuario tiró dos direcciones, "verde oscuro" o "violeta", sin cerrar. **Se cierra en violeta.** Razones, en orden de peso:

1. **El verde ya está tomado por la semántica.** En una app de resultados, el verde es *el* color de "en vivo" (lo es en 365Scores y en cualquier marcador). Si además fuera el acento de marca, el usuario vería verde en el header, en los links y en el partido en juego, y perdería la señal que más importa: **cuál se está jugando ahora**. Un acento que canibaliza una semántica reservada es un acento mal elegido.
2. **Diferenciación.** Toda app de fútbol es verde césped. El violeta se despega sin ser exótico y no evoca "apuestas" (el límite duro del Bloque 1: Fulbo no es una app de apuestas — el naranja/verde neón de las casas de apuestas queda descartado por la misma razón).
3. **Se banca los dos modos.** Un violeta medio mantiene contraste AA sobre blanco y sobre negro con solo dos variantes, cosa que el verde oscuro no logra: en modo oscuro habría que aclararlo tanto que se confunde con el verde "en vivo".

**Tokens de marca**

| Token | Claro | Oscuro | Uso |
|-------|-------|--------|-----|
| `--color-brand` | `#5B3FD6` (6.7:1 sobre `--color-surface`) | `#9B87FF` (6.6:1 sobre `--color-bg`) | Wordmark, anillo de foco, subrayado de link en hover/focus. |
| `--color-brand-strong` | `#4A2FB0` | `#B3A3FF` | Estado presionado (`:active`). |
| `--color-brand-soft` | `#EFEBFF` | `#241C4A` | Fondo del **indicador de selección** de un control de opciones excluyentes (hoy: el segmento elegido del control de tema). Único uso de la marca como superficie. |

**Dónde está PROHIBIDO el acento de marca**

- Teñir cualquier dato: marcador, hora, minuto, nombre de equipo, nombre de competición, fecha.
- Comunicar estado: nunca significa "ok", "error", "en vivo" ni "atención".
- Fondos de filas de partido, de tarjetas o de la pantalla entera. La marca es un acento, no un baño.
- Escudos y logos (§ 2).

**Dónde SÍ — lista cerrada de cinco usos:**

1. **Wordmark** del header de Inicio (§ 10.1: solo el punto, no la palabra).
2. **Anillo de foco** (`--color-focus`).
3. **Subrayado de link** en hover / focus / active (§ 3.3).
4. **Indicador de selección de un control de opciones excluyentes** — hoy, el segmento elegido del control de tema (§ 6.1). Único uso de la marca como superficie.
5. **Estado presionado (`:active`) de un control**, en `--color-brand-strong` (§ 6). Es afordancia momentánea, no un estado persistente ni un dato: existe mientras el dedo está apoyado.
6. **Borde de un control en hover** (hoy: el conmutador de vista, § 6.5). Es el mismo mecanismo que el subrayado del link en hover, aplicado a un control que tiene caja en vez de palabra suelta: no tiñe ningún dato, no comunica estado del partido ni del sistema, y **solo existe con puntero** — en touch nadie lo ve nunca. Se agrega a la lista al cerrarse el conmutador; sin él, la única forma de dar respuesta al hover sería mover la superficie, y la superficie del conmutador ya es `--color-surface-2`.

Nada más. **Wordmark** e **indicador de selección** son los dos únicos usos permanentes; los otros cuatro existen solo mientras el usuario apunta, enfoca o presiona algo. Cualquier uso nuevo entra por esta lista o no entra.

**Nota:** al cerrarse el navegador de día como flechas + etiqueta (§ 6.2), el uso "píldora del día activo" que se contemplaba como posible **nunca se materializó**: en Inicio la marca aparece solo en el punto del wordmark y en el anillo de foco. **La fecha es un dato y nunca se tiñe**, ni de marca ni de color semántico.

**Por qué la selección sí puede llevar marca** (justificación del cuarto uso, agregado al cerrar RF-007): "cuál de N opciones excluyentes elegí" **no es un dato deportivo ni un estado del sistema** —no dice ni "en vivo", ni "ok", ni "error"—, es afordancia pura: le marca al usuario dónde está parado dentro de un control. Y nunca viaja solo: el elemento seleccionado suma peso 600 y `--color-text-1` frente a 500 y `--color-text-2` de los no seleccionados, más la semántica ARIA — cumple "nada solo por color" sin apoyarse en el violeta.

### 3.3 Afordancia sin color

Fulbo tiene un problema propio: **lo único clickeable son datos** (nombre de equipo, nombre de competición), y la regla dura prohíbe teñir datos. Además es mobile-first: en touch **no hay hover**, así que la afordancia tiene que verse en reposo.

**Regla: la afordancia es el subrayado, no el color.**

- Link en reposo: **subrayado 1px en `currentColor` al 30% de opacidad**, `text-underline-offset: 3px`.
- Hover / focus / active: el subrayado pasa a **2px `--color-brand`**; el texto NO cambia de color ni de peso (nada de reflow bajo el dedo).
- La fila entera de un partido **no** es clickeable: solo lo son los nombres. Una fila enteramente clickeable pediría destino único y acá hay tres (equipo local, visitante, competición). Se evita la ambigüedad de destino.

Ventaja lateral: el subrayado es una señal no cromática, con lo que cumple sola la regla de "nada solo por color".

**El tratamiento tipográfico del link lo dicta su rol, no el hecho de ser link.** Lo único que comparten todos los links de Fulbo es el subrayado; tamaño, peso y color de texto siguen siendo los del rol que ese texto cumple en su contexto. Es lo que permite que **el mismo nombre de competición sea link en 18px/700 cuando es titular y en 12px/600 cuando es subtítulo** (§ 7.1) sin que ninguno de los dos deje de leerse como lo que es. Si un link tuviera que forzarse siempre a `--fs-base` / 500 / `--color-text-1`, la jerarquía de la pantalla se rompería para satisfacer una regla de estilo.

| Link | Tratamiento (de su rol) | Dónde |
|------|--------------------------|-------|
| Nombre de equipo | `--fs-base` 16px / 500 / `--color-text-1` | Línea de equipo del bloque de partido, las tres pantallas (§ 7.0). |
| Nombre de competición, **titular** de grupo | `--fs-lg` 18px / 700 / tracking `-0.02em` / `--color-text-1` (22px en amplia) | Inicio, vista **por torneo** (§ 10.1). |
| Nombre de competición, **subtítulo** de grupo | `--fs-xs` 12px / 600 / tracking `0.04em` / `--color-text-3` | Inicio, vista **por horario** (§ 10.1). |
| Nombre de competición, meta-línea | `--fs-xs` 12px / 600 / tracking `0.04em` / `--color-text-3` | Meta-línea de la fila en Equipo (§ 10.3). |
| Acceso de encabezado (`Mi equipo`) | `--fs-sm` 14px / 500 / `--color-text-1` | Barra de marca de Inicio (§ 10.1). El otro acceso de esa barra, Ajustes, dejó de ser palabra: es el botón de icono de § 6.5. |

**El área tocable de un link es su texto más su relleno vertical, y nada más.** La versión anterior de este documento extendía el link del encabezado de grupo de Inicio a **toda la banda**, porque esa banda era una superficie cerrada con un solo destino. Con el patrón de fila nuevo (§ 7) esa banda no existe: el titular es texto sobre `--color-bg` seguido de una **línea divisoria decorativa** que corre hasta el borde. Esa línea **no** entra al link: sería un target de ~200px de ancho, invisible, sobre lo que el usuario lee como un separador — y en una lista que se recorre con el pulgar, un separador que navega es un toque accidental esperando ocurrir. El target se consigue con relleno vertical sobre el texto (§ 7.0), no con superficie prestada.

**Qué no es link, y conviene decirlo:** el wordmark (§ 10.1), la hora —sea titular, subtítulo o meta-línea, en cualquier pantalla—, la fecha del titular de grupo en Competición, la fecha de la meta-línea en Equipo, la etiqueta del navegador de día, la línea de estado del bloque y cualquier badge. Ninguno lleva subrayado, ninguno tiene estados de interacción.

### 3.4 Paleta completa

Nombres semánticos, no literales (`--color-surface`, no `--color-white`). El mapeo a la config de Tailwind lo decide `frontend`, **respetando estos nombres**.

| Token | Claro | Oscuro | Rol |
|-------|-------|--------|-----|
| `--color-bg` | `#F6F6F9` | `#0E0E13` | Lienzo de la página. |
| `--color-surface` | `#FFFFFF` | `#17171F` | Barras de encabezado, tarjeta de Configuración, tarjeta de Error. **No es fondo de lista ni de bloque de partido** (§ 7). |
| `--color-surface-2` | `#F0F0F5` | `#1F1F29` | Skeleton, píldora del conmutador, banda `PRÓXIMOS`, hover de superficie. |
| `--color-border` | `#E3E3EB` | `#2A2A36` | Divisorias entre bloques, línea de 2px del titular de grupo, bordes de tarjeta (Configuración, Error) y **el guion del eje cuando no hay marcador** (§ 8.4). |
| `--color-text-1` | `#15151B` | `#F2F2F5` | Dato principal: equipos, marcador, títulos. |
| `--color-text-2` | `#5A5A68` | `#A8A8B8` | Dato secundario: hora, competición, metadatos. AA garantizado. |
| `--color-text-3` | `#70707F` | `#86869A` | Terciario / deshabilitado. AA garantizado (≥4.8:1) — se puede usar para texto real, no solo decoración. |
| `--color-live` | `#0F7A3D` | `#3DD07A` | Verde reservado (§ 3.1). |
| `--color-danger` | `#C02626` | `#FF6B6B` | Rojo reservado. |
| `--color-warn` | `#9A5B00` | `#F5B54A` | Ámbar reservado. |
| `--color-focus` | = `--color-brand` | = `--color-brand` | Anillo de foco. |

**Contraste:** todos los pares texto/superficie de la tabla llegan a **AA (≥4.5:1)** en ambos modos. Ninguna variante nueva entra a la paleta sin verificar ese piso.

### 3.5 Los dos modos

- **El modo oscuro no es el claro invertido.** Los neutros oscuros llevan un tinte frío levísimo (hacia el violeta de marca) para que la marca no quede pegoteada sobre un gris puro.
- **La jerarquía se construye con superficie, no con sombra.** En oscuro las sombras no se ven: la profundidad la da el escalón `--color-bg` → `--color-surface` → `--color-surface-2`. En claro se suma `--shadow-1` (`0 1px 2px rgb(0 0 0 / 0.06)`), pero **el borde de 1px está siempre en ambos modos**, así que ninguna tarjeta depende de la sombra para leerse.
- **Ningún componente se especifica en un solo modo.** Un spec que no dice qué pasa en oscuro está incompleto.

### 3.6 Qué modo se muestra: tres opciones explícitas, **Automático** por default

RF-007 está **confirmado y cerrado en tres opciones**: **Claro · Oscuro · Automático**. Lo que se fija acá es qué modo pinta la app para cada valor de la preferencia, y por qué el default es Automático.

**La preferencia tiene tres valores y uno de ellos es "Automático".** No es la ausencia de preferencia: es una **opción explícita, seleccionable y persistida igual que las otras dos**, que además es el valor de fábrica.

| Valor de la preferencia | Qué modo se pinta | Cómo se llega a ese valor |
|-------------------------|-------------------|---------------------------|
| **Automático** (default de fábrica) | El que diga **`prefers-color-scheme` del dispositivo**, y **lo sigue en vivo**: si el sistema cambia con la app abierta, la app cambia sin recargar. | Es el valor vigente mientras el usuario no elija otro (primer uso, o datos del sitio borrados) **y** se puede volver a él en cualquier momento eligiéndolo en el control. |
| **Claro** | Claro **siempre**. Deja de escuchar al sistema. | Elección explícita del usuario. |
| **Oscuro** | Oscuro **siempre**. Deja de escuchar al sistema. | Elección explícita del usuario. |

Consecuencias que son parte de la regla:

- **Automático se muestra seleccionado en el control** desde el primer uso, sin que el usuario haya tocado nada. Un estado que gobierna lo que se ve pero no aparece en la UI es un estado invisible: el usuario no sabe en qué está parado ni cómo volver. Con Automático como opción visible, los tres valores tienen forma y el control siempre tiene exactamente un segmento elegido.
- **Volver a Automático re-sincroniza al instante** con el sistema y retoma el seguimiento en vivo. Es la salida del override, y el usuario ya no depende de borrar los datos del sitio para recuperarla (que era el agujero honesto del modelo de dos opciones).
- La preferencia, cualquiera sea, **persiste entre sesiones** en el dispositivo.

**Por qué el default es Automático, y no "arranca siempre en claro" ni "arranca siempre en oscuro":**

1. **Es coherente con "mobile-first, literal" (§ 1).** En un teléfono el tema es una decisión que el usuario **ya tomó**, a nivel sistema operativo, y muchas veces por horario automático. Arrancar en un modo fijo sería ignorar esa decisión y obligarlo a repetirla dentro de Fulbo: carga cognitiva pura, y encima con un fogonazo de luz en la mano a la noche.
2. **El mejor default es el que nadie tiene que tocar.** Si el sistema ya acierta, el control de tema es una salida de emergencia que el usuario no abre nunca. La existencia del control no obliga a que el usuario lo use.
3. **La elección explícita manda — incluida la de delegar.** Con Claro u Oscuro elegidos, que la app se diera vuelta sola por el sistema se leería como un bug: por eso el override no escucha al sistema. Con Automático elegido pasa exactamente lo contrario: seguir al sistema **es** lo que el usuario pidió, así que el cambio en vivo es la conducta correcta y esperada. Las tres opciones respetan el mismo principio; Automático es el que lo vuelve legible en vez de implícito.

**Invariante visual: sin flash de tema.** El modo correcto se resuelve y se aplica **antes del primer pintado**, incluido el caso Automático: si la preferencia vigente es Automático (o no hay ninguna guardada), se resuelve contra `prefers-color-scheme` en ese mismo momento, antes de pintar. Nunca se ve un destello claro antes de que entre el oscuro (ni al revés) al cargar o al navegar entre pantallas. Cómo se logra lo decide `frontend`; que no se vea es requisito de diseño y entra al QA visual.

**El cambio de modo es instantáneo, sin transición de color en la página.** Nada de *cross-fade* de fondos y textos: en una lista larga se ve sucio y arrastra. Lo único que anima es el indicador dentro del propio control (§ 6.1).

**Dónde vive el control:** solo en **Configuración** — fundamentado en § 6.1.

## 4. Tipografía

### 4.1 Familia

**Una sola familia: Inter Variable** (`@fontsource-variable/inter`, self-hosted; sin CDN de terceros). Fallback: `ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.

Por qué una sola: Fulbo tiene tres pantallas de listas. Una segunda familia agregaría peso de carga y una decisión más por elemento sin resolver ningún problema real. Inter cubre lo que la app necesita —incluidos los números— y aterriza limpio en un futuro cliente mobile nativo.

### 4.2 Números tabulares — obligatorio

**Sí, la app necesita números tabulares.** El usuario escanea una **columna vertical de horarios y marcadores**: con cifras proporcionales, el `1` es más angosto que el `8` y la columna queda dentada, lo que obliga a leer número por número en lugar de barrer con la vista. Con `tabular-nums` cada dígito ocupa lo mismo y la columna se alinea sola. Además evita el *jitter* del minuto de un partido en vivo, que se actualiza en pantalla.

**Obligatorio (`font-variant-numeric: tabular-nums`) en:**

- Horario del partido (`19:30`).
- Marcador (`2 - 1`) y minuto de juego (`45'`).
- Fechas numéricas y el encabezado de día.

Prosa y texto corrido van con cifras proporcionales (por defecto).

### 4.3 Escala

| Token | Tamaño / interlínea | Peso típico | Uso |
|-------|--------------------|-------------|-----|
| `--fs-xs` | 12px / 1.4 (línea de 16px) | 500–600 | **Subtítulo de grupo** y **meta-línea** (600, tracking `0.04em`); **línea de estado** del bloque (500, sin tracking); banda `PRÓXIMOS` (600, mayúsculas, `0.04em`). |
| `--fs-sm` | 14px / 1.45 | 400–500 | Metadatos, texto secundario, accesos de encabezado. |
| `--fs-base` | 16px / 1.5 (línea de 24px) | 500 | Nombre de equipo. Cuerpo. |
| `--fs-lg` | 18px / 1.2 | 600–700 | Marcador en disposición compacta; **titular de grupo** (700, tracking `-0.02em`). |
| `--fs-xl` | 22px / 1.25 | 600–700 | Título de pantalla, etiqueta del navegador de día; marcador y titular de grupo en disposición amplia. |

**La escala sigue siendo de cinco pasos: 12 · 14 · 16 · 18 · 22.** El titular de grupo que introduce el patrón de fila nuevo (§ 7.0) **no agrega un paso**: va en `--fs-lg` 18px en compacta y sube a `--fs-xl` 22px en amplia. Es una desviación deliberada respecto del prototipo de origen, que lo dibujaba en 20px y 24px —dos tamaños que no existen en la escala—, y tiene además una razón de jerarquía: la etiqueta del navegador de día ya está en 22px/700 y **queda fija al scrollear** (§ 9.2). Un titular de 22px en compacta pasaría por debajo de esa barra con exactamente el mismo traje y se leería como un duplicado de la barra fija. A 18px la jerarquía queda limpia y en un solo sentido: día (22) → titular de grupo (18) → nombre de equipo (16) → subtítulo y estado (12).

**Pesos permitidos:** 400 / 500 / 600 / 700. El 700 está reservado a títulos, **al titular de grupo** y al marcador del ganador — si se usa en todos lados deja de significar "esto importa".

**Truncado:** los nombres de equipo van a **una línea con elipsis** (`min-width: 0` + `text-overflow: ellipsis`), con el nombre completo en `title`. Un nombre largo nunca hace crecer la fila ni empuja al marcador fuera de pantalla (invariante 1 de § 8). Los nombres de competición pueden abreviarse a su forma corta (§ 7.3) en disposición compacta. **El sufijo desambiguador entre paréntesis está protegido del truncado** — regla completa en § 7.5.

**Tracking: un valor por rol, no uno por elemento.** Hay exactamente tres:

| Tracking | Cuándo | Por qué |
|----------|--------|---------|
| `0.04em` | Todo `--fs-xs` que cumple rol de **etiqueta**: subtítulo de grupo, meta-línea de Equipo, banda `PRÓXIMOS`. | Un 12px en 600 sin aire se lee apelmazado y deja de leerse como rótulo. |
| `0` (por defecto) | Todo lo demás, incluida la **línea de estado** del bloque (`Finalizado`, `En vivo · 68'`). | El estado es una palabra que se lee, no un rótulo que se barre: el tracking de etiqueta lo disfrazaría de badge. |
| `-0.02em` | **Titular de grupo** (§ 7.0), en las dos disposiciones. | A 18–22px en 700 el texto necesita cerrarse un poco; es la misma corrección óptica que cualquier titular. |

El **wordmark** queda fuera de la tabla con `-0.035em`: es un logotipo, no texto de UI (§ 10.1). Ningún elemento elige tracking por gusto — se toma el de su rol.

## 5. Espaciado, radios, iconografía

- **Escala de espaciado, base 4px:** `--space-1` 4 · `--space-2` 8 · `--space-3` 12 · `--space-4` 16 · `--space-5` 24 · `--space-6` 32. No se usan valores fuera de la escala.
- **Padding lateral de pantalla:** 16px en compacto, 24px en amplio.
- **Radios:** `--radius-sm` 6px (badges) · `--radius-md` 10px (tarjetas de Configuración) · `--radius-full` (punto de "en vivo", píldora del conmutador, halo de botón de icono). Nada con radio 0 salvo separadores.
- **Alto del bloque de partido:** **92px** en compacta (dos líneas de equipo de 28px + línea de estado + relleno, § 7.0) y **68px** en amplia (§ 8.4); en Equipo suma la meta-línea → 116px y 92px (§ 10.3). **Mínimo 56px** como piso general de cualquier fila de la app. El módulo vertical de 56px sigue siendo la unidad: las dos líneas de equipo suman exactamente 56px.
- **Iconos:** trazo (stroke) de 1.5–2px, siempre `currentColor`. Nunca un icono como único portador de significado sin `aria-label`. **El inventario de iconos de la v1 está cerrado**, y el patrón de fila nuevo lo amplía por única vez:

| Glifo | Tamaño | Dónde | Alta |
|-------|--------|-------|------|
| Sol · luna · círculo mitad | 16px | Control de tema (§ 6.1) | Original |
| Chevron | 20px | Botón de icono: flechas de día y volver (§ 6.3) | Original |
| Icono neutro | 24px | Estado Vacío (§ 6) | Original |
| **Marca de competición** (tres: círculo con estrella, escudo con disco, rombo con rombo) | **18px** | Junto al nombre de competición, sea titular, subtítulo o meta-línea (§ 7.3) | Patrón de fila nuevo |
| **Intercambio** (dos flechas opuestas) | **14px** | Conmutador de vista (§ 6.5) | Patrón de fila nuevo |
| **Engranaje** | 20px | Acceso a Configuración desde Inicio (§ 6.5, § 10.1) | Patrón de fila nuevo |

Los **14px** del glifo de intercambio son una **excepción declarada** al tamaño de icono, con la misma lógica que los 18px del escudo: vive dentro de una píldora de 32px, al lado de una palabra de 12px, y a 16px pesaría más que el texto que acompaña. Fuera de estos seis glifos, todo acceso de la app sigue siendo **una palabra subrayada** (§ 3.3). Sumar un icono nuevo pide justificarlo contra esta lista.

## 6. Interacción y estados

Todo elemento interactivo declara sus cinco estados. Un spec al que le falta uno está incompleto.

| Estado | Forma |
|--------|-------|
| Reposo | Según § 3.3 (links) o `--color-surface` (botones/controles). |
| Hover | Superficie a `--color-surface-2`; en links, subrayado a 2px `--color-brand`. Nunca es el único indicio (no existe en touch). |
| Focus | `outline: 2px solid var(--color-focus); outline-offset: 2px`. **Jamás `outline: none`.** Visible en ambos modos. |
| Activo / presionado | `--color-brand-strong`, sin desplazamiento de layout. |
| Deshabilitado | `--color-text-3`, sin puntero, sin hover. |

**Target tocable mínimo 44×44px** para todo **control**: flechas ← → de Inicio, volver atrás, engranaje de Ajustes, conmutador de vista, segmentos del control de tema, botón Reintentar. Ninguno baja de ahí y ninguno negocia.

**Excepción declarada y única: los links que son datos dentro de la lista.** Los nombres apilados de un bloque de partido y el nombre de competición del titular o del subtítulo **no llegan a 44px de alto**, y no pueden llegar:

| Link | Alto tocable | Cómo se logra |
|------|--------------|----------------|
| Nombre de equipo | **28px** | La línea de equipo mide 28px y el link la ocupa entera (§ 7.0). |
| Competición en el titular | **32px** | La fila del titular mide 32px y el link la ocupa entera (§ 7.0). |
| Competición en el subtítulo o en la meta-línea | **24px** | La fila del subtítulo mide 24px y el link la ocupa entera (§ 7.0). |

**Por qué se acepta:** los dos nombres de un partido están apilados y son **destinos distintos**. Llevarlos a 44px cada uno obliga a una de dos cosas: que sus áreas activas **se pisen** —dos destinos en el mismo píxel, que es peor que un target chico porque el error es silencioso y te lleva a otra pantalla— o subir el bloque de 92px a ~124px, un tercio más de alto en la unidad que se repite 15 veces por pantalla, contra el objetivo declarado de densidad (§ 1). Se elige el target chico **con áreas que no se solapan jamás** y con el texto como blanco ancho (≥230px a 320px). Todo lo que **hace** algo distinto de navegar sigue en 44px.

Esta excepción vale **solo** para links de dato dentro de la lista. No se extiende ni se cita para justificar ningún otro control por debajo de 44px.

**Estados de pantalla — son tres** (los de `docs/screens.md`, con su forma visual):

| Estado | Forma visual |
|--------|--------------|
| **Cargando** | Skeleton, no spinner: barras en `--color-surface-2`, `--radius-sm`, con **las mismas alturas y posiciones que el contenido real**, para que no salte el layout al llegar el dato. El skeleton no usa la marca. **En Inicio hay dos siluetas, una por vista** (§ 10.1): es el único estado que se bifurca. En Competición y Equipo hay una sola. |
| **Vacío** | Bloque centrado: icono neutro 24px en `--color-text-3` + una línea en `--fs-base` / `--color-text-2` ("No hay partidos este día"). Sin ilustración, sin botón. |
| **Error** | Tarjeta en `--color-surface` con borde `--color-danger`, icono y texto en `--color-danger`, y botón **Reintentar** debajo (§ 6.4). **Reemplaza la lista**: si la carga falló no hay nada que mostrar, así que la tarjeta ocupa el área de contenido y Reintentar es la única acción. El rojo va acompañado siempre del icono y del texto. |

**No existe un estado de pantalla "cuota agotada", y es a propósito (RF-006).** El agotamiento de la cuota diaria de API-Football es **transparente para el usuario**: la app sigue sirviendo los últimos datos de caché sin ninguna distinción respecto de datos frescos. **Ni banda, ni tarjeta, ni badge, ni ámbar, ni copy, ni "actualizado hace X".** Queda solo en el logging interno del backend (`docs/technical.md`). Visualmente, una pantalla con la cuota agotada **es idéntica** a una con la cuota disponible — esa identidad es el requisito, y entra al QA como tal.

**Consecuencia para el lenguaje visual: el ámbar queda con un solo disparador.** Sin el caso de cuota, `--color-warn` aparece **únicamente** en los estados anómalos de un partido (postergado, suspendido, cancelado — § 7.2). No hay ningún estado del *sistema* que use ámbar en la v1. Eso es una simplificación real, no una pérdida: el usuario aprende que el ámbar habla del partido, nunca de la app.

**Copy de los estados.** El texto de Vacío ya está cerrado en `docs/screens.md`; el de Error lo propongo acá para que `frontend` no invente texto, marcado como pendiente de OK de producto:

| Estado | Título | Cuerpo | Acción |
|--------|--------|--------|--------|
| Vacío | — | «No hay partidos este día» (cerrado, viene de `docs/screens.md`) | — |
| Error | «No pudimos cargar los partidos» | «Revisá tu conexión y volvé a intentar.» *(copy propuesto, pendiente de OK)* | Botón **Reintentar** |

- En Competición y Equipo el estado Vacío cambia de sujeto («No hay partidos para esta competición» / «…para este equipo»); el texto exacto es **copy pendiente de OK**, no una decisión visual.
- **Reintentar devuelve la pantalla al estado Cargando** (el skeleton reemplaza la tarjeta de error). No hay spinner adentro del botón ni estado deshabilitado: el feedback es que la pantalla vuelve a cargar.

**Partido en vivo:** punto `--radius-full` 8px en `--color-live` + palabra `En vivo` + minuto (`En vivo · 68'`), todo en la línea de estado del bloque (§ 7.0). Tres señales, ninguna solo cromática. El punto puede pulsar con una animación suave de opacidad, respetando `prefers-reduced-motion`.

**Los estados de pantalla son de la pantalla, no de la vista.** En Inicio, Vacío y Error se ven **idénticos en las dos vistas** (§ 10.1): sin partidos —o sin datos— no hay nada que agrupar, así que el eje de agrupación es irrelevante y duplicar la forma sería inventar una diferencia. El conmutador **sigue presente y habilitado** en los tres estados: la preferencia es del cliente, no depende del dato (§ 6.5).

### 6.1 Control de tema (RF-007)

Es el primer control de entrada del producto. Se especifica entero acá porque marca el patrón para todo control de opciones excluyentes que venga después.

#### Dónde vive — **solo en Configuración** (confirmado)

El analista infirió que el control vive en Configuración (`docs/screens.md`). **Se confirma, y se cierra que es su único lugar**: no se duplica en el encabezado de Inicio ni en ninguna otra pantalla.

1. **Es una preferencia de frecuencia casi nula.** Con **Automático** como default (§ 3.6), el usuario que está cómodo con su tema de sistema **no toca el control jamás**; el que no, lo toca una vez en la vida de la instalación. Un control de un solo uso no se gana un lugar permanente en la pantalla que se mira todos los días.
2. **El encabezado de Inicio es territorio escaso.** Ya carga wordmark, acceso al favorito, entrada a Configuración y navegación de días — el inventario está en § 9. A 320px, meter ahí un control más le come ancho a lo que sí es de uso constante — riesgo directo sobre el invariante 3 de § 8 (ninguna acción inalcanzable). Se prioriza lo que se usa siempre por sobre lo que se usa una vez.
3. **Un solo lugar, una sola verdad.** Duplicar el control en dos pantallas obliga a mantener dos formas visuales del mismo estado y a que el usuario se pregunte si son el mismo ajuste. Consistencia (§ Lente UX) por sobre atajo.
4. **El costo es un tap.** Desde Inicio se llega a Configuración en un paso. Aceptable de sobra para algo que se hace una vez; inaceptable sería si fuera de uso diario, y no lo es.

*Nota de alcance:* el **control concreto de Inicio que abre Configuración** no es parte de RF-007 — que exista es parte del inventario de § 9. Su forma quedó cerrada en § 10.1: es la palabra `Ajustes` en la barra de marca, sin icono.

#### Forma — control segmentado de **tres** opciones, no un switch

**Se descarta el switch on/off.** Un interruptor junto a la etiqueta "Tema" no dice qué significa "encendido": ¿oscuro activado, o "tema activado"? El usuario tiene que inferirlo, y para saber en qué modo está tiene que mirar el resto de la pantalla en vez de mirar el control. Es un problema de **affordance y claridad**, no de estética. Con tres opciones el switch queda directamente descartado por definición.

**Se elige un control segmentado de tres opciones**, cada una con **icono + palabra**: `☀ Claro` · `☾ Oscuro` · `◐ Auto`. Se autoexplica, muestra el estado actual sin interpretación y deja las tres alternativas a la vista al mismo tiempo — el usuario compara sin abrir nada. (Al cerrarse la tercera opción se cumplió lo previsto: el patrón creció de 2 a 3 segmentos **sin rediseñarse**, solo ajustando el reparto de ancho y la palabra del tercero.)

**Orden: Claro · Oscuro · Auto.** Es el orden que ya fijaron RF-007 y `docs/screens.md`, y además es el que conviene: los dos modos concretos primero y el que delega al final, que se lee como "o que decida el sistema". Ventaja lateral: Claro y Oscuro no se mueven de donde estaban, así que quien ya conocía el control no tiene que reaprender posiciones.

**Etiquetas y iconos**

| Opción | Palabra visible | Nombre accesible | Icono (16px, `currentColor`, trazo 1.5–2px) |
|--------|-----------------|------------------|---------------------------------------------|
| Claro | `Claro` | "Claro" | Sol: círculo + 8 rayos. |
| Oscuro | `Oscuro` | "Oscuro" | Luna creciente. |
| Automático | **`Auto`** | **"Automático"** | Círculo con la mitad izquierda rellena (glifo de contraste). |

- **Por qué la palabra visible del tercero es "Auto" y no "Automático":** a 320px "Automático" **no entra** en un tercio del control (ver el presupuesto de ancho más abajo) y la salida sería truncar, partir en dos líneas o cambiar la disposición solo en compacto — las tres peores que acortar la palabra. `Auto` es prefijo literal de `Automático`, así que el nombre accesible completo lo contiene: se cumple WCAG 2.5.3 (*Label in Name*) y el control por voz responde tanto a "Auto" como a "Automático". En contexto (etiqueta "Tema", vecinos "Claro" y "Oscuro", icono de contraste) no hay lectura ambigua posible.
- **Por qué ese icono y no un engranaje ni un monitor:** el engranaje ya significa "Configuración" —y estamos *dentro* de Configuración—, y un monitor es un objeto que el usuario mobile-first no tiene delante. El círculo mitad-y-mitad dice literalmente "las dos cosas según corresponda", que es lo que hace la opción.
- **El icono nunca viaja solo.** Nada de un modo "solo icono": los tres glifos de tema son convencionales pero no unívocos (un sol y una luna en el mismo control admiten leerse como "el modo actual" en vez de "el modo a elegir"). La palabra es la que desambigua.

**Anatomía y tokens** — no se introduce ningún token nuevo:

| Parte | Especificación |
|-------|----------------|
| Etiqueta | Texto "Tema" **arriba** del control, `--fs-sm`, peso 500, `--color-text-2`, `--space-2` de separación. |
| Pista (track) | Fondo `--color-bg`, borde 1px `--color-border`, `--radius-md` (10px), padding `--space-1` (4px). El escalón hacia abajo desde `--color-surface` de la tarjeta lo lee como "hueco" en claro y en oscuro; el borde garantiza que se vea aun cuando el contraste de superficie es sutil. |
| Segmento | **Tres columnas de ancho idéntico (`1fr` cada una), sin importar el largo de la palabra**, alto mínimo **44px**, `--radius-sm` (6px), icono 16px `currentColor` + texto `--fs-sm`, gap `--space-2`, todo centrado, `min-inline-size: 0`. 6px + 4px de padding de la pista = los 10px de la pista: los radios anidan sin quedar torcidos. |
| Ancho total | 100% del ancho disponible con **`max-inline-size: 360px`**, alineado a la izquierda. Sin *media query*: a 320px ocupa todo (3 × ~83px), a 360px cada segmento queda en ~117px y no se estira más. |

**Columnas iguales, no ajustadas al contenido:** con `1fr` los tres blancos quedan simétricos y el indicador se desplaza siempre el mismo paso. Si cada segmento midiera lo que mide su palabra, el control quedaría dentado y el salto del indicador sería irregular — ruido gratis en un control que se mira dos segundos en la vida.

**Presupuesto de ancho a 320px** (caso peor: control anidado dentro de una tarjeta con padding propio):

| Concepto | Ancho |
|----------|-------|
| Viewport mínimo soportado | 320 px |
| − padding lateral de pantalla (16 × 2) | 288 px |
| − padding lateral de la tarjeta de Configuración (16 × 2, **tope**) | 256 px |
| − padding de la pista (4 × 2) | 248 px |
| ÷ 3 columnas iguales | **~82,6 px por segmento** |
| Contenido más ancho — `☾ Oscuro`: icono 16 + gap 8 + texto ~48 | **72 px** → entra, con ~5px de aire de cada lado |
| Contenido de `◐ Auto`: 16 + 8 + ~31 | 55 px → entra holgado |
| Contenido de `☀ Claro`: 16 + 8 + ~34 | 58 px → entra holgado |
| Contenido de `◐ Automático`: 16 + 8 + ~75 | **99 px → NO entra.** Origen de la decisión de acortar a `Auto`. |

**Restricción heredada para la pantalla de Configuración** (cumplida en § 10.4): en compacto no puede robarle al control más de **32px de padding lateral combinado** por encima del padding de pantalla. Si el contenedor pidiera más, la palabra `Oscuro` empieza a rozar el borde y el spec deja de cumplirse.

**Los cinco estados** (obligatorio, § 6), en **ambos modos**:

| Estado | Forma |
|--------|-------|
| Reposo, **no** seleccionado | Fondo transparente, texto e icono `--color-text-2`, peso 500. |
| Reposo, **seleccionado** | Fondo `--color-brand-soft`, texto e icono `--color-text-1`, **peso 600**. Tres señales (fondo, color de texto, peso) + `aria-checked`: no depende del color. |
| Hover (solo puntero) sobre no seleccionado | Fondo `--color-surface-2`, texto a `--color-text-1`. Sobre el seleccionado no pasa nada: ya está elegido. Nunca es el único indicio — en touch no existe. |
| Focus | `outline: 2px solid var(--color-focus); outline-offset: 2px` **sobre el segmento**, no sobre la pista. Jamás `outline: none`. |
| Activo / presionado | Fondo `--color-brand-soft` + borde interior 1px y texto en `--color-brand-strong`. Sin desplazamiento de layout. |
| Deshabilitado | **No aplica**: el control no depende de red ni de datos, siempre está disponible. Se declara para cerrar los cinco; si alguna vez hiciera falta, `--color-text-3` y sin puntero. |

**Siempre hay exactamente un segmento seleccionado, nunca cero.** Con Automático como opción explícita (§ 3.6) desaparece el estado "ninguno elegido" que existía cuando el default era la ausencia de preferencia. Un control segmentado sin selección se lee como roto.

**"Auto" no muestra qué modo resolvió.** Nada de `Auto (oscuro)` ni de un punto extra en el segmento: la app entera **ya está pintada** del modo resuelto, que es la retroalimentación más grande posible. Duplicarla en el control agrega texto que cambia solo y no responde ninguna pregunta que el usuario no tenga ya contestada mirando la pantalla.

**Movimiento:** el fondo del segmento seleccionado se desliza al segmento elegido en **120ms**, solo con `transform`. La duración es **fija**, salte una columna o dos: proporcionarla a la distancia haría que el salto Claro → Auto se sienta lento y arrastrado. Con `prefers-reduced-motion: reduce`, aparece sin desplazarse. La página detrás cambia de modo **de golpe** (§ 3.6): la animación es del control, no del tema.

**Semántica y accesibilidad:** grupo con `role="radiogroup"` y `aria-label="Tema"`, **tres** opciones con `role="radio"` y `aria-checked`. *Roving tabindex*: el grupo entra una sola vez en el orden de tabulación y las flechas ← → recorren los tres, con envolvimiento (del último al primero). El nombre accesible del tercer segmento es **"Automático"**, aunque la palabra visible sea "Auto". El icono nunca es el único portador de significado — siempre va la palabra al lado.

**Línea de ayuda bajo el control — *agregado no solicitado, confirmar*.** Propongo una línea **estática** debajo del control: «Automático» usa el tema de tu sistema. En `--fs-sm`, peso 400, `--color-text-2`, `--space-2` por encima. Razón: de las tres opciones, la única cuyo comportamiento no se deduce de la palabra es la tercera, y de paso la línea deja el término completo "Automático" en pantalla, anclando la abreviatura. Estática y no dinámica a propósito: un texto que cambia con la selección obliga a releer en cada tap y pide `aria-live`, y no aporta nada sobre Claro y Oscuro. **No estaba en el brief recibido: si no se confirma, el control funciona igual sin ella.**

#### Contención en pantalla chica

- **Compacta (320–767px), que es la base:** etiqueta arriba, control abajo a todo el ancho de la tarjeta menos su padding, en tres columnas iguales. A 320px cada segmento queda en **~83px de ancho y 44px de alto**, y el contenido más ancho (`☾ Oscuro`, 72px) entra sin truncar — ver el presupuesto de ancho arriba. Las tres palabras son cortas por diseño; **si una etiqueta futura no entrara, se cambia la palabra, no se achica ni se trunca el texto** (que es exactamente lo que se hizo con `Automático` → `Auto`).
- **Amplia (≥768px):** exactamente lo mismo, topado a 360px. **Una sola disposición, sin media query propia** — y se mantuvo así a propósito al pasar a tres opciones: acortar una palabra cuesta menos que sostener dos formas del mismo control (una compacta y una amplia), que serían dos cosas que mantener, testear y explicar.
- **Invariante 1:** el control nunca desborda; el ancho es 100% con tope, no un valor fijo, y las columnas son `1fr`, no anchos fijos. **Invariante 3:** los tres segmentos tienen 44px de alto y son alcanzables sin scroll horizontal. Invariantes 2 y 4: no aplican (no hay modal ni superficie ancha).

#### Checklist de aceptación visual — control de tema

1. Instalación limpia → el control muestra **"Auto" seleccionado** y la app abre en el modo del sistema (oscuro si el sistema está en oscuro, claro si está en claro).
2. Con "Auto" seleccionado, cambiar el modo del sistema con la app abierta → la app **acompaña en vivo**, sin recargar, y el control **sigue mostrando "Auto"** (no salta a Claro ni a Oscuro).
3. Tocar "Claro" con el sistema en oscuro → la app queda **en claro**, y **sigue en claro** tras recargar y tras cerrar y volver a abrir.
4. Con Claro u Oscuro elegido, cambiar el modo del sistema → la app **no se mueve**.
5. Volver a tocar "Auto" → la app adopta **al instante** el modo del sistema, vuelve a acompañarlo en vivo, y la elección persiste tras recargar.
6. Al recargar **no hay destello claro** en ningún momento: ni con Oscuro elegido, ni con "Auto" resolviendo a oscuro.
7. **Siempre hay exactamente un segmento seleccionado**: nunca cero, nunca dos — y se distingue **con la pantalla en escala de grises** (peso 600 + color de texto), no solo por el violeta.
8. Los cinco estados existen y son visibles en claro **y** en oscuro; el foco por teclado se ve en los tres segmentos y las flechas ← → los recorren.
9. A 320px no hay scroll horizontal, **ninguna de las tres palabras se trunca ni se parte en dos líneas**, y los tres segmentos miden ≥44px de alto y ancho idéntico entre sí.
10. En ningún lado el violeta tiñe un dato, y el control no usa verde, rojo ni ámbar.

### 6.2 Navegador de día (Inicio) — **cerrado: flechas ancladas + etiqueta centrada**

RF-002 pide moverse día a día desde Inicio. **Se cierra en flechas ancladas a los bordes con la etiqueta del día centrada entre ellas.** Era una decisión de composición; queda decidida acá para que `frontend` no elija.

**Forma**

| Parte | Especificación |
|-------|----------------|
| Barra | Alto **56px**, `--color-surface`, borde inferior 1px `--color-border`, `padding: 0 8px`, ancho completo (en amplia el contenido interno se topa a 720px, la barra sangra a todo el ancho). |
| Flechas | Botón de **44×44** contra cada borde interno de la barra, `padding: 0` explícito, chevron de 20px, trazo 2px, `currentColor` en `--color-text-1`. `aria-label` "Día anterior" / "Día siguiente". Patrón completo de estados en § 6.3. |
| Etiqueta | Centrada, `--fs-xl` 22px / 700 / `--color-text-1` / **`tabular-nums`**, una línea, `min-width: 0` + elipsis, **`flex-shrink: 1`**; las flechas son `flex-shrink: 0`. Nunca envuelve, nunca empuja a las flechas. |

**Por qué flechas y no una tira de días.** A 320px la tira deja ~288px útiles: seis chips de 48px, por debajo del mínimo tocable de 44 **y** con seis blancos contiguos — sería el control más errable de la app justo en el pulgar. Además un carrusel promete un rango navegable que no existe (no hay límite documentado, así que la tira no tiene ni principio ni fin que dibujar), y con chips de 48px la palabra `Hoy` no entra, lo que obligaría a volver a números y a perder la única etiqueta que el usuario lee sin pensar. Dos flechas de 44px separadas por 200px de etiqueta son imposibles de confundir entre sí.

**Etiqueta: relativa en los tres días cercanos, absoluta en el resto.**

| Día mostrado | Etiqueta visible |
|--------------|------------------|
| Hoy | `Hoy` |
| Ayer / mañana | `Ayer` / `Mañana` |
| Cualquier otro del año en curso | `sáb 18 abr` |
| Fuera del año calendario en curso | `sáb 18 abr 2027` |

- **La forma relativa existe porque la pregunta más frecuente en Inicio es "¿estoy parado en hoy?".** `Hoy` la contesta sin leer un número. Fuera de esos tres días la pregunta cambia a "¿qué día es este?", y ahí la única respuesta útil es la fecha.
- **El año aparece solo cuando cambia el año.** Sin eso, navegar 300 días adelante muestra `sáb 18 abr` y el usuario no tiene forma de saber que se fue de año — un caso que el guion de QA ya busca a propósito. Con la regla, el 99% de los días no paga nada.
- **La fecha absoluta completa está siempre disponible sin ocupar píxeles:** la etiqueta es un `<time>` con la fecha en el atributo y **nombre accesible con la fecha completa** («Hoy, sábado 18 de abril»), más `title`. Así, mostrar `Hoy` no le esconde el dato a nadie: ni al lector de pantalla, ni al que apoya el puntero. Por eso se descarta la sub-línea con la fecha absoluta debajo: costaba 16px permanentes en la única barra que queda fija, para duplicar un dato que ya está.
- **La etiqueta relativa vive solo en Inicio.** Competición y Equipo usan fecha absoluta siempre (§ 10.2, § 10.3): ahí el usuario está recorriendo un calendario, no parado en un día.
- Zona horaria del dispositivo (RN-005). "Hoy" es hoy donde está el usuario.

**Sin límite de rango, y sus dos consecuencias:** ninguna flecha tiene estado deshabilitado (se declara igual en § 6.3 por si el límite aparece), y **no existe un botón "volver a hoy"** — no está en RF-002 ni en `docs/screens.md`, y agregarlo sería alcance inventado. Ver § 11: la fricción de volver desde un día lejano es una observación de producto, no una decisión visual que yo pueda tomar.

### 6.3 Patrón: botón de icono (flechas de día, volver atrás)

Único control de la app que se apoya en un glifo. Se define una vez y se reusa: navegador de día (§ 6.2) y "volver atrás" de las tres pantallas de drill-down (§ 9).

**Por qué acá sí un icono y no una palabra:** un chevron no es un símbolo que haya que aprender, es una dirección. Y las alternativas en palabra (`Anterior` / `Siguiente`) le comen a 320px el ancho de la etiqueta del día, que es el dato, y compiten tipográficamente con ella. En todos los demás accesos de la app la afordancia es la palabra subrayada (§ 3.3): el icono es la excepción, no la regla.

| Parte | Especificación |
|-------|----------------|
| Caja | **44×44**, `padding: 0` explícito (el `1px 6px` que el navegador le pone a `<button>` invalida cualquier cálculo de contención), `--radius-full`, fondo transparente. |
| Glifo | Chevron 20px, trazo 2px, `currentColor`. |
| Posición | Nunca al ras del borde del viewport: la barra que lo contiene lleva `padding: 0 8px`, de modo que el anillo de foco (2px + 2px de offset) tiene lugar y no se recorta. El glifo queda ópticamente alineado con el margen de 16px del contenido de abajo. |

**Los cinco estados, en ambos modos:**

| Estado | Forma |
|--------|-------|
| Reposo | Glifo en `--color-text-1`, sin fondo. Es un control primario: en `--color-text-2` se leería como secundario y en `--color-text-3` como deshabilitado. |
| Hover (solo puntero) | Halo circular `--color-surface-2` en los 44px. Circular a propósito: distingue "botón de icono" de las superficies rectangulares (tarjetas, badges, segmentos) sin agregar ningún token. |
| Focus | `outline: 2px solid var(--color-focus); outline-offset: 2px`. Jamás `outline: none`. |
| Activo / presionado | Glifo a `--color-brand-strong` + halo `--color-surface-2`. Sin desplazamiento de layout. Es el quinto uso permitido de la marca (§ 3.2). |
| Deshabilitado | Glifo `--color-text-3`, sin halo, sin puntero, `aria-disabled`. **Hoy no se usa** (no hay límite de rango navegable); se declara para cerrar los cinco y para que exista si el límite se define. |

### 6.4 Patrón: botón neutro (Reintentar)

Único botón "de acción" de la v1 fuera del control de tema. **No es un botón de marca:** § 3.2 reserva el violeta como superficie exclusivamente para el indicador de selección, y además es la única acción de una pantalla en estado de error — no tiene con qué competir.

| Parte | Especificación |
|-------|----------------|
| Caja | Alto **44px**, `padding: 0 --space-4`, `--radius-sm` 6px, borde 1px `--color-border`, fondo `--color-surface`. |
| Texto | `--fs-sm` 14px / 500 / `--color-text-1`. |

| Estado | Forma |
|--------|-------|
| Reposo | Como arriba. |
| Hover | Fondo `--color-surface-2`. |
| Focus | `outline: 2px solid var(--color-focus); outline-offset: 2px`. |
| Activo | Fondo `--color-surface-2`, texto `--color-brand-strong`. |
| Deshabilitado | **No aplica**: al tocarlo la pantalla pasa a Cargando y el botón deja de existir. Se declara para cerrar los cinco. |

### 6.5 Patrón: conmutador de vista (RF-008) — **píldora de un toque**

Es el control nuevo del producto y **el único de la app que no es una preferencia de Configuración ni una navegación**: alterna la agrupación de Inicio entre **por torneo** (default) y **por horario**. Vive **solo en Inicio** (RF-008); Competición y Equipo no lo tienen. Se especifica como patrón reusable porque fija la forma de todo control futuro que sea "una etiqueta de estado que además es un botón".

**Forma: un solo botón que muestra la vista vigente, no dos opciones enfrentadas.** El segmentado de dos opciones se descarta: son 52px de alto y el ancho completo de la pantalla para un control que se elige una vez y **se guarda entre sesiones** (RF-008). Le daría a un ajuste el peso visual de una barra de navegación, en la pantalla que se mira todos los días, y contra el objetivo declarado de densidad (§ 1). La píldora entra en la barra de marca que ya existía: **costo de alto cero**.

**Lo que se paga, dicho:** un toque no anticipa a qué cambia. Lo mitigan el glifo de intercambio, el nombre accesible que nombra el destino y el hecho de que las dos vistas son visiblemente distintas — si el usuario se equivoca lo ve al instante y vuelve con otro toque. Con dos opciones, un ciclo es reversible por definición.

**Anatomía y tokens** — no se introduce ningún token nuevo:

| Parte | Especificación |
|-------|----------------|
| Caja | Alto visible **32px**, `--radius-full`, `padding: 0 --space-2` (8px), borde 1px `--color-border`, fondo `--color-surface-2`, `flex-shrink: 0`. |
| Contenido | Glifo de intercambio **14px** `currentColor` (§ 5) + palabra, `gap: --space-1` (4px). |
| Palabra | `--fs-xs` 12px / **600** / **sin tracking** / `--color-text-2`. Es una palabra en caja normal, no una etiqueta en mayúsculas (§ 4.3). |
| Rótulos visibles | `Torneo` · `Horario`. |
| Área tocable | **44px de alto**, extendidos 6px por arriba y 6px por abajo con un pseudo-elemento absoluto: la caja visible sigue midiendo 32px y el layout no se mueve. Ancho ≥44px por contenido. El **anillo de foco se dibuja sobre la píldora visible de 32px**, no sobre el área extendida — si no, el foco flotaría despegado del control. |
| Posición | En la barra de marca de Inicio, **a la derecha de `Mi equipo`** y antes del engranaje de Ajustes (§ 10.1). |

**Por qué el rótulo visible pierde la preposición.** El rótulo canónico es **con preposición** —`Por torneo` / `Por horario`—, y es el que se usa en cualquier lugar donde las dos opciones aparezcan enfrentadas, porque sin preposición se leen como un filtro ("Torneo / Horario" parece que filtra). **En la píldora no aplica esa lectura**: no hay dos opciones enfrentadas, hay **un botón que muestra un estado**, y el glifo de intercambio ya dice que se alterna. Y además no entra: `Por horario` a 12px/600 mide ~72px y lleva la píldora a ~108px, que rompe el presupuesto de la barra a 320px (§ 10.1). La preposición no se pierde: **vive entera en el nombre accesible**.

**Semántica y accesibilidad**

- Es un `<button>` común. **No** es `role="switch"` ni un `radiogroup`: no hay encendido/apagado ni opciones simultáneas a la vista.
- **`aria-label` dinámico, que nombra el estado actual y el destino:**
  - Vista por torneo activa → «Vista por torneo. Tocar para cambiar a por horario».
  - Vista por horario activa → «Vista por horario. Tocar para cambiar a por torneo».
- **Sin región viva.** El usuario que toca el botón recibe la retroalimentación más grande posible: la lista entera se reagrupa delante suyo, y el nombre accesible del botón —que conserva el foco— ya describe el estado nuevo. Un `aria-live` acá sería un anuncio duplicado.
- El glifo nunca viaja solo: siempre está la palabra al lado.

**Los cinco estados**, en **ambos modos**:

| Estado | Forma |
|--------|-------|
| Reposo | Fondo `--color-surface-2`, borde 1px `--color-border`, texto y glifo `--color-text-2`. |
| Hover (solo puntero) | Borde a `--color-brand`, texto y glifo a `--color-text-1`. El fondo **no** cambia: ya es `--color-surface-2`, que es el hover de superficie de la app — de ahí la necesidad del borde (sexto uso de la marca, § 3.2). Nunca es el único indicio: en touch no existe. |
| Focus | `outline: 2px solid var(--color-focus); outline-offset: 2px` sobre la píldora de 32px. Jamás `outline: none`. |
| Activo / presionado | Borde y texto en `--color-brand-strong`, fondo `--color-surface-2`. Sin desplazamiento de layout. |
| Deshabilitado | **No aplica, y es una decisión, no un olvido:** el conmutador **nunca** se deshabilita — ni mientras carga, ni en Vacío, ni en Error. La agrupación es estado del cliente y no depende del dato; deshabilitarlo dejaría al usuario sin poder cambiar de vista justo cuando la pantalla no le sirve. Si alguna vez hiciera falta: `--color-text-3`, sin puntero. |

**No queda fijo al scrollear.** Se va con la barra de marca (§ 9.2), igual que el wordmark y Ajustes. Es **cromo de entrada**: la vista se elige una vez y persiste entre sesiones (RF-008); un control de esa frecuencia no puede ocupar píxeles permanentes en una app cuyo objetivo es densidad. El riesgo asumido es que cambiar de vista desde el fondo de la lista obliga a scrollear arriba — se acepta por la misma razón que se aceptó que Ajustes no esté siempre visible: es un destino, no una herramienta de escaneo.

**Consecuencia en el encabezado: `Ajustes` deja de ser palabra y pasa a engranaje.** Es una **excepción declarada** a la regla "los accesos del encabezado son palabras" (§ 3.3), y existe por presupuesto de ancho, no por gusto: con `Ajustes` en palabra la barra de marca **no cierra a 320px** (§ 10.1). El engranaje reusa el patrón de botón de icono de § 6.3 **entero y sin cambios** —caja 44×44, `padding: 0`, halo circular en hover, los mismos cinco estados—, con glifo de engranaje de 20px y `aria-label="Ajustes"`. No se inventa un patrón nuevo para un botón nuevo.

#### Contención en pantalla chica

- **Compacta (320–767px), que es la base:** la píldora es `flex-shrink: 0` y **nunca trunca su palabra**. La barra baja su `gap` y su padding lateral de 16px a **12px** para que los cuatro elementos entren; el presupuesto completo está en § 10.1. **Invariante 1:** nada desborda ni fuerza scroll horizontal — el que cede ancho es el espacio libre entre el wordmark y los accesos, que es lo único elástico de la barra. **Invariante 3:** el área tocable es de 44px de alto aunque la píldora se vea de 32px.
- **Amplia (≥768px):** exactamente lo mismo, sin *media query* propia; la barra sangra a todo el ancho con el contenido topado a 720px (§ 9.2). El conmutador **no cambia de forma ni de lugar**, y **no se convierte en dos listas lado a lado**: un control que existe en angosto y desaparece en ancho es peor que uno que está siempre.
- Invariantes 2 y 4: no aplican (no hay modal ni superficie ancha).

#### Checklist de aceptación visual — conmutador de vista

1. Instalación limpia → Inicio abre **por torneo** y la píldora dice `Torneo`.
2. Tocarla → la lista se reagrupa **por horario**, la palabra pasa a `Horario` y **la píldora no se mueve de lugar ni cambia de ancho de forma perceptible**.
3. La elección **sobrevive** a: cambiar de día, ir a Competición o Equipo y volver, recargar, y cerrar y volver a abrir el navegador.
4. `aria-label` nombra el **destino**, no solo el estado, y cambia al alternar.
5. Los cinco estados existen y se ven en claro **y** en oscuro; el foco es visible y se dibuja sobre la píldora de 32px.
6. El área tocable mide **44px de alto** (verificar en computed styles / inspector de accesibilidad, no a ojo) aunque la caja visible mida 32px.
7. Al scrollear, la píldora **se va con la barra de marca**; solo queda fija la barra de día.
8. A 320px: la barra de marca no tiene scroll horizontal, **ninguna palabra se trunca** y el engranaje no se corta ni queda al ras del borde.
9. El violeta aparece en la píldora **solo** en hover, foco y presionado — nunca en reposo, y nunca teñiendo la palabra de la vista como si fuera un dato.
10. El conmutador sigue presente y **habilitado** en Cargando, Vacío y Error.

## 7. Patrón: bloque de partido

Es la unidad que se repite en las tres pantallas — lo que las versiones anteriores de este documento llamaban "fila de partido"; **los dos nombres refieren a lo mismo** y las referencias a "la fila" siguen siendo válidas. **Se especifica una vez y se implementa como un solo componente**; escribirla por pantalla garantiza que las tres se desincronicen. Lo que cambia entre pantallas es el eje de agrupación (§ 7.1) y si el bloque lleva meta-línea (solo Equipo, § 10.3) — no su anatomía.

**El bloque tiene dos disposiciones**, con los mismos datos y el mismo vocabulario: la **compacta** (§ 7.0), que es la base y rige en 320–767px, y la **simétrica** (§ 8.4), que rige en ≥768px. Todo lo demás de esta sección —agrupación, estados, escudos, truncado, corte temporal— vale para las dos por igual.

- **La unidad son dos líneas, una por equipo, más una línea de estado.** Cada línea trae *su* escudo, *su* nombre y *su* número: `escudo · nombre (izquierda) · marcador (derecha)`. Nada de una columna de marcadores desprendida de los nombres.
- **La hora no vive dentro del bloque.** Está siempre en el envoltorio inmediato: el titular, el subtítulo o la meta-línea (§ 7.0). Es la regla que hace posible el bloque de dos líneas, y la que garantiza que la hora nunca se pierda al cambiar de pantalla, de vista o de disposición.
- **Agrupación:** los bloques nunca van mezclados sin envoltorio, salvo en Equipo (lista plana, donde el envoltorio es la meta-línea de cada bloque); qué agrupa cada pantalla se define en § 7.1.
- **Ancho fijo en la ranura del marcador:** con `tabular-nums` los números se alinean entre bloques **y entre pantallas**, y el ojo baja en línea recta. Es la propiedad que hace escaneable la app entera; todo lo demás se subordina a ella. **Ninguna ranura numérica es `auto`, en ninguna disposición.**
- **Sin resultado todavía** → la ranura del marcador queda vacía —pero **reservada**, no colapsada—, y no muestra `-` ni `0-0`. Un `0 - 0` en un partido que no empezó es un dato falso; una ranura colapsada desalinearía los nombres del bloque de al lado.
- **Sin tarjetas.** La lista corre directamente sobre `--color-bg`. La separación entre bloques es una **divisoria de 1px `--color-border`** al pie de cada uno; el último bloque de la lista no la lleva. No hay fondo de bloque, ni borde de contorno, ni radio, ni bandas alternadas.

**Por qué desaparecieron las tarjetas.** Envolver cada grupo en una superficie con borde y radio agregaba, por grupo, dos bordes verticales, ~24px de padding lateral y un encabezado con fondo propio — todo para comunicar algo que el titular ya comunica solo. En un lector de listas eso es cromo compitiendo con el dato (§ 1), y además le comía al nombre de equipo el recurso más escaso de la pantalla: **el ancho**. `--color-surface` y `--color-surface-2` dejan de usarse como fondo de lista; `--color-surface` queda para las barras de encabezado y la tarjeta de Configuración, y `--color-surface-2` para el skeleton, la píldora del conmutador, la banda `PRÓXIMOS` y los hover de superficie.

### 7.0 Anatomía (disposición compacta, que es la base)

```
Primera A ─────────────────────────────      ← titular  (18px / 700)
16:30                                        ← subtítulo (12px / 600)
▨ Central Córdoba (SdE)               1
▨ Gimnasia y Esgrima (LP)             1
Finalizado
─────────────────────────────────────────    ← divisoria 1px
```

#### El envoltorio de grupo: titular + subtítulo

Reemplaza al encabezado de grupo con fondo propio de la versión anterior. **Son dos niveles y siempre están los dos** (salvo Equipo, que no agrupa y resuelve el contexto con la meta-línea, § 10.3). Qué dato ocupa cada nivel es lo único que cambia entre pantallas y entre vistas:

| Pantalla / vista | Titular | Subtítulo |
|------------------|---------|-----------|
| Inicio · **por torneo** (default) | Competición: marca + nombre | Hora: `16:30` |
| Inicio · **por horario** | Hora: `16:30` | Competición: marca + nombre |
| **Competición** | Fecha absoluta: `mié 15 abr` | Hora: `16:30` |
| **Equipo** | — (lista plana) | — (el contexto va en la meta-línea, § 10.3) |

| Parte | Especificación |
|-------|----------------|
| **Titular** | `--fs-lg` 18px / **700** / tracking `-0.02em` / `--color-text-1`, línea de texto de 24px dentro de una fila de **`min-block-size: 32px`**, `tabular-nums` cuando es hora o fecha. `display: flex; align-items: center; gap: --space-2`. A la derecha del texto corre una **línea de 2px `--color-border`** (`flex: 1`) hasta el borde del contenido. `margin-block-end: --space-2` (8px); todo grupo que no sea el primero lleva además `margin-block-start: --space-4` (16px). |
| **Subtítulo** | `--fs-xs` 12px / 600 / tracking `0.04em` / `--color-text-3`, línea de texto de 16px dentro de una fila de **`min-block-size: 24px`**, `tabular-nums` cuando es hora. `display: flex; align-items: center; gap: --space-2`. `margin-block-end: --space-1` (4px); todo subgrupo que no sea el primero de su grupo lleva `margin-block-start: --space-2` (8px). |
| **Marca de competición** | Glifo de 18px en `currentColor` (§ 5, § 7.3), antes del nombre. Hereda el color del nivel en el que está: `--color-text-1` en el titular, `--color-text-3` en el subtítulo. **No introduce color nuevo ni depende del modo.** |
| **Link** | El nombre de competición **es link** a la pantalla Competición, esté en el titular o en el subtítulo, con el subrayado de § 3.3 y el tratamiento tipográfico de su nivel. La hora y la fecha **nunca** son link. La línea de 2px **no** entra al área tocable (§ 3.3). |

**Por qué dos niveles y no un encabezado único.** La lista tiene dos ejes reales —cuándo y de qué torneo— y el usuario entra buscando uno de los dos. Con dos niveles, el eje que buscás es el titular y el otro sigue estando, un escalón abajo, sin desaparecer: alternar vista es **girar la misma lista**, no saltar a otra pantalla. Con un solo encabezado habría que elegir qué dato tirar, y la vista alterna dejaría de ser reversible sin pérdida.

#### El bloque

`padding: --space-2 0` (8px arriba y abajo), sin fondo, sin borde de contorno, sin radio, `border-block-end: 1px solid --color-border`. Alto resultante: **92px**.

| Ranura | Contenido | Tratamiento | Por qué |
|--------|-----------|-------------|---------|
| **Línea de equipo** (×2: local arriba, visitante abajo) | `display: flex; align-items: center; gap: --space-2` (8px), **`min-block-size: 28px`** | Las dos líneas suman **56px**, que es el módulo vertical de la app (§ 5, § 9.1). | Un bloque que se apoya en el mismo módulo que las barras no introduce un ritmo nuevo. |
| — **Escudo** | 18px, `flex: 0 0 auto`, tal cual lo provee la fuente (§ 2) | Solo con la variante 2 (§ 7.4); con la variante 1 vigente, la línea arranca en el nombre. | Es el primer elemento **de cada línea**, no del bloque: cada escudo queda pegado a su nombre y a su número. |
| — **Nombre** | `flex: 1; min-inline-size: 0` | `--fs-base` 16px / 500 / `--color-text-1`, link (§ 3.3), truncado según § 7.5. El link ocupa los 28px de su línea. | El dato principal, pegado al borde izquierdo. Los dos nombres son links; el bloque entero no lo es (§ 3.3). |
| — **Marcador** | **`flex: 0 0 24px`**, alineado a la derecha | `--fs-lg` 18px / `tabular-nums`, peso según § 3.1 | Un número por línea, a la altura de su equipo: el usuario no tiene que mapear "el primero es el de arriba". 24px entran dos dígitos tabulares a 18px con holgura. |
| **Línea de estado** | Tercera línea, **alineada a la izquierda, siempre** | `margin-block-start: --space-1` (4px), `display: flex; align-items: center; gap: --space-2`, línea de 16px. Forma (8px) + palabra, `--fs-xs` 12px / 500, sin tracking. Vocabulario y color en § 7.2. | Renglón propio y no una franja embutida entre los nombres: no le roba ancho a nada y admite `Suspendido · 54'` completo sin truncar. |

**Reparto vertical:** 8 (relleno) + 28 + 28 + 4 + 16 + 8 (relleno) = **92px**. La divisoria queda a 8px del contenido de arriba y a 8px del de abajo — equidistante, así que no se "pega" a ninguno de los dos bloques.

#### Presupuesto de ancho a 320px

El caso que manda (§ 8). 320 − 32 de padding de pantalla = **288px de contenido**, sin bordes de tarjeta ni padding de tarjeta que descontar:

| Concepto | Ancho para el nombre |
|----------|----------------------|
| 288 − 8 (gap) − 24 (marcador) — **variante 1, sin escudo (vigente)** | **256px** ≈ 32 caracteres |
| 288 − 18 (escudo) − 16 (dos gaps) − 24 (marcador) — **variante 2, con escudo** | **230px** ≈ 28 caracteres |

**Contra la anatomía anterior, el nombre gana ~90px** (eran 166px sin escudo y 140px con escudo). Los paga la desaparición de la columna de hora de 48px, de los bordes y el padding de la tarjeta, y de un gap. Es la ganancia concreta del patrón nuevo: el dato que el usuario vino a leer entra completo mucho más seguido, y el truncado de § 7.5 pasa a ser una red y no la norma.

#### Invariantes del bloque

1. **La ranura del marcador mide 24px, es fija y termina en el mismo píxel** — entre bloques, entre grupos y **entre las tres pantallas**. Nunca `auto`, nunca colapsada, ni cuando está vacía. Verificable apoyando una regla vertical sobre Inicio, Competición y Equipo.
2. **Todo lo que se agregue se lo come el nombre**, que ya trunca. Ni el escudo, ni la meta-línea, ni un estado largo mueven el marcador.
3. **El alto del bloque no depende del contenido:** son 92px con estado o sin estado, con nombre corto o largo, en las tres pantallas. Un partido programado no tiene línea de estado visible pero **el renglón se reserva igual**, para que la lista no cambie de ritmo entre un partido programado y uno finalizado.
4. El invariante 1 es de **cada disposición consigo misma**, no entre disposiciones: en amplia las ranuras numéricas son otras (§ 8.4), pero ahí también son fijas y también alinean en las tres pantallas. Lo que nunca se admite es un ancho `auto` en una ranura numérica.

**Meta-línea (solo Equipo, § 10.3):** va **arriba** de las dos líneas de equipo, como cuarta línea del bloque, de una sola línea con `nowrap` y elipsis. **El marcador ya no necesita ningún desplazamiento**: cada número vive en la línea de su equipo, así que la meta-línea no lo despega de nada. Esa corrección de 16px que existía en la anatomía anterior **queda eliminada** y no hay que reintroducirla en ninguna disposición.

### 7.1 Qué agrupa cada pantalla

Las tres pantallas muestran la misma lista de partidos, pero **lo que el usuario ya sabe al entrar es distinto en cada una**, y el eje de agrupación es exactamente lo que *no* sabe. Repetir en cada fila un dato que es el título de la pantalla es ruido. Esto fija el eje de agrupación; qué agrega y qué omite la fila en cada pantalla está cerrado en § 10:

| Pantalla | Titular (nivel 1) | Subtítulo (nivel 2) | Notas |
|----------|-------------------|---------------------|-------|
| **Inicio · por torneo** (default, RF-008) | **Competición** (máximo 3 grupos) | **Hora** | El nombre de competición **es el link** a la pantalla Competición. |
| **Inicio · por horario** (RF-008) | **Hora** de inicio | **Competición** | Mismos partidos, ejes intercambiados. El link sigue estando en el nombre de competición, ahora en el subtítulo. |
| **Competición** | **Fecha** (día) | **Hora** | Ni la fecha ni la hora son link. Sin nivel de competición: es el título de la pantalla. |
| **Equipo** | — **lista plana**, cronológica | — | El contexto (fecha · hora · competición) viaja en la meta-línea de cada bloque (§ 10.3). |

**Las dos vistas de Inicio usan exactamente el mismo esqueleto:** mismo titular, mismo subtítulo, mismo bloque, mismas divisorias, mismos estados. Lo único que cambia es **qué dato manda**. Esa identidad es la que hace que alternar se lea como girar la misma lista y no como saltar a otra pantalla — y es también la razón por la que **no** existen dos sistemas de fila en la misma pantalla: la vista por torneo adoptó la anatomía de § 7.0 completa, sin conservar nada de la grilla anterior.

**Por qué Competición gana un subtítulo de hora.** No es alcance nuevo: al salir la columna de hora del bloque (§ 7.0), la hora tiene que vivir en el envoltorio, y en Competición el titular ya está ocupado por la fecha. El subtítulo de hora es el mismo mecanismo que la vista "por torneo" de Inicio, con fecha en lugar de competición. Sin él, Competición sería la única pantalla de la app donde la hora de un partido no se ve.

**Por qué Equipo no agrupa:** un equipo juega una o dos veces por semana, así que agrupar por fecha daría una ristra de titulares con un solo bloque abajo — más cromo que dato. Y agrupar por competición rompería el orden cronológico, que es justamente lo que el usuario viene a ver ("¿cuándo juega?").

**Ancla del orden (Competición y Equipo):** las listas son cronológicas ascendentes y se abren posicionadas en el **próximo partido**. Visualmente eso exige que se vea dónde está el corte entre lo jugado y lo que viene; su forma está en § 7.6.

### 7.2 Vocabulario de estados de partido — **provisional**

**Provisional hasta el relevamiento real de API-Football** (pendiente en `docs/data-model.md`): la app no inventa estados, muestra los que la API devuelve (RN-001). Esta tabla fija **cómo se dice y cómo se ve** cada estado que razonablemente vamos a recibir; cuando el relevamiento cierre, se ajustan las filas, no las reglas.

**La regla de vocabulario: palabra completa, capitalizada, en su propia línea.** Sin mayúsculas, sin versalitas, sin abreviaturas. Siete palabras, y ninguna más:

`Finalizado` · `En vivo` · `Entretiempo` · `Suspendido` · `Postergado` · `Cancelado` · `A confirmar`

| Estado | Línea de estado | Marcador | Color y forma (§ 3.1) |
|--------|-----------------|----------|------------------------|
| Programado | *(vacía — el renglón se reserva igual, invariante 3 de § 7.0)* | Vacío | Neutro, sin forma. La hora está en el envoltorio: es todo lo que hay que decir. |
| En vivo | ● `En vivo · 68'` | Presente, ambos 600 (`0 - 0` es válido) | Verde. **Círculo** de 8px `--radius-full`, pulsa. |
| Entretiempo | ● `Entretiempo` — **nunca lleva minuto** | Presente, ambos 600 | Verde. Círculo, pulsa. |
| Finalizado | `Finalizado` en `--color-text-3` | Presente; ganador 700, perdedor 400 + `--color-text-2`; empate ambos 500 | Neutro — el ganador se distingue por peso, nunca por color. |
| Postergado | ◆ `Postergado` | Vacío | Ámbar. **Rombo** de 8px (cuadrado a 45°). |
| Suspendido | ◆ `Suspendido · 54'` (minuto si la fuente lo da) | **Puede haber parcial** — se muestra tal cual | Ámbar. Rombo. |
| Cancelado | ◆ `Cancelado` | Vacío | Ámbar. Rombo. Nunca rojo: no falló la app (§ 3.1). |
| A confirmar | `A confirmar` en `--color-text-3` | Vacío | **Neutro**, no ámbar y sin forma: el partido está bien, lo que falta es la hora. En el envoltorio, la ranura de hora muestra `—`. |

**`FIN` se elimina por completo, y con él toda abreviatura de estado.** La regla anterior admitía la forma corta cuando otro dato de la fila sostenía el estado; existía porque `FIN` vivía en una sub-línea de una columna de 48px que **ya no existe**. Con el estado en renglón propio, la palabra completa entra siempre y en las tres pantallas. Que se repita quince veces por pantalla ya no es un problema de tinta: la línea de estado es el texto **más liviano** del bloque (12px / 500 / `--color-text-3`), por debajo del nombre (16px / 500 / `--color-text-1`) y del marcador. Lo que en la anatomía anterior era el elemento con más peso de la fila, acá es el que menos pesa — así que se puede decir entero, que es lo que el usuario entiende sin aprender nada.

**Un solo vocabulario, en las dos disposiciones y en las tres pantallas.** No hay forma larga en amplia y corta en compacta: `Suspendido · 54'` entra completo a 320px porque la línea dispone del ancho entero del bloque.

**El minuto se concatena con punto medio** (` · `), nunca entre paréntesis ni pegado. **Excepción: `Entretiempo` nunca lleva minuto** — el partido está detenido y el número sería ruido que además cambiaría solo.

**Círculo para el verde, rombo para el ámbar — se mantienen.** Es lo que hace que "nada solo por color" (§ 2) se cumpla de verdad: en escala de grises, o con daltonismo rojo-verde, un partido postergado se distingue de uno en vivo por **forma y palabra**, sin depender del tono. Alguien podría argumentar que con la palabra completa la forma sobra; no sobra, porque la forma es lo que se lee **de un vistazo** al barrer la lista, antes de leer ninguna palabra, y porque el punto verde pulsante es la única señal de la app que se ve sin enfocar. El rojo no aparece nunca en un bloque (§ 3.1: un partido cancelado no es un error de la app), así que la app usa dos formas, no tres.

- **Prohibida la abreviatura `ET`**: colisiona entre *entretiempo* y *tiempo extra*, y con Libertadores/Sudamericana el alargue existe. Si el relevamiento confirma alargue y penales, entran como `Tiempo extra` y `Penales`, ambos con tratamiento de "en vivo" (verde, círculo).
- **Marcador vacío se deja vacío; hora ausente lleva `—`.** No es incoherente: un `-` en la ranura del marcador se leería como un resultado, mientras que un hueco donde va la hora —que es la que ordena la lista entera— se lee como un error de render. El em dash dice "todavía no hay hora", y la línea `A confirmar` lo explica.
- **Nombre accesible = la palabra visible.** Al no haber abreviaturas, no hace falta ningún `title` ni `aria-label` que traduzca nada. Las formas (círculo, rombo) van `aria-hidden`: la palabra ya está.

> **PENDIENTE (funcional, no visual):** dónde cae el grupo de los partidos con hora a confirmar dentro del orden de la lista —al final, al principio o en su lugar estimado— no está definido en `docs/screens.md`. Visualmente el envoltorio muestra `—`; el orden lo decide el analista.

### 7.3 Nombres de competición — forma corta, capitalizada, con marca

El nombre completo se usa en el título de la pantalla Competición; la **forma corta** es para el titular o el subtítulo de grupo en Inicio y para la meta-línea del bloque en Equipo.

| Nombre completo | Forma corta | Marca (18px, `currentColor`) |
|-----------------|-------------|------------------------------|
| Primera A — Argentina | `Primera A` | Círculo con estrella inscripta |
| Copa Libertadores | `Libertadores` | Escudo con disco central |
| Copa Sudamericana | `Sudamericana` | Rombo con rombo interior |

**Capitalizadas, no en mayúsculas.** Las mayúsculas eran coherentes cuando el nombre de competición era una etiqueta de 12px dentro de una banda; ahora, en la vista por torneo, ese mismo nombre es **el titular de la sección a 18px/700**, y una palabra larga en mayúsculas a ese tamaño se convierte en el elemento más pesado de la pantalla. Y no puede haber dos ortografías del mismo nombre según dónde aparezca: si el titular dice `Primera A`, el subtítulo y la meta-línea de Equipo también. **Una sola forma escrita por nombre, en toda la app.**

**Es una tabla, no un algoritmo:** acortar por truncado automático produce basura (`Copa Sudameric…`), y capitalizar por función produce `Primera a`. Son tres competiciones fijas en la v1 (`docs/requirements.md`), así que la forma escrita es un dato de presentación curado, no una transformación. Dónde vive ese mapeo y cómo se concilia con RN-001 es decisión funcional/técnica, no visual.

**Por qué existen las marcas.** En la vista **por horario** los partidos de torneos distintos quedan mezclados bajo una misma hora, y el nombre del torneo baja a subtítulo de 12px. La marca permite discernir el torneo **de un vistazo, sin leer**, sin agregar color y sin ocupar ancho de nombre. Tres formas geométricas simples y distinguibles entre sí en escala de grises y a 18px.

- Van en `currentColor`: heredan el color del texto que acompañan, así que **no introducen ningún color nuevo ni dependen del modo**.
- **No son los escudos de las competiciones.** Son glifos del sistema de diseño (§ 5), del mismo trazo que el resto de la iconografía. Si algún día llegan los logos reales de competición, rige § 2 —se muestran tal cual la fuente— y **estas marcas desaparecen**: no conviven un glifo propio y un logo real para el mismo torneo.
- **Siguen siendo provisionales:** los tres glifos son formas genéricas de diseño, no assets aprobados de marca (§ 11).
- Acompañan al nombre en los tres lugares donde aparece (titular, subtítulo, meta-línea) y **nunca aparecen solas**: la marca sin el nombre sería un símbolo que hay que aprender.

### 7.4 Escudos — **se implementa la variante 1 (sin escudo)**

Que API-Football provea logos sigue **pendiente de relevamiento** (`docs/data-model.md`). La decisión de qué se construye ahora **se cierra acá, y es la variante sin escudo**; la variante con escudo queda especificada al detalle para que adoptarla el día que el dato se confirme sea un cambio mecánico y no un rediseño.

**Variante 1 — sin escudo. Es la que se implementa.**

Cada línea de equipo arranca en el nombre. El nombre alcanza: es el dato que el usuario vino a leer.

> **Nota de lectura del canvas de diseño.** Las maquetas del patrón nuevo dibujan escudos en todas las líneas (rectángulos rayados). **Son marcas de "asset pendiente", no la variante adoptada**: mientras `docs/data-model.md` no confirme que la fuente provee logos, lo que se implementa es la variante 1 y las líneas arrancan en el nombre. La anatomía de § 7.0 ya reserva el lugar del escudo para que adoptar la variante 2 sea mecánico.

**Por qué esta y no la variante con placeholder** (que es lo que proponía el handoff de origen):

1. **Un placeholder no es un escudo: es una caja gris que no dice nada.** Si el relevamiento vuelve con "no hay logos", la app queda con una columna de rectángulos idénticos en cada fila, permanentemente. Eso es decoración inventada (§ 1) y, peor, crea un ritmo vertical falso que el ojo tiene que filtrar en cada barrida — en un lector de listas es exactamente el tipo de ruido que hay que sacar.
2. **Cuesta 26px del recurso más escaso.** 18 de escudo + 8 de gap salen del nombre, que a 320px pasa de **256px a 230px**: **≈4 caracteres menos por nombre** (§ 7.0). Pagar cuatro caracteres de un dato real por un placeholder que no es ningún dato es un mal cambio. (El patrón nuevo aflojó la presión —el nombre ganó ~90px— pero no cambió el signo del cálculo.)
3. **El costo de esperar es acotado y conocido.** Adoptar la variante 2 después mueve el truncado de los nombres y suma un elemento al encabezado de dos pantallas. Eso se re-verifica con el checklist que ya está escrito (§ 10) — no se rediseña nada, porque los valores están todos fijados abajo.
4. **La regla de "la caja nunca se colapsa" no obliga a reservarla desde hoy.** Esa regla resuelve *un equipo sin logo dentro de una app que tiene logos*; no dice nada sobre *una app que todavía no sabe si tendrá logos*. Son dos problemas distintos y el handoff los mezclaba.

**Variante 2 — con escudo. Especificada, no implementada.** Se adopta **solo** cuando `docs/data-model.md` confirme que la fuente provee logos y que el tamaño servido rinde bien a 18px. Ese día no hay decisión visual que tomar: es esto.

| Dónde | Tamaño | Colocación |
|-------|--------|------------|
| Bloque de partido, **disposición compacta** | **18px** | **Primer elemento de cada línea de equipo** —no del bloque—, antes del nombre, `gap: --space-2` (8px), `flex: 0 0 auto`. Cada escudo queda a la altura de su propio nombre y de su propio número. |
| Bloque de partido, **disposición amplia** | **18px** | **Hacia adentro, flanqueando el marcador** (§ 8.4): local → nombre y después escudo; visitante → escudo y después nombre. La simetría es de espejo, no de repetición. |
| Encabezado de Equipo y de Competición | **24px** | Antes del título, `margin-inline-end: --space-2`. |

- **18 y 24px son tamaños de icono, no pasos de la escala de espaciado** (§ 5 admite 16/20/24): 18px es el que se alinea con la altura de línea de 24px de un nombre a `--fs-base`. Excepción declarada, no un valor suelto.
- **Tal cual lo provee la fuente:** sin recolorear, sin filtro por modo, sin borde, sin fondo, sin recorte circular (§ 2).
- **El marcador no se mueve** al adoptar la variante 2, en ninguna de las dos disposiciones. El escudo se lo come el nombre, que ya trunca (§ 7.0, invariante 2).
- **Escudo faltante o que no carga, dentro de la variante 2:** la caja **nunca se colapsa** —si se colapsara, los nombres de dos filas contiguas quedarían desalineados—. Placeholder del mismo tamaño, `--color-surface-2` con borde 1px `--color-border` y `--radius-sm`. **Plano: sin rayas, sin iniciales, sin glifo.** (Las rayas del prototipo de origen eran una marca de "asset pendiente", no un tratamiento a portar.) El espacio se reserva desde el primer pintado: la llegada del escudo no corre nada.
- Con la variante 2 activa, el **skeleton** (§ 6) incluye la caja del escudo; con la variante 1, no.

**Un solo interruptor para toda la app.** Si se adopta la variante 2, se adopta en fila **y** en encabezados a la vez. No existe el estado intermedio "escudo en el título pero no en las filas": sería la misma pregunta contestada de dos maneras en dos pantallas contiguas.

### 7.5 Truncado de nombres con sufijo desambiguador

**Problema:** `Central Córdoba (SdE)` truncado a una línea da `Central Córdo…` y pierde exactamente el token que lo distingue de otro club homónimo. El truncado se come el dato más discriminante justo porque está al final.

**Regla: el sufijo entre paréntesis está protegido del truncado.** El nombre se compone de dos piezas en una sola línea — base y sufijo —; la base trunca con elipsis y el sufijo se mantiene entero. Resultado: **`Central Córdo… (SdE)`**.

| Pieza | Comportamiento |
|-------|----------------|
| Base | `min-width: 0`, `white-space: nowrap`, `overflow: hidden`, `text-overflow: ellipsis`. Cede ancho primero. |
| Sufijo entre paréntesis | No cede ancho (`flex-shrink: 0`), `white-space: nowrap`. |
| **Tope de la protección** | El sufijo **no puede quedarse con más de la mitad del ancho disponible para el nombre**, y la base nunca baja de ~4 caracteres. Superado ese punto, el sufijo también trunca. |

- **No se toca el string de la fuente** (RN-001): es una regla de presentación sobre el texto que llegue, no una transformación del dato ni una tabla curada por equipo.
- **No crece el bloque.** La altura constante es el activo de un lector de listas (invariante 3 de § 7.0); se descarta pasar el nombre a dos líneas, que haría convivir bloques de 92px con bloques de ~116px, despegaría el marcador de la línea de su equipo y bajaría la densidad ~25%. Con el nombre en 230–256px a 320px (§ 7.0) el truncado es una red, no la norma.
- **Se descarta también el sufijo sin paréntesis** (`Central Córdoba SdE`): es la lectura más limpia de las tres, pero se aparta del string de la fuente y exige una tabla curada equipo por equipo — costo de mantenimiento permanente por una mejora tipográfica.
- **El tope existe porque un paréntesis largo puede ser peor que el truncado.** Sin él, un `(Santiago del Estero)` protegido dejaría `C… (Santiago del Estero)`: se salva el desambiguador y se pierde el nombre. La protección sirve a un sufijo corto, que es el caso que motiva la regla.
- El nombre completo va en `title` y queda íntegro en el DOM, así que el lector de pantalla nunca recibe el texto recortado.

**Dependencia declarada:** esta regla asume que el desambiguador llega **entre paréntesis**. Si el relevamiento de API-Football muestra que viene sin ellos (`Gimnasia L.P.`), la regla no se dispara y el sufijo se pierde igual. Eso es una pregunta de dato, no de composición → § 11.

### 7.6 Corte entre lo jugado y lo que viene

Las listas de Competición y Equipo son cronológicas ascendentes y **abren posicionadas en el próximo partido** (§ 7.1). Para que esa posición se entienda, el corte tiene forma:

| Parte | Especificación |
|-------|----------------|
| Banda | Ancho completo de la lista, fondo `--color-surface-2`, borde superior e inferior 1px `--color-border`, `padding: --space-1 --space-3` (4px 12px). |
| Palabra | `PRÓXIMOS`, `--fs-xs` 12px / 600 / tracking `0.04em` / mayúsculas / `--color-text-2`. |

- **Es neutro y sin marca, a propósito.** No es un estado del partido ni un dato deportivo: es una marca de posición en el tiempo. Teñirlo de violeta lo convertiría en el elemento más llamativo de una pantalla cuyo protagonista es el partido.
- No lleva target tocable ni estados: no es interactivo.
- **No aparece en Inicio, en ninguna de las dos vistas** (RF-008). Inicio muestra un solo día: el corte se repetiría una vez por grupo —hasta tres o cuatro veces por pantalla— para separar dos o tres bloques cada vez. Más cromo que dato. Y en la vista **por horario** sería redundante hasta el absurdo: la lista ya está ordenada por hora, así que el corte caería exactamente donde el usuario ya sabe que cae.
- Aparece **una sola vez por lista**, aunque la lista esté agrupada por fecha (Competición): el corte es del eje temporal completo, no de cada grupo.

## 8. Contención responsive

Sección de referencia obligada de `docs/qa-visual.md`, `.claude/agents/design.md` y `.claude/agents/frontend.md`.

### 8.1 Anchos y umbral

| Concepto | Valor |
|----------|-------|
| **Ancho mínimo soportado** | **320px** |
| **Token del umbral amplio/compacto** | **`--bp-wide` = 768px** |
| **Disposición compacta** | **320–767px** (`< --bp-wide`) |
| **Disposición amplia** | **≥ 768px** |
| **Ancho máximo del contenido** | 720px, centrado, a partir de `--bp-wide` |

**Mobile-first, explícito:** el diseño **arranca en 320px y crece hacia arriba**. La disposición compacta es la base —los estilos por defecto, sin media query— y `--bp-wide` es la única *media query* que agrega la disposición amplia. Nunca al revés: no se escribe el escritorio primero para después parchear con `max-width`.

**Un solo umbral, a propósito.** Tres pantallas de listas no justifican una escala de breakpoints; más umbrales serían más estados que mantener y testear sin ganancia para el usuario.

**Fulbo no tiene navegación persistente.** Sin sidebar ni tabs (`docs/screens.md`), la navegación es drill-down puro. Por lo tanto **el régimen compacto/amplio se mide directo contra el ancho del viewport**: no hay chrome fijo que le reste ancho al contenido y no existe el caso "nav abierta vs. cerrada".

**Por debajo de 320px** la app no promete contención. No hay pantalla de bloqueo: el shell mantiene un piso de `min-inline-size: 320px` y el documento puede panear horizontalmente. Ese piso **es** el "gate" que menciona `docs/qa-visual.md`, y es la única excepción tolerada al invariante 1. A 320px (el equivalente a 400% de zoom en un escritorio de 1280px) la app sigue siendo plenamente usable.

### 8.2 Los cuatro invariantes

Se cumplen **en todo ancho ≥ 320px**, en ambas disposiciones y en ambos modos:

1. **Sin scroll horizontal del `body`** en ningún ancho ≥ 320px.
2. **Modales completos y scrolleables**: ni cortados ni atrapantes. *La v1 no tiene modales (`docs/screens.md`); el invariante rige igual desde el momento en que aparezca el primero.*
3. **Ninguna acción inalcanzable**: nada fuera de pantalla ni tapado. En Fulbo aplica sobre todo a las flechas ← → de Inicio y a los links de equipo/competición dentro de una fila apretada.
4. **Las superficies anchas scrollean dentro de sí mismas**, sin romper el layout de la página.

### 8.3 Cómo se cumplen en Fulbo

- **Compacta (320–767px):** una sola columna a todo el ancho menos 16px de padding lateral —12px en la barra de marca de Inicio (§ 10.1)—. Cada nombre de equipo lleva `min-inline-size: 0` y elipsis: el nombre largo se recorta, no empuja (invariante 1). Nombres de competición en forma corta. Las flechas de día quedan ancladas a los bordes de su barra, con 44px de target y sin salirse (invariante 3).
- **Amplia (≥768px):** el contenido se centra y se limita a **720px** con 24px de padding lateral. Ensanchar la lista más allá de 720px alarga el recorrido del ojo entre un extremo y el otro de la fila y la hace más lenta de leer, que es exactamente lo contrario del objetivo. **No se agregan columnas a la página ni se ponen dos listas lado a lado** —tampoco las dos vistas de Inicio lado a lado (§ 8.4)—: la lista sigue siendo una lista. Lo que sí cambia es la **forma interna del bloque** — § 8.4.
- **Todo spec de feature declara su comportamiento compacto**, aunque sea "no cambia". Un spec sin sección de contención está incompleto.

### 8.4 El bloque en disposición amplia — **fila simétrica centrada (cerrado)**

**Confirmado por el usuario.** En ≥768px el bloque cambia de forma: las dos líneas de equipo se funden en **una sola fila en espejo alrededor de un eje central**, y el envoltorio se centra con ella. Los datos son exactamente los mismos; cambia dónde se paran.

```
                  Primera A ──────────────────────
                            16:30
   Central Córdoba (SdE) ▨  1 – 1  ▨ Gimnasia y Esgrima (LP)
                          Finalizado
```

**Una sola disposición amplia para toda la app, y esto lo cierra.** El canvas de Inicio había llegado a proponer una **columna izquierda de 180px** para la competición en pantalla ancha, mientras Competición y Equipo usaban la fila simétrica: dos soluciones distintas para el mismo problema en el mismo producto. **Queda la fila simétrica, en las tres pantallas y en las dos vistas de Inicio.** La columna izquierda queda descartada y no vuelve.

**Si se centra la fila, se centra todo el bloque.** Centrar solo la línea de equipos deja el titular, el subtítulo y el estado colgando a la izquierda, y el ojo pierde el eje. Por eso en amplia el **titular va centrado con la línea de 2px abriendo a los dos lados**, el **subtítulo va centrado** y la **línea de estado va centrada bajo el marcador**.

**La condición no negociable:** las ranuras numéricas son de **ancho fijo**, nunca `auto`. Con `auto`, un `10 – 1` mide distinto que un `1 – 0` y los marcadores dejarían de formar columna: zigzaguearían entre nombres de largo variable y se rompería la alineación vertical de los números, que es lo único que hace escaneable la lista (§ 7.0) y la razón entera de `tabular-nums` (§ 4.2).

#### Anatomía

Grid de **siete columnas**, `column-gap: --space-2` (8px), `align-items: center`, `padding: --space-2 0` (8px), `border-block-end: 1px solid --color-border`. La fila del partido lleva `min-block-size: 32px` (lo que pide un marcador de 22px). **Alto resultante: 68px** sin meta-línea — 8 + 32 + 4 + 16 + 8. En amplia el bloque es más bajo que en compacta (92px) porque los dos equipos comparten una sola fila: la lista gana densidad justo donde hay más ancho.

| # | Columna | Ancho | Contenido |
|---|---------|-------|-----------|
| 1 | Nombre local | `1fr`, `min-inline-size: 0` | Alineado **a la derecha**. |
| 2 | Escudo local | 18px (colapsa a 0 con la variante 1, § 7.4) | Hacia adentro. |
| 3 | Marcador local | **28px fijos** | Alineado a la derecha (mira al eje). |
| 4 | Separador | **20px fijos** | En dash, centrado. |
| 5 | Marcador visitante | **28px fijos** | Alineado a la izquierda (mira al eje). |
| 6 | Escudo visitante | 18px (ídem col. 2) | Hacia adentro. |
| 7 | Nombre visitante | `1fr`, `min-inline-size: 0` | Alineado **a la izquierda**. |

**El bloque central mide siempre 92px** (28 + 8 + 20 + 8 + 28), pase lo que pase con el contenido. Es el eje real de la lista y reemplaza al eje de 96px de la versión anterior de este documento.

Y **tres filas**:

| Fila | Contenido | Colocación |
|------|-----------|------------|
| **1 — meta** | Solo en Equipo: `dom 19/04 · 16:30 · ▣ Primera A` (§ 10.3). | `grid-column: 1 / -1`, **centrada**, `min-block-size: 24px`. No existe en Inicio ni en Competición. |
| **2 — el partido** | Las siete columnas de arriba. | — |
| **3 — estado** | La palabra del estado, con su forma (§ 7.2). | `grid-column: 1 / -1`, **centrada**, `margin-block-start: --space-1`. El renglón se reserva aunque esté vacío (invariante 3 de § 7.0). |

**Las filas 1 y 3 son de ancho completo, no van dentro del bloque central.** Es lo que hace viable el ancho fijo del eje: si el estado viviera adentro de los 92px, `Entretiempo` o `Suspendido · 54'` obligarían a ensanchar el eje muy por encima de lo que el marcador necesita —desparramando los nombres y aflojando la simetría— o a truncar una palabra que el usuario no puede permitirse malinterpretar (§ 7.2). Como filas propias disponen del ancho entero (~720px) y **nunca truncan**.

#### El eje

| Qué muestra | Cuándo | Tratamiento |
|-------------|--------|-------------|
| Marcador | Hay marcador | `--fs-xl` 22px, `tabular-nums`, **pesos idénticos a compacta** (§ 3.1: ganador 700 / perdedor 400 + `--color-text-2`; empate 500; en curso 600). |
| Separador | **Siempre** | **En dash `–` (U+2013)** — no guion corto, no em dash — en `--fs-lg` 18px, `--color-text-3`. Un paso más chico y en terciario porque **no es un dato**: separa dos números, no dice nada. |
| Sin marcador | Programado, postergado, cancelado, a confirmar | Las dos ranuras de 28px quedan **vacías pero reservadas**, y **el guion queda solo, aclarado a `--color-border`**: el eje no queda hueco, pero tampoco finge un dato. |

- **La hora no aparece en el eje, nunca.** Ya está en el titular o en el subtítulo del grupo, según la vista (§ 7.0, § 7.1). Repetirla en el centro sería decir dos veces lo mismo a dos tamaños distintos. Esto deroga la regla anterior, que ponía la hora en el eje cuando no había marcador: existía porque la hora vivía dentro de la fila, y ya no.
- **De dónde salen los 28px de cada ranura.** Contenido más ancho posible: dos dígitos tabulares a 22px ≈ 26,4px. 28 (7 × 4) deja la holgura mínima que absorbe la diferencia de métricas entre Inter y la tipografía de respaldo **antes de que la webfont cargue** — con un ancho al ras, el número desbordaría durante ese primer pintado. **No es un valor a ojo: si cambia el tamaño del marcador, se recalcula desde el contenido.**
- **De dónde salen los 20px del separador:** un en dash a 18px mide ≈10px; 20px lo centran con aire y mantienen el bloque central en un número redondo.

#### Los equipos

- **Local:** columna 1, alineado **a la derecha**. **Visitante:** columna 7, alineado **a la izquierda**. Ambos `--fs-base` 16px / 500 / `--color-text-1`, links (§ 3.3), `min-inline-size: 0`.
- **Ancho por nombre** a 720px de contenido: **~306px** con la variante 1 y **~288px** con la variante 2 — de sobra para que un nombre entre completo.
- **Truncado:** rige § 7.5 igual que en compacta. Casi nunca se dispara, pero es la red que sostiene el invariante 1 con un nombre extremo. La elipsis cae al final del string —del lado que mira al eje— en las dos columnas: misma regla, sin caso especial por lado.
- **Escudos** (solo con la variante 2, § 7.4): **hacia adentro**, flanqueando el marcador. Local: nombre y después escudo; visitante: escudo y después nombre. La simetría es de espejo, no de repetición. Con la variante 1 las columnas 2 y 6 miden 0 y sus gaps se suman al aire entre nombre y marcador: **no hay que rehacer la grilla el día que lleguen los escudos**.

#### El envoltorio en amplia

| Parte | Cambio respecto de compacta |
|-------|------------------------------|
| Titular | Sube a `--fs-xl` **22px** / 700 / `-0.02em`, **centrado**, con línea de 2px `--color-border` **a los dos lados**. |
| Subtítulo | Mismo tamaño y color, **centrado**. |
| Línea de estado | Mismo tamaño, color, forma y vocabulario, **centrada**. |

#### Qué **no** cambia y qué **no** se hace en amplia

- No cambian los datos, los pesos del marcador, el vocabulario de estados, las formas, los colores ni la familia. **Es el mismo bloque reordenado.**
- **Ningún dato aparece ni desaparece al cruzar el umbral en cualquiera de los dos sentidos.** La hora está en el envoltorio a los dos lados de 768px; el estado tiene renglón propio a los dos lados.
- No se agregan columnas a la página, ni dos listas lado a lado, ni **las dos vistas de Inicio lado a lado** — eso convertiría un conmutador en un layout, y entonces el conmutador tendría sentido en angosto y no en ancho. Un control que aparece y desaparece según el tamaño de la ventana es peor que uno que está siempre.
- No hay escudos más grandes ni bloques más altos de lo que su contenido pide.

**El costo, asumido con los ojos abiertos:** existen **dos formas del bloque**, no una. Son dos disposiciones del mismo componente y de los mismos datos, y las dos entran al QA visual por separado.

## 9. Encabezado por pantalla — inventario

El encabezado es el único cromo persistente de la app: no hay tabs ni sidebar (§ 8.1). Esta sección fija **qué elementos existen en cada pantalla y cuáles no**, más la altura (§ 9.1) y la política de fijado (§ 9.2). La forma concreta de cada elemento está cerrada en § 10.

**Regla general:** el encabezado no debería cambiar de altura entre estados (cargando, vacío, error) para que la lista no salte bajo el dedo del usuario al llegar el dato.

**Inicio:** wordmark de Fulbo · acceso a la pantalla Equipo del equipo favorito predefinido (RF-005 — no es "elegir", es solo navegación a un destino fijo; no existe estado marcado/desmarcado porque no hay selección) · **conmutador de vista** (RF-008, forma cerrada en § 6.5) · acceso a Configuración, **en forma de engranaje** (§ 6.5) · navegación día anterior/siguiente (RF-002, forma cerrada en § 6.2). Nada más: sin buscador, filtros, tabs, ni controles fuera de esta lista.

**El conmutador es el único elemento que se agregó al encabezado desde que se cerró este inventario**, y entró **sin sumar altura**: vive dentro de la barra de marca que ya existía. Ese fue el criterio de aceptación — un control nuevo que hubiera pedido una tercera barra no habría entrado (§ 6.5).

**Competición:** volver atrás · nombre de la competición (con su escudo si la variante con escudo aplica, § 7.4). Nada más.

**Equipo:** volver atrás · nombre del equipo (ídem escudo). Nada más — **incluido cuando la pantalla muestra al equipo favorito**: no hay nada que marcar ahí.

**Configuración:** volver atrás · título. El cuerpo es solo el control de tema (§ 6.1) y su línea de ayuda — sin botones de guardar/cancelar (el cambio se aplica al instante), sin sección de versión o acerca de.

**Consistencia entre Competición, Equipo y Configuración:** las tres son pantallas de drill-down con "volver atrás" — comparten esa estructura básica de encabezado; el wordmark y los accesos de Inicio no se duplican en ninguna de las tres.

### 9.1 Altura: **una sola, 56px**

Toda barra de encabezado de la app mide **56px**, en las cuatro pantallas y en las dos barras de Inicio. Es exactamente lo que suman las dos líneas de equipo de un bloque de partido (28 + 28, § 7.0), así que la app entera se apoya en un único módulo vertical, y le deja 6px de aire a un target de 44px sin que nadie tenga que calcular nada. Un segundo valor (52px) no compraba nada y era un número más para recordar y para equivocar.

### 9.2 Qué queda fijo al scrollear — **cerrado**

**La regla, que vale para toda pantalla presente y futura:** queda fijo **lo que el usuario necesita mientras recorre la lista**; se va con el scroll **lo que solo necesita al llegar**.

| Pantalla | Queda fijo (`position: sticky; top: 0`) | Se va con el scroll |
|----------|------------------------------------------|---------------------|
| **Inicio** | La **barra de día** (§ 6.2). | La **barra de marca** entera: wordmark, `Mi equipo`, **conmutador de vista** y engranaje de Ajustes. |
| **Competición / Equipo** | El **encabezado entero** (volver + título). | — |
| **Configuración** | El encabezado entero (por consistencia; la pantalla no scrollea). | — |
| **Todas** | — | Los **titulares y subtítulos de grupo**: no se pegan. |

**Por qué la barra de día sí y la de marca no.** Un miércoles son ~16 partidos ≈ 3 pantallas: sin sticky, cambiar de día desde el fondo obliga a scrollear todo hacia arriba, y es el único control de uso constante de la app (invariante 3, § 8.2). El wordmark, `Mi equipo`, el conmutador y Ajustes son cromo de entrada: se usan al abrir, no mientras se escanea. Fijarlos costaría 56px permanentes contra el objetivo de densidad, y recuperarlos cuesta un flick.

**El conmutador no es una excepción a esa regla, es un caso de ella.** La vista se elige una vez y persiste entre sesiones (RF-008): es exactamente el perfil de uso del wordmark y de Ajustes, no el de las flechas de día. Argumento completo y riesgo asumido en § 6.5.

**Por qué el encabezado de drill-down sí queda fijo, aunque contenga un acceso de "llegada".** No es una excepción a la regla, es la misma regla con otro contenido: en Competición y Equipo el encabezado no es cromo, **es el contexto** — el título es el único lugar de la pantalla que dice de qué competición o de qué equipo son los 200 bloques que el usuario está recorriendo (en Inicio ese contexto lo dan los titulares y subtítulos de grupo, que viajan con la lista). Además ahí vive la única salida de la pantalla, y son las listas más largas de la app. Costo total: 56px, **menos** que los 56px de Inicio — ninguna de estas pantallas tiene dos barras.

**Por qué los titulares de grupo no se pegan.** Serían una segunda capa fija (56 + 24 + 16 = ~96px con titular y subtítulo, ~17% del alto útil en un teléfono) para un problema chico: en Inicio los grupos son pocos —máximo 3 competiciones, o los horarios de un solo día— y el titular de 18px/700 con su línea es reconocible al pasar. Además un titular pegado justo debajo de la barra de día pondría dos textos grandes contiguos y el usuario tendría que distinguir cuál es el día y cuál el grupo.

**Forma del estado fijo:**

- **La altura no cambia al pegarse.** Nada de barras que se condensan: en Inicio eso movería la etiqueta del día bajo el dedo justo cuando el usuario va a tocarla, y en drill-down movería el botón de volver.
- Al pegarse suma **borde inferior 1px `--color-border`** (que ya tiene) y **`--shadow-1`** — **solo en modo claro**. En oscuro no hay sombra: la sombra no se ve y el borde de 1px es el separador (§ 3.5).
- La barra **sangra a todo el ancho** del viewport; su contenido interno respeta el tope de 720px y el padding lateral de la disposición (§ 8.3). Así el borde inferior corre de lado a lado y no queda una línea flotando en el medio de la pantalla.

## 10. Specs por pantalla

Composición cerrada de las cuatro pantallas de la v1. Todo lo que no está acá sale de los patrones de § 6 y § 7; si un elemento no aparece en ninguno de los dos, **no se inventa: se pregunta** (`CLAUDE.md` § Regla de oro).

### 10.1 Inicio

Partidos del día elegido, **en una de dos vistas conmutables** (RF-008): **por torneo** (default) o **por horario**. Las dos muestran los mismos partidos del mismo día con la misma anatomía (§ 7.0) y solo intercambian qué dato es titular y cuál subtítulo (§ 7.1). Dos barras de encabezado, ambas `--color-surface` con borde inferior 1px `--color-border`, ambas de 56px (§ 9.1).

**Barra 1 — marca y accesos** (`padding: 0 --space-3`, `gap: --space-3`, se va con el scroll):

| Elemento | Especificación | Por qué |
|----------|----------------|---------|
| **Wordmark** | `fulbo.` — `--fs-xl` 22px / 700 / tracking **`-0.035em`**. La **palabra** en `--color-text-1`; **solo el punto final** en `--color-brand`. Alineado a la izquierda. | La marca cabe en un punto de 4px. Un wordmark entero en violeta a 22px/700 sería el elemento con más peso *y* más saturación de una pantalla cuyo protagonista es el dato (§ 1) — el acento dejaría de ser acento. El punto es distintivo, es marca legítima (§ 3.2) y no le disputa nada a la etiqueta del día que viene justo abajo. |
| | **No es interactivo:** ni link, ni botón, ni estados, ni foco. Es un `<h1>`. Nombre accesible **"Fulbo"**; el punto va `aria-hidden`. | Inicio es la pantalla de inicio: un logo que linkea a donde ya estás es una promesa vacía. Y el wordmark no aparece en ninguna otra pantalla (§ 9). |
| | El tracking negativo es la **única excepción** de la app a la tipografía de UI: es un logotipo, no texto. | |
| **`Mi equipo`** | Link de encabezado (§ 3.3): `--fs-sm` 14px / 500 / `--color-text-1` + subrayado. Target 44px de alto por padding vertical. Destino: pantalla Equipo del favorito predefinido (RF-005). | **Dice "Mi equipo" y no el nombre del club** porque el rótulo tiene que caber a 320px **sea cual sea el equipo configurado**: un `Gimnasia y Esgrima (LP)` en el encabezado se truncaría (truncar un nombre de equipo en el cromo es peor que en una fila) o empujaría a `Ajustes` fuera. Además nunca se confunde con un nombre de equipo de una fila. |
| | En sentence case y `--fs-sm`, **no** `MI EQUIPO` en `--fs-xs` mayúsculas. | En toda la app, `--fs-xs` en mayúsculas significa "etiqueta o badge, no se toca". Usar ese mismo traje para un acceso de navegación rompería el vocabulario. Y `--color-text-3` está definido como terciario/deshabilitado (§ 3.4): sería el peor color posible para el acceso al equipo del usuario. |
| **Conmutador de vista** | Píldora de 32px, a la derecha de `Mi equipo`. Especificación completa en § 6.5. | Muestra la vista vigente y alterna al tocarla. Entra sin sumar altura a la pantalla. |
| **Ajustes → engranaje** | Botón de icono de § 6.3 —caja 44×44, `padding: 0`, halo circular en hover, los cinco estados— con glifo de **engranaje de 20px** y `aria-label="Ajustes"`. Último elemento de la barra. Destino: Configuración. | **Excepción declarada** a "los accesos del encabezado son palabras" (§ 3.3), y la única de la app. Existe por presupuesto de ancho: con `Ajustes` en palabra la barra no cierra a 320px (ver abajo). El engranaje es, además, el único glifo de la app que ya significa "configuración" sin que haya que aprenderlo. |

**Presupuesto de ancho de la barra 1 a 320px** — es lo que obliga al engranaje y a bajar `gap` y padding de 16 a 12px:

| Concepto | Ancho |
|----------|-------|
| Viewport mínimo | 320 px |
| − padding lateral de la barra (12 × 2) | **296 px disponibles** |
| Wordmark `fulbo.` (22px/700, tracking `-0.035em`) | ≈64 px |
| `Mi equipo` (14px/500) | ≈64 px |
| Píldora `⇅ Horario` (caso peor: 14 + 4 + ≈48 + 16 de padding + 2 de borde) | ≈84 px |
| Engranaje (botón 44×44) | 44 px |
| 3 gaps de 12 | 36 px |
| **Total** | **≈292 px** → entra, con ~4px de aire |
| *Mismo cálculo con `Ajustes` en palabra (≈52px) y gaps de 16* | *≈308 px* → **no entra** |

- **El único elemento elástico de la barra es el espacio libre** entre el wordmark y el grupo de tres accesos. Wordmark, `Mi equipo`, píldora y engranaje son todos `flex-shrink: 0`: **ninguno trunca nunca**. Si algún día entra un elemento más, algo tiene que salir — el margen es de 4px, y está dicho a propósito.
- El engranaje **no** usa margen negativo para meterse en el padding de la barra: sus 44px viven adentro de los 296px, así que el anillo de foco (2 + 2px) tiene lugar y no se recorta contra el borde del viewport (§ 6.3).

**Barra 2 — navegador de día:** § 6.2 completo. Queda fija al scrollear (§ 9.2). **No cambia con la vista**: la misma barra de día sirve a las dos.

**Cuerpo** (`padding: --space-4 --space-4 --space-6`): **sin tarjetas** (§ 7). La lista corre sobre `--color-bg`, con la jerarquía de grupo y los bloques de § 7.0.

| Elemento | Vista **por torneo** (default) | Vista **por horario** |
|----------|-------------------------------|------------------------|
| **Titular** | Marca 18px + forma corta de la competición (§ 7.3), `--fs-lg` 18px / 700 / `-0.02em` / `--color-text-1`, **es link** a la pantalla Competición. Máximo 3 grupos en la v1. | Hora `16:30`, `--fs-lg` 18px / 700 / `-0.02em` / `--color-text-1` / `tabular-nums`. **No es link.** Tantos grupos como horas de inicio tenga el día. |
| **Subtítulo** | Hora `16:30`, `--fs-xs` 12px / 600 / `0.04em` / `--color-text-3` / `tabular-nums`. **No es link.** | Marca 18px + forma corta de la competición, `--fs-xs` 12px / 600 / `0.04em` / `--color-text-3`. **Es link** a la pantalla Competición. |
| **Bloques** | § 7.0, sin meta-línea, con su divisoria de 1px al pie. El último bloque de la lista no la lleva. | Idéntico. |
| **Corte `PRÓXIMOS`** | No existe (§ 7.6). | No existe (§ 7.6). |
| **Todo lo demás** | Mismo esqueleto, mismos espaciados, mismos estados, mismo comportamiento responsive. | Ídem. |

**El link a Competición existe en las dos vistas y siempre está sobre el nombre de la competición** — lo que cambia es en qué nivel está parado. Así, la ruta a Competición no depende de la vista: el usuario no tiene que aprender dos caminos.

**Estados de pantalla:** § 6. En Inicio hay un matiz que vale la pena escribir porque es contraintuitivo:

| Estado | ¿Cambia entre vistas? | Forma |
|--------|------------------------|-------|
| **Cargando** | **Sí — es el único** | Dos siluetas (ver abajo). |
| **Vacío** | No | Idéntico. Sin partidos no hay nada que agrupar: el eje de agrupación es irrelevante. |
| **Error** | No | Idéntico. Sin datos no hay nada que agrupar. |
| **Cuota agotada** | No existe como estado (RF-006) | La pantalla se ve **igual** que con cuota disponible, en las dos vistas. Nada que especificar, y esa ausencia es el requisito (§ 6). |

**Las dos siluetas del skeleton.** El skeleton existe para que la lista no salte cuando llega el dato; una silueta que no anticipa lo que viene produce exactamente el salto que venía a evitar. Como las dos vistas tienen titulares y subtítulos de largo muy distinto, la silueta se bifurca. **Ninguna de las dos lleva tarjeta** —no hay tarjetas en el patrón nuevo—, ninguna usa la marca, ninguna lleva caja de escudo (variante 1 vigente, § 7.4), y las dos usan barras en `--color-surface-2` con `--radius-sm`:

| Barra | Por torneo | Por horario |
|-------|-----------|-------------|
| Titular | **~140px** × 24px (nombre de competición) | **~92px** × 24px (hora) |
| Subtítulo | ~48px × 12px (hora), uno por subgrupo | ~110px × 12px (competición), uno por subgrupo |
| Nombres | Dos barras de 14px al 74% y al 56% del ancho, una por línea de equipo | Idéntico |
| Marcador | Sin barra: la ranura queda vacía | Idéntico |
| Estado | Barra de ~64px × 12px | Idéntico |
| Estructura | **3 grupos × 2 bloques**, con las mismas divisorias y los mismos espaciados que la lista real | Ídem |

**Contención (§ 8):** compacta es la base. La barra 1 a 320px consume ~292px de los 296 disponibles — el presupuesto completo está arriba, y es lo más ajustado de la app. La etiqueta del día cede ancho antes que las flechas (§ 6.2), así que las flechas nunca se salen ni se achican (invariantes 1 y 3). En amplia, las barras sangran a todo el ancho con el contenido topado a 720px (§ 9.2), **los bloques pasan a la forma simétrica de § 8.4** y **el envoltorio de grupo se centra con ellos**; el encabezado y el conmutador no cambian de forma ni de lugar, y **las dos vistas no se muestran lado a lado** (§ 8.4).

#### Checklist de aceptación visual — Inicio

1. Wordmark: la palabra en `--color-text-1`, **solo el punto** en violeta. No es clickeable y no toma foco con Tab.
2. `Mi equipo` es una palabra subrayada de 14px que lleva a Equipo-favorito; **Ajustes es un engranaje de 20px en un botón de 44×44**, no una palabra, y lleva a Configuración.
3. La barra de marca lleva, en este orden: wordmark · espacio · `Mi equipo` · píldora del conmutador · engranaje. `gap` y padding lateral de **12px**, no 16.
4. Flechas de día: **44×44 reales** (medir en computed styles, no a ojo), separadas 8px del borde, **sin** estado deshabilitado.
5. La etiqueta del día dice `Hoy` / `Ayer` / `Mañana` en esos tres días y fecha absoluta en el resto; al pasar de año la fecha **incluye el año**; el `title` siempre trae la fecha completa.
6. No existe ningún botón "volver a hoy".
7. Al scrollear: la barra de marca **desaparece con el conmutador adentro**, la de día **queda fija al mismo alto de 56px** (no se condensa), y los titulares de grupo pasan por debajo **sin pegarse**.
8. En modo oscuro la barra fija **no** tiene sombra; en claro tiene `--shadow-1`. En ambos, borde inferior de 1px.
9. **La lista no tiene tarjetas:** ningún grupo lleva fondo, borde de contorno ni radio; la única separación entre bloques es una divisoria de 1px, y **el último bloque de la lista no la lleva**.
10. **Por torneo** (default): el titular es la competición con su marca de 18px, y el subtítulo es la hora. **Por horario**: el titular es la hora y el subtítulo es la competición con su marca. En las dos, la línea de 2px del titular corre hasta el borde derecho.
11. El nombre de competición **es link en las dos vistas** (subrayado de § 3.3) y la hora **no lo es en ninguna**. La línea de 2px del titular **no** navega al tocarla.
12. Los nombres de competición se ven **capitalizados** (`Primera A`, `Libertadores`, `Sudamericana`), nunca en mayúsculas, y con la misma ortografía en las dos vistas y en Equipo.
13. Cada línea del bloque trae **su** nombre a la izquierda y **su** marcador pegado al borde derecho; **no hay columna de hora dentro del bloque**.
14. La ranura del marcador mide **24px fijos** y termina en el mismo píxel en Inicio, Competición y Equipo — también en los partidos sin marcador, donde queda vacía pero **no colapsa**.
15. Un partido programado **no** muestra `0-0` ni `-`; uno "a confirmar" muestra `—` donde iría la hora, en el titular o el subtítulo según la vista.
16. La línea de estado va **abajo, alineada a la izquierda, siempre**, con la palabra completa y capitalizada: `Finalizado`, `En vivo · 68'`, `Suspendido · 54'`. **`FIN` no aparece en ninguna parte de la app**, ni ninguna otra abreviatura de estado.
17. `Entretiempo` **no** lleva minuto.
18. Un partido en vivo muestra los dos números en 600 (ninguno en 700), círculo verde que pulsa y `En vivo`; postergado / suspendido / cancelado muestran **rombo** ámbar y la palabra completa. Con `prefers-reduced-motion` el punto **no pulsa**.
19. **El alto del bloque es el mismo** (92px) con estado o sin estado: comparar un partido programado con uno finalizado, uno al lado del otro.
20. Skeleton: **la silueta cambia al cambiar de vista** (titular ancho + subtítulo corto por torneo, titular corto + subtítulo ancho por horario), **sin** caja de escudo, sin violeta, sin tarjetas; al llegar el dato **nada salta de lugar**.
21. Vacío y Error se ven **idénticos en las dos vistas**, y el conmutador sigue visible y **habilitado** en los tres estados.
22. Error: tarjeta roja que reemplaza la lista, con **Reintentar**; al tocarlo aparece el skeleton de la vista vigente.
23. **Con la cuota diaria de API-Football agotada, la pantalla se ve exactamente igual** que con la cuota disponible, en las dos vistas: ningún aviso, ninguna banda, ningún badge, nada en ámbar, ningún texto de "datos desactualizados" (RF-006).
24. Con la pantalla en **escala de grises**, cada estado sigue siendo identificable (palabra + forma) y las tres marcas de competición se distinguen entre sí.
25. Foco visible en flechas, `Mi equipo`, píldora, engranaje, nombre de competición y los dos nombres de cada bloque, en los dos modos.
26. A 320px: **sin scroll horizontal**, nada truncado en la barra 1, y ningún **control** por debajo de 44px de área tocable. Los links de dato de la lista son la excepción declarada de § 6 (28 / 32 / 24px) y **sus áreas no se solapan** — verificar tocando el borde entre los dos nombres de un mismo partido.
27. **A ≥768px el bloque es simétrico** (§ 8.4): el bloque central mide **92px medidos en computed styles**, no `auto`; con la ventana en 800, 1000 y 1400px **no cambia de ancho**.
28. **A ≥768px, apoyando una regla vertical sobre la lista, todos los marcadores quedan alineados** aunque los bloques mezclen `1 – 0` y `10 – 10`; en los partidos sin marcador **el guion queda solo, en `--color-border`**, y la hora **no** se repite en el centro.
29. **A ≥768px el titular, el subtítulo y la línea de estado están centrados**, la línea de 2px del titular abre a los dos lados, y `Suspendido · 54'` y `Entretiempo` entran completos, sin truncar y sin envolver.
30. Cruzando 768px en los dos sentidos con la misma lista en pantalla, **ningún dato aparece ni desaparece** — solo se reacomoda. La hora sigue estando en el envoltorio de los dos lados del umbral.
31. **Las dos vistas nunca se muestran a la vez**, en ningún ancho.
32. El checklist del conmutador (§ 6.5) se corre entero como parte de esta pantalla.

### 10.2 Competición

Drill-down desde el nombre de competición. Partidos de esa competición agrupados **por fecha** (§ 7.1).

| Elemento | Especificación | Por qué |
|----------|----------------|---------|
| Encabezado | 56px, `--color-surface`, borde inferior 1px, `padding: 0 --space-2`, `gap: --space-1`. Botón de volver (§ 6.3, `aria-label` "Volver") + título. **Queda fijo** (§ 9.2). | Sin wordmark y sin los accesos de Inicio: es una pantalla de profundidad (§ 9). |
| Título | Nombre **completo** de la competición, `--fs-xl` 22px / 700 / `--color-text-1`, una línea con elipsis, nombre completo en `title`. Sin tracking negativo (eso es solo del wordmark). Con la marca de 18px (§ 7.3) antes del nombre. | El nombre completo se usa acá; la forma corta es para el envoltorio de grupo de Inicio y la meta-línea de Equipo (§ 7.3). |
| **Titular de grupo** | Fecha absoluta (`mié 15 abr`), `--fs-lg` 18px / 700 / `-0.02em` / `--color-text-1` / **`tabular-nums`**, con la línea de 2px `--color-border` (§ 7.0). **Sin subrayado: no es link.** Sin banda tocable. | Es una etiqueta de posición, no un destino. La etiqueta relativa (`Hoy`) vive solo en Inicio (§ 6.2). |
| **Subtítulo de grupo** | Hora `16:30`, `--fs-xs` 12px / 600 / `0.04em` / `--color-text-3` / `tabular-nums`. **No es link.** Un subgrupo por horario dentro de cada fecha. | **Es donde vive la hora ahora.** Al salir la columna de hora del bloque (§ 7.0), Competición necesita el segundo nivel; si no, sería la única pantalla donde no se ve a qué hora se juega. Mismo mecanismo que la vista por torneo de Inicio, con fecha en lugar de competición. |
| Sin nivel de competición | — | Es el título de la pantalla; repetirlo en cada grupo es ruido (§ 7.1). |
| Bloques | § 7.0 **completo, el mismo que Inicio**, sin meta-línea. Con su divisoria de 1px al pie; sin tarjetas. | La competición ya es el título; la fecha y la hora ya están en el envoltorio. |
| Apertura | Posicionada en el corte `PRÓXIMOS` (§ 7.6). | Lo que viene es lo que se busca. |

**Contención:** idéntica a Inicio; el título cede ancho antes que el botón de volver, que es `flex-shrink: 0`. En ≥768px, § 8.4 igual que Inicio.

**Esta pantalla no tiene conmutador de vista** (RF-008): la agrupación es una sola, siempre por fecha. El conmutador vive solo en Inicio (§ 6.5).

#### Checklist — Competición

1. El titular de fecha y el subtítulo de hora **no** son clickeables ni llevan subrayado; los dos nombres de equipo **sí**.
2. La fecha es siempre absoluta — nunca `Hoy` — y está en números tabulares, igual que la hora del subtítulo.
3. **La hora de cada partido se ve**, en el subtítulo de su subgrupo — nunca dentro del bloque.
4. La lista abre en el corte `PRÓXIMOS`, no arriba de todo, y ese corte aparece **una sola vez**.
5. La banda `PRÓXIMOS` es neutra: `--color-surface-2` + `--color-text-2`, sin violeta. Es la **única** superficie con fondo propio de la lista: no hay tarjetas.
6. El encabezado queda fijo al scrollear y el título sigue visible con la lista abajo.
7. Los bloques son **exactamente los de Inicio**: dos líneas con nombre a la izquierda y marcador a la derecha, estado en línea propia con la palabra completa, divisoria de 1px al pie. La ranura del marcador **termina en el mismo píxel** que en Inicio y Equipo.
8. Un título largo trunca con elipsis **sin** empujar ni achicar el botón de volver, y su texto completo está en `title`.
9. En ≥768px el bloque pasa a la **forma simétrica** de § 8.4: bloque central de 92px, estado en fila propia de ancho completo, titular y subtítulo centrados, lista centrada y topada a 720px.
10. Cruzando el umbral de 768px en los dos sentidos **no se pierde ningún dato**: la hora está en el subtítulo del subgrupo a los dos lados del umbral, y **nunca** aparece en el centro del bloque.
11. **No hay conmutador de vista en esta pantalla.**

### 10.3 Equipo

Drill-down desde un nombre de equipo. Partidos de ese equipo en **lista plana cronológica ascendente** (§ 7.1).

| Elemento | Especificación | Por qué |
|----------|----------------|---------|
| Encabezado | Igual que Competición, con el nombre del equipo como título. **Sin escudo** mientras rija la variante 1 (§ 7.4); si se adopta la variante 2, escudo de 24px antes del título. | Consistencia de drill-down (§ 9). |
| Sin agrupar | Lista plana, sin titulares ni subtítulos de grupo. | Un equipo juega una o dos veces por semana: agrupar por fecha daría una ristra de titulares con un solo bloque abajo (§ 7.1). |
| **Meta-línea del bloque** | **En compacta:** primera línea del bloque, arriba de las dos líneas de equipo, alineada a la izquierda. **En amplia:** fila 1 del grid, `grid-column: 1 / -1`, **centrada** (§ 8.4). Una sola línea de texto de 16px dentro de una fila de **`min-block-size: 24px`** (el mismo alto que el subtítulo de grupo, y el área tocable del link de competición), `nowrap` + elipsis, sin margen propio. Contenido: **fecha `dom 19/04` · hora `16:30` · marca + forma corta de la competición** (§ 7.3), todo en `--fs-xs` 12px / 600 / tracking `0.04em` / `--color-text-3`, con `tabular-nums` en fecha y hora y separador ` · `. **Fecha y hora no son link; el nombre de competición sí**, con el subrayado de § 3.3. | Sin envoltorio de grupo, el bloque tiene que traer su propio contexto — y es justamente el propósito de la pantalla: no perder ni la fecha, ni la hora, ni la competición. **La hora entró acá** porque salió del bloque (§ 7.0): es el mismo dato en el mismo renglón de contexto, no un agregado. |
| Alto del bloque | Cuatro líneas (meta + dos equipos + estado): **116px** en compacta (92 + 24 de meta), **92px** en amplia (68 + 24). | Son ~4 partidos por pantalla: el costo de densidad es nulo frente al contexto que se gana, y esta es la lista más corta de la app. |
| Marcador | **Sin desplazamiento, en ninguna disposición.** La corrección de 16px que existía en la anatomía anterior **queda eliminada** (§ 7.0). | Cada número vive en la línea de su equipo, así que la meta-línea ya no lo despega de nada. |
| Corte `PRÓXIMOS` | § 7.6; la lista abre ahí. | |
| **Equipo favorito** | Se ve **exactamente igual que cualquier otro equipo**: mismo tratamiento, sin resaltado, sin estrella, sin badge, en su propia pantalla y en las filas de las otras. | No existe la acción de marcar ni desmarcar favorito (RF-005: viene fijado fuera de la UI). Un indicador de estado que no se puede cambiar es afordancia falsa: invita a un tap que no hace nada. |

**Contención:** la meta-línea es lo primero que trunca; nunca envuelve. A 320px el caso peor —`dom 19/04 · 16:30 · ▣ Sudamericana`— mide ~205px de los 288 disponibles, así que en la práctica no trunca nunca; la elipsis es la red, no la norma.

#### Checklist — Equipo

1. En cada bloque: la fecha y la hora **no** son link, la competición **sí**, y los dos nombres de equipo también.
2. La meta-línea trae **los tres datos**: fecha, **hora** y competición con su marca — en ese orden, separados por ` · `, con fecha y hora en números tabulares y la competición en forma corta capitalizada (`Primera A`, no `PRIMERA A` ni `Primera A — Argentina`).
3. La meta-línea nunca pasa a dos líneas, ni con el nombre de competición más largo.
4. **El marcador de cada línea está a la altura de su propio equipo**, sin ningún desplazamiento vertical.
5. Orden cronológico ascendente; la lista abre en el corte `PRÓXIMOS`.
6. El equipo favorito **no** tiene ningún resaltado en su propia pantalla ni en los bloques de Inicio o Competición.
7. No existe ningún control de marcar/desmarcar favorito en ninguna parte de la app.
8. La ranura del marcador **termina en el mismo píxel** que en Inicio y Competición.
9. El encabezado no lleva escudo (variante 1 vigente).
10. En ≥768px la meta-línea es una **fila propia centrada** de ancho completo (no va dentro del bloque central de 92px) y **no trunca** ni con el nombre de competición más largo.
11. **No hay conmutador de vista en esta pantalla.**

### 10.4 Configuración

Una sola preferencia: el tema. **El control está especificado entero en § 6.1 y no se rediseña acá.** Esta sección solo fija su contenedor.

| Elemento | Especificación |
|----------|----------------|
| Encabezado | Igual que Competición, título `Configuración`. |
| Cuerpo | `padding: --space-3 --space-4 --space-5`. Una tarjeta: `--color-surface`, borde 1px `--color-border`, `--radius-md`, **`padding: --space-4` (16px)**. |
| Contenido de la tarjeta | Etiqueta `Tema` → control segmentado → línea de ayuda. Todo según § 6.1. |
| Nada más | Sin botón guardar (el cambio se aplica al instante, § 3.6), sin sección "acerca de", sin versión, sin más opciones (§ 9). |

**El único valor que se decide acá es de contención:** la tarjeta lleva **16px** de padding lateral, que es exactamente el tope que § 6.1 permite gastar por encima del padding de pantalla. A 320px eso deja 248px de pista y ~82,6px por segmento, y `☾ Oscuro` (72px de contenido) entra con ~5px de aire por lado. Un solo píxel más de padding y el spec de § 6.1 deja de cumplirse.

**Nota de implementación que no es cosmética:** el `padding` por defecto que los navegadores le ponen a `<button>` (`1px 6px`) se come justo ese aire y deja la palabra al ras. **`padding: 0` explícito** en los segmentos y en los botones de icono (§ 6.3) es lo que hace verdadero el cálculo de contención.

#### Checklist — Configuración

Se usa el de § 6.1 (control de tema) más:

1. `☾ Oscuro` entra completo a 320px, sin truncar ni partir, con aire visible a los lados.
2. Los segmentos y los botones de icono tienen `padding: 0` (verificar en computed styles, no a ojo).
3. La tarjeta tiene 16px de padding lateral, ni uno más.
4. No hay botón de guardar, ni sección "acerca de", ni ninguna opción además del tema.

### 10.5 Verificación transversal de reglas duras

Se corre una vez sobre la app entera, en los dos modos. Es el checklist que protege § 2.

1. **Violeta:** aparece **solo** en el punto del wordmark, el anillo de foco, el subrayado de link en hover/focus/active, el segmento elegido del control de tema, el glifo de un control presionado y **el borde del conmutador de vista en hover** (§ 3.2, seis usos). En **ningún** marcador, hora, minuto, nombre de equipo, nombre de competición, fecha, marca de competición ni badge de estado — y tampoco en la palabra que muestra el conmutador, que es una etiqueta de estado, no un dato teñido.
2. **Verde** solo en vivo/entretiempo. **Rojo** solo en error de carga de la app. **Ámbar** solo en partido postergado, suspendido o cancelado — y **en ningún otro lado**: no hay estado del sistema que use ámbar en la v1.
3. **La cuota agotada no tiene superficie visual en ninguna pantalla** (RF-006): con la cuota diaria agotada la app se ve **idéntica** a con la cuota disponible. Ningún aviso, banda, badge, tarjeta, color, icono ni copy la delata, ni marca de "dato viejo".
4. **Ningún resultado coloreado:** la diferencia ganador/perdedor es solo peso tipográfico.
5. **Todo dato numérico tabular:** horas, marcadores, minutos, fechas numéricas.
6. **Nada solo por color:** todo estado con color lleva además palabra **y** forma. Se verifica con la pantalla en escala de grises.
7. **Escudos** (cuando existan): tal cual la fuente, sin recolorear, sin filtro por modo, sin borde ni recorte circular.
8. **Cinco estados** declarados en todo elemento interactivo, en claro y en oscuro. **`outline: none` no aparece en ninguna parte del código.**
9. **Tipografía:** solo 12 / 14 / 16 / 18 / 22px. Ningún tamaño intermedio — en particular, **ningún 20px ni 24px** en el titular de grupo (§ 4.3). Una sola familia.
10. **Espaciado:** solo 4 / 8 / 12 / 16 / 24 / 32px. Las únicas excepciones declaradas son los targets de 44px, los iconos de 14/16/18/20/24px, el alto de 28px de la línea de equipo (§ 7.0) y los **anchos de ranura numérica**: 24px del marcador en compacta (§ 7.0); 28px por marcador y 20px del separador en amplia, que forman el bloque central de 92px (§ 8.4). Todos se derivan del contenido máximo con `tabular-nums`, no se eligen a ojo, y **ninguno es `auto`**.
11. **Los cuatro invariantes de contención** (§ 8.2) se cumplen entre 320px y arriba, en las dos disposiciones y en los dos modos.
12. **Un solo patrón de bloque en toda la app:** Inicio (en sus dos vistas), Competición y Equipo usan la misma anatomía de § 7.0 y la misma fila simétrica de § 8.4. **No hay ninguna pantalla con la grilla vieja de tres columnas**, ni ninguna con una disposición amplia distinta (nada de columna izquierda de 180px).
13. **Un solo vocabulario de estados**, capitalizado y sin abreviaturas, en las tres pantallas y en las dos disposiciones. **`FIN` no existe.**
14. **Una sola ortografía por nombre de competición** (`Primera A`), en titular, subtítulo, meta-línea y título de pantalla.
15. **Sin tarjetas en las listas:** ninguna de las tres pantallas de datos usa `--color-surface` como fondo de grupo o de bloque.

## 11. Decisiones abiertas

Anotadas como pendientes, no como decisiones. Se distingue lo que es **mío** (composición, lo resuelvo yo) de lo que **no lo es** (dato, producto o técnica: lo resuelve el usuario o el analista y yo me adapto).

**Pendientes de dato o de producto — no las puede cerrar `design`:**

- **Escudos: si la fuente los provee.** Hoy rige la variante 1, sin escudo (§ 7.4). El relevamiento de `docs/data-model.md` tiene que confirmar si hay logos, en qué campo, en qué tamaños, y si rinden a 18px. La variante 2 ya está especificada al detalle: adoptarla es mecánico.
- **Cómo llega el desambiguador en el nombre del equipo** (§ 7.5). La regla del sufijo protegido asume paréntesis. Si API-Football devuelve `Gimnasia L.P.` en vez de `Gimnasia (LP)`, la regla no se dispara y hay que volver a decidir.
- **Estados reales de partido:** § 7.2 es provisional hasta el relevamiento de API-Football; falta confirmar alargue, penales y estados raros (interrumpido, abandonado, walkover).
- **Copy de error** (§ 6) y el copy de Vacío de Competición y Equipo: propuestos por diseño, **pendientes de OK de producto**.
- **Marcas de competición: los tres glifos son provisionales** (§ 7.3). Son formas geométricas de diseño, no assets aprobados. Si API-Football provee logos de competición utilizables, rige § 2 (tal cual la fuente) y **las marcas propias desaparecen**; si no, estos glifos se quedan y habría que confirmarlos como parte de la identidad. Es la misma pregunta de dato que la de los escudos.
- **Orden de los grupos con hora a confirmar** en la vista por horario de Inicio (§ 7.2): dónde cae el grupo `—` dentro del orden de la lista es decisión funcional del analista, no visual.
- **Límite del rango navegable de días:** si existe, es decisión funcional. Hoy no hay ninguno, y por eso las flechas no tienen estado deshabilitado (§ 6.2, § 6.3).
- **Volver a hoy desde un día lejano:** hoy cuesta un tap por día. No hay control de retorno porque no está en RF-002 ni en `docs/screens.md`, y agregarlo sería alcance inventado. Es una fricción real: queda anotada como observación de producto, no como pendiente de diseño.
- **Zona horaria de visualización** (`docs/requirements.md`): si los horarios pasan a mostrar la zona, el patrón de fila necesita lugar para esa etiqueta. Es decisión funcional, no visual.

**Cerradas desde la versión anterior de este documento** (dejadas acá como registro, no como pendientes): forma del navegador de día (§ 6.2), iconografía y composición de los encabezados (§ 10), política de encabezado fijo (§ 9.2), tratamiento del wordmark (§ 10.1), variante de fila con escudos (§ 7.4), truncado con desambiguador (§ 7.5) y la **fila simétrica en disposición amplia** (§ 8.4).

**Cerradas en la ronda del patrón de fila nuevo** (todas confirmadas por el usuario; registro, no pendientes):

- **Anatomía del bloque de partido** (§ 7.0): dos líneas de equipo con su propio escudo, nombre y marcador; sin columna de hora; estado en línea propia; sin tarjetas, con divisoria de 1px. **Aplica a las tres pantallas**, no solo a Inicio.
- **Jerarquía de dos niveles** titular + subtítulo (§ 7.0, § 7.1), y la hora viviendo siempre en el envoltorio.
- **Vocabulario de estados** capitalizado y sin abreviaturas (§ 7.2); `FIN` eliminado.
- **Nombres de competición capitalizados**, con marca de 18px (§ 7.3).
- **Dos vistas de Inicio** (RF-008), con **por torneo** de default, el mismo esqueleto para las dos, y el conmutador como **píldora de un toque** que no queda fija al scrollear (§ 6.5). Ajustes pasa a engranaje.
- **Fila simétrica centrada de siete columnas** en amplia, con el bloque central de 92px, para las tres pantallas (§ 8.4). Queda descartada la columna izquierda de 180px que el canvas había propuesto para Inicio: **una sola disposición amplia en todo el producto**.
- **El skeleton de Inicio se bifurca** por vista; Vacío y Error no (§ 10.1).

**Cerradas por cambio de alcance — el estado "cuota agotada" ya no existe en el front.** El usuario decidió que el agotamiento de cuota sea **transparente**, y el analista reescribió RF-006 en consecuencia. Con eso caen dos pendientes que este doc tenía abiertos y que **no hay que volver a plantear**: el *copy de cuota agotada* y *a qué hora y en qué zona horaria se renueva la cuota*. Ninguno de los dos aplica: no hay nada que escribir ni ninguna hora que mostrar, porque no hay mensaje. También desaparece el segundo disparador del ámbar (§ 3.1) y el cuarto estado de pantalla (§ 6).

**Sigue sin existir:** un **asset** de marca (favicon, icono de app). El wordmark es tipográfico y se resuelve con Inter Variable, sin archivo; un icono de app no es entregable de la v1 (§ 1: la v1 es web).
