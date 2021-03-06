var mongodb = require('./mongodb.js')
var mongoCol = "equipos"

exports.findingByGrupo = function (grupo) {
	return mongodb.finding(mongoCol, {
		grupo: grupo
	});
}

exports.findingGrupos = function() {
    return mongodb.findingDistinct(mongoCol, {}, 'grupo');
}

exports.finding = function() {
    return mongodb.finding(mongoCol, {});
}

exports.inserting = function (partido) {
	return mongodb.inserting(mongoCol, partido);
}

