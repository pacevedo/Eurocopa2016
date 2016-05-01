"use strict";
var partidosData = require('./data/partidosData.js');
var enrutar = function (app, ruta) {
    // una para ir a la colección
	app.route(ruta)
		.get(function (peticion, respuesta) {
            if (peticion.query.grupo != null) {
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
            } else if (peticion.query.fase != null){
                partidosData.findingByFase(peticion.query.fase, peticion.query.parte)
                    .then(function (partidos) {
                        if (partidos && partidos.length > 0)
                            respuesta.json(partidos);
                        else
                            respuesta.status(204).send();
                    })
                    .fail(function (err) {
                        respuesta.status(500).send(err);
                    });    
            } else {
                respuesta.status(500).send(err);
            }
		})
        .post(function (peticion, respuesta) {
			var partido = peticion.body;
			partidosData.inserting(partido)
				.then(function (data) {
					respuesta.status(201).json(partido);
				})
				.fail(function (err) {
					respuesta.status(500).send(err);
				});
		});
}

module.exports = enrutar;