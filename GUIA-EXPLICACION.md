# Guía para explicar el portafolio (v8, bosque)

Esta guía es para explicar el proyecto sin entrar en tecnicismos. Cada parte dice qué hace y en qué archivo está.

## React

La etiqueta React en la lista de tecnologías se monta desde `react-entry.jsx`. El archivo `script.js` y las funciones originales del portafolio se conservan.

Para iniciar el proyecto con React, ejecuta `npm install` una vez y luego `npm run dev`. Para compilarlo, ejecuta `npm run build`.

## La idea general

El portafolio es una sola página que se recorre de lado a lado, como un libro horizontal. La rueda del ratón, las flechas del teclado o la barra lateral mueven la página hacia la derecha o la izquierda.

- Portada: el nombre con el paisaje de fondo.
- Sobre mí, Habilidades, Proyectos, Educación y Contacto: un panel por cada sección.

## Los dos temas

El botón **Claro / Oscuro** cambia el paisaje:

- **Claro**: un paisaje de invierno, con montañas nevadas, árboles y nieve que cae.
- **Oscuro**: el mismo bosque de noche, con cielo estrellado y una aurora.

La elección se guarda en el navegador, así que al volver la página sigue igual. El tema se decide antes de dibujar la página, por eso no parpadea.

Las escenas son dibujos en SVG (formas vectoriales, sin fotos). Si quieres poner fotos propias, mira las líneas `--foto-claro` y `--foto-oscuro` en `style.css`.

## Profundidad al hacer scroll

Cada capa del paisaje se mueve a una velocidad distinta: el cielo casi no se mueve, los árboles cercanos se mueven más. Eso da sensación de profundidad. En `script.js` cada capa tiene un número `data-vel` en `index.html`.

## Las letras de la bienvenida

- Al entrar, las letras aparecen desde el centro: empiezan borrosas y se enfocan.
- Al bajar, la bienvenida se va hacia la izquierda y las letras se dispersan desde el centro, girando un poco y perdiendo nitidez.

El JavaScript separa el nombre en letras y calcula cuánto se dispersa cada una según su posición.

## Proyectos que funcionan

Cada tarjeta abre una ventana con descripción, etiquetas y enlaces. Tres de los cuatro proyectos tienen una demostración que funciona dentro de la ventana:

- **Lista de tareas**: agrega, marca y borra. Se guarda en el navegador.
- **Calculadora de propinas**: calcula la propina, el total y lo que toca a cada persona.
- **Generador de contraseñas**: crea contraseñas con la longitud y los tipos de caracteres que elijas.

El filtro de arriba muestra solo los proyectos con esa tecnología.

Para cambiar los proyectos, edita la lista `PROYECTOS` al inicio de `script.js`.

## Preguntas probables

**¿Por qué no hay gráficas ni números?** El portafolio muestra lo que haces, no métricas. Las habilidades se explican con texto y etiquetas.

**¿Funciona sin internet?** Casi todo sí. La tipografía viene de Google Fonts; sin conexión se usa una letra del sistema.

**¿Qué hace el formulario de contacto?** Revisa que los campos estén bien escritos. Para que el mensaje llegue a tu correo hay que conectarlo a un servicio de envío.

**¿Cómo está hecho el scroll horizontal?** Todas las secciones están en una fila dentro de un contenedor con desplazamiento horizontal. La rueda del ratón se traduce en ese desplazamiento.

## Qué cambiar antes de entregar

1. `PERFIL.correo` en `script.js`: tu correo real.
2. `PERFIL.redes`: tus enlaces de GitHub y LinkedIn.
3. `PROYECTOS`: tus proyectos y sus enlaces de código.
4. Texto de Sobre mí, Formación y Habilidades en `index.html`.
5. `PERFIL.cv`: la ruta de tu CV, si quieres mostrar el botón de descarga.
