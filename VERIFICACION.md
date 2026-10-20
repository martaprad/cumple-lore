# Verificación de la entrega

Comprobación realizada el 20 de octubre de 2026 sobre los archivos incluidos en este proyecto.

## Resultado

La aventura se ha ejecutado en Chromium mediante Playwright, abriendo el HTML local. Se han comprobado el recorrido de los cinco juegos, el guardado, la recarga, el reinicio, la navegación por teclado y el diseño a varios anchos.

| Área | Comprobación | Resultado |
| --- | --- | --- |
| Estructura y sintaxis | IDs HTML únicos, recursos estáticos del HTML existentes y sintaxis de los cuatro scripts. | Correcto. |
| Clave de acceso | Comparación del hash con el proyecto original y rechazo de una clave incorrecta mediante Enter. | El hash es idéntico; el formulario rechaza una clave incorrecta. |
| Reglas del juego | Diez escenarios del motor independiente de la interfaz. | 10 de 10 correctos. |
| Diseño responsive | Once vistas o estados a 320, 390, 768, 1.366 y 1.920 px. | 55 de 55 sin desbordamiento horizontal, imágenes visibles rotas ni excepciones JavaScript. |
| Ajustes visuales finales | Quince combinaciones afectadas por los últimos cambios de CSS. | 15 de 15 correctas; capturas revisadas visualmente. |
| Reinicio | Prueba puntual después de corregir el vaciado de las pantallas finales. | Cero sellos, regalo y tripulación vacíos, inicio recuperado tras recargar. |

## Recorrido funcional comprobado

- Sólo se desbloquea una nueva escala cuando se completa la anterior.
- El puzle mezcla nueve piezas, permite intercambiarlas con teclado, muestra la referencia y recupera las posiciones tras una recarga.
- Un mismo puzle completado no puede conceder dos sellos.
- Los cinco puertos rechazan asociaciones erróneas, revelan la historia correcta y conservan los aciertos al recargar.
- Las cuatro frases y las tres botellas validan las respuestas, muestran las pistas y recuperan una ronda acertada pendiente de continuar.
- La taberna admite añadir, quitar y borrar letras; no abre el cofre con una palabra vacía o incorrecta. Acepta TRASGU en el orden exacto.
- El regalo y los mensajes finales no se insertan en la interfaz antes del quinto sello.
- Aparecen las once personas y el pasaporte muestra los cinco sellos al terminar.
- Escape cancela el diálogo de reinicio. Confirmarlo borra la partida y conserva la sesión de acceso.
- Los estados guardados corruptos o incompatibles se descartan o normalizan; no conceden sellos por una puntuación declarada sin respuestas válidas.

Durante el primer recorrido se detectó que el reinicio dejaba los mensajes finales en secciones ocultas. Se corrigió limpiando esas secciones y se verificó de nuevo ese caso. No quedan incidencias funcionales conocidas de las comprobaciones realizadas.

## Límites de esta comprobación

Las resoluciones de móvil y tablet se han simulado en Chromium; no equivalen a ensayos físicos en todos los dispositivos ni a una batería específica de Safari o Firefox.

Las fotos reales de infancia no estaban adjuntas. Se ha comprobado que, al faltar `lorena-infancia-1.jpg` y `lorena-infancia-2.jpg`, se carga correctamente la ilustración de respaldo. Hasta que se añadan las fotos, la consola de desarrollo puede registrar esos intentos de carga fallidos; no impiden jugar y no dejan imágenes rotas en pantalla.

No se ha publicado la web ni se ha modificado directamente la carpeta de Windows. Para aplicar la entrega y hacer el ensayo con tus fotos, sigue `LEEME.md`.
