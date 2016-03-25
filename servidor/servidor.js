"use strict";
var express = require('express');
var bodyParser = require('body-parser');

var partidos = require('./partidos.js');
var equipos = require('./equipos.js');
var grupos = require('./grupos.js');

var app = express();

// Permite recuperar como objetos JavaScript el contenido emitido por el cliente
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.use(function (peticion, respuesta, siguiente) {
	console.log("recibida petición: " + peticion.url);
	siguiente();
});

app.use(express.static(__dirname + './../cliente'));


partidos(app, '/api/pub/partidos');
equipos(app, '/api/pub/equipos');
grupos(app, '/api/pub/grupos');

app.listen(3000);
console.log('listening on port 3000');