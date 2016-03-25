"use strict";
var equiposData = require('./data/equiposData.js');
var partidosData = require('./data/partidosData.js');
var enrutar = function (app, ruta) {
    // una para ir a la colección
	app.route(ruta)
		.get(function (peticion, respuesta) {
            equiposData.findingGrupos()
                .then(function(gruposStr) {
                    if (gruposStr && gruposStr.length > 0) {
                        respuesta.json(gruposStr);
                    }else
                            respuesta.status(204).send();
                })
                .fail(function (err) {
                    respuesta.status(500).send(err);
                });
		});
}

module.exports = enrutar;