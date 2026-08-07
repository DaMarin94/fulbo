# Diseño — guía viva del lenguaje visual

Guía **curada y vigente** del lenguaje visual de Fulbo. Es el destino canónico de color, tipografía, espaciado, jerarquía, estados visuales y contención responsive. Único escriba: el agente `design`.

Lo funcional (qué muestra cada pantalla, qué acciones expone) vive en `docs/screens.md` y `docs/requirements.md`; la implementación, en `docs/frontend.md`. **Ante conflicto sobre algo visual, manda este doc.**

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
- **Todo dato numérico usa números tabulares** (`tabular-nums`): horarios, marcadores, minuto de juego, fechas numéricas, contador de cuota.
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
| **Ámbar** (`--color-warn`) | Advertencia / dato anómalo o degradado | Partido postergado, suspendido o cancelado. Cuota de API-Football agotada o cerca del límite (RNF-001). Dato servido de caché vieja. |

Decisiones que se desprenden y que son parte de la regla:

- **Un partido cancelado no es un error de la app** → va en ámbar, no en rojo. El rojo queda para "algo falló y podés reintentar".
- **El marcador nunca se colorea.** Verde en un marcador significaría "este resultado es bueno", cosa que depende de a quién le hinchás. Se resuelve con peso: **el ganador va en 700, el perdedor en 400 y `--color-text-2`**. Empate: ambos en 500.
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

**Dónde SÍ:** wordmark del header, anillo de foco, subrayado activo de un link y **el indicador de selección de un control de opciones excluyentes** (hoy, el segmento elegido del control de tema, § 6.1). Nada más. Si el navegador de días o cualquier otro control nuevo quiere violeta, se justifica contra esta lista — pero **la fecha en sí es un dato y nunca se tiñe**, sea cual sea la forma final que tome el navegador (§ 6.2, abierto).

**Por qué la selección sí puede llevar marca** (justificación del cuarto uso, agregado al cerrar RF-007): "cuál de N opciones excluyentes elegí" **no es un dato deportivo ni un estado del sistema** —no dice ni "en vivo", ni "ok", ni "error"—, es afordancia pura: le marca al usuario dónde está parado dentro de un control. Y nunca viaja solo: el elemento seleccionado suma peso 600 y `--color-text-1` frente a 500 y `--color-text-2` de los no seleccionados, más la semántica ARIA — cumple "nada solo por color" sin apoyarse en el violeta.

### 3.3 Afordancia sin color

Fulbo tiene un problema propio: **lo único clickeable son datos** (nombre de equipo, nombre de competición), y la regla dura prohíbe teñir datos. Además es mobile-first: en touch **no hay hover**, así que la afordancia tiene que verse en reposo.

**Regla: la afordancia es el subrayado, no el color.**

- Link en reposo: texto en `--color-text-1`, peso 500, **subrayado 1px en `currentColor` al 30% de opacidad**, `text-underline-offset: 3px`.
- Hover / focus / active: el subrayado pasa a **2px `--color-brand`**; el texto NO cambia de color.
- La fila entera de un partido **no** es clickeable: solo lo son los nombres. Una fila enteramente clickeable pediría destino único y acá hay tres (equipo local, visitante, competición). Se evita la ambigüedad de destino.

Ventaja lateral: el subrayado es una señal no cromática, con lo que cumple sola la regla de "nada solo por color".

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
- Contador de cuota de API-Football, si alguna vez se muestra (RNF-001).

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

**Truncado:** los nombres de equipo van a **una línea con elipsis** (`min-width: 0` + `text-overflow: ellipsis`), con el nombre completo en `title`. Un nombre largo nunca hace crecer la fila ni empuja al marcador fuera de pantalla (invariante 1 de § 8). Los nombres de competición pueden abreviarse a su forma corta en disposición compacta.

## 5. Espaciado, radios, iconografía

- **Escala de espaciado, base 4px:** `--space-1` 4 · `--space-2` 8 · `--space-3` 12 · `--space-4` 16 · `--space-5` 24 · `--space-6` 32. No se usan valores fuera de la escala.
- **Padding lateral de pantalla:** 16px en compacto, 24px en amplio.
- **Radios:** `--radius-sm` 6px (píldoras, badges) · `--radius-md` 10px (tarjetas y grupos) · `--radius-full` (punto de "en vivo", avatares). Nada con radio 0 salvo separadores.
- **Alto de fila de partido:** mínimo 56px. Da aire suficiente para leer dos equipos y respeta el target tocable.
- **Iconos:** trazo (stroke) de 1.5–2px, tamaño 16/20/24, siempre `currentColor`. Nunca un icono como único portador de significado sin `aria-label`. **Qué elementos necesitan icono y cuál usar en cada caso es composición** — se decide al diseñar la pantalla, no acá.

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

**Estados de pantalla** (los cuatro de `docs/screens.md`, con su forma visual):

| Estado | Forma visual |
|--------|--------------|
| **Cargando** | Skeleton, no spinner: 5 filas de partido en `--color-surface-2` con las mismas alturas que la fila real, para que no salte el layout al llegar el dato. El skeleton no usa la marca. |
| **Vacío** | Bloque centrado: icono neutro 24px en `--color-text-3` + una línea en `--fs-base` / `--color-text-2` ("No hay partidos este día"). Sin ilustración, sin botón. |
| **Error** | Tarjeta en `--color-surface` con borde `--color-danger`, icono y texto en `--color-danger`, y botón **Reintentar** debajo. El rojo va acompañado siempre del icono y del texto. |
| **Cuota agotada** (RF-006) | Misma tarjeta pero en **ámbar** (`--color-warn`), con mensaje específico de cuota diaria agotada y, si aplica, cuándo se renueva. **Es advertencia, no error**: la app no falló, se acabó el presupuesto de la API. Diferenciarla por color *y* por texto es justamente lo que RF-006 pide. |

**Partido en vivo:** punto `--radius-full` 8px en `--color-live` + minuto en `--color-live` + etiqueta "EN VIVO" en `--fs-xs`. Tres señales, ninguna solo cromática. El punto puede pulsar con una animación suave de opacidad, respetando `prefers-reduced-motion`.

### 6.1 Control de tema (RF-007)

Es el primer control de entrada del producto. Se especifica entero acá porque marca el patrón para todo control de opciones excluyentes que venga después.

#### Dónde vive — **solo en Configuración** (confirmado)

El analista infirió que el control vive en Configuración (`docs/screens.md`). **Se confirma, y se cierra que es su único lugar**: no se duplica en el encabezado de Inicio ni en ninguna otra pantalla.

1. **Es una preferencia de frecuencia casi nula.** Con **Automático** como default (§ 3.6), el usuario que está cómodo con su tema de sistema **no toca el control jamás**; el que no, lo toca una vez en la vida de la instalación. Un control de un solo uso no se gana un lugar permanente en la pantalla que se mira todos los días.
2. **El encabezado de Inicio es territorio escaso.** Ya carga wordmark, acceso al favorito, entrada a Configuración y navegación de días — el inventario está en § 9. A 320px, meter ahí un control más le come ancho a lo que sí es de uso constante — riesgo directo sobre el invariante 3 de § 8 (ninguna acción inalcanzable). Se prioriza lo que se usa siempre por sobre lo que se usa una vez.
3. **Un solo lugar, una sola verdad.** Duplicar el control en dos pantallas obliga a mantener dos formas visuales del mismo estado y a que el usuario se pregunte si son el mismo ajuste. Consistencia (§ Lente UX) por sobre atajo.
4. **El costo es un tap.** Desde Inicio se llega a Configuración en un paso. Aceptable de sobra para algo que se hace una vez; inaceptable sería si fuera de uso diario, y no lo es.

*Nota de alcance:* el **control concreto de Inicio que abre Configuración** no es parte de RF-007 — que exista es parte del inventario de § 9; qué forma e icono toma es composición, se decide al diseñar la pantalla.

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

**Restricción heredada para la pantalla de Configuración** (cuando se especifique): en compacto no puede robarle al control más de **32px de padding lateral combinado** por encima del padding de pantalla. Si el contenedor pidiera más, la palabra `Oscuro` empieza a rozar el borde y el spec deja de cumplirse.

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

### 6.2 Navegador de día (Inicio) — pregunta abierta

RF-002 pide moverse día a día desde Inicio. **La forma concreta no está cerrada** — flechas con fecha en el medio, tira/carrusel de días, u otra — es una decisión de composición que le corresponde a quien diseñe la pantalla, con su propia justificación.

Como insumo, no como decisión: hay dos referencias anotadas en `references/` (365Scores usa una tira de días; TenisTemple usa flechas + fecha), con nota de qué tomar de cada una y qué no (el resto de las reglas duras de este documento manda igual).

**Restricciones que aplican sin importar la forma que se elija:**

- La fecha mostrada es un dato: **nunca lleva color de marca ni color semántico**, y usa `tabular-nums`.
- Targets táctiles ≥44×44 (§ 6) y sin generar scroll horizontal propio (invariante 1, § 8.2).
- Zona horaria del dispositivo (RN-005).
- Si existe un límite de rango navegable hacia atrás o adelante, es una **decisión funcional pendiente**, no visual — hoy no hay ninguno documentado.

## 7. Patrón: fila de partido

Es la unidad que se repite en las tres pantallas; se define una vez y se reusa igual en todas (consistencia). El spec fino de cada pantalla se emite cuando esa pantalla se construya.

- **Agrupación:** las filas nunca van mezcladas sin encabezado; qué agrupa cada pantalla se define en § 7.1. El encabezado de grupo va en `--fs-xs`, mayúsculas, `--color-text-2`, fondo `--color-surface-2`.
- **Estructura de la fila, izquierda a derecha:** columna de estado/hora de ancho fijo (hora en programados, minuto o "FIN" en el resto) · bloque de equipos (local arriba, visitante abajo, una línea cada uno) · marcador alineado a la derecha, ancho fijo, tabular.
- **Ancho fijo en las columnas numéricas** (hora y marcador): con `tabular-nums` la columna se alinea entre filas y el ojo baja en línea recta.
- **Sin resultado todavía** → la columna del marcador queda vacía, no muestra `-` ni `0-0`. Un `0 - 0` en un partido que no empezó es un dato falso.
- **Separador** de 1px `--color-border` entre filas; no hay bandas alternadas (ruido innecesario a esta densidad).

### 7.1 Qué agrupa cada pantalla

Las tres pantallas muestran la misma lista de partidos, pero **lo que el usuario ya sabe al entrar es distinto en cada una**, y el eje de agrupación es exactamente lo que *no* sabe. Repetir en cada fila un dato que es el título de la pantalla es ruido. Cómo se ve cada fila en cada caso (qué agrega, qué omite) es composición y se resuelve al diseñar la pantalla — esto fija solo el eje de agrupación:

| Pantalla | Agrupa por | Encabezado de grupo |
|----------|-----------|---------------------|
| **Inicio** | **Competición** (máximo 3 grupos) | Nombre de la competición, y **es el link** a la pantalla Competición. |
| **Competición** | **Fecha** (día) | Fecha, no clickeable. Sin encabezado de competición: es el título de la pantalla. |
| **Equipo** | **Nada: lista plana**, cronológica | — |

**Por qué Equipo no agrupa:** un equipo juega una o dos veces por semana, así que agrupar por fecha daría una ristra de encabezados con una sola fila abajo — más cromo que dato. Y agrupar por competición rompería el orden cronológico, que es justamente lo que el usuario viene a ver ("¿cuándo juega?").

**Ancla del orden (Competición y Equipo):** las listas son cronológicas ascendentes y se abren posicionadas en el **próximo partido**. Visualmente eso exige que se vea dónde está el corte entre lo jugado y lo que viene; la forma de ese corte se define al construir cada pantalla.

### 7.2 Vocabulario de estados de partido — **provisional**

**Provisional hasta el relevamiento real de API-Football** (pendiente en `docs/data-model.md`): la app no inventa estados, muestra los que la API devuelve (RN-001). Esta tabla fija **cómo se dice y cómo se ve** cada estado que razonablemente vamos a recibir; cuando el relevamiento cierre, se ajustan las filas, no las reglas.

| Estado | Etiqueta (canónica, visible) | Forma corta | Marcador | Categoría de color (§ 3.1) |
|--------|------------------------------|-------------|----------|------------------------------|
| Programado | — (no lleva etiqueta; la hora es el estado) | — | Vacío | Neutro. |
| En vivo | `EN VIVO` | — | Presente (`0 - 0` es válido) | Verde. |
| Entretiempo | `ENTRETIEMPO` | `ENTR.` | Presente | Verde. |
| Finalizado | `FINALIZADO` | `FIN` | Presente | Neutro — el ganador se distingue por peso (§ 3.1), nunca por color. |
| Postergado | `POSTERGADO` | `POST.` | Vacío | Ámbar. |
| Suspendido | `SUSPENDIDO` | `SUSP.` | **Puede haber parcial** — se muestra tal cual | Ámbar. |
| Cancelado | `CANCELADO` | `CANC.` | Vacío | Ámbar. Nunca rojo: no falló la app (§ 3.1). |
| A confirmar | `A CONFIRMAR` | `A CONF.` | Vacío | **Neutro**, no ámbar: el partido está bien, lo que falta es la hora. |

- **Prohibida la abreviatura `ET`**: colisiona entre *entretiempo* y *tiempo extra*, y con Libertadores/Sudamericana el alargue existe. Entretiempo abrevia `ENTR.`; si el relevamiento confirma alargue y penales, entran como `T. EXTRA` / `T.E.` y `PENALES` / `PEN.`, ambos con tratamiento de "en vivo".
- **La etiqueta canónica aparece completa al menos una vez en la fila.** La forma corta es solo para cuando el espacio es fijo y angosto; dónde ubicar cada una (qué va en qué columna, qué icono si corresponde) es composición.
- Ningún estado se comunica solo por color: siempre hay palabra, y los ámbar y rojo lo refuerzan además con forma o icono (cuál, es composición).

### 7.3 Nombres de competición — forma corta

El nombre completo se usa en el título de la pantalla Competición; la **forma corta** es para el encabezado de grupo en Inicio y para la meta-línea de la fila extendida en Equipo.

| Nombre completo | Forma corta |
|-----------------|-------------|
| Primera A — Argentina | `PRIMERA A` |
| Copa Libertadores | `LIBERTADORES` |
| Copa Sudamericana | `SUDAMERICANA` |

**Es una tabla, no un algoritmo:** acortar por truncado automático produce basura (`Copa Sudameric…`). Son tres competiciones fijas en la v1 (`docs/requirements.md`); dónde vive ese mapeo y cómo se concilia con RN-001 es decisión funcional/técnica, no visual.

### 7.4 Escudos — dos variantes de la fila

Que API-Football provea logos está **pendiente de relevamiento**, así que la fila se especifica en dos variantes y la app tiene que verse bien en las dos. Tamaño exacto, gap y tratamiento del placeholder son composición; esto fija los requisitos duros que cualquier propuesta tiene que cumplir:

- **Variante 1 — sin escudo (canónica).** Es la que se implementa mientras el dato no esté confirmado. La fila lee perfecto sin escudos: el nombre alcanza.
- **Variante 2 — con escudo**, a la izquierda del nombre. **Sin recolorear, sin filtro por modo, sin borde, sin fondo, sin recorte circular** (§ 2) — se muestra tal cual lo provee la fuente.

**Requisito duro que une las dos variantes: la hora y el marcador conservan el mismo ancho fijo y la misma posición en ambas.** El escudo le come ancho **solo al bloque de equipos** (que ya trunca con elipsis). Si al sumar escudos se moviera la columna de horarios, se rompería lo único que hace escaneable la lista: la alineación vertical de los números.

**Escudo faltante (o que no carga):** la caja **nunca se colapsa** —si se colapsara, los nombres de dos filas contiguas quedarían desalineados—. Necesita un placeholder del mismo tamaño que el escudo real, neutro (sin color de marca ni semántico). El espacio se reserva desde el primer pintado: la llegada del escudo no debe correr nada.

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
- **Amplia (≥768px):** el mismo layout, centrado y limitado a 720px con 24px de padding. **No se agregan columnas ni se cambia el patrón de fila**: la lista sigue siendo una lista. Ensanchar la fila más allá de 720px alarga el recorrido del ojo entre la hora y el marcador y hace más lento leerla, que es exactamente lo contrario del objetivo.
- **Todo spec de feature declara su comportamiento compacto**, aunque sea "no cambia". Un spec sin sección de contención está incompleto.

## 9. Encabezado por pantalla — inventario

El encabezado es el único cromo persistente de la app: no hay tabs ni sidebar (§ 8.1). Esto fija **qué elementos existen en cada pantalla y cuáles no** — la forma, el tamaño, el icono concreto y la disposición son composición y se deciden al diseñar cada pantalla.

**Regla general:** el encabezado no debería cambiar de altura entre estados (cargando, vacío, error, cuota) para que la lista no salte bajo el dedo del usuario al llegar el dato.

**Inicio:** wordmark de Fulbo · navegación día anterior/siguiente (RF-002, forma abierta en § 6.2) · acceso a la pantalla Equipo del equipo favorito predefinido (RF-005 — no es "elegir", es solo navegación a un destino fijo; no existe estado marcado/desmarcado porque no hay selección) · acceso a Configuración. Nada más: sin buscador, filtros, tabs, ni controles fuera de esta lista.

**Competición:** volver atrás · nombre de la competición (con su escudo si la variante con escudo aplica, § 7.4). Nada más.

**Equipo:** volver atrás · nombre del equipo (ídem escudo). Nada más — **incluido cuando la pantalla muestra al equipo favorito**: no hay nada que marcar ahí.

**Configuración:** volver atrás · título. El cuerpo es solo el control de tema (§ 6.1) y su línea de ayuda — sin botones de guardar/cancelar (el cambio se aplica al instante), sin sección de versión o acerca de.

**Consistencia entre Competición, Equipo y Configuración:** las tres son pantallas de drill-down con "volver atrás" — comparten esa estructura básica de encabezado; el wordmark y los accesos de Inicio no se duplican en ninguna de las tres.

## 10. Decisiones abiertas

Anotadas como pendientes, no como decisiones. La mayoría son composición: se resuelven al diseñar cada pantalla, no acá.

- **Forma del navegador de día** (§ 6.2): flechas, tira de días u otra — abierto, con referencias anotadas en `references/`.
- **Set de iconos y forma de cada elemento del encabezado** (§ 9): qué icono usar para cada acceso, tamaño, disposición y posición exacta.
- **Zona horaria de visualización** (`docs/requirements.md`): si los horarios pasan a mostrar la zona, el patrón de fila necesita lugar para esa etiqueta. Es decisión funcional, no visual.
- **Escudos de equipo:** cuál de las dos variantes de fila rige (§ 7.4) depende del relevamiento pendiente en `docs/data-model.md`. El tamaño y tratamiento exacto del escudo y su placeholder son composición.
- **Estados reales de partido:** § 7.2 es provisional hasta el relevamiento de API-Football; falta confirmar alargue, penales y estados raros (interrumpido, abandonado, walkover).
- **Encabezado fijo (sticky):** si la barra de marca, el navegador de día y/o los encabezados de grupo quedan pegados al hacer scroll. Es un intercambio real entre densidad (§ 1) y acceso permanente a la navegación de día (RF-002).
- **Límite del rango navegable de días:** si existe, es una decisión funcional pendiente (afecta si hace falta un estado deshabilitado en § 6.2).
- **Wordmark de Fulbo:** no existe todavía ningún tratamiento tipográfico ni asset.
