var mongodb = require('./mongodb.js')
var mongoCol = "partidos"

exports.findingByGrupo = function (grupo) {
	return mongodb.aggregating(mongoCol, [{
	   $match: {
           grupo: grupo
       }	
    },{
        $lookup: {
		  from: "equipos",
          localField: "local",
          foreignField: "id",
          as: "equipoLocal"
		}
	},{
       $lookup: {
		  from: "equipos",
          localField: "visitante",
          foreignField: "id",
          as: "equipoVisitante"
		} 
    }]);
}

exports.inserting = function (partido) {
	return mongodb.inserting(mongoCol, partido);
}