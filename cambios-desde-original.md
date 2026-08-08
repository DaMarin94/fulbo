# Cambios respecto a `Fulbo - Pantallas.html`

Documento para Claude Code. `Fulbo - Pantallas.html` es la base que ya viajó al handoff (`docs/design-handoff/spec.md`). `Fulbo - Inicio con dos vistas.html` es el estado vigente. Acá está enumerado todo lo que cambió, en orden de impacto.

**Alcance:** todos estos cambios aplican a **Inicio**. Competición, Equipo y Configuración no fueron rediseñadas en esta ronda — pero los cambios 1 a 6 son del patrón de fila, así que hay que propagarlos a Competición y Equipo (ver § 13).

---

## 1. El bloque de partido cambia de estructura — el cambio más grande

**Antes:** grilla de tres columnas `[hora 48px] [equipos 1fr] [marcador 24px]`. Marcadores apilados, uno por línea de equipo, alineados a la derecha en una columna de 24px.

**Ahora:** dos líneas, sin columna de hora. Cada línea es `escudo · nombre (izquierda, 1fr) · marcador (derecha)`. El estado va como tercera línea debajo.

```
▨ Central Córdoba (SdE)        1
▨ Gimnasia y Esgrima (LP)      1
Finalizado
```

- El nombre arranca pegado a la izquierda y trunca con elipsis.
- El marcador se ancla al borde derecho del bloque.
- El estado ocupa su propia línea, alineado a la izquierda, siempre.
- **La columna de hora desaparece del bloque.** La hora pasa a ser título o subtítulo de sección (§ 3).

**Por qué:** lo confirmaste explícitamente en `Fulbo - Alineación final.html`.

---

## 2. Se eliminan las tarjetas

**Antes:** cada competición era una `.card` — fondo `--color-surface`, borde de 1px, radio 10, y un encabezado `.ghd` con fondo `--color-surface-2`.

**Ahora:** no hay tarjetas. La lista corre sobre `--color-bg`, y la separación entre partidos es una **divisoria de 1px** al pie de cada bloque. El último bloque de la lista no lleva divisoria.

**Consecuencia:** desaparecen `--color-surface` y `--color-surface-2` como fondos de lista. `--color-surface` queda para el header y las tarjetas de Configuración; `--color-surface-2` para la píldora del conmutador y estados hover.

---

## 3. Jerarquía de dos niveles: titular + subtítulo

Reemplaza al encabezado de grupo de las tarjetas.

| | Titular | Subtítulo |
|---|---|---|
| Vista por horario | la hora (`16:30`) | la competición (`▣ Primera A`) |
| Vista por torneo | la competición (`▣ Primera A`) | la hora (`16:30`) |

**Titular** — 20px / 700 / `-0.02em` / `--color-text-1`, con una línea de 2px en `--color-border` que corre desde el texto hasta el borde derecho. En ≥768px sube a 24px y la línea abre a los dos lados.

**Subtítulo** — 12px / 600 / `+0.04em` / `--color-text-3`.

**Marca de competición** — ícono de 18px que acompaña al nombre del torneo, en `currentColor` (§ 8).

---

## 4. Vocabulario de estados: palabra completa, capitalizada

**Antes:** `FIN` en la columna angosta, y el resto en versalitas dentro de la franja (`EN VIVO`, `ENTRETIEMPO`, `POSTERGADO`…).

**Ahora:** todos capitalizados, sin versalitas, en su propia línea:

`Finalizado` · `En vivo` · `Entretiempo` · `Suspendido` · `Postergado` · `Cancelado` · `A confirmar`

- **`FIN` se elimina por completo.** Lo confirmaste: «nos quedamos con esta palabra» (Finalizado).
- El minuto se concatena con punto medio: `En vivo · 68'`, `Suspendido · 54'`.
- **Excepción:** `Entretiempo` nunca lleva minuto.
- Tipografía: 12px / 500. Color por semántica: `--color-live` para en vivo y entretiempo, `--color-warn` para suspendido / postergado / cancelado, `--color-text-3` para el resto.

---

## 5. Pesos del marcador — sin cambios

Se mantiene la regla del documento anterior:

- Finalizado o suspendido con ganador: ganador 700 / `--color-text-1`, perdedor 400 / `--color-text-2`.
- Empate finalizado: ambos 500.
- En vivo o entretiempo: **ambos 600** — el partido no terminó, no hay ganador que distinguir.
- Programado o a confirmar: sin marcador. Ni `0-0` ni `-`.

Tamaño: 18px en angosto, 22px en ≥768px.

---

## 6. Escudos

Sin cambios de tamaño (18px) ni de tratamiento (tal cual los provee la fuente, sin recolorear ni recortar). Lo que cambia es la **posición**: antes eran el primer elemento del bloque de equipos; ahora son el primer elemento de cada línea, seguidos del nombre.

En ≥768px giran hacia adentro y flanquean el marcador (§ 10).

**Siguen siendo placeholders.** Falta la URL real que devuelve API-Football.

---

## 7. Dos vistas de Inicio

Es la funcionalidad nueva. Mismo día, mismos partidos, dos agrupaciones:

**Por torneo** — agrupa por competición; dentro de cada una, subgrupos por hora. Contesta «¿qué hay hoy?».

**Por horario** — agrupa por hora de inicio; dentro de cada una, subgrupos por competición. Contesta «¿qué se juega ahora?».

**Reglas:**
- Defecto: **por torneo**.
- Solo aplica a **Inicio**. Competición y Equipo no tienen conmutador.
- La elección **persiste entre sesiones**.
- **Sin banda de corte `PRÓXIMOS`** en ninguna de las dos vistas de Inicio. (La banda sigue vigente en Competición y Equipo, que sí se abren posicionadas en el próximo partido.)
- Las dos vistas usan **exactamente el mismo esqueleto**: mismo titular, mismo subtítulo, mismo bloque, mismas divisorias. Lo único que cambia es qué dato manda.

---

## 8. Marcas de competición

Tres íconos geométricos de 18px que identifican cada torneo sin depender del color:

| Competición | Marca |
|---|---|
| Primera A | círculo con estrella inscripta |
| Libertadores | escudo con disco central |
| Sudamericana | rombo con rombo interior |

Van en `currentColor` — heredan el color del texto que acompañan, así que no introducen color nuevo ni dependen del tema.

**Por qué existen:** en la vista por horario los partidos de torneos distintos quedan mezclados bajo una misma hora. La marca permite discernir el torneo de un vistazo sin agregar color ni ocupar ancho.

**Nombres de competición:** se muestran capitalizados (`Primera A`, `Libertadores`, `Sudamericana`), no en mayúsculas. La función de capitalización preserva las siglas de hasta dos letras.

---

## 9. Conmutador de vista — píldora en la barra de marca

**Forma:** un solo botón de 32px de alto, radio completo (999px), a la derecha de «Mi equipo».

- Muestra **la vista vigente**, no las dos opciones: `⇅ Torneo` o `⇅ Horario`.
- Al tocarlo, alterna.
- Ícono de intercambio de 14px + palabra en 12px / 600.
- Fondo `--color-surface-2`, borde `--color-border`, texto `--color-text-2`. En hover el borde pasa a `--color-brand`.
- `aria-label` describe el destino: «Vista por torneo. Tocar para cambiar a por horario».

**Consecuencias en el header:**
- «Ajustes» **deja de ser palabra y pasa a ícono de engranaje** de 20px, para hacer lugar. Es una excepción declarada a la regla «los accesos del header son palabras».
- El `gap` de la barra baja de 16px a 12px y el padding lateral de 16px a 12px. Sin eso, a 320px el engranaje se corta.
- **Costo de alto: cero.** El conmutador no agrega ninguna barra.
- **No queda fijo al scrollear.** Solo la barra de día queda pegada, igual que la decisión original.

---

## 10. Disposición amplia (≥768px)

Se alinea con la disposición amplia de `Fulbo - Pantallas.html`, que usa la **fila simétrica centrada**:

```
        Central Córdoba (SdE) ▨  1 – 1  ▨ Gimnasia y Esgrima (LP)
                              Finalizado
```

- Grilla de 7 columnas: `1fr auto auto 20px auto auto 1fr`.
- Local alineado a la derecha de su lado, visitante a la izquierda del suyo.
- Escudos **hacia adentro**, flanqueando el marcador.
- Marcador en 22px, guion en 18px / `--color-text-3`.
- **Titular, subtítulo y estado también centrados.** La línea del titular abre a los dos lados.
- **Programados:** el guion queda solo, aclarado a `--color-border`. No se repite la hora en el centro — ya está en el titular o el subtítulo.
- Contenido topado a 768px, centrado, con 24px de padding.

**Lo que no se hace:** las dos vistas lado a lado en amplio. Convertiría un conmutador en un layout.

---

## 11. Estados de pantalla

Sin cambios de contenido respecto al documento anterior. El skeleton se adapta a la estructura nueva: tres grupos, cada uno con un titular y dos bloques de tres líneas.

Copy de error y cuota: **sigue siendo propuesta mía, sin aprobar.**

---

## 12. Lo que NO cambió

- Tokens de color, tipografía y espaciado — idénticos.
- Escala tipográfica de 5 pasos (12 · 14 · 16 · 18 · 22) y escala de espaciado de 4px.
- Wordmark `fulbo.`
- Acceso al favorito: `MI EQUIPO` + escudo, en un renglón.
- Navegador de día: flechas ancladas + etiqueta relativa (`Hoy` / `Ayer` / `Mañana`), sin límite de rango.
- Sticky: solo la barra de día.
- Truncado de nombres largos: paréntesis protegido (`Central Córdo… (SdE)`).
- Targets mínimos de 44px.
- Anti-alcance: sigue sin haber tab bar, sidebar, hamburguesa, modales, filtros ni botón «volver a hoy».

---

## 13. Pendientes de decisión antes de implementar

1. **Persistencia de la vista:** dónde se guarda. Es estado nuevo — el modelo de datos es caché de solo lectura.
