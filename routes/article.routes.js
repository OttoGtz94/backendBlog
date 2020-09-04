"use strict";

var express = require("express");
var ArticleController = require("../controllers/article.controller");

var router = express.Router();

/* Multiparty nos ayuda a cargar los archivos */
var multiparty = require('connect-multiparty');
var middlewareUpload = multiparty({ uploadDir: './upload/articles/img'});
/* El middleware de Upload se lo tenemos que pasar a la ruta como un parametro */

/* Rutas de prueba */
router.get("/test-de-controlador", ArticleController.test);
router.post("/datos-curso", ArticleController.datosCurso);
/* Fin de rutas de prueba */
/* Rutas utiles */
router.post("/save", ArticleController.save);
router.get("/ver-articulos/:last?", ArticleController.getArticles); /* last es un parametro para obtener el valor de la url, es decir como buscar algún dato en especifico ejemplo curso.com/cursos/js js vendría siendo nuestro last y lo llamamos en nuestro article.controller */
router.get("/articulo/:id", ArticleController.getArticle); /* con id sin el ? decimos que sera obligatorio */
router.put("/articulo/:id", ArticleController.updateArticle); 
router.delete("/articulo/:id", ArticleController.deteleArticle); 
router.post('/upload-image/:id', middlewareUpload, ArticleController.uploadFiles);
router.get('/get-image/:image', ArticleController.getImage);
router.get("/search/:search", ArticleController.search);

module.exports = router;
