(function () {

	angular.module('servicios').service('maestros_service', maestrosService);

	function maestrosService() {
		this.grupos = ['A', 'B', 'C', 'D', 'E', 'F'];
	}

}());
