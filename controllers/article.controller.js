/* Esto sera una clase donde tendremos los diferentes métodos y rutas de nuestro backend */
"use strict";

var validator = require("validator");
var Article = require("../models/article.model");
var path = require("path");
var fs = require("fs");
const { exists } = require("../models/article.model");

var controller = {
  /* Metodos de prueba */
  datosCurso: (req, res) => {
    return res.status(200).send({
      curso: "Framewoks de JS",
      anio: 2020,
    });
  },
  test: (req, res) => {
    return res.status(200).send({
      message: "Test de article.controller",
    });
  },
  /* Fin de metodos de prueba */

  /* El metodo save nos permitira crear nuevos articulos */
  save: (req, res) => {
    /* Recoger parametros por post */
    var params = req.body; /* Recogemos lo que llegue por el body */
    /* console.log(params); Al hacer una petición post por postman veremos que nos aparece en consola lo que escribimos */

    /* Validar datos con librería validator */
    try {
      var validateTitle = !validator.isEmpty(params.title);
      var validateContent = !validator.isEmpty(params.content);
      /* title y content son keys que se usan en postman */
    } catch (err) {
      return res.status(200).send({
        message: "Faltan datos por enviar",
      });
    }

    /* if de prueba para ver que valide los datos en postman
    if (validateTitle && validateContent) {
      return res.status(200).send({
        message: "Datos validados correctamente",
      });
    } */

    if (validateTitle && validateContent) {
      /* Crear el objeto a guardar */
      var article = new Article();
      /* Asignar valores */
      article.title = params.title;
      article.content = params.content;
      article.image = null;

      /* Guardar el articulo */
      article.save((err, articleStored) => {
        if (err || !articleStored) {
          return res.status(404).send({
            status: "Error",
            message: "Error al guardar",
          });
        }
        /* Devolver respuesta */
        return res.status(200).send({
          status: "Success",
          article: articleStored,
        });
      });
    } else {
      return res.status(200).send({
        message: "Datos incorrectos",
      });
    }
    /* return res.status(200).send({
      message: "Método save",
    }); */
  },
  /* El método getArticles nos permitira obtener los articulos */
  getArticles: (req, res) => {
    var query = Article.find({});

    /* Sacar los ultimos articulos */
    var last = req.params.last; /* Viene de las rutas */
    /* console.log(last); */
    if (last || last != undefined) {
      query.limit(
        5
      ); /* limit es un metodo que pone como limite una cantidad, es decir aquí nos mostrara solo el numero de elementos que se ponga */
    }

    /* Con find para obtener los datos de la BD, lo dejaremos vacio para así obtener todos los datos se podría poner condicionales, como un where en SQL */
    /* el metodo sort nos sirve para ordenar, como parametro le ponemos la propiedad, si queremos que sea de forma descendente se pone un menos antes de la propiedad */
    query.sort("-_id").exec((err, articles) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "Error al mostrar articulos",
        });
      }
      if (!articles) {
        return res.status(404).send({
          status: "error",
          message: "No hay articulos que mostrar",
        });
      }
      return res.status(200).send({
        status: "Success",
        articles,
      });
    });
    /*  return res.status(200).send({
      message: "Metodo getArticles",
    }); */
  },
  /* El método getArticle nos permitira obtener un unico articulo */
  getArticle: (req, res) => {
    /* Recoger el id de la url */
    var articleId = req.params.id;
    /* Comprobar que existe */
    if (!articleId || articleId == null) {
      return res.status(404).send({
        status: "Error",
        message: "Articulo no encontrado",
      });
    }
    /* Buscar el articulo   */
    Article.findById(articleId, (err, article) => {
      if (err || !article) {
        return res.status(404).send({
          status: "Error",
          message: "No existe el articulo " + articleId,
        });
      }
      /* Devolver en JSON */
      return res.status(200).send({
        status: "Success",
        article,
      });
    });
    /* return res.status(200).send({
      message: "Metodo getArticle",
    }); */
  },
  /* El metodo updateArticle nos servira para actualizar el articulo */
  updateArticle: (req, res) => {
    /* Recoger el id del articulo que viene por la ur */
    var articleId = req.params.id;
    /* Recoger los datos que llegan por put */
    var params = req.body;
    /* Validar datos */
    try {
      var validateTitle = !validator.isEmpty(params.title);
      var validateContent = !validator.isEmpty(params.content);
    } catch (err) {
      return res.status(200).send({
        status: "Error",
        message: "Faltan datos por enviar",
      });
    }

    if (validateTitle && validateContent) {
      /* Find and update */
      Article.findOneAndUpdate(
        {
          _id: articleId,
        },
        params,
        {
          new: true,
        } /* Para que al actualizar nos devuelva el json actualizado */,
        (err, articleUpdated) => {
          if (err || !articleUpdated) {
            return res.status(500).send({
              status: "Error",
              message: "Error al actualizar",
            });
          }
          return res.status(200).send({
            status: "Success",
            article: articleUpdated,
          });
        }
      );
    } else {
      return res.status(200).send({
        status: "Error",
        message: "Validación incorrecta",
      });
    }

    /* Devolver respuesta */
    /* return res.status(200).send({
      message: "Metodo updateArticle",
    }); */
  },
  /* El metodo deleteArticle nos servira para eliminar un articulo */
  deteleArticle: (req, res) => {
    /* Recoger el id de la url */
    var articleId = req.params.id;
    /* Find and delete */
    Article.findOneAndDelete({ _id: articleId }, (err, articleRemoved) => {
      if (err || !articleRemoved) {
        return res.status(500).send({
          status: "Error",
          message: "Error al borrar",
        });
      }

      return res.status(200).send({
        status: "Success",
        article: articleRemoved,
      });
    });
    /* return res.status(200).send({
      message: "Metodo deleteArticle",
    }); */
  },
  /*  */
  uploadFiles: (req, res) => {
    /* Se debe de configurar el modulo connect multiparty en las rutas*/
    /* Recoger el fichero de la petición */
    var fileName = "imagen no cargada";

    if (!req.files) {
      return res.status(404).send({
        status: "Error",
        message: fileName,
      });
    }
    /* Conseguir el nombre y la extensión del archivo */
    var filePath =
      req.files.file0
        .path; /* Para obtener la ruta con el nombre del archivo, file0 es un nombre por defecto que las librerías le ponen a los archivos */
    var fileSplit = filePath.split(
      "\\"
    ); /* Nos ayuda a separar en pedazos el filePath y así solo tener el nombre */
    fileName = fileSplit[3];
    var extensionSplit = fileName.split(".");
    var fileExtension = extensionSplit[1];
    /* Comprobar la extensión */
    if (
      fileExtension != "png" &&
      fileExtension != "jpg" &&
      fileExtension != "jpeg" &&
      fileExtension != "gif"
    ) {
      /* Borrar el archivo, necesitamos la librería de fileSystem (fs)*/
      /* unlink permite eliminar un fichero */
      fs.unlink(filePath, (err) => {
        return res.status(200).send({
          status: "Error",
          message: "Archivo no compatible",
        });
      });
    } else {
      /* Buscar el articulo, asignar el nombre de la imagen y actualizar */
      var articleId = req.params.id;
      Article.findOneAndUpdate(
        { _id: articleId },
        { image: fileName },
        { new: true },
        (err, articleUpdated) => {
          if (err || !articleUpdated) {
            return res.status(300).send({
              status: "Error",
              message: "Error al subir imagen",
            });
          }
          return res.status(200).send({
            status: "Success",
            article: articleUpdated,
          });
        }
      );
      /*PRUEBAS 
      return res.status(200).send({
        fichero: req.files,
        split: fileName,
        extension: fileExtension,
      }); */
    }
    /* return res.status(200).send({
      message: "Metodo uploadFiles",
    }); */
  },
  /* El metodo getImage nos ayudara a obtener laimagen */
  getImage: (req, res) => {
    var file = req.params.image;
    var pathFile = "./upload/articles/img/" + file;
    /* exits es para saber si existe el archivo, pertenece a la libreria fs */
    fs.exists(pathFile, (exists) => {
      if (exists) {
        return res.sendFile(path.resolve(pathFile));
      } else {
        return res.status(404).send({
          status: "Error",
          message: "No se encontro la imagen",
        });
      }
    });
    /* return res.status(200).send({
      message: "Metodo getImage",
    }); */
  },
  /* El metodo search sirve para buscar un dato en la BD */
  search: (req, res) => {
    /* Sacar el string a buscar */
    var searchString = req.params.search;
    /* Find or para hacer varias condiciones */
    /* $or es un operador de mongoose, dentro de los corchetes se mete cun objeto con una condicion, $regex: searchString quiere decir que cuando el titulo contenta el searchString y los options tiene i para decir si esta incluido, es decir si el searchString esta incluido en el title o en el content entonces mostrara los articulos que coincidan con eso. sort es para ordenar, otra forma de ordenar es poniendo doble corchete (array)  y podemos ponemos varias reglas, por fecha y descendiente y con exec nos ejecuta la query*/
    Article.find({
      $or: [
        { title: { $regex: searchString, $options: "i" } },
        { content: { $regex: searchString, $options: "i" } },
      ],
    })
      .sort([["date", "descending"]])
      .exec((err, articles) => {
        if (err) {
          return res.status(500).send({
            status: "Error",
            message: "Error al buscar",
          });
        }

        if (!articles || articles <= 0) {
          return res.status(500).send({
            status: "Error",
            message: "No se encontraron articulos para mostrar",
          });
        }

        return res.status(200).send({
          status: "Success",
          articles,
        });
      });

    /* return res.status(200).send({
      message: "Metodo search",
    }); */
  },
};

module.exports = controller;
