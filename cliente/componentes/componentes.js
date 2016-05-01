(function () {

	angular.module('pavComponentes', ['pavMenu','resultados','servicios'])
		.component('pavContenido', {
			template: '<div class="container text-center" style="padding-top:60px;" ui-view></div>'
		})
        .directive('pavPartido', function () {
			return {
				restrict: 'A',
				templateUrl: './componentes/tpl-fila-partido.html',
				scope: {
					partido: '='
				},
                link : function ($scope, element, attrs) {
                    $scope.calculaClasificacion=function(grupo, grupos) {
                        $scope.$parent.$ctrl.calculaPuntuacion(grupo, grupos);
                    }
                }
			}
		})
        .directive('pavPartidoEliminatoria', function () {
			return {
				restrict: 'A',
				templateUrl: './componentes/tpl-fila-partido-eliminatoria.html',
				scope: {
					partido: '='
				},
            }
        })
        .directive('pavEquipo', function () {
			return {
				restrict: 'A',
				templateUrl: './componentes/tpl-fila-equipo.html',
				scope: {
					equipo: '='
				}
			}
		})
}());