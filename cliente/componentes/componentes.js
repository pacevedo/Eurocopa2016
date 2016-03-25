(function () {

	angular.module('pavComponentes', ['pavMenu'])
		.component('pavContenido', {
			template: '<div class="container text-center" style="padding-top:60px;" ui-view></div>'
		})
        .directive('pavPartido', function () {
			return {
				restrict: 'A',
				templateUrl: './componentes/tpl-fila-partido.html',
				scope: {
					partido: '='
				}
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