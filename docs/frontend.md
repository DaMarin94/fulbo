# Frontend

Arquitectura del frontend. Los estándares transversales viven en `docs/technical.md`; las pantallas, en `docs/screens.md`; el lenguaje visual, en `docs/design.md`.

## Estructura

> **PENDIENTE:** sin documentar. Se escribe junto con la reescritura de componentes de abajo.

## Componentes

Las cuatro pantallas están construidas en `frontend/src/` (pantallas, fila de partido, navegador de día, estados y control de tema).

> **Ese código no es referencia de nada visual: implementa un patrón derogado.** Dibuja la fila de partido como grilla de tres columnas con columna de hora, envuelve los grupos en tarjetas, muestra la banda `PRÓXIMOS` en Inicio y abrevia los estados en versalitas (`FIN`) — nada de eso rige. Lo vigente es `docs/design.md` § 7 (bloque de partido), § 8.4 (disposición amplia) y § 10 (specs por pantalla), más las dos vistas conmutables de Inicio (RF-008). La próxima tarea de `frontend` reescribe estos componentes contra `docs/design.md`, y esta sección se completa ahí.

## Estado del cliente

- **Agrupación de la pantalla de entrada (RF-008):** se persiste en **`localStorage`**, enteramente client-side. No hay cookies, no hay endpoint ni entidad en el backend (`docs/data-model.md` § Naturaleza del modelo). Si `localStorage` no está disponible, se usa el default sin persistir y sin error visible.

## Testing

Vitest. Ver `docs/technical.md` § Testing.
