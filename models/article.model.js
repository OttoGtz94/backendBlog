/* Aquí definimos que propiedades tendra un articulo, sobre este modelo podemos conectarnos a la colección de articulos que se tendra en la BD */

"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

/* Aquí definimos la estructura que tendra cada uno de los objetos */
var ArticleSchema = Schema({
  title: String,
  content: String,
  date: {
    type: Date,
    default: Date.now /* Para que guarde la fecha actual */,
  },
  image: String,
});

/* Al exportarlo podemos usalor ya sea para obtener datos, ingresar datos, actualizar datos, etc */
module.exports = mongoose.model('Article', ArticleSchema);

/* Es importanrte que por cada colección de datos que tengamos en la BD tengamos un modelo para interactuar con la BD */
