"use strict";

/* Cargar modulos para creacion de servidor */
var express = require("express");
var bodyParser = require("body-parser"); /* Recibir las peticiones y convertilos a JSON */

/* Ejecutar express */
var app = express();

/* Cargar ficheros rutas */
var articleRoutes = require("./routes/article.routes");

/* Middlewares */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* CORS (peticiones del front) es importante para permitir las llamadas http o las peticiones ajax al api desde cualquier frontend con otra ip diferente, es un midleware*/
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

/* Añadir prefijos a rutas/ cargar rutas */

app.use("/", articleRoutes);

/* Ruta de prueba */
/* app.get("/probando", (req, res) => {
  console.log("Hola mundo");
  return res.status(200).send(`
    <h1>Backend satisfactorio</h1>
    
  `)
  return res.status(200).send({
    curso: 'Frameworks de JS',
    anio: 2020,
  });
}); */

/* Exportar modulo (fichero actual) */
module.exports = app;
