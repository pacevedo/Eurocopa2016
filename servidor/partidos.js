"use strict";
var partidosData = require('./data/partidosData.js');
var enrutar = function (app, ruta) {
    // una para ir a la colección
	app.route(ruta)
		.get(function (peticion, respuesta) {
			partidosData.findingByGrupo(peticion.query.grupo)
                .then(function (partidos) {
                    if (partidos && partidos.length > 0)
                        respuesta.json(partidos);
                    else
                        respuesta.status(204).send();
                })
                .fail(function (err) {
                    respuesta.status(500).send(err);
                });
		});
}

module.exports = enrutar;