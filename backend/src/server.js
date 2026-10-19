/**
 * Punto de entrada del servidor (server.js)
 *
 * Responsabilidad única: leer la configuración de entorno y
 * arrancar el servidor HTTP. No contiene lógica de aplicación.
 */
const { buildApp } = require("./app");

const port = process.env.PORT || 3000;
const app  = buildApp();

app.listen(port, () => {
  console.log(`API lista en http://localhost:${port}`);
});
