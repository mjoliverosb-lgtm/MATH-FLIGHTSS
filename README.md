Esta carpeta está reservada para fuentes locales.

Por ahora el juego carga "Orbitron" y "Exo 2" desde Google Fonts vía CDN
(enlace <link> en index.html), lo cual es el método estándar y más
confiable para un sitio alojado en GitHub Pages — no requiere mantener
archivos de fuente en el repositorio.

Si prefieres que funcione 100% sin conexión a Google Fonts:
1. Descarga los archivos .woff2 de https://fonts.google.com/specimen/Orbitron
   y https://fonts.google.com/specimen/Exo+2
2. Colócalos aquí, en fonts/
3. Agrega las reglas @font-face correspondientes al inicio de css/style.css
4. Quita el <link> de Google Fonts en index.html
