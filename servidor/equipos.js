"use strict";
var equiposData = require('./data/equiposData.js');
var enrutar = function (app, ruta) {
    // una para ir a la colección
	app.route(ruta)
		.get(function (peticion, respuesta) {
            if (peticion.query.grupo != null) {
			equiposData.findingByGrupo(peticion.query.grupo)
                .then(function (equipos) {
                    if (equipos && equipos.length > 0)
                        respuesta.json(equipos);
                    else
                        respuesta.status(204).send();
                })
                .fail(function (err) {
                    respuesta.status(500).send(err);
                });
            } 
            else {
                equiposData.finding()
                .then(function (equipos) {
                    if (equipos && equipos.length > 0)
                        respuesta.json(equipos);
                    else
                        respuesta.status(204).send();
                })
                .fail(function (err) {
                    respuesta.status(500).send(err);
                });
            }
		})
        .post(function (peticion, respuesta) {
			var equipo = peticion.body;
			equiposData.inserting(equipo)
				.then(function (data) {
					respuesta.status(201).json(equipo);
				})
				.fail(function (err) {
					respuesta.status(500).send(err);
				});
		});
}

module.exports = enrutar;