var mongodb = require('./mongodb.js');
var mongoCol = "partidos";

var lookupLocal = {
        $lookup: {
		  from: "equipos",
          localField: "local",
          foreignField: "id",
          as: "equipoLocal"
		}
	};
var lookupVisitante = {
       $lookup: {
		  from: "equipos",
          localField: "visitante",
          foreignField: "id",
          as: "equipoVisitante"
		} 
    };

exports.findingByGrupo = function (grupo) {
	return mongodb.aggregating(mongoCol, [{
	   $match: {
           grupo: grupo
       }	
    },
    lookupLocal,
    lookupVisitante,
    {
        $sort: { fecha: 1}
    }]);
}

exports.findingByFase = function (fase, parte) {
    var condicion = null;
    if (parte != null){
        
        if (fase === 'Octavos'){
            num = 4;
        } else if (fase === 'Cuartos') {
            num = 2;
        } else if (fase === 'Semis') {
            num = 1;
        }
        if (parte === 'alta'){
            condicion = {$lte: num};
        } else {
            condicion =  {$gt: num};
        }
        return mongodb.aggregating(mongoCol, [{
            $match: {
                fase: fase,
                orden: condicion
            },
        },
        lookupLocal,
        lookupVisitante,
        {
            $sort: { orden: 1}
        }]);
    } else {
        return mongodb.aggregating(mongoCol, [{
            $match: {
                fase: fase
            }
        },
        lookupLocal,
        lookupVisitante,
        {
            $sort: { fecha: 1}
        }]);
    }
}


exports.inserting = function (partido) {
	return mongodb.inserting(mongoCol, partido);
}