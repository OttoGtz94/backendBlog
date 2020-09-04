"use strict";

/*  */
var mongoose = require("mongoose");
var app = require("./app");
var port = 5050;

mongoose.set(
  "useFindAndModify",
  false
); /* Para desactivar los metodos antiguos de MongoDB, así solo utilizamos los más actualizados */
/* Promesa */
mongoose.Promise = global.Promise;
/* Conexión a MongoDB */
mongoose
  .connect("mongodb://localhost:27017/api_rest_blog", { useNewUrlParser: true })
  .then(() => {
    console.log("Conexion a MongoDB satisfactoría");

    /* Creación del servidor */
    app.listen(port, () => {
      console.log("Servidor corriendo en el puerto " + port);
    });
  });
