(function () {
	angular.module('pavMenu', ['ui.router'])
		.controller('MenuCtrl', menuCtrl)
		.component('pavMenuNavegacion', {
			templateUrl: './componentes/menu/tpl-menu-navegacion.html',
			controller: 'MenuCtrl'
		})

	function menuCtrl($state) {
		this.soyElEstadoActivo = function (estado) {
			return $state.is(estado);
		}
	}
}());