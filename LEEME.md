# Operación Lorena · El tesoro de los 40

Versión preparada el 20 de octubre de 2026. Web estática en HTML, CSS y JavaScript, sin compilación y sin dependencias externas en tiempo de ejecución.

Esta carpeta contiene el proyecto completo actualizado. Incluye cinco minijuegos con los recuerdos del cuestionario, la anécdota corregida de Arantxa, un pasaporte con cinco sellos, guardado local, diseño responsive y la sorpresa final del proyecto original.

## 1. Cómo aplicar los cambios

1. Guarda una copia de tu carpeta actual `C:\Users\Marta\Proyectos\Regalo Lorena\cumple-lore`.
2. Descomprime el ZIP. Dentro encontrarás una carpeta llamada `cumple-lore`.
3. Copia **el contenido de esa carpeta** dentro de tu proyecto: `index.html`, `css`, `js`, `assets`, `LEEME.md` y `LICENSE`. Acepta reemplazar los archivos con el mismo nombre.
4. Conserva la carpeta `.git` de tu proyecto si trabajas con Git. El ZIP entregado no incluye ni reemplaza el historial del repositorio.
5. Abre `index.html` en un navegador actual. También puedes usar el servidor local de tu editor, por ejemplo Live Server si ya lo tienes instalado.
6. Entra con **la misma clave del proyecto original**. Haz una recarga completa si el navegador muestra el diseño antiguo.

No necesitas ejecutar `npm install`, crear un backend ni importar el CSV en el navegador. Los textos seleccionados ya están en `js/game-data.js`. Puedes mantener tu alojamiento estático actual; esta entrega no publica la web automáticamente.

## 2. Archivos que cambian

| Archivo | Función |
| --- | --- |
| `index.html` | Estructura accesible de las pantallas, acceso, navegación y confirmación de reinicio. |
| `css/styles.css` | Diseño responsive completo, paleta pirata, estados, foco visible y animaciones reducidas. Sustituye los estilos anteriores y el uso de Tailwind por CDN. |
| `js/app.js` | Interfaz de los cinco juegos, fotos, pistas, navegación, guardado, pasaporte y final. |
| `js/game-core.js` | Reglas de juego y validación del progreso, separadas de la interfaz. |
| `js/game-data.js` | Preguntas, respuestas, historias, personas, imágenes y datos del regalo. |
| `js/access-config.js` | El mismo hash de la clave original, separado del resto de la lógica. |
| `assets/` | Se conservan todos los recursos gráficos originales. Aquí puedes añadir las fotos reales. |

Los cuatro scripts deben mantenerse y cargarse en el orden que ya aparece en el HTML. No basta con copiar únicamente `app.js`.

## 3. Añadir las fotos de Lorena

Las fotos reales **no venían en el material disponible**. Por eso el juego usa la ilustración pirata existente cuando no encuentra las fotos nuevas. La aventura se puede completar así, sin esperar a las imágenes.

### Primera foto de infancia: el puzle

Guárdala como:

```text
assets/lorena-infancia-1.jpg
```

No tienes que tocar el código si usas ese nombre. Al volver a cargar la página, la foto sustituirá a la ilustración del puzle. Si el archivo es PNG, WebP o tiene otro nombre, modifica `photos.puzzle.src` en `js/game-data.js` para que coincida. Cambiar sólo la extensión de un archivo no lo convierte a otro formato.

El puzle recorta la foto desde el centro para obtener un cuadrado y divide esa vista en nueve piezas. Una foto cuadrada, con Lorena centrada, da el resultado más predecible. La opción «Ver el retrato completo» muestra la referencia para resolverlo.

### Segunda foto de infancia: el cierre

Guárdala como:

```text
assets/lorena-infancia-2.jpg
```

Se mostrará junto al mensaje de cumpleaños y la tripulación, después del regalo. Para otro nombre o formato, modifica `photos.finale.src`.

### Tercera foto, opcional: portada y pasaporte

Puedes conservar la ilustración pirata o añadir una foto actual, por ejemplo `assets/lorena-actual.jpg`, y cambiar estas dos entradas en `js/game-data.js`:

```js
hero: './assets/lorena-actual.jpg',
heroAlt: 'Retrato de Lorena',
```

Las fotos se cargan desde `assets`; no se envían a ningún servicio. La ilustración original incluye texto dibujado dentro de la propia imagen. Si quieres sustituir ese marco y sus datos, utiliza una foto real en esta configuración.

## 4. Las cinco pruebas

La ruta se desbloquea en orden. Cada prueba concede un sello. Una respuesta incorrecta permite repetir y nunca cuenta como un acierto. No hay cronómetro ni límite de intentos.

| Escala | Mecánica | Contenido |
| --- | --- | --- |
| El retrato perdido | Puzle de 3 × 3. Se pulsan dos piezas para intercambiarlas. | Primera foto de infancia; ilustración de respaldo. |
| Los puertos de la memoria | Relacionar cinco recuerdos con sus destinos. | Portugal, Japón, Andorra, Atenas y Logroño. |
| El idioma de la capitana | Completar cuatro frases con tres opciones cada una. | Expresiones enviadas por Alberto, Patri y su compañero de aventuras. |
| Mensajes en una botella | Adivinar quién envió cada una de tres anécdotas. | Arantxa, Marta del clínico y Ana. |
| La taberna secreta | Colocar seis letras en orden. | El bar recordado por Tamara y Vero: TRASGU. |

Después de acertar se puede leer el recuerdo, y se avanza con un botón. La web no salta sola a la siguiente pregunta. Las pruebas completadas siguen disponibles desde el mapa para releer los mensajes.

En la cuarta prueba se pregunta por **la persona que envió el recuerdo al cuestionario**. Las dos Martas están diferenciadas como «Marta del clínico» y «Marta de basket».

La nueva anécdota de Arantxa aparece resumida en la pregunta. Su texto íntegro, con la redacción que facilitaste, se abre después de resolverla. La anécdota antigua se ha retirado. Las menciones a rankings de profundidad quedan dentro de su recuerdo; no se usan como preguntas de geografía ni como hechos comprobados.

## 5. Diseño responsive

- El contenido puede aprovechar hasta **1.440 px de ancho útil** en pantallas grandes, con márgenes a ambos lados.
- Desde **1.100 px**, la ruta de las pruebas ocupa una columna lateral de 260 px y el juego tiene su propia zona amplia.
- Por debajo, la ruta se convierte en un panel plegable encima de la prueba.
- En móvil, las tarjetas y los controles se reorganizan en una columna. El puzle conserva su forma cuadrada.
- Las seis letras se muestran en una fila cuando caben; en móviles de menos de 375 px se distribuyen en dos filas para conservar botones cómodos.
- Se puede usar teclado, ratón o pantalla táctil. No hay acciones que exijan arrastrar.
- El zoom del navegador está permitido. Si el dispositivo pide menos animaciones, se reduce el movimiento y no se lanza confeti.

Un ancho máximo evita que los textos se extiendan de un extremo a otro en monitores muy grandes. La web se adapta al espacio disponible sin estirar desproporcionadamente el contenido.

## 6. Guardado y reinicio

La partida se guarda automáticamente en `localStorage`, bajo la clave `lorena-pirate-game-v2`. Guarda la pantalla actual, los sellos, las posiciones del puzle, los puertos resueltos, las respuestas correctas y las letras colocadas.

- Volver al mapa o al pasaporte no borra los avances.
- Recargar recupera la partida del mismo navegador y del mismo origen o dirección local.
- Cambiar de dispositivo, de navegador o de dirección no traslada la partida.
- Si el navegador bloquea el almacenamiento, la interfaz avisa y permite seguir jugando durante esa sesión.
- «Reiniciar» abre una confirmación. Si se acepta, borra todos los avances y retira de la interfaz el regalo y los mensajes ya descubiertos. La sesión de acceso sigue activa.

El acceso conserva la clave original y utiliza `sessionStorage`, como antes. La comprobación emplea la API criptográfica del navegador: usa un navegador actual; si un entorno HTTP no seguro la bloquea, abre el juego mediante HTTPS o un servidor local.

## 7. Cambiar textos y regalo

La configuración está al principio de `js/game-data.js`:

- `photos`: rutas y textos alternativos de las imágenes.
- `gift`: destino, acompañante, tipo de viaje, imagen, mensaje y pista final opcional.
- `challenges`: minijuegos y contenidos.
- `crew`: once personas, sus descripciones y sus respuestas originales.

Se conserva el regalo que ya figuraba en tu proyecto: **Punta Cana, República Dominicana, Lorena + acompañante, resort all-inclusive**. No se han añadido fechas ni reservas. Si vas a cambiar el regalo, actualiza también `gift.image`: la imagen original contiene el nombre del destino dentro del dibujo.

`gift.finalClue` queda vacío. Si al final quieres conducirla a un regalo físico, puedes escribir ahí una pista concreta. Mientras esté vacío, no se muestra ningún paso adicional.

Si cambias IDs de preguntas, respuestas correctas o reglas, actualiza `version` en `game-data.js` o reinicia la partida de prueba para no mezclar un guardado antiguo con el contenido nuevo. Cambiar sólo las fotos o corregir una errata no requiere modificar el motor.

## 8. Guía rápida para organizar el cumpleaños

Planifica unos **25–35 minutos como orientación**, según cuánto os detengáis a comentar las historias. Es una estimación para organizar la actividad, no un tiempo medido ni impuesto por la web.

1. Abre la web en el dispositivo que vais a usar y comprueba la clave y las fotos.
2. Si has hecho un ensayo, pulsa «Reiniciar» antes de dárselo a Lorena.
3. Entrega la clave de embarque y deja que empiece. En un ordenador podéis leer los recuerdos juntos; en móvil puede ir resolviendo ella.
4. Usa las pistas cuando haga falta. La gracia está en recordar y reírse, no en bloquearla.
5. Tras el quinto sello, deja que pulse «Abrir mi tesoro».
6. Después del regalo, abre el mensaje de la tripulación: ahí aparecen las once personas.

### Soluciones para quien organiza

| Prueba | Solución |
| --- | --- |
| Puzle | Reconstruir la imagen. Con lector de pantalla, las piezas del 1 al 9 van ordenadas por filas. |
| Puertos | Boliñas → Portugal; mochila y español → Japón; untador → Andorra; kebab a pagar al día siguiente → Atenas; cuenta de la calle Laurel → Logroño. |
| Frases | Tomate; cloaca; explico; pides cambio. |
| Botellas | Metro → Arantxa; grupo equivocado → Marta del clínico; fuente y policía → Ana. |
| Taberna | TRASGU. |

## 9. Alcance técnico

Esta es una aventura estática para el cumpleaños. No usa servidor, cuentas de jugador, sincronización entre móviles, analítica ni servicios de terceros. Los recursos, textos y respuestas forman parte de los archivos de la web; la clave de entrada mantiene la experiencia del proyecto original.

El regalo sólo se inserta en la interfaz al obtener los cinco sellos. El recurso `cofre.png` original contiene la misma imagen que revela el destino, por lo que no se utiliza como adorno en las pantallas anteriores.

Las comprobaciones de la entrega se documentan en `VERIFICACION.md`.
