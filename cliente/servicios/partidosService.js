(function () {
	angular.module('servicios').service('partidosService', partidosService);


	function partidosService($resource)  {
        this.partidos =  $resource("/api/pub/partidos/");
        this.equipos = $resource("/api/pub/equipos");
	};

}()); 