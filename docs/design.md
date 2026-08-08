# Diseño — guía viva del lenguaje visual

Guía **curada y vigente** del lenguaje visual de Fulbo. Es el destino canónico de color, tipografía, espaciado, jerarquía, estados visuales y contención responsive. Único escriba: el agente `design`.

Lo funcional (qué muestra cada pantalla, qué acciones expone) vive en `docs/screens.md` y `docs/requirements.md`; la implementación, en `docs/frontend.md`. **Ante conflicto sobre algo visual, manda este doc.**

**Sobre `docs/design-handoff/`:** es **material crudo de origen** (prototipo externo), no la guía. Ya fue auditado y curado hacia acá — lo que sobrevivió está en este documento, y donde difiere, **manda este documento**. `frontend` implementa contra `docs/design.md`, no contra el handoff. `maqueta.html` sirve como referencia visual de apoyo, con dos salvedades: los escudos rayados son marcas de "asset pendiente" y no un tratamiento a portar (§ 7.4), y la fila simétrica en pantalla ancha **sí está adoptada pero con la composición de § 8.4**, que difiere de la del prototipo en tres puntos (eje de ancho fijo, estado como fila de ancho completo, hora del eje a `--fs-xl`). `tokens.css` sí está verificado y coincide valor por valor con § 3.4 / § 4.3 / § 5.

## 1. Punto de partida

**Qué es Fulbo, visualmente:** un lector de listas. Tres pantallas de datos (Inicio, Competición, Equipo), solo lectura, sin modales, sin acciones destructivas. La única tarea del usuario es **escanear una lista de partidos y encontrar rápido el dato que busca** (hora, quién juega, cómo salió). Todo el lenguaje visual se subordina a eso.

Hay una cuarta pantalla, **Configuración** (`docs/screens.md`), que concentra la **única preferencia** del usuario —el tema (RF-007)— y es la única con controles de entrada. El equipo favorito **no** es una preferencia de la UI: viene predefinido fuera de ella (RF-005) y no tiene selector. Configuración es deliberadamente la excepción: sacando el control de preferencia de las pantallas de datos, esas tres siguen siendo lectura pura.

**Principios de partida**

| Principio | Consecuencia concreta |
|-----------|------------------------|
| **Mobile-first, literal** | El diseño arranca en el **ancho mínimo soportado (320px)** y crece hacia arriba. Nunca se diseña el escritorio primero y se "achica después". Hay un cliente mobile nativo planeado (`docs/architecture.md`): el lenguaje visual tiene que sobrevivir a esa mudanza. |
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
| **Verde** (`--color-live`) | En vivo / éxito | Partido en juego: punto + minuto + etiqueta "EN VIVO". |
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

Nada más. Los cuatro primeros son estados de reposo o de foco; el quinto es transitorio — por eso la lista de "usos permanentes" son cuatro y el total son cinco.

**Nota:** al cerrarse el navegador de día como flechas + etiqueta (§ 6.2), el uso "píldora del día activo" que se contemplaba como posible **nunca se materializó**: en Inicio la marca aparece solo en el punto del wordmark y en el anillo de foco. **La fecha es un dato y nunca se tiñe**, ni de marca ni de color semántico.

**Por qué la selección sí puede llevar marca** (justificación del cuarto uso, agregado al cerrar RF-007): "cuál de N opciones excluyentes elegí" **no es un dato deportivo ni un estado del sistema** —no dice ni "en vivo", ni "ok", ni "error"—, es afordancia pura: le marca al usuario dónde está parado dentro de un control. Y nunca viaja solo: el elemento seleccionado suma peso 600 y `--color-text-1` frente a 500 y `--color-text-2` de los no seleccionados, más la semántica ARIA — cumple "nada solo por color" sin apoyarse en el violeta.

### 3.3 Afordancia sin color

Fulbo tiene un problema propio: **lo único clickeable son datos** (nombre de equipo, nombre de competición), y la regla dura prohíbe teñir datos. Además es mobile-first: en touch **no hay hover**, así que la afordancia tiene que verse en reposo.

**Regla: la afordancia es el subrayado, no el color.**

- Link en reposo: **subrayado 1px en `currentColor` al 30% de opacidad**, `text-underline-offset: 3px`.
- Hover / focus / active: el subrayado pasa a **2px `--color-brand`**; el texto NO cambia de color ni de peso (nada de reflow bajo el dedo).
- La fila entera de un partido **no** es clickeable: solo lo son los nombres. Una fila enteramente clickeable pediría destino único y acá hay tres (equipo local, visitante, competición). Se evita la ambigüedad de destino.

Ventaja lateral: el subrayado es una señal no cromática, con lo que cumple sola la regla de "nada solo por color".

**El tratamiento tipográfico del link lo dicta su rol, no el hecho de ser link.** Lo único que comparten todos los links de Fulbo es el subrayado; tamaño, peso y color de texto siguen siendo los del rol que ese texto cumple en su contexto. Si un link tuviera que forzarse siempre a `--fs-base` / 500 / `--color-text-1`, un encabezado de grupo clickeable dejaría de leerse como encabezado de grupo, y la jerarquía de la pantalla se rompería para satisfacer una regla de estilo.

| Link | Tratamiento (de su rol) | Dónde |
|------|--------------------------|-------|
| Nombre de equipo | `--fs-base` 16px / 500 / `--color-text-1` | Fila de partido, las tres pantallas. |
| Nombre de competición, encabezado de grupo | `--fs-xs` 12px / 600 / tracking `0.04em` / mayúsculas / `--color-text-2` | Encabezado de grupo en Inicio (§ 10.1). |
| Nombre de competición, meta-línea | `--fs-xs` 12px / 600 / mayúsculas / `--color-text-2` | Meta-línea de la fila en Equipo (§ 10.3). |
| Acceso de encabezado (`Mi equipo`, `Ajustes`) | `--fs-sm` 14px / 500 / `--color-text-1` | Barra de marca de Inicio (§ 10.1). |

**Un link con destino único puede extender su área tocable más allá del texto.** La restricción de "solo los nombres son clickeables" nace de la ambigüedad de destino de la fila de partido (tres destinos). Donde hay **un** destino y **uno solo** —el encabezado de grupo de Inicio—, la banda entera es el link: target grande, cero ambigüedad. El subrayado sigue yendo sobre las palabras; es lo que declara la afordancia.

**Qué no es link, y conviene decirlo:** el wordmark (§ 10.1), la fecha del encabezado de grupo en Competición, la fecha de la meta-línea en Equipo, la etiqueta del navegador de día y cualquier badge de estado. Ninguno lleva subrayado, ninguno tiene estados de interacción.

### 3.4 Paleta completa

Nombres semánticos, no literales (`--color-surface`, no `--color-white`). El mapeo a la config de Tailwind lo decide `frontend`, **respetando estos nombres**.

| Token | Claro | Oscuro | Rol |
|-------|-------|--------|-----|
| `--color-bg` | `#F6F6F9` | `#0E0E13` | Lienzo de la página. |
| `--color-surface` | `#FFFFFF` | `#17171F` | Fila/tarjeta de partido, header. |
| `--color-surface-2` | `#F0F0F5` | `#1F1F29` | Encabezado de grupo (competición), skeleton, hover de superficie. |
| `--color-border` | `#E3E3EB` | `#2A2A36` | Separadores y borde de tarjeta. |
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
| `--fs-xs` | 12px / 1.4 | 600, tracking `0.04em`, mayúsculas | Etiqueta de competición, "EN VIVO", "POSTERGADO". |
| `--fs-sm` | 14px / 1.45 | 400–500 | Hora, metadatos, texto secundario. |
| `--fs-base` | 16px / 1.5 | 500 | Nombre de equipo. Cuerpo. |
| `--fs-lg` | 18px / 1.2 | 600–700 | Marcador. |
| `--fs-xl` | 22px / 1.25 | 700 | Título de pantalla, encabezado de día. |

**Pesos permitidos:** 400 / 500 / 600 / 700. El 700 está reservado a títulos y al marcador del ganador — si se usa en todos lados deja de significar "esto importa".

**Truncado:** los nombres de equipo van a **una línea con elipsis** (`min-width: 0` + `text-overflow: ellipsis`), con el nombre completo en `title`. Un nombre largo nunca hace crecer la fila ni empuja al marcador fuera de pantalla (invariante 1 de § 8). Los nombres de competición pueden abreviarse a su forma corta (§ 7.3) en disposición compacta. **El sufijo desambiguador entre paréntesis está protegido del truncado** — regla completa en § 7.5.

**Tracking: un solo valor por paso.** `--fs-xs` en mayúsculas lleva **siempre `0.04em`**, sea encabezado de grupo, franja de estado o banda de corte. No hay trackings distintos para el mismo tamaño según el elemento: es una diferencia que nadie percibe y una decisión más que tomar en cada spec. La **única excepción declarada** es el wordmark, que lleva tracking negativo por ser un logotipo y no texto de UI (§ 10.1).

## 5. Espaciado, radios, iconografía

- **Escala de espaciado, base 4px:** `--space-1` 4 · `--space-2` 8 · `--space-3` 12 · `--space-4` 16 · `--space-5` 24 · `--space-6` 32. No se usan valores fuera de la escala.
- **Padding lateral de pantalla:** 16px en compacto, 24px en amplio.
- **Radios:** `--radius-sm` 6px (píldoras, badges) · `--radius-md` 10px (tarjetas y grupos) · `--radius-full` (punto de "en vivo", avatares). Nada con radio 0 salvo separadores.
- **Alto de fila de partido:** mínimo 56px. Da aire suficiente para leer dos equipos y respeta el target tocable.
- **Iconos:** trazo (stroke) de 1.5–2px, tamaño 16/20/24, siempre `currentColor`. Nunca un icono como único portador de significado sin `aria-label`. **El inventario de iconos de la v1 está cerrado y es corto:** los tres glifos del control de tema (§ 6.1), el chevron de los botones de icono (§ 6.3) y el icono neutro del estado Vacío (§ 6). Todo otro acceso de la app es **una palabra subrayada**, no un icono (§ 3.3, § 10.1). Sumar un icono nuevo pide justificarlo contra esta lista.

## 6. Interacción y estados

Todo elemento interactivo declara sus cinco estados. Un spec al que le falta uno está incompleto.

| Estado | Forma |
|--------|-------|
| Reposo | Según § 3.3 (links) o `--color-surface` (botones/controles). |
| Hover | Superficie a `--color-surface-2`; en links, subrayado a 2px `--color-brand`. Nunca es el único indicio (no existe en touch). |
| Focus | `outline: 2px solid var(--color-focus); outline-offset: 2px`. **Jamás `outline: none`.** Visible en ambos modos. |
| Activo / presionado | `--color-brand-strong`, sin desplazamiento de layout. |
| Deshabilitado | `--color-text-3`, sin puntero, sin hover. |

**Target tocable mínimo 44×44px** para todo lo clickeable, incluidas las flechas ← → de Inicio y los nombres dentro de una fila (se logra con padding vertical, sin engordar la fila).

**Estados de pantalla — son tres** (los de `docs/screens.md`, con su forma visual):

| Estado | Forma visual |
|--------|--------------|
| **Cargando** | Skeleton, no spinner: 5 filas de partido en `--color-surface-2` con las mismas alturas que la fila real, para que no salte el layout al llegar el dato. El skeleton no usa la marca. |
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

**Partido en vivo:** punto `--radius-full` 8px en `--color-live` + minuto en `--color-live` + etiqueta "EN VIVO" en `--fs-xs`. Tres señales, ninguna solo cromática. El punto puede pulsar con una animación suave de opacidad, respetando `prefers-reduced-motion`.

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

## 7. Patrón: fila de partido

Es la unidad que se repite en las tres pantallas. **Se especifica una vez y se implementa como un solo componente**; escribirla por pantalla garantiza que las tres se desincronicen. Lo que cambia entre pantallas es el eje de agrupación (§ 7.1) y si la fila lleva meta-línea (solo Equipo, § 10.3) — no su anatomía.

**La fila tiene dos disposiciones**, con los mismos datos y el mismo vocabulario: la **compacta** (§ 7.0), que es la base y rige en 320–767px, y la **simétrica** (§ 8.4), que rige en ≥768px. Todo lo demás de esta sección —agrupación, estados, escudos, truncado, corte temporal— vale para las dos por igual.

- **Agrupación:** las filas nunca van mezcladas sin encabezado, salvo en Equipo (lista plana); qué agrupa cada pantalla se define en § 7.1. El encabezado de grupo va en `--fs-xs`, 600, tracking `0.04em`, mayúsculas, `--color-text-2`, fondo `--color-surface-2`.
- **Ancho fijo en las columnas numéricas** (hora y marcador): con `tabular-nums` la columna se alinea entre filas **y entre pantallas**, y el ojo baja en línea recta. Es la propiedad que hace escaneable la app entera; todo lo demás se subordina a ella.
- **Sin resultado todavía** → la columna del marcador queda vacía, no muestra `-` ni `0-0`. Un `0 - 0` en un partido que no empezó es un dato falso.
- **Separador** de 1px `--color-border` entre filas; no hay bandas alternadas (ruido innecesario a esta densidad).

### 7.0 Anatomía (disposición compacta, que es la base)

Grid de tres columnas: **`48px | 1fr | 24px`**, `gap: --space-3` (12px), `padding: --space-3` (12px), `min-height: 56px`, `align-items: start`.

| Ranura | Contenido | Tratamiento | Por qué |
|--------|-----------|-------------|---------|
| **Col. 1 — línea de tiempo** (48px) | Hora programada | `--fs-sm` 14px / 400 / `--color-text-2` / `tabular-nums` | Es el dato de orientación, no el protagonista. **Se muestra siempre, incluso en un partido terminado:** es la hora a la que se jugó, y sacarla dejaría huecos en la columna que ancla toda la lista. |
| | Sub-línea (debajo de la hora) | `--fs-xs` 12px / 600 / `tabular-nums`. `FIN` en `--color-text-3`; minuto de juego (`68'`) en `--color-live` | Un único lugar para "en qué momento del partido estamos". Vertical: arriba cuándo empezaba, abajo dónde va. |
| **Col. 2 — equipos** (`1fr`, `min-width: 0`) | Local arriba, visitante abajo, una línea cada uno | `--fs-base` 16px / 500 / `--color-text-1`, links (§ 3.3), truncado según § 7.5 | El dato principal. Los dos son links; la fila entera no lo es (§ 3.3). |
| | Franja de estado, debajo de los nombres | `--fs-xs` 12px / 600 / tracking `0.04em` / mayúsculas, forma + palabra, `gap: --space-2` | Va debajo de los nombres y alineada con ellos: **no le roba ancho a las columnas numéricas**, que no se mueven jamás. |
| **Col. 3 — marcador** (24px) | Local arriba, visitante abajo, **un número por línea**, alineados a la derecha | `--fs-lg` 18px / `tabular-nums`, peso según § 3.1 | Apilado y no `2 - 1` en línea: cada número queda a la altura de su equipo, así el usuario no tiene que mapear "el primero es el de arriba". De paso, apilado la columna mide 24px en vez de ~40 — 16px que se le devuelven al nombre. |

**Presupuesto de ancho a 320px** (el caso que manda, § 8): 320 − 32 (padding de pantalla) − 2 (bordes de la tarjeta de grupo) − 24 (padding de la fila) − 48 (col. 1) − 24 (col. 3) − 24 (dos gaps) = **~166px para el bloque de nombres**, ≈20 caracteres a `--fs-base`. Con escudo (§ 7.4, variante 2) baja a **~140px**, ≈17 caracteres. Ese delta de 3 caracteres es exactamente lo que está en juego en la decisión de escudos.

**Invariante de columnas — el requisito duro de la fila.** Las columnas 1 y 3 son de ancho fijo y **no se mueven nunca**: ni con escudo, ni con nombre largo, ni con meta-línea, ni entre pantallas. Todo lo que se agregue se lo come la columna 2, que ya trunca. Verificable apoyando una regla vertical sobre Inicio, Competición y Equipo: las tres columnas de hora arrancan en el mismo píxel, las tres de marcador terminan en el mismo píxel.

El invariante es de **cada disposición consigo misma**, no entre disposiciones: en amplia las ranuras numéricas son otras (§ 8.4), pero ahí también son de ancho fijo y también alinean en las tres pantallas. Lo que nunca se admite es un ancho `auto` en una ranura numérica.

**Alineación del marcador cuando hay meta-línea** (solo Equipo): el marcador baja `--space-4` (16px) para quedar a la altura de la línea del equipo local. Para que ese desplazamiento siga siendo verdadero, **la meta-línea es de una sola línea, con `nowrap` y elipsis** — si envolviera, el marcador se despegaría de su equipo.

### 7.1 Qué agrupa cada pantalla

Las tres pantallas muestran la misma lista de partidos, pero **lo que el usuario ya sabe al entrar es distinto en cada una**, y el eje de agrupación es exactamente lo que *no* sabe. Repetir en cada fila un dato que es el título de la pantalla es ruido. Esto fija el eje de agrupación; qué agrega y qué omite la fila en cada pantalla está cerrado en § 10:

| Pantalla | Agrupa por | Encabezado de grupo |
|----------|-----------|---------------------|
| **Inicio** | **Competición** (máximo 3 grupos) | Nombre de la competición, y **es el link** a la pantalla Competición. |
| **Competición** | **Fecha** (día) | Fecha, no clickeable. Sin encabezado de competición: es el título de la pantalla. |
| **Equipo** | **Nada: lista plana**, cronológica | — |

**Por qué Equipo no agrupa:** un equipo juega una o dos veces por semana, así que agrupar por fecha daría una ristra de encabezados con una sola fila abajo — más cromo que dato. Y agrupar por competición rompería el orden cronológico, que es justamente lo que el usuario viene a ver ("¿cuándo juega?").

**Ancla del orden (Competición y Equipo):** las listas son cronológicas ascendentes y se abren posicionadas en el **próximo partido**. Visualmente eso exige que se vea dónde está el corte entre lo jugado y lo que viene; su forma está en § 7.6.

### 7.2 Vocabulario de estados de partido — **provisional**

**Provisional hasta el relevamiento real de API-Football** (pendiente en `docs/data-model.md`): la app no inventa estados, muestra los que la API devuelve (RN-001). Esta tabla fija **cómo se dice y cómo se ve** cada estado que razonablemente vamos a recibir; cuando el relevamiento cierre, se ajustan las filas, no las reglas.

| Estado | Franja de estado (col. 2) | Col. 1 — hora y sub-línea | Marcador | Color y forma (§ 3.1) |
|--------|---------------------------|---------------------------|----------|------------------------|
| Programado | — (la hora es el estado) | Hora. Sin sub-línea | Vacío | Neutro, sin forma. |
| En vivo | ● `EN VIVO` | Hora + minuto (`68'`) | Presente, ambos 600 (`0 - 0` es válido) | Verde. **Círculo** de 8px `--radius-full`, pulsa. |
| Entretiempo | ● `ENTRETIEMPO` | Hora + `ENTR.` en `--color-live` | Presente, ambos 600 | Verde. Círculo, pulsa. |
| Finalizado | — | Hora + `FIN` en `--color-text-3` | Presente; ganador 700, perdedor 400 + `--color-text-2`; empate ambos 500 | Neutro — el ganador se distingue por peso, nunca por color. |
| Postergado | ◆ `POSTERGADO` | Hora. Sin sub-línea | Vacío | Ámbar. **Diamante** de 8px (cuadrado a 45°). |
| Suspendido | ◆ `SUSPENDIDO` (+ minuto si la fuente lo da) | Hora. Sin sub-línea | **Puede haber parcial** — se muestra tal cual | Ámbar. Diamante. |
| Cancelado | ◆ `CANCELADO` | Hora. Sin sub-línea | Vacío | Ámbar. Diamante. Nunca rojo: no falló la app (§ 3.1). |
| A confirmar | `A CONFIRMAR` en `--color-text-2` | `—` en `--color-text-3`, sin sub-línea | Vacío | **Neutro**, no ámbar y sin forma: el partido está bien, lo que falta es la hora. |

**Círculo para el verde, diamante para el ámbar.** Es lo que hace que la regla "nada solo por color" se cumpla de verdad: en escala de grises —o para un usuario con daltonismo rojo-verde— un partido postergado se distingue de uno en vivo por **forma y palabra**, sin depender del tono. El rojo no aparece nunca en una fila (§ 3.1: un partido cancelado no es un error de la app), así que la app usa dos formas, no tres.

**La etiqueta canónica es el nombre del estado; la forma visible puede ser la corta cuando otro dato visible de la misma fila ya sostiene el estado.** (Enmienda a la regla anterior, que exigía la etiqueta completa siempre.) Hoy eso ocurre en un solo caso: **Finalizado**, que muestra `FIN` en la sub-línea y **no** lleva franja. Razones:

1. **El marcador presente ya dice que el partido terminó.** `FIN` no es la única señal, es el refuerzo — que es justo la condición que la regla protege.
2. **En una lista, la mayoría de las filas están finalizadas.** Repetir `FINALIZADO` quince veces convierte el estado más común en el elemento con más tinta de la pantalla, contra "el dato es el protagonista" (§ 1). El estado que hay que leer es el excepcional, no el esperado.
3. **`FINALIZADO` sigue siendo el nombre accesible** del estado (`aria-label` / `title` sobre la sub-línea). No se pierde para lector de pantalla.

Los estados **ámbar conservan la palabra completa, sin excepción**: son raros, no traen marcador que los sostenga, y son exactamente los que el usuario no puede permitirse malinterpretar (llegar al estadio de un partido postergado). `ENTR.` / `POST.` / `SUSP.` / `CANC.` / `A CONF.` quedan como reserva para un contexto más angosto que 320px, que hoy no existe.

- **Prohibida la abreviatura `ET`**: colisiona entre *entretiempo* y *tiempo extra*, y con Libertadores/Sudamericana el alargue existe. Entretiempo abrevia `ENTR.`; si el relevamiento confirma alargue y penales, entran como `T. EXTRA` / `T.E.` y `PENALES` / `PEN.`, ambos con tratamiento de "en vivo".
- **Marcador vacío se deja vacío; hora ausente lleva `—`.** No es incoherente: un `-` en la columna del marcador se leería como un resultado, mientras que un hueco en la columna de hora —que es la que ancla la lectura vertical de toda la lista— se lee como un error de render. El em dash dice "todavía no hay hora", y la franja `A CONFIRMAR` lo explica.

### 7.3 Nombres de competición — forma corta

El nombre completo se usa en el título de la pantalla Competición; la **forma corta** es para el encabezado de grupo en Inicio y para la meta-línea de la fila extendida en Equipo.

| Nombre completo | Forma corta |
|-----------------|-------------|
| Primera A — Argentina | `PRIMERA A` |
| Copa Libertadores | `LIBERTADORES` |
| Copa Sudamericana | `SUDAMERICANA` |

**Es una tabla, no un algoritmo:** acortar por truncado automático produce basura (`Copa Sudameric…`). Son tres competiciones fijas en la v1 (`docs/requirements.md`); dónde vive ese mapeo y cómo se concilia con RN-001 es decisión funcional/técnica, no visual.

### 7.4 Escudos — **se implementa la variante 1 (sin escudo)**

Que API-Football provea logos sigue **pendiente de relevamiento** (`docs/data-model.md`). La decisión de qué se construye ahora **se cierra acá, y es la variante sin escudo**; la variante con escudo queda especificada al detalle para que adoptarla el día que el dato se confirme sea un cambio mecánico y no un rediseño.

**Variante 1 — sin escudo. Es la que se implementa.**

El bloque de nombres arranca en el borde de su columna. El nombre alcanza: es el dato que el usuario vino a leer.

**Por qué esta y no la variante con placeholder** (que es lo que proponía el handoff de origen):

1. **Un placeholder no es un escudo: es una caja gris que no dice nada.** Si el relevamiento vuelve con "no hay logos", la app queda con una columna de rectángulos idénticos en cada fila, permanentemente. Eso es decoración inventada (§ 1) y, peor, crea un ritmo vertical falso que el ojo tiene que filtrar en cada barrida — en un lector de listas es exactamente el tipo de ruido que hay que sacar.
2. **Cuesta ~26px del recurso más escaso.** 18 de escudo + 8 de gap salen del bloque de nombres, que a 320px pasa de ~166px a ~140px: **≈3 caracteres menos por nombre** (§ 7.0). Pagar tres caracteres de un dato real por un placeholder que no es ningún dato es un mal cambio.
3. **El costo de esperar es acotado y conocido.** Adoptar la variante 2 después mueve el truncado de los nombres y suma un elemento al encabezado de dos pantallas. Eso se re-verifica con el checklist que ya está escrito (§ 10) — no se rediseña nada, porque los valores están todos fijados abajo.
4. **La regla de "la caja nunca se colapsa" no obliga a reservarla desde hoy.** Esa regla resuelve *un equipo sin logo dentro de una app que tiene logos*; no dice nada sobre *una app que todavía no sabe si tendrá logos*. Son dos problemas distintos y el handoff los mezclaba.

**Variante 2 — con escudo. Especificada, no implementada.** Se adopta **solo** cuando `docs/data-model.md` confirme que la fuente provee logos y que el tamaño servido rinde bien a 18px. Ese día no hay decisión visual que tomar: es esto.

| Dónde | Tamaño | Colocación |
|-------|--------|------------|
| Fila de partido | **18px** | A la izquierda del nombre, `gap: --space-2` (8px). Alineado a la altura de línea del nombre. |
| Encabezado de Equipo y de Competición | **24px** | Antes del título, `margin-inline-end: --space-2`. |

- **18 y 24px son tamaños de icono, no pasos de la escala de espaciado** (§ 5 admite 16/20/24): 18px es el que se alinea con la altura de línea de 24px de un nombre a `--fs-base`. Excepción declarada, no un valor suelto.
- **Tal cual lo provee la fuente:** sin recolorear, sin filtro por modo, sin borde, sin fondo, sin recorte circular (§ 2).
- **La hora y el marcador no se mueven** al adoptar la variante 2. El escudo se lo come el bloque de nombres, que ya trunca (§ 7.0, invariante de columnas).
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
| **Tope de la protección** | El sufijo **no puede quedarse con más de la mitad del bloque de nombres**, y la base nunca baja de ~4 caracteres. Superado ese punto, el sufijo también trunca. |

- **No se toca el string de la fuente** (RN-001): es una regla de presentación sobre el texto que llegue, no una transformación del dato ni una tabla curada por equipo.
- **No crece la fila.** La altura constante es el activo de un lector de listas; se descarta pasar el nombre a dos líneas, que hacía convivir filas de ~68px con filas de ~100px, despegaba el marcador de la línea de su equipo y bajaba la densidad ~30%.
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
- **No aparece en Inicio.** Inicio muestra un solo día agrupado por competición: el corte se repetiría hasta tres veces por pantalla para separar dos o tres filas cada vez. Más cromo que dato.
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

- **Compacta (320–767px):** una sola columna a todo el ancho menos 16px de padding lateral. El bloque de equipos lleva `min-width: 0` y elipsis: el nombre largo se recorta, no empuja (invariante 1). Nombres de competición en forma corta. Las flechas de día quedan ancladas a los bordes del encabezado, con 44px de target y sin salirse (invariante 3).
- **Amplia (≥768px):** el contenido se centra y se limita a **720px** con 24px de padding lateral. Ensanchar la lista más allá de 720px alarga el recorrido del ojo entre un extremo y el otro de la fila y la hace más lenta de leer, que es exactamente lo contrario del objetivo. **No se agregan columnas a la página ni se ponen dos listas lado a lado:** la lista sigue siendo una lista. Lo que sí cambia es la **forma interna de la fila** — § 8.4.
- **Todo spec de feature declara su comportamiento compacto**, aunque sea "no cambia". Un spec sin sección de contención está incompleto.

### 8.4 La fila en disposición amplia — **fila simétrica (cerrado)**

**Confirmado por el usuario.** En ≥768px la fila de partido cambia de forma: pasa de la anatomía de tres columnas de § 7.0 a un **espejo alrededor de un eje central**. Los datos son exactamente los mismos; cambia dónde se paran.

```
      Central Córdoba (SdE)      1 – 0      Gimnasia y Esgrima (LP)
                             19:30 · FIN
```

**La condición no negociable, y por qué existe.** La columna central es de **ancho fijo**, nunca `auto`. Con `auto` su ancho cambia de fila en fila (`19:30` no mide lo que `1 – 0`), así que horas y marcadores dejarían de formar una columna y zigzaguearían entre nombres de largo variable — se rompería la alineación vertical de los números, que es lo único que hace escaneable la lista (§ 7.0) y la razón entera de `tabular-nums` (§ 4.2). Fijo, el eje es un eje de verdad.

#### Anatomía

Grid de **tres columnas `1fr | 96px | 1fr`**, `gap: 0 --space-4` (16px), `padding: --space-3 --space-4` (12px 16px), `min-height: 56px`, y **tres filas implícitas**:

| Fila | Contenido | Colocación |
|------|-----------|------------|
| **1 — meta** | Solo en Equipo: `dom 19/04 · PRIMERA A` (§ 10.3). | `grid-column: 1 / -1`, **centrada**. Colapsa a cero cuando no hay meta (Inicio y Competición). |
| **2 — el partido** | Local · eje · visitante. `align-items: center`. | Las tres columnas del grid. |
| **3 — estado** | Hora (si el eje no la mostró) + estado en palabras. | `grid-column: 1 / -1`, **centrada**. Colapsa a cero cuando está vacía. |

**Las filas 1 y 3 son de ancho completo, no van dentro de la columna central.** Es la decisión que hace viable el ancho fijo del eje: si el estado viviera adentro de los 96px, una etiqueta como `ENTRETIEMPO` o `SUSPENDIDO · 54'` obligaría a ensanchar el eje muy por encima de lo que el marcador necesita —desparramando los nombres y aflojando la simetría— o a truncar una palabra que el usuario no puede permitirse malinterpretar (§ 7.2). Puestas como filas propias, ambas disponen del ancho entero de la fila (~640px a 720px de contenido) y **nunca truncan**, mientras el eje queda tan angosto como el número que contiene. Cada elemento en el contenedor que su contenido pide.

#### Columna 2 — el eje (96px fijos)

| Qué muestra | Cuándo | Tratamiento |
|-------------|--------|-------------|
| Marcador `1 – 0` | Hay marcador | Números en `--fs-xl` 22px, `tabular-nums`, **pesos idénticos a compacta** (§ 3.1: ganador 700 / perdedor 400 + `--color-text-2`; empate 500; en curso 600). |
| Separador | Con el marcador | **En dash `–` (U+2013)** — no guion corto, no em dash — en `--fs-lg` 18px, `--color-text-3`, `gap: --space-2` (8px) a cada lado. Un paso más chico y en terciario porque **no es un dato**: separa dos números, no dice nada. |
| Hora `19:30` | No hay marcador (programado, postergado, cancelado) | `--fs-xl` 22px / **600** / `--color-text-1` / `tabular-nums`. |
| `—` | Hora a confirmar | `--fs-xl` / `--color-text-3`. |

- **La hora del eje va a `--fs-xl`, no a `--fs-sm` como proponía el handoff.** En Competición la mayoría de las filas son partidos futuros: con la hora a 14px y el marcador a 22px, el eje latiría de tamaño fila a fila y dejaría de leerse como columna. Mismo tamaño = eje real. Va en 600 y no en 700 porque el 700 está reservado a títulos y al marcador del ganador (§ 4.3).
- **De dónde salen los 96px.** Contenido más ancho posible: marcador de dos dígitos por lado a 22px tabular (≈26px cada lado) + dos gaps de 8 + en dash a 18px (≈10px) = **≈79px**. `19:30` a 22px mide ≈59px. Los 96px (24 × 4, en escala) dejan ~17px de holgura, que es lo que absorbe la diferencia de métricas entre Inter y la tipografía de respaldo **antes de que la webfont cargue** — con un ancho al ras, el eje desbordaría durante ese primer pintado. **No es un valor a ojo ni ajustable "si queda mejor": si cambia, se recalcula desde el contenido.**
- A 720px de contenido, descontados padding de fila y gaps, el eje de 96px deja **~255px por nombre** — de sobra para que un nombre entre completo, con margen incluso para el escudo de la variante 2.

#### Columnas 1 y 3 — los equipos

- **Local:** columna 1, texto alineado **a la derecha**. **Visitante:** columna 3, alineado **a la izquierda**. Ambos `--fs-base` 16px / 500 / `--color-text-1`, links (§ 3.3), `min-width: 0`.
- **Truncado:** rige § 7.5 igual que en compacta. A 272px casi nunca se dispara, pero es la red que sostiene el invariante 1 con un nombre extremo. La elipsis cae al final del string —o sea, del lado que mira al eje— en las dos columnas: es la misma regla, sin caso especial por lado.
- **Escudos** (solo si se adopta la variante 2, § 7.4): **hacia adentro**, pegados al eje. Local: nombre y después escudo; visitante: escudo y después nombre. La simetría es de espejo, no de repetición.

#### Fila 3 — la línea de estado

**Regla única: el eje muestra el número que manda; la fila 3 muestra la hora si el eje no la mostró, más el estado en palabras.** Así ningún dato se pierde al cruzar el umbral: la hora que en compacta vive en la columna 1 sigue estando siempre.

`--fs-xs` 12px / 600 / tracking `0.04em` / mayúsculas para la etiqueta de estado; la hora en 500, `--color-text-2`, `tabular-nums`; separador ` · `; `gap: --space-2`. Forma (círculo verde / diamante ámbar) antes de la etiqueta, igual que en compacta (§ 7.2).

| Estado | Eje (col. 2) | Fila 3 |
|--------|--------------|--------|
| Programado | `19:30` | *(vacía — colapsa)* |
| A confirmar | `—` | `A CONFIRMAR` en `--color-text-2` |
| En vivo | `1 – 0` | `19:30` · ● `EN VIVO · 68'` |
| Entretiempo | `1 – 0` | `19:30` · ● `ENTRETIEMPO` |
| Finalizado | `2 – 1` | `19:30` · `FIN` |
| Postergado | `19:30` | ◆ `POSTERGADO` |
| Suspendido | `1 – 0` | `19:30` · ◆ `SUSPENDIDO · 54'` |
| Cancelado | `19:30` | ◆ `CANCELADO` |

- **El minuto se absorbe acá**, no se repite al costado: en amplia hay una sola línea de estado y el minuto es parte del estado.
- **`FIN` sigue siendo la forma visible, aunque en amplia sobre lugar para `FINALIZADO`.** La regla de § 7.2 no es de espacio sino de ruido: es el estado más común de la lista y no puede ser el texto más pesado. El nombre accesible sigue siendo "Finalizado". Un solo vocabulario en las dos disposiciones.

#### Qué **no** cambia y qué **no** se hace en amplia

- No cambian los datos, los pesos del marcador, el vocabulario de estados, las formas, los colores ni los tamaños tipográficos. **Es la misma fila reordenada.**
- **El desplazamiento de 16px del marcador que existe en compacta no aplica acá** (§ 7.0): en amplia la meta-línea es una fila propia del grid, así que no hay nada que compensar.
- No se agregan columnas, ni dos listas lado a lado, ni escudos más grandes, ni filas más altas de lo que su contenido pide.

**El costo, asumido con los ojos abiertos:** existen **dos formas de la fila**, no una. Son dos disposiciones del mismo componente y de los mismos datos, y las dos entran al QA visual por separado.

## 9. Encabezado por pantalla — inventario

El encabezado es el único cromo persistente de la app: no hay tabs ni sidebar (§ 8.1). Esta sección fija **qué elementos existen en cada pantalla y cuáles no**, más la altura (§ 9.1) y la política de fijado (§ 9.2). La forma concreta de cada elemento está cerrada en § 10.

**Regla general:** el encabezado no debería cambiar de altura entre estados (cargando, vacío, error) para que la lista no salte bajo el dedo del usuario al llegar el dato.

**Inicio:** wordmark de Fulbo · navegación día anterior/siguiente (RF-002, forma cerrada en § 6.2) · acceso a la pantalla Equipo del equipo favorito predefinido (RF-005 — no es "elegir", es solo navegación a un destino fijo; no existe estado marcado/desmarcado porque no hay selección) · acceso a Configuración. Nada más: sin buscador, filtros, tabs, ni controles fuera de esta lista.

**Competición:** volver atrás · nombre de la competición (con su escudo si la variante con escudo aplica, § 7.4). Nada más.

**Equipo:** volver atrás · nombre del equipo (ídem escudo). Nada más — **incluido cuando la pantalla muestra al equipo favorito**: no hay nada que marcar ahí.

**Configuración:** volver atrás · título. El cuerpo es solo el control de tema (§ 6.1) y su línea de ayuda — sin botones de guardar/cancelar (el cambio se aplica al instante), sin sección de versión o acerca de.

**Consistencia entre Competición, Equipo y Configuración:** las tres son pantallas de drill-down con "volver atrás" — comparten esa estructura básica de encabezado; el wordmark y los accesos de Inicio no se duplican en ninguna de las tres.

### 9.1 Altura: **una sola, 56px**

Toda barra de encabezado de la app mide **56px**, en las cuatro pantallas y en las dos barras de Inicio. Es la misma altura mínima que la fila de partido (§ 5), así que la app entera se apoya en un único módulo vertical, y le deja 6px de aire a un target de 44px sin que nadie tenga que calcular nada. Un segundo valor (52px) no compraba nada y era un número más para recordar y para equivocar.

### 9.2 Qué queda fijo al scrollear — **cerrado**

**La regla, que vale para toda pantalla presente y futura:** queda fijo **lo que el usuario necesita mientras recorre la lista**; se va con el scroll **lo que solo necesita al llegar**.

| Pantalla | Queda fijo (`position: sticky; top: 0`) | Se va con el scroll |
|----------|------------------------------------------|---------------------|
| **Inicio** | La **barra de día** (§ 6.2). | La **barra de marca** (wordmark, `Mi equipo`, `Ajustes`). |
| **Competición / Equipo** | El **encabezado entero** (volver + título). | — |
| **Configuración** | El encabezado entero (por consistencia; la pantalla no scrollea). | — |
| **Todas** | — | Los **encabezados de grupo**: no se pegan. |

**Por qué la barra de día sí y la de marca no.** Un miércoles son ~16 partidos ≈ 2,5 pantallas: sin sticky, cambiar de día desde el fondo obliga a scrollear todo hacia arriba, y es el único control de uso constante de la app (invariante 3, § 8.2). El wordmark, `Mi equipo` y `Ajustes` son cromo de entrada: se usan al abrir, no mientras se escanea. Fijarlos costaría 56px permanentes contra el objetivo de densidad, y recuperarlos cuesta un flick.

**Por qué el encabezado de drill-down sí queda fijo, aunque contenga un acceso de "llegada".** No es una excepción a la regla, es la misma regla con otro contenido: en Competición y Equipo el encabezado no es cromo, **es el contexto** — el título es el único lugar de la pantalla que dice de qué competición o de qué equipo son las 200 filas que el usuario está recorriendo (en Inicio ese contexto lo dan los encabezados de grupo, que viajan con la lista). Además ahí vive la única salida de la pantalla, y son las listas más largas de la app. Costo total: 56px, **menos** que los 56px de Inicio — ninguna de estas pantallas tiene dos barras.

**Por qué los encabezados de grupo no se pegan.** Serían una segunda capa fija (56 + 44 = 100px, ~18% del alto útil en un teléfono) para un problema chico: en Inicio son máximo 3 grupos, y en Competición cada fila ya lleva su hora.

**Forma del estado fijo:**

- **La altura no cambia al pegarse.** Nada de barras que se condensan: en Inicio eso movería la etiqueta del día bajo el dedo justo cuando el usuario va a tocarla, y en drill-down movería el botón de volver.
- Al pegarse suma **borde inferior 1px `--color-border`** (que ya tiene) y **`--shadow-1`** — **solo en modo claro**. En oscuro no hay sombra: la sombra no se ve y el borde de 1px es el separador (§ 3.5).
- La barra **sangra a todo el ancho** del viewport; su contenido interno respeta el tope de 720px y el padding lateral de la disposición (§ 8.3). Así el borde inferior corre de lado a lado y no queda una línea flotando en el medio de la pantalla.

## 10. Specs por pantalla

Composición cerrada de las cuatro pantallas de la v1. Todo lo que no está acá sale de los patrones de § 6 y § 7; si un elemento no aparece en ninguno de los dos, **no se inventa: se pregunta** (`CLAUDE.md` § Regla de oro).

### 10.1 Inicio

Partidos del día elegido, agrupados por competición (§ 7.1). Dos barras de encabezado, ambas `--color-surface` con borde inferior 1px `--color-border`, ambas de 56px (§ 9.1).

**Barra 1 — marca y accesos** (`padding: 0 --space-4`, `gap: --space-4`, se va con el scroll):

| Elemento | Especificación | Por qué |
|----------|----------------|---------|
| **Wordmark** | `fulbo.` — `--fs-xl` 22px / 700 / tracking **`-0.035em`**. La **palabra** en `--color-text-1`; **solo el punto final** en `--color-brand`. Alineado a la izquierda. | La marca cabe en un punto de 4px. Un wordmark entero en violeta a 22px/700 sería el elemento con más peso *y* más saturación de una pantalla cuyo protagonista es el dato (§ 1) — el acento dejaría de ser acento. El punto es distintivo, es marca legítima (§ 3.2) y no le disputa nada a la etiqueta del día que viene justo abajo. |
| | **No es interactivo:** ni link, ni botón, ni estados, ni foco. Es un `<h1>`. Nombre accesible **"Fulbo"**; el punto va `aria-hidden`. | Inicio es la pantalla de inicio: un logo que linkea a donde ya estás es una promesa vacía. Y el wordmark no aparece en ninguna otra pantalla (§ 9). |
| | El tracking negativo es la **única excepción** de la app a la tipografía de UI: es un logotipo, no texto. | |
| **`Mi equipo`** | Link de encabezado (§ 3.3): `--fs-sm` 14px / 500 / `--color-text-1` + subrayado. Target 44px de alto por padding vertical. Destino: pantalla Equipo del favorito predefinido (RF-005). | **Dice "Mi equipo" y no el nombre del club** porque el rótulo tiene que caber a 320px **sea cual sea el equipo configurado**: un `Gimnasia y Esgrima (LP)` en el encabezado se truncaría (truncar un nombre de equipo en el cromo es peor que en una fila) o empujaría a `Ajustes` fuera. Además nunca se confunde con un nombre de equipo de una fila. |
| | En sentence case y `--fs-sm`, **no** `MI EQUIPO` en `--fs-xs` mayúsculas. | En toda la app, `--fs-xs` en mayúsculas significa "etiqueta o badge, no se toca" (encabezado de grupo, franja de estado). Usar ese mismo traje para un acceso de navegación rompería el vocabulario. Y `--color-text-3` está definido como terciario/deshabilitado (§ 3.4): sería el peor color posible para el acceso al equipo del usuario. |
| **`Ajustes`** | Idéntico a `Mi equipo`, a su derecha, `gap: --space-4`. Destino: Configuración. | Dos palabras subrayadas con el mismo tratamiento = un solo patrón de acceso. Cero iconos inventados en esta barra: cierra el pendiente de "qué icono usar en cada acceso del encabezado" resolviéndolo **sin** icono. |

**Barra 2 — navegador de día:** § 6.2 completo. Queda fija al scrollear (§ 9.2).

**Cuerpo** (`padding: --space-3 --space-4 --space-5`): una tarjeta por competición, `--color-surface`, borde 1px `--color-border`, `--radius-md`, separadas por `--space-3`. Máximo 3 grupos en la v1.

| Elemento | Especificación |
|----------|----------------|
| Encabezado de grupo | Dentro de la tarjeta, arriba. Fondo `--color-surface-2`, borde inferior 1px `--color-border`, `min-height: 44px`, `padding: 0 --space-3`, contenido centrado verticalmente. Texto: **forma corta** de la competición (§ 7.3) en `--fs-xs` 12px / 600 / tracking `0.04em` / mayúsculas / `--color-text-2`, **subrayado de link** (§ 3.3). |
| Área tocable | **La banda entera es el link** a la pantalla Competición — destino único, sin ambigüedad (§ 3.3). Los 44px de alto son el target; el subrayado sobre las palabras es la afordancia. |
| Estados de la banda | Hover/focus/active: el subrayado pasa a 2px `--color-brand`. El fondo **no** cambia (ya es `--color-surface-2`). Focus: `outline` de § 6 sobre la banda. |
| Filas | § 7.0, sin meta-línea. Separador 1px `--color-border` entre filas; la última no lleva separador (la cierra el borde de la tarjeta). |
| Sin corte `PRÓXIMOS` | § 7.6. |

**Estados de pantalla:** § 6. El skeleton son 5 filas dentro de **una** tarjeta de grupo, sin escudo (§ 7.4, variante 1), sin marca.

**Contención (§ 8):** compacta es la base. La barra 1 a 320px consume ~196px de los 288 disponibles: entra con holgura y ningún elemento trunca. La etiqueta del día cede ancho antes que las flechas (§ 6.2), así que las flechas nunca se salen ni se achican (invariantes 1 y 3). En amplia, las barras sangran a todo el ancho con el contenido topado a 720px (§ 9.2) y **las filas pasan a la forma simétrica de § 8.4**; el encabezado y los grupos no cambian.

#### Checklist de aceptación visual — Inicio

1. Wordmark: la palabra en `--color-text-1`, **solo el punto** en violeta. No es clickeable y no toma foco con Tab.
2. `Mi equipo` y `Ajustes` se ven iguales entre sí (14px, subrayados) y llevan a Equipo-favorito y a Configuración.
3. Flechas de día: **44×44 reales** (medir en computed styles, no a ojo), separadas 8px del borde, **sin** estado deshabilitado.
4. La etiqueta del día dice `Hoy` / `Ayer` / `Mañana` en esos tres días y fecha absoluta en el resto; al pasar de año la fecha **incluye el año**; el `title` siempre trae la fecha completa.
5. No existe ningún botón "volver a hoy".
6. Al scrollear: la barra de marca **desaparece**, la de día **queda fija al mismo alto de 56px** (no se condensa), y los encabezados de grupo pasan por debajo **sin pegarse**.
7. En modo oscuro la barra fija **no** tiene sombra; en claro tiene `--shadow-1`. En ambos, borde inferior de 1px.
8. La banda del encabezado de grupo es clickeable **entera** y mide ≥44px de alto; el nombre va subrayado y en mayúsculas `--fs-xs`.
9. La columna de hora y la de marcador arrancan y terminan en el mismo píxel que en Competición y en Equipo.
10. Un partido programado **no** muestra `0-0` ni `-` en el marcador; uno "a confirmar" muestra `—` en la hora.
11. Un partido en vivo muestra los dos números en 600 (ninguno en 700), círculo verde que pulsa y `EN VIVO`; postergado / suspendido / cancelado muestran **diamante** ámbar y la palabra completa.
12. Un partido finalizado muestra `FIN` en la sub-línea y **no** lleva franja de estado.
13. Con `prefers-reduced-motion` el punto de en vivo **no pulsa**.
14. Skeleton: 5 filas, **sin** caja de escudo, sin violeta; el encabezado no cambia de alto al llegar el dato.
15. Error: tarjeta roja que reemplaza la lista, con **Reintentar**; al tocarlo aparece el skeleton.
16. **Con la cuota diaria de API-Football agotada, la pantalla se ve exactamente igual** que con la cuota disponible: ningún aviso, ninguna banda, ningún badge, nada en ámbar, ningún texto de "datos desactualizados" (RF-006).
17. Con la pantalla en **escala de grises**, cada estado sigue siendo identificable (palabra + forma).
18. Foco visible en flechas, `Mi equipo`, `Ajustes`, encabezado de grupo y los dos nombres de cada fila, en los dos modos.
19. A 320px: sin scroll horizontal, nada truncado en la barra 1, ningún target por debajo de 44px.
20. **A ≥768px la fila es simétrica** (§ 8.4): el eje mide **96px medidos en computed styles**, no `auto`; con la ventana en 800, 1000 y 1400px el eje **no cambia de ancho**.
21. **A ≥768px, apoyando una regla vertical sobre la lista, todos los marcadores y todas las horas del eje quedan alineados** aunque las filas mezclen `19:30`, `1 – 0` y `10 – 10`.
22. **A ≥768px la franja de estado ocupa el ancho completo de la fila, centrada**, y `SUSPENDIDO · 54'` y `ENTRETIEMPO` **entran completos, sin truncar y sin envolver**.
23. **A ≥768px la hora nunca se pierde:** en un partido finalizado o en vivo aparece en la fila de estado (`19:30 · FIN`); en uno programado, en el eje.
24. Cruzando 768px en los dos sentidos con la misma lista en pantalla, **ningún dato aparece ni desaparece** — solo se reacomoda.

### 10.2 Competición

Drill-down desde el nombre de competición. Partidos de esa competición agrupados **por fecha** (§ 7.1).

| Elemento | Especificación | Por qué |
|----------|----------------|---------|
| Encabezado | 56px, `--color-surface`, borde inferior 1px, `padding: 0 --space-2`, `gap: --space-1`. Botón de volver (§ 6.3, `aria-label` "Volver") + título. **Queda fijo** (§ 9.2). | Sin wordmark y sin los accesos de Inicio: es una pantalla de profundidad (§ 9). |
| Título | Nombre **completo** de la competición, `--fs-xl` 22px / 700 / `--color-text-1`, una línea con elipsis, nombre completo en `title`. Sin tracking negativo (eso es solo del wordmark). | El nombre completo se usa acá; la forma corta es para el encabezado de grupo de Inicio y la meta-línea de Equipo (§ 7.3). |
| Encabezado de grupo | Fecha absoluta (`mié 15 abr`), mismo tratamiento tipográfico que en Inicio, **con `tabular-nums`** y **sin subrayado: no es link**. Sin banda tocable. | Es una etiqueta de posición, no un destino. La etiqueta relativa (`Hoy`) vive solo en Inicio (§ 6.2). |
| Sin encabezado de competición por grupo | — | Es el título de la pantalla; repetirlo en cada grupo es ruido (§ 7.1). |
| Filas | § 7.0, sin meta-línea. | La competición ya es el título; la fecha ya es el encabezado de grupo. |
| Apertura | Posicionada en el corte `PRÓXIMOS` (§ 7.6). | Lo que viene es lo que se busca. |

**Contención:** idéntica a Inicio; el título cede ancho antes que el botón de volver, que es `flex-shrink: 0`.

#### Checklist — Competición

1. El encabezado de fecha **no** es clickeable ni tiene subrayado; los dos nombres de equipo **sí**.
2. La fecha es siempre absoluta — nunca `Hoy` — y está en números tabulares.
3. La lista abre en el corte `PRÓXIMOS`, no arriba de todo, y ese corte aparece **una sola vez**.
4. La banda `PRÓXIMOS` es neutra: `--color-surface-2` + `--color-text-2`, sin violeta.
5. El encabezado queda fijo al scrollear y el título sigue visible con la lista abajo.
6. Anchos y posición de las columnas de hora y marcador, idénticos a Inicio.
7. Un título largo trunca con elipsis **sin** empujar ni achicar el botón de volver, y su texto completo está en `title`.
8. En ≥768px la fila pasa a la **forma simétrica** de § 8.4: eje central de 96px, estado en fila propia de ancho completo, la lista centrada y topada a 720px.
9. Cruzando el umbral de 768px en los dos sentidos **no se pierde ningún dato**: la hora que en compacta está a la izquierda aparece en el eje (si no hay marcador) o en la fila de estado (si lo hay).

### 10.3 Equipo

Drill-down desde un nombre de equipo. Partidos de ese equipo en **lista plana cronológica ascendente** (§ 7.1).

| Elemento | Especificación | Por qué |
|----------|----------------|---------|
| Encabezado | Igual que Competición, con el nombre del equipo como título. **Sin escudo** mientras rija la variante 1 (§ 7.4); si se adopta la variante 2, escudo de 24px antes del título. | Consistencia de drill-down (§ 9). |
| Sin agrupar | Lista plana, sin encabezados de grupo. | Un equipo juega una o dos veces por semana: agrupar por fecha daría una ristra de encabezados con una fila abajo (§ 7.1). |
| **Meta-línea de la fila** | **En compacta:** arriba de los nombres, dentro de la columna 2. **En amplia:** fila 1 del grid, `grid-column: 1 / -1`, **centrada sobre el eje** (§ 8.4) — no adentro de la columna central, donde no entraría. `--fs-xs` 12px, una línea, `nowrap` + elipsis. Fecha `dom 19/04` en 500 / `--color-text-2` / **`tabular-nums`**, **no es link**; separador ` · `; forma corta de la competición (§ 7.3) en 600 / mayúsculas / tracking `0.04em` / `--color-text-2`, **sí es link** con subrayado (§ 3.3). | Sin encabezado de grupo, la fila necesita traer su propio contexto — y es justamente el propósito de la pantalla: no perder ni la fecha ni la competición. |
| Alto de fila | Tres líneas (meta + dos equipos), ~80px. | Son ~8 partidos por pantalla: el costo de densidad es nulo frente al contexto que se gana. |
| Marcador | **Solo en compacta:** baja `--space-4` (16px) para alinearse con la línea del equipo local (§ 7.0). En amplia no se desplaza nada: la meta-línea es una fila propia del grid (§ 8.4). | La meta-línea no debe despegar el marcador de su equipo. |
| Corte `PRÓXIMOS` | § 7.6; la lista abre ahí. | |
| **Equipo favorito** | Se ve **exactamente igual que cualquier otro equipo**: mismo tratamiento, sin resaltado, sin estrella, sin badge, en su propia pantalla y en las filas de las otras. | No existe la acción de marcar ni desmarcar favorito (RF-005: viene fijado fuera de la UI). Un indicador de estado que no se puede cambiar es afordancia falsa: invita a un tap que no hace nada. |

**Contención:** la meta-línea es lo primero que trunca; nunca envuelve (si envolviera, el marcador se desalinea de su equipo).

#### Checklist — Equipo

1. En cada fila: la fecha **no** es link, la competición **sí**, y los dos nombres de equipo también.
2. La fecha de la meta-línea está en números tabulares y usa la forma corta de competición (`PRIMERA A`, no `Primera A — Argentina`).
3. La meta-línea nunca pasa a dos líneas, ni con el nombre de competición más largo.
4. El marcador queda a la altura de la línea del equipo local, no de la meta-línea.
5. Orden cronológico ascendente; la lista abre en el corte `PRÓXIMOS`.
6. El equipo favorito **no** tiene ningún resaltado en su propia pantalla ni en las filas de Inicio o Competición.
7. No existe ningún control de marcar/desmarcar favorito en ninguna parte de la app.
8. Anchos y posición de las columnas de hora y marcador, idénticos a Inicio y Competición.
9. El encabezado no lleva escudo (variante 1 vigente).
10. En ≥768px la meta-línea es una **fila propia centrada** sobre el eje (no va dentro del eje de 96px) y **no trunca** ni con el nombre de competición más largo; el marcador **no** lleva el desplazamiento de 16px.

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

1. **Violeta:** aparece **solo** en el punto del wordmark, el anillo de foco, el subrayado de link en hover/focus/active, el segmento elegido del control de tema y el glifo de un control presionado. En **ningún** marcador, hora, minuto, nombre de equipo, nombre de competición, fecha ni badge de estado.
2. **Verde** solo en vivo/entretiempo. **Rojo** solo en error de carga de la app. **Ámbar** solo en partido postergado, suspendido o cancelado — y **en ningún otro lado**: no hay estado del sistema que use ámbar en la v1.
3. **La cuota agotada no tiene superficie visual en ninguna pantalla** (RF-006): con la cuota diaria agotada la app se ve **idéntica** a con la cuota disponible. Ningún aviso, banda, badge, tarjeta, color, icono ni copy la delata, ni marca de "dato viejo".
4. **Ningún resultado coloreado:** la diferencia ganador/perdedor es solo peso tipográfico.
5. **Todo dato numérico tabular:** horas, marcadores, minutos, fechas numéricas.
6. **Nada solo por color:** todo estado con color lleva además palabra **y** forma. Se verifica con la pantalla en escala de grises.
7. **Escudos** (cuando existan): tal cual la fuente, sin recolorear, sin filtro por modo, sin borde ni recorte circular.
8. **Cinco estados** declarados en todo elemento interactivo, en claro y en oscuro. **`outline: none` no aparece en ninguna parte del código.**
9. **Tipografía:** solo 12 / 14 / 16 / 18 / 22px. Ningún tamaño intermedio. Una sola familia.
10. **Espaciado:** solo 4 / 8 / 12 / 16 / 24 / 32px. Las únicas excepciones declaradas son los targets de 44px, los iconos de 16/18/20/24px y los **anchos de ranura numérica**: 48 y 24px en compacta (§ 7.0), 96px del eje en amplia (§ 8.4). Los tres se derivan del contenido máximo con `tabular-nums`, no se eligen a ojo, y ninguno es `auto`.
11. **Los cuatro invariantes de contención** (§ 8.2) se cumplen entre 320px y arriba, en las dos disposiciones y en los dos modos.

## 11. Decisiones abiertas

Anotadas como pendientes, no como decisiones. Se distingue lo que es **mío** (composición, lo resuelvo yo) de lo que **no lo es** (dato, producto o técnica: lo resuelve el usuario o el analista y yo me adapto).

**Pendientes de dato o de producto — no las puede cerrar `design`:**

- **Escudos: si la fuente los provee.** Hoy rige la variante 1, sin escudo (§ 7.4). El relevamiento de `docs/data-model.md` tiene que confirmar si hay logos, en qué campo, en qué tamaños, y si rinden a 18px. La variante 2 ya está especificada al detalle: adoptarla es mecánico.
- **Cómo llega el desambiguador en el nombre del equipo** (§ 7.5). La regla del sufijo protegido asume paréntesis. Si API-Football devuelve `Gimnasia L.P.` en vez de `Gimnasia (LP)`, la regla no se dispara y hay que volver a decidir.
- **Estados reales de partido:** § 7.2 es provisional hasta el relevamiento de API-Football; falta confirmar alargue, penales y estados raros (interrumpido, abandonado, walkover).
- **Copy de error** (§ 6) y el copy de Vacío de Competición y Equipo: propuestos por diseño, **pendientes de OK de producto**.
- **Límite del rango navegable de días:** si existe, es decisión funcional. Hoy no hay ninguno, y por eso las flechas no tienen estado deshabilitado (§ 6.2, § 6.3).
- **Volver a hoy desde un día lejano:** hoy cuesta un tap por día. No hay control de retorno porque no está en RF-002 ni en `docs/screens.md`, y agregarlo sería alcance inventado. Es una fricción real: queda anotada como observación de producto, no como pendiente de diseño.
- **Zona horaria de visualización** (`docs/requirements.md`): si los horarios pasan a mostrar la zona, el patrón de fila necesita lugar para esa etiqueta. Es decisión funcional, no visual.

**Cerradas desde la versión anterior de este documento** (dejadas acá como registro, no como pendientes): forma del navegador de día (§ 6.2), iconografía y composición de los encabezados (§ 10), política de encabezado fijo (§ 9.2), tratamiento del wordmark (§ 10.1), variante de fila con escudos (§ 7.4), truncado con desambiguador (§ 7.5) y, confirmada por el usuario, la **fila simétrica en disposición amplia** (§ 8.4, con su eje de 96px, la línea de estado de ancho completo y la meta-línea centrada).

**Cerradas por cambio de alcance — el estado "cuota agotada" ya no existe en el front.** El usuario decidió que el agotamiento de cuota sea **transparente**, y el analista reescribió RF-006 en consecuencia. Con eso caen dos pendientes que este doc tenía abiertos y que **no hay que volver a plantear**: el *copy de cuota agotada* y *a qué hora y en qué zona horaria se renueva la cuota*. Ninguno de los dos aplica: no hay nada que escribir ni ninguna hora que mostrar, porque no hay mensaje. También desaparece el segundo disparador del ámbar (§ 3.1) y el cuarto estado de pantalla (§ 6).

**Sigue sin existir:** un **asset** de marca (favicon, icono de app). El wordmark es tipográfico y se resuelve con Inter Variable, sin archivo; un icono de app no es entregable de la v1 (§ 1: la v1 es web).
