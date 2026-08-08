# Handoff de diseño — las 4 pantallas de Fulbo

Material **crudo de origen** para el agente `design`, en el sentido de `.claude/agents/design.md` § Fuente de verdad visual. Producido a partir de `docs/design.md`, `docs/requirements.md` y `docs/screens.md`.

## Qué hay acá

| Archivo | Qué es | Para quién |
|---|---|---|
| `spec.md` | La especificación de las 4 pantallas: por elemento, qué token/escala/estado aplica y por qué. Cierra con un checklist de aceptación visual por pantalla. | `design` lo audita y lo cura; `frontend` implementa desde acá una vez avalado. |
| `tokens.css` | Los tokens de `docs/design.md` § 3.4 / § 4.3 / § 5 en formato Tailwind v4 (`@theme`), listos para pegar. Incluye modo oscuro por `data-theme` y los alias con los nombres normativos del doc. | `frontend`. |
| `maqueta.html` | Referencia visual autocontenida: se abre offline con doble clic, sin build ni servidor. 40 lienzos con las 4 pantallas en claro y oscuro, los 9 estados de fila, los 4 estados de pantalla, y las alternativas descartadas de cada decisión abierta con su trade-off. | Todos. Es el "qué tiene que verse así". |

## Reglas de propiedad que este paquete NO rompe

- **No toca `docs/design.md`.** Su único escriba sigue siendo el agente `design`. Ante conflicto entre este handoff y la guía viva, **prevalece la guía viva**.
- **No escribe doc funcional ni técnica.** Si algo de acá obliga a cambiar `docs/screens.md`, `docs/frontend.md` o `docs/technical.md`, es señal para el orquestador → analista, no un cambio hecho.
- **No es código de la app.** `maqueta.html` es una referencia visual, no un componente a portar. La estructura a implementar es la que describe `spec.md`.

## Antes de implementar

`spec.md` § 9 lista **cinco pendientes** que el spec deliberadamente no cierra: la URL real de los escudos, el copy de error y cuota (propuesta sin aprobar), el archivo de Inter Variable auto-hospedada, la aprobación formal de las cuatro decisiones abiertas, y la tabla de nombres cortos de competición.

Las cuatro decisiones abiertas bajan como **valor único** —para que `frontend` no tenga que improvisar, lo que las reglas duras prohíben— pero marcadas `PENDIENTE DE APROBACIÓN`. Sus alternativas están dibujadas en la maqueta.

## Contexto de origen

Diseñado en Omelette. Las decisiones y su justificación están en `spec.md`; la maqueta lleva las notas al lado de cada lienzo.
