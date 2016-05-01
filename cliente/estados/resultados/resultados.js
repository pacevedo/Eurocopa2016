(function () {

	angular.module('resultados', ['ui.router', 'pavComponentes', 'servicios', 'ngAnimate', 'ui.bootstrap'])
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
                vm.octavosAlta = resultadosService.octavosAlta;
                vm.octavosBaja = resultadosService.octavosBaja;
                vm.octavos = resultadosService.octavos;
                vm.cuartos = resultadosService.cuartos;
                vm.cuartosAlta = resultadosService.cuartosAlta;
                vm.cuartosBaja = resultadosService.cuartosBaja;
                vm.semis = resultadosService.semis;
                vm.semisAlta = resultadosService.semisAlta;
                vm.semisBaja = resultadosService.semisBaja;
                vm.final = resultadosService.final;
                vm.calculaPuntuacion = function(grupo, grupos) {
                    vm.campo = 'puesto';
                    resultadosService.setClasificacionGrupo(grupo, grupos, vm.octavosAlta, vm.octavosBaja, vm.octavos);
                }
                angular.element(document).ready(function () {
                    vm.grupos.forEach(function(grupo) {
                        resultadosService.setClasificacionGrupo(grupo,vm.grupos,vm.octavosAlta,vm.octavosBaja,vm.octavosBaja);
                    });
                });
                
                
			},
		})
        
        /**
         * Función que calcula la clasificación
         */
        /*this.setClasificacion = function (vm){
            vm.grupos.forEach(function(grupo) {
                resultadosService.setClasificacionGrupo(grupo,vm.octavosAlta,vm.octavosBaja,vm.octavosBaja);
            });
        }*/
}());
