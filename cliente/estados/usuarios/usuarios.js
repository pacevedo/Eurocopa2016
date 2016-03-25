(function () {

	angular.module('usuarios', ['ui.router', 'pavComponentes', 'servicios'])
		.config(function ($stateProvider) {
			$stateProvider
				.state('usuarios', {
					url: '/usuarios',
					template: '<pav-usuarios></pav-usuarios>'
				})
		})
		.component('pavUsuarios', {
			templateUrl: './estados/usuarios/usuarios.html',
			controller: function (usuariosService) {
				var vm = this;

			},
		})

}());