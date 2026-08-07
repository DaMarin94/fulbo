# QA visual

Validación que ni los tests, ni el build, ni el e2e cubren: pixel, layout, modales cortados o atrapantes, marcas mal puestas, datos inválidos que se guardan. Se corre contra la app andando, en un navegador de escritorio.

**Quién ejecuta:** el orquestador lo corre él mismo contra el navegador conectado vía `/chrome` (herramientas `mcp__claude-in-chrome`) — navega, interactúa, dispara casos borde, saca screenshots y reporta. Si el navegador no está conectado/disponible en la sesión, cae al **fallback**: arma el prompt per-feature y se lo entrega al usuario para que lo corra en el chat de la extensión **Claude para Chrome**. La conexión de `/chrome` no es persistente: se reconecta en cada sesión nueva. En ambos modelos el guion es el mismo — cambia solo quién lo ejecuta.

**Sembrado de datos de prueba:** el orquestador **siembra la data que el caso requiera** cuando la cuenta conectada no tiene los casos necesarios para ejercitar la feature. Es **parte esperada** de correr el QA, no un paso extraordinario: sin los datos adecuados el recorrido no prueba nada.

**La base de datos local de desarrollo es descartable.** Sus datos no tienen valor. Al correr QA (o cualquier prueba), el orquestador **crea y modifica** libremente lo que necesite **sin pedir permiso** y **sin obligación de revertir** la data de prueba. La data no se trata como preciosa. Esto aplica **solo a la base local de desarrollo**, no a datos de producción.

**Interactuar es el guion, no una excepción:** en **localhost**, el orquestador **usa la app y envía formularios sin pedir confirmación por acción** — crear y guardar registros de prueba es exactamente lo que el QA pide. Pedir permiso antes de cada submit invalida el recorrido. El **borrado de datos** queda **fuera** del guion: lo hace el usuario.

**Límites (reglas de seguridad):** el orquestador **no crea cuentas de usuario, no ingresa credenciales/contraseñas ni realiza el login** (incluido OAuth) y **no borra datos** —ni siquiera la data que él mismo creó durante el guion—. Si una prueba requiere una sesión autenticada, la autenticación la resuelve el usuario; el borrado, también. El alta y la edición de datos las maneja el orquestador sin fricción.

El corte está en la reversibilidad: el borrado es irreversible, así que lo dispara el usuario. Todo el resto del guion —crear, editar, **anular/des-anular**, navegar— es reversible o no destructivo, y por eso lo ejecuta el orquestador sin confirmación. **Anular no es borrar:** es un caso reversible más y se ejercita con normalidad.

Este doc es un **asset de trabajo vivo**: el prompt genérico de regresión y la plantilla per-feature se mantienen acá al día con las superficies del producto.

## Alcance y exclusiones

**Valida:**
- Roturas visuales de layout.
- Modales cortados o atrapantes (que no se cierran, que pierden datos al cerrar).
- Opciones inalcanzables (menús que se salen de pantalla, selects que tapan).
- Datos inválidos que se guardan.
- Estados vacíos rotos (NaN, undefined, empty feo).
- Crashes.
- **Contención responsive** — los cuatro invariantes de `docs/design.md` § Contención responsive, verificados entre el **ancho mínimo soportado (320px) y arriba** (incluyendo la disposición compacta, `< --bp-wide`, 320–767px, además del amplio). Por debajo de 320px la app no promete contención (muestra el gate): fuera de alcance.
  1. Sin scroll horizontal del `body` en todo ancho `≥ 320px`.
  2. Modales completos y scrolleables: no cortados, no atrapantes.
  3. Ninguna acción inalcanzable (fuera de pantalla o tapada).
  4. Las superficies anchas scrollean dentro de sí mismas, no rompen el layout de la página.

El grueso del recorrido va en **escritorio normal**; los cuatro invariantes de contención se verifican **siempre**, también achicando la ventana entre 320px y `--bp-wide` (disposición compacta). Por debajo de 320px no se verifica: no es un ancho soportado.

> **Fulbo no tiene navegación persistente** (drill-down puro, sin sidebar ni tabs): el régimen compacto/amplio se juzga directo contra el **ancho del viewport**, sin ningún chrome fijo que le reste ancho al contenido.

**Exclusiones vigentes** — se atacan como esfuerzos propios y **no** se incluyen en los prompts por ahora:
- **Adaptación / rediseño mobile:** evaluar si la experiencia en pantalla chica es *buena* o *cómoda*. Lo único que se verifica en pantalla chica es que **no se rompe** (los cuatro invariantes de contención, arriba); adaptar o rediseñar para mobile queda fuera.
- **Accesibilidad**: uso por teclado, foco, contraste, legibilidad, información transmitida solo por color.

## Prompt genérico de regresión adversarial

Doc vivo: cuando una feature agrega una superficie nueva, se agrega a la lista de superficies de este prompt, **en el mismo commit que el código**. El bloque de abajo es el asset a mantener y se pega tal cual.

---
Sos un QA senior con mentalidad adversarial. Tu objetivo NO es confirmar que la app anda: es ENCONTRAR maneras de romperla. La app se llama Fulbo, un visor de fixtures de fútbol de un solo usuario: muestra los partidos de Primera A de Argentina, Copa Libertadores y Copa Sudamericana (día, horario, equipos, resultado), con drill-down por competición y por equipo y un equipo favorito. Los datos vienen de la API externa API-Football, cacheados localmente; todo es de solo lectura. Recorré todo, meté datos que no deberían entrar, forzá flujos raros, y documentá cada falla con screenshot y pasos para reproducir.

FUERA DE ALCANCE (ignoralo): adaptación/rediseño mobile —si la experiencia en pantalla chica es *cómoda* o *buena* no es tu problema— y accesibilidad (teclado, foco, contraste, legibilidad, info por color).

BORRADOS, A CARGO DEL USUARIO: los casos que borran datos (borrar una entidad en uso, eliminar registros) están dentro del alcance y hay que verificarlos, pero **el borrado lo ejecuta el usuario, no vos**. Enunciá el caso, pedile al usuario que dispare el borrado y verificá el resultado. No borrás nada, ni siquiera la data que creaste durante el guion. Crear, editar y **anular/des-anular** sí los hacés vos, sin pedir confirmación: son reversibles. Anular no es borrar.

DENTRO DE ALCANCE, SIEMPRE — contención responsive: además de probar en escritorio normal, achicá la ventana hasta 320px (el ancho mínimo soportado), pasando por la disposición compacta (320–767px), y verificá los cuatro invariantes. No bajes de 320px: por debajo de ese ancho la app muestra el gate y no promete contención. Fulbo no tiene navegación persistente, así que el régimen compacto/amplio se mide directo contra el ancho del viewport.
1. El `body` no tiene scroll horizontal en ningún ancho ≥ 320px.
2. Los modales se ven completos y scrollean: ni cortados ni atrapantes.
3. Ninguna acción queda fuera de pantalla ni tapada.
4. Las superficies anchas (tablas, grillas, gráficos) scrollean dentro de sí mismas sin romper el layout de la página.

Enfocate en: datos inválidos que se guardan, roturas visuales de layout, modales cortados, opciones inalcanzables, estados rotos y crashes.

Superficies (recorrelas todas): Inicio (partidos del día de todas las competiciones; flechas ← → para navegar día a día, incluido cambio de mes y de año; días sin partidos; horarios y resultados; links a competición y a equipo); Competición (todos los partidos de una competición: Primera A, Libertadores, Sudamericana; volver atrás); Equipo (fixture propio de un equipo, incluido el favorito; selección del equipo favorito; volver atrás).

<!-- Cada feature que agrega una superficie la suma a la lista de arriba en el mismo commit que el código. -->

Mentalidad para romperla, por cada campo:
- Texto: vacío, solo espacios, 2000+ chars, emojis/unicode RTL, HTML/JS (`<script>`, `<img onerror>`) verificando que NO ejecute, comillas/backslashes/`{{7*7}}`/`'; DROP TABLE`/saltos de línea, espacios al borde, nombres duplicados, recrear con nombre de uno borrado (¿ofrece reactivar?).
- Numérico: 0, negativos, decimales largos, notación científica, números enormes (¿desborda?), letras/símbolos/pegar no-numérico, coma vs punto, vacío, valores fuera del rango permitido.
- Fechas: inválidas, año 0001/9999, muy futuras/pasadas, 31 en meses de 30, febrero/bisiesto, rangos que cruzan fin de año.
- Selects/menús: kebab cerca del borde (¿se corta/queda fuera?), selects largos (¿scrollean/tapan?), guardar sin elegir (¿validación?).

Modales y overlays (foco especial): ¿se ve completo o CORTADO?, contenido largo (¿crece/scrollea/rompe?), cerrar con X/Esc/backdrop (¿alguno cierra perdiendo datos sin avisar?), fondo bloqueado (no scrollea atrás), modal sobre modal (apilado/z-index/orden de cierre).

Flujos que rompen: doble/rápido submit (¿duplicados?), spam de clicks en acciones, guardar/navegar durante carga, borrar una entidad EN USO (borrado a cargo del usuario: ¿lo impide con mensaje?, ¿histórico consistente?), editar+cancelar (¿descarta y reabre con valores originales?). Propios de Fulbo: spam de las flechas ← → en Inicio saltando muchos días seguidos (¿se pisan las respuestas?, ¿queda el día que corresponde?), navegar a un día muy lejano en el futuro o en el pasado (¿empty prolijo o error?), drill-down encadenado partido → competición → equipo → volver atrás varias veces (¿el atrás vuelve donde corresponde?), entrar a una competición o a un equipo sin partidos (¿empty prolijo?), cambiar el equipo favorito y volver a Inicio (¿refleja el cambio sin datos viejos?), agotar la cuota de 100 requests/día de API-Football (¿mensaje específico de cuota agotada, no error genérico?), backend caído o respuesta lenta (¿mensaje con reintento, no pantalla blanca?), partido en juego o con resultado parcial (¿se muestra sin NaN ni campos vacíos?).

<!-- Los flujos propios se mantienen al día: cada feature suma los suyos acá. -->

Estados vacíos y carga pesada: usuario/listado sin registros (¿empty prolijo o NaN/undefined?), listado con 30+ registros (¿aguanta?, ¿números desbordan?).

Sesión/navegación: F5 en medio de un flujo (modal abierto), botón atrás tras modales/cambio de contexto, URL interna deslogueado (¿redirige a login?), sesión expirada (¿mensaje claro, no pantalla blanca?).

Reporte: por hallazgo (1) dónde, (2) pasos, (3) qué pasó, (4) qué esperabas, (5) severidad (rompe/feo/menor), (6) screenshot. Agrupá por severidad; priorizá datos inválidos guardados, modales cortados/atrapantes, opciones inalcanzables, crashes.
---

## Plantilla del prompt per-feature

Guion per-feature que el orquestador sigue al cierre de cada tarea con superficie visual — lo ejecuta él directo contra el navegador, o lo entrega como prompt al usuario en el fallback. Estructura fija, en este orden, para que salga consistente:

1. **Rol + objetivo** — QA visual adversarial, con las mismas exclusiones (adaptación/rediseño mobile y a11y fuera) y el mismo chequeo permanente de los cuatro invariantes de contención responsive entre el ancho mínimo soportado (320px) y arriba (sin bajar de 320px), pasando por la disposición compacta (320–767px, `< --bp-wide`).
2. **Contexto breve de la feature** — qué hace, en términos de UI.
3. **Invariantes críticos** (testear primero) — p. ej. "cero-impacto con config vacía": la app se ve igual si la feature no está activada.
4. **Recorrido superficie por superficie** de lo que la feature toca — con qué mirar y qué esperar en cada una.
5. **Casos borde** de input y de estado propios de la feature.
6. **Modales/overlays nuevos** — cortado, cierre, apilado.
7. **Formato de reporte** (dónde / pasos / qué pasó / qué esperabas / severidad / screenshot). No hay paso de limpieza: la data de prueba de la base local no se revierte (ver arriba).

El contenido visual esperado (colores, posiciones, estados) sale del **"Checklist de aceptación visual"** del spec de `design` de esa feature; el orquestador lo reusa para los puntos 3 y 4.

## Cadencia

| Prompt | Cuándo |
|--------|--------|
| Per-feature | **Siempre**, en el paso 5.5 del flujo del orquestador, al cierre de cada tarea con superficie visual/UI. Lo ejecuta el orquestador directo contra `/chrome`; hand-off al usuario como fallback. |
| Genérico de regresión | **On-demand** y al cerrar una versión. |
