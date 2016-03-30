(function () {

	angular.module('partidos', ['ui.router', 'pavComponentes', 'servicios'])
		.config(function ($stateProvider) {
			$stateProvider
				.state('partidos', {
					url: '/partidos',
					template: '<pav-partidos></pav-partidos>'
				})
		})
		.component('pavPartidos', {
			templateUrl: './estados/partidos/partidos.html',
			controller: function (partidosService, maestrosService) {
				var vm = this;
				

				vm.nuevoPartido = new partidosService.partidos();
				vm.maestros = maestrosService;
                vm.equipos = partidosService.equipos.query();


				vm.guardarPartido = function () {
                    vm.nuevoPartido.fecha = new Date(vm.nuevoPartido.fecha);
                    if (vm.nuevoPartido.local != null) {
                        vm.nuevoPartido.local = vm.nuevoPartido.local.id;
                    }
                    if (vm.nuevoPartido.visitante != null) {
                        vm.nuevoPartido.visitante = vm.nuevoPartido.visitante.id;
                    }
                    if (vm.nuevoPartido.fase == "Primera") {
                        vm.nuevoPartido.id = "1F-"+vm.nuevoPartido.local+"-"+vm.nuevoPartido.visitante;;
                    } 
					vm.nuevoPartido.$save()
						.then(function (result) {
                            vm.nuevoPartido = new partidosService.partidos();
						}, function (error) {
							console.error(error);
						});
				};


			}
		})

}());
