(function () {

	angular.module('equipos', ['ui.router', 'pavComponentes', 'servicios'])
		.config(function ($stateProvider) {
			$stateProvider
				.state('equipos', {
					url: '/equipos',
					template: '<pav-equipos></pav-equipos>'
				})
		})
		.component('pavEquipos', {
			templateUrl: './estados/equipos/equipos.html',
			controller: function (equiposService, maestrosService) {
				var vm = this;
				

				vm.nuevoEquipo = new equiposService.equipos();
				vm.maestros = maestrosService;

				vm.guardarEquipo = function () {
					vm.nuevoEquipo.$save()
						.then(function (result) {
                            vm.nuevoEquipo = new equiposService.equipos();
						}, function (error) {
							console.error(error);
						});
				};


			}
		})

}());
