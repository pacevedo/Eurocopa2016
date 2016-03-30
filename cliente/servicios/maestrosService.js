(function () {

	angular.module('servicios').service('maestrosService', maestrosService);

	function maestrosService() {
		this.grupos = ['A', 'B', 'C', 'D', 'E', 'F'];
        this.fases = ['Primera', 'Octavos', 'Cuartos', 'Semis', 'Final'];
	}

}());
