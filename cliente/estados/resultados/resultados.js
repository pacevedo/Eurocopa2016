(function () {

	angular.module('resultados', ['ui.router', 'pavComponentes', 'servicios'])
		.config(function ($stateProvider) {
			$stateProvider
				.state('resultados', {
					url: '/resultados',
					template: '<pav-resultados></pav-resultados>'
				})
		})
		.component('pavResultados', {
			templateUrl: './estados/resultados/resultados.html',
			controller: function (resultadosService) {
				var vm = this;
                vm.grupos = resultadosService.grupos;
			},
		})

}());
