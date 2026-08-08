# Fulbo — spec visual de las 4 pantallas

Especificación de implementación para las cuatro pantallas de la v1: **Inicio, Competición, Equipo y Configuración**.

**Qué es este documento.** Material **crudo de origen** en el sentido de `.claude/agents/design.md` § Fuente de verdad visual: es el handoff del que se derivan las decisiones, no la guía viva. Ante conflicto con `docs/design.md`, **prevalece `docs/design.md`**. No reemplaza ni modifica ese doc — su único escriba sigue siendo el agente `design`.

**Para quién.** `design` lo audita y lo cura hacia `docs/design.md`; `frontend` implementa desde acá una vez que `design` lo avaló. `frontend` **no decide ningún valor visual por su cuenta** (`CLAUDE.md` § Decisiones de diseño): si un elemento no está en este spec, se pregunta.

**Referencia visual.** `maqueta.html` — un archivo autocontenido que abre offline, con las cuatro pantallas en modo claro y oscuro, los 9 estados de fila, los 4 estados de pantalla y las variantes de cada decisión abierta. Los escudos son placeholders rayados (§ 9).

**Sin aprobar todavía.** Las decisiones de § 3.1, § 3.4, § 4.1 y § 4.5 bajan como **valor único** para que `frontend` no improvise, pero llevan la marca `PENDIENTE DE APROBACIÓN`. Ver § 9.

---

## 1. Tokens

En `tokens.css`, listo para pegar. Tailwind v4 (`@theme`). Los nombres son los de `docs/design.md` § 3.4 / § 4.3 / § 5; el modo oscuro se activa con `data-theme="dark"` en `<html>`.

Nada de lo que sigue usa un valor fuera de esas escalas. Tres excepciones declaradas, todas justificadas:

| Excepción | Valor | Por qué |
|---|---|---|
| Targets tocables | 44px (flechas, segmentos de tema), 46px (chip de día) | § 6.2 exige mínimo 44×44. El mínimo de accesibilidad manda sobre la escala de 4px. |
| Escudo | 18px en fila, 24px en título/header | Tamaño de ícono alineado a la altura de línea de 24px, no un paso de espaciado. |
| Ancho de columnas de la fila | 48px (hora), 24px (marcador) | Derivados del contenido máximo con `tabular-nums`; ambos son múltiplos de 4. |

---

## 2. El patrón de fila de partido

Un solo componente sirve a las tres pantallas de lista. **Se escribe una vez.** Escribirlo por pantalla garantiza que se desincronicen.

### 2.1 Datos que muestra

Local, visitante, hora programada, marcador (si existe), estado, y —solo en Equipo— fecha y competición.

### 2.2 Disposición compacta (320–767px)

Grid de 3 columnas: `48px | 1fr | 24px`, `gap: 12px`, `padding: 12px`, `min-height: 56px`, `align-items: start`.

| Elemento | Token / valor | Por qué |
|---|---|---|
| Hora programada | `--fs-sm` 14px / 400 / `--color-text-2` / tabular | Es el dato de orientación, no el protagonista. Siempre visible, incluso en un partido terminado: es la hora a la que se jugó. |
| Sub-línea de la hora | `--fs-xs` 12px / 600 / `FIN` en `--color-text-3`, minuto en `--color-live` + tabular | Un solo lugar para "en qué momento está". El verde acá cumple § 3.1. |
| Nombre de equipo | `--fs-base` 16px / 500 / `--color-text-1`, link § 3.3 | El dato principal de la fila. Los dos son links; la fila entera **no** lo es (§ 3.3: tres destinos, ninguno único). |
| Marcador | `--fs-lg` 18px / tabular, apilado local-arriba | Alineado línea a línea con cada equipo, para no obligar a mapear "el primero es el de arriba". |
| Peso del marcador | finalizado: ganador 700, perdedor 400 + `--color-text-2`; empate ambos 500; **en curso ambos 600** | § 3.1: el resultado nunca se colorea. En vivo no hay ganador que distinguir todavía. |
| Franja de estado | `--fs-xs` 12px / 600 / tracking `.05em` / mayúsculas, `gap: 8px` | Debajo de los nombres, alineada con ellos: no le roba ancho a hora ni marcador. |
| Escudo | 18px, `gap: 8px`, antes del nombre | Tal cual lo provee la fuente: sin recolorear, sin filtro por modo, sin borde ni recorte (§ regla dura). |
| Escudo faltante | caja de 18px, `--color-surface-2`, borde 1px `--color-border`, `--radius` 3px | La caja **nunca se colapsa**: si el escudo llega tarde no corre nada. |

**Invariante de columnas.** Las dos columnas numéricas son de ancho fijo y **no se mueven nunca** — ni con escudo, ni con nombre largo, ni entre pantallas. El escudo (18 + 8 = 26px) lo absorbe el bloque de nombres, que ya truncaba. Verificable con una regla vertical sobre dos pantallas distintas.

### 2.3 Disposición amplia (≥768px) — fila simétrica

**Decidida** (pedido explícito del usuario, ronda de chat). Cambia la forma de la fila, no sus datos:

```
        Central Córdoba (SdE) 🛡   1 – 0   🛡 Gimnasia y Esgrima (LP)
                                  FIN
```

Grid de 3 columnas `1fr | auto | 1fr`, `gap: 0 16px`, `padding: 12px 16px`, `align-items: center`, 3 filas implícitas (meta / nombres+marcador / estado).

| Elemento | Valor | Por qué |
|---|---|---|
| Local | columna 1, alineado a la derecha, escudo **hacia adentro** (`row-reverse`) | Simetría de espejo alrededor del marcador. |
| Visitante | columna 3, alineado a la izquierda, escudo hacia adentro | Ídem. |
| Marcador | columna 2 centrado, `--fs-xl` 22px, guion `–` en `--fs-lg` 18px / `--color-text-3`, `gap: 8px` | Es el eje de la lectura; sube un paso porque ahora es el centro óptico. |
| Partido sin marcador | el centro muestra **la hora**, `--fs-sm` 14px / `--color-text-1` | El eje central siempre dice el estado numérico del partido: sin huecos. La columna de hora al borde izquierdo **desaparece**. |
| Fecha + competición (Equipo) | fila 1, centrada sobre el marcador | Nada apoyado en los bordes. |
| Estado | fila 3, centrada, ancho completo | Ídem. En vivo absorbe el minuto (`EN VIVO · 68'`) en vez de repetirlo al costado. |
| Contenido de pantalla | máx. 720px, centrado, padding lateral 24px | Ensanchar más alarga el recorrido del ojo entre un equipo y el otro. |

**No se hace en amplio:** ni una columna extra, ni dos listas lado a lado, ni escudos más grandes, ni filas más altas.

### 2.4 Vocabulario de estados

Etiqueta canónica **completa**, siempre. La única forma corta admitida es `FIN`, y solo en la sub-línea de la hora.

| Estado | Franja | Marcador | Forma |
|---|---|---|---|
| Programado | — | vacío (ni `0-0` ni `-`) | — |
| En vivo | `EN VIVO` + minuto en amplio | ambos 600 | círculo `--color-live`, pulsa |
| Entretiempo | `ENTRETIEMPO` | ambos 600 | círculo `--color-live`, pulsa |
| Finalizado | — (`FIN` en la sub-línea) | ganador 700 / perdedor 400 | — |
| Postergado | `POSTERGADO` | vacío | diamante `--color-warn` |
| Suspendido | `SUSPENDIDO · 54'` | parcial, tal cual la fuente | diamante `--color-warn` |
| Cancelado | `CANCELADO` | vacío | diamante `--color-warn` |
| A confirmar | `A CONFIRMAR` | vacío; hora `—` en `--color-text-3` | — sin ícono |

**Círculo para verde, diamante para ámbar** (§ regla dura "nada solo por color"): en escala de grises el estado anómalo se distingue del en vivo por forma **y** por palabra, no solo por tono.

`ENTR.` / `POST.` / `SUSP.` / `CANC.` / `A CONF.` quedan como reserva para un contexto más apretado que 320px. **`ET` no se usa.**

### 2.5 Corte entre jugado y por jugar

Banda `--color-surface-2`, borde arriba y abajo 1px `--color-border`, `padding: 4px 12px`, palabra `PRÓXIMOS` en `--fs-xs` 12px / 600 / tracking `.09em` / `--color-text-2`, y una línea de 1px que corre hasta el borde. Las listas de Competición y Equipo **abren posicionadas ahí**.

Neutro a propósito: no es un estado del partido, es un marcador de posición en el tiempo. No lleva marca.

### 2.6 Nombres largos con desambiguador — PENDIENTE DE APROBACIÓN

Problema: `Central Córdoba (SdE)` truncado a una línea da `Central Córdo…` y pierde exactamente el dato que desambigua.

**Valor a implementar: paréntesis protegido.** El paréntesis es un hijo flex con `flex-shrink: 0` y `white-space: nowrap`; la base lleva `min-width: 0` + `text-overflow: ellipsis`. Resultado: `Central Córdo… (SdE)`.

- No crece la fila (la altura constante es el activo de un lector de listas).
- No toca el string de la fuente (RN-001: se muestra lo que la API devuelve).
- No necesita ninguna tabla curada nueva.

Descartadas, con su costo: **segunda línea** — cero pérdida de información, pero la altura de fila deja de ser constante (68px conviven con 100px), el marcador se despega de la línea del equipo y la densidad cae ~30%. **Sufijo sin paréntesis** — la lectura más limpia, pero se aparta del string de la fuente y exige una tabla curada por equipo.

Las tres están dibujadas en `maqueta.html`.

---

## 3. Inicio

Pantalla de entrada. Partidos del día elegido, agrupados por competición.

### 3.1 Header — PENDIENTE DE APROBACIÓN

Dos barras, `--color-surface`, borde inferior 1px.

**Barra 1** — alto 52px, `padding: 0 16px`, `gap: 16px`:

| Elemento | Valor | Por qué |
|---|---|---|
| Wordmark | `fulbo.` en `--fs-xl` 22px / 700 / tracking `-.035em`; palabra en `--color-text-1`, **punto en `--color-brand`** | La palabra no compite con el dato; la marca se concentra en un punto de 4px. Marca distintiva sin dibujar ícono (§ cero iconografía deportiva). |
| Acceso al favorito | `MI EQUIPO` en `--fs-xs` 12px / 600 / `--color-text-3` + **escudo de 24px**, en un renglón, `gap: 8px` | Destino fijo (Racing Club). El escudo es la identidad del equipo; el rótulo evita que se lea como un partido. |
| Ajustes | palabra `Ajustes`, link § 3.3, alto de línea 44px | Cero iconos inventados: los accesos son palabras con subrayado de afordancia. |

Descartadas para el wordmark: `Fulbo` 22px/700 en marca — el elemento de más peso del header, compite con la etiqueta del día. `FULBO` 14px con tracking `.18em` — la más discreta y la que peor escala a ícono de app.

**Barra 2** — el navegador de día (§ 3.2).

### 3.2 Navegador de día — PENDIENTE DE APROBACIÓN

**Valor a implementar: flechas ancladas + etiqueta centrada.** Alto 52px. Botón de 44×44 pegado a cada borde con chevron de 20px (`stroke` 2px, `currentColor`, `aria-label` "Día anterior" / "Día siguiente"), etiqueta al medio en `--fs-xl` 22px / 700 / `--color-text-1` / tabular.

**Etiqueta:** relativa sola para hoy/ayer/mañana (`Hoy`, `Ayer`, `Mañana`), absoluta el resto (`sáb 18 abr`). **Solo en Inicio** — Competición y Equipo usan fecha absoluta siempre.

**Sin límite de rango navegable** → ninguna flecha tiene estado deshabilitado. **No hay botón "volver a hoy"** (anti-alcance).

Descartada la **tira de días**, por tres razones: a 320px son 288px útiles ÷ 6 días = 48px de ancho contra un mínimo de 44 y seis blancos contiguos — el control más errable de la app en el pulgar; un carrusel promete un rango que no existe; y con chips de 48px la etiqueta `Hoy` no entra, lo que obligaría a volver a números. Descartada la **sub-línea con fecha absoluta**: agrega 16px permanentes al bloque que queda fijo al scrollear, y muestra el mismo dato dos veces.

### 3.3 Grupos

Una tarjeta por competición (`--color-surface`, borde 1px, `--radius-md` 10px). Encabezado adentro: `--color-surface-2`, `padding: 8px 12px`, `--fs-xs` 12px / 600 / tracking `.05em` / mayúsculas / `--color-text-2`, borde inferior 1px. El nombre de la competición **es link** (a Competición). Máximo 3 grupos en la v1.

### 3.4 Qué queda fijo al scrollear — PENDIENTE DE APROBACIÓN

**Valor a implementar: solo la barra de día.**

- La **barra de marca se va** con el scroll. Wordmark, favorito y Ajustes son cromo de entrada: se usan al abrir, no mientras se escanea. Fijarlos cuesta 52 de 568px (9% del viewport) en forma permanente, contra el objetivo de densidad; volver a ellos cuesta un flick.
- La **barra de día queda fija**. Un miércoles son ~16 partidos ≈ 2,5 pantallas: sin sticky, cambiar de día desde el fondo exige scrollear todo hacia arriba, y es el único control de uso constante de la app (invariante "ninguna acción inalcanzable").
- Los **encabezados de competición no se pegan**. Serían una segunda capa fija (52 + 30 = 82px, 14% del alto útil) para un problema chico: son máximo 3 grupos y cada fila ya lleva su contexto.

**Forma del estado fijo:** el alto **no cambia** (52px, sin condensar) — condensarla movería la etiqueta del día bajo el dedo justo cuando el usuario va a tocarla. Solo suma borde inferior 1px `--color-border` y sombra de 2px muy leve. En oscuro **no hay sombra**: el borde de 1px es el único separador (§ 3.5).

### 3.5 Estados de pantalla

Según `docs/design.md` § 6. `padding: 12px 16px 24px` en `main`.

| Estado | Forma | Copy — PENDIENTE DE APROBACIÓN |
|---|---|---|
| Cargando | Skeleton de 5 filas en `--color-surface-2` con las alturas reales **y la caja del escudo incluida**, para que no salte el layout. Sin marca, sin spinner. | — |
| Vacío | Icono neutro 24px `--color-text-3` + una línea `--fs-base` / `--color-text-2`. Sin ilustración, sin botón. | «No hay partidos este día» (viene de `docs/screens.md`) |
| Error | Tarjeta borde + icono + texto en `--color-danger`, botón **Reintentar** debajo (alto 44px). | «No pudimos cargar los partidos» / «Revisá tu conexión y volvé a intentar.» |
| Cuota agotada (RF-006) | Misma tarjeta en **ámbar** `--color-warn`, diamante + palabra. **Sin botón Reintentar** — reintentar no cambia nada hasta la renovación. Debajo siguen visibles los últimos datos guardados. | «Se agotó la cuota diaria de datos» / «Fulbo consulta hasta 100 veces por día a API-Football. La cuota se renueva a las 00:00. Hasta entonces se muestran los últimos datos guardados.» |

La tercera frase de la cuota es la que hace el trabajo: explica por qué el dato puede estar viejo sin usar la palabra "error".

### 3.6 Checklist de aceptación visual — Inicio

- [ ] Wordmark: palabra en `--color-text-1`, **solo el punto** en `--color-brand`.
- [ ] `MI EQUIPO` + escudo en **un renglón**.
- [ ] Flechas: 44×44 reales (medir, no estimar), pegadas a los bordes, **sin** estado deshabilitado.
- [ ] Etiqueta del día dice `Hoy` / `Ayer` / `Mañana` en esos tres días y fecha absoluta en el resto.
- [ ] No existe ningún botón "volver a hoy".
- [ ] Al scrollear: la barra de marca desaparece, la de día queda fija **al mismo alto**, los encabezados de grupo pasan por debajo sin pegarse.
- [ ] En oscuro la barra fija **no** tiene sombra.
- [ ] La columna de hora y la de marcador arrancan/terminan en el mismo píxel que en Competición y Equipo.
- [ ] Un partido programado no muestra `0-0` ni `-`.
- [ ] Un partido en vivo muestra los dos números en 600 (ninguno en 700).
- [ ] En vivo = círculo verde que pulsa; postergado/suspendido/cancelado = diamante ámbar.
- [ ] Con `prefers-reduced-motion` el punto no pulsa.
- [ ] Skeleton: 5 filas, incluye la caja del escudo, no usa violeta, el header no cambia de alto al llegar el dato.
- [ ] Cuota agotada: ámbar, **sin** botón Reintentar, con los datos viejos visibles debajo.
- [ ] Foco visible en las flechas, el favorito, Ajustes y los dos nombres de cada fila, en los dos modos.

---

## 4. Competición

Drill-down desde el nombre de competición. Los partidos de esa competición agrupados **por fecha**.

| Elemento | Valor | Por qué |
|---|---|---|
| Header | chevron de volver 44×44 + título en `--fs-xl` 22px / 700, alto 56px, `padding: 0 8px`, `gap: 4px`, truncado a una línea | Sin wordmark y sin los accesos de Inicio: es una pantalla de profundidad. |
| Encabezado de grupo | fecha absoluta (`mié 15 abr`), **no es link**, mismo estilo que § 3.3 | Es una etiqueta de posición, no un destino. La etiqueta relativa vive solo en Inicio. |
| Sin encabezado de competición | — | Es el título de la pantalla; repetirlo por grupo es ruido. |
| Fila | el patrón de § 2, sin meta-línea | — |
| Apertura | posicionada en el corte `PRÓXIMOS` (§ 2.5) | Lo que viene es lo que se busca. |

### Checklist — Competición

- [ ] El encabezado de fecha **no** es clickeable; los dos nombres de equipo **sí**.
- [ ] Fecha siempre absoluta (nunca `Hoy`).
- [ ] La lista abre en el corte `PRÓXIMOS`, no arriba.
- [ ] La banda `PRÓXIMOS` es neutra: `--color-surface-2` + `--color-text-2`, sin violeta.
- [ ] Anchos de columna idénticos a Inicio.
- [ ] En ≥768px la fila pasa a la forma simétrica de § 2.3.

---

## 5. Equipo

Drill-down desde un nombre de equipo. Los partidos de ese equipo, **lista plana cronológica ascendente**.

| Elemento | Valor | Por qué |
|---|---|---|
| Header | igual que Competición, **más el escudo del equipo a 24px** antes del título (`margin-right: 8px`) | Es la pantalla de la identidad del equipo. |
| Sin agrupar | — | Un equipo juega una o dos veces por semana: agrupar daría una ristra de encabezados con una fila cada uno. |
| Meta-línea de la fila | `dom 19/04 · PRIMERA A` en `--fs-xs` 12px, arriba de los nombres. Fecha en `--color-text-2` + tabular, **competición como link**; fecha no es link | Sin encabezado de grupo, la fila necesita su propio contexto. Es el propósito de la pantalla: no perder ni fecha ni competición. |
| Alto de fila | 3 líneas | Son ~8 partidos: el costo de densidad es nulo. |
| Marcador | `padding-top: 16px` para alinearse con la línea del equipo local | La meta-línea no debe despegar el marcador de su equipo. |
| Equipo favorito | **se ve igual que cualquier otro**: mismo escudo de 18px, sin resaltado | No existe la acción de desmarcar favorito (anti-alcance). |

### Checklist — Equipo

- [ ] Escudo del equipo en el título, 24px, sin recolorear.
- [ ] En cada fila: fecha **no** link, competición **sí** link, ambos nombres link.
- [ ] Orden cronológico ascendente; abre en el corte `PRÓXIMOS`.
- [ ] Racing Club no tiene ningún resaltado especial en su propia pantalla.
- [ ] No existe control de desmarcar favorito en ninguna parte.
- [ ] Anchos de columna idénticos a Inicio y Competición.

---

## 6. Configuración

Una sola opción: el tema. El control viene especificado entero en `docs/design.md` § 6.1 — **no se rediseña**.

| Elemento | Valor |
|---|---|
| Header | igual que Competición, título `Configuración` |
| Tarjeta | `--color-surface`, borde 1px, `--radius-md` 10px, `padding: 16px` |
| Etiqueta | `Tema` en `--fs-sm` 14px / 500 / `--color-text-2`, `margin-bottom: 8px` |
| Pista | `--color-bg`, borde 1px `--color-border`, `--radius-md` 10px, `padding: 4px`, grid de 3 × `1fr`, máx. 360px |
| Segmento | alto 44px, `--radius-sm` 6px, ícono 16px + palabra, `gap: 8px`, `--fs-sm` 14px / 500 / `--color-text-2`, **`padding: 0`** |
| Seleccionado | fondo `--color-brand-soft`, texto `--color-text-1`, peso 600 |
| Íconos | sol (Claro), luna (Oscuro), círculo mitad-relleno (Auto) — `stroke` 1.8px, `currentColor` |
| Ayuda | `«Automático» usa el tema de tu sistema.` en `--fs-sm` 14px / `--color-text-2` |
| Default | **Auto** |
| A11y | `role="radiogroup"` + `role="radio"` con `aria-checked` |

**Lo único decidido acá, y es de contención:** la tarjeta lleva 16px de padding lateral, el tope que § 6.1 permite. A 320px eso deja 248px de pista y 82,6px por segmento; `☾ Oscuro` entra con ~6px de aire por lado.

**Atención `frontend`:** el `padding` por defecto del navegador en `<button>` (`1px 6px`) come exactamente ese aire y deja el segmento al ras. **`padding: 0` explícito** en el segmento y en los botones de flecha no es cosmética: es lo que hace verdadero el cálculo de contención.

Sin botón guardar (se aplica al instante), sin sección "acerca de", sin más opciones.

### Checklist — Configuración

- [ ] `☾ Oscuro` entra completo a 320px, sin truncar ni partir, con aire visible a los lados.
- [ ] El segmento y las flechas tienen `padding: 0` (verificar en computed styles, no a ojo).
- [ ] Seleccionado = `--color-brand-soft` + `--color-text-1` + 600. **Único uso de la marca como superficie en toda la app.**
- [ ] Los tres segmentos miden ≥44px de alto.
- [ ] `Auto` viene seleccionado de fábrica.
- [ ] Cambiar el tema repinta la app entera sin recargar y sin botón guardar.
- [ ] `role="radiogroup"` / `aria-checked` presentes.

---

## 7. Reglas duras — verificación transversal

Corre una vez sobre la app entera, en los dos modos:

- [ ] **Violeta:** aparece solo en wordmark, anillo de foco, subrayado de link en hover/focus y el segmento elegido del control de tema. **En ningún** marcador, hora, nombre de equipo, nombre de competición ni badge de estado.
- [ ] **Verde** solo en vivo/entretiempo. **Rojo** solo en error de la app. **Ámbar** solo en dato anómalo y cuota.
- [ ] **Ningún resultado coloreado.** La diferencia ganador/perdedor es solo peso tipográfico.
- [ ] **Todo dato numérico tabular:** horas, marcadores, minuto, fechas numéricas.
- [ ] **Nada solo por color:** todo estado con color lleva además palabra y forma.
- [ ] **Escudos tal cual la fuente:** sin recolorear, sin filtro por modo, sin borde ni recorte circular.
- [ ] **Cinco estados** declarados en todo interactivo, en claro y oscuro. `outline: none` no aparece en ninguna parte del código.
- [ ] Tipografía: **solo** 12 / 14 / 16 / 18 / 22px. Ningún tamaño intermedio.
- [ ] Espaciado: **solo** 4 / 8 / 12 / 16 / 24 / 32px, salvo las tres excepciones de § 1.

---

## 8. Contención responsive

Umbral `--bp-wide` 768px. Compacta 320–767, amplia ≥768.

| Elemento | Compacta | Amplia |
|---|---|---|
| Fila | grid `48px \| 1fr \| 24px`, estado bajo los nombres | simétrica, marcador al centro (§ 2.3) |
| Padding lateral | 16px | 24px, contenido máx. 720px centrado |
| Nombre de equipo | trunca con paréntesis protegido | entra completo |
| Navegador de día | flechas a los bordes | igual, dentro del contenedor centrado |
| Control de tema | 3 × `1fr` de 82,6px | igual, tope 360px |

Los cuatro invariantes se cumplen en compacta: nada de scroll horizontal propio, ningún target bajo 44px, ninguna acción inalcanzable, y ningún dato perdido por truncado (el desambiguador está protegido).

---

## 9. PENDIENTES — no inventar, preguntar

Cinco cosas que este spec **no** cierra. `CLAUDE.md` § Regla de oro: ante la duda se pregunta.

1. **Escudos — falta la URL real.** La maqueta usa un placeholder rayado. Hay que relevar qué devuelve API-Football (campo, tamaños disponibles, si hay CDN propio) y confirmar que el tamaño servido rinde bien a 18px. **Bloquea** el pixel-perfect de las tres pantallas de lista; **no** bloquea la estructura.
2. **Copy de error y cuota — propuesta sin aprobar.** Los textos de § 3.5 los escribí yo. Necesitan el OK del usuario, y el de vacío ya viene de `docs/screens.md`.
3. **Inter Variable auto-hospedada — falta el archivo.** `docs/design.md` § 4.1 pide auto-hospedado, sin CDN de terceros. La maqueta carga de Google Fonts porque no tengo el `.woff2`; **eso no es la decisión de implementación**. Hay que sumar el archivo y el `@font-face`.
4. **Las cuatro decisiones abiertas — falta aprobación formal.** Wordmark (§ 3.1), navegador de día (§ 3.2), truncado con desambiguador (§ 2.6) y política de sticky (§ 3.4). Bajan como valor único para que nadie improvise, pero el usuario todavía no las firmó. Las alternativas descartadas están dibujadas en `maqueta.html` con su trade-off.
5. **Tabla de nombres cortos de competición.** `PRIMERA A`, `LIBERTADORES`, `SUDAMERICANA` son los que usé en la maqueta. Falta la tabla curada y su fuente de verdad: ¿la decide `design`, la trae el analista desde `docs/data-model.md`, o se deriva del nombre que devuelve la API? Es el mismo problema que el desambiguador del § 2.6, así que conviene resolverlos juntos.
