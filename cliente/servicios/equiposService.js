(function () {
	angular.module('servicios').service('equiposService', equiposService);


	function equiposService($resource)  {
        this.equipos =  $resource("/api/pub/equipos/");
	};

}());   