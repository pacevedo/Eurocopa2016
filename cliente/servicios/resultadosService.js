(function () {
	angular.module('servicios').service('resultadosService', resultadosService);


	function resultadosService($resource)  {
       
       var gruposStr = ['A', 'B', 'C', 'D', 'E', 'F'];
       var grupos = [];
       gruposStr.forEach(function(elem){
           var grupo = {
               nombre: elem,
               equipos: $resource("/api/pub/equipos?grupo="+elem).query(),
               partidos: $resource("/api/pub/partidos?grupo="+elem).query()
           }
           grupos.push(grupo);
       });
       this.grupos = grupos;
	};

}());