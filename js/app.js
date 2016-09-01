// angular.module('TodoApp', ['ngRoute', 'UserCtrl', 'RouteControllers', 'UserService']);
angular.module('TodoApp', ['ngRoute', 'angular-storage', 'RouteControllers', 'UserService']);

angular.module('TodoApp').config(function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'templates/home.html',
        controller: 'HomeController'
    })
    .when('/accounts/register', {
        templateUrl: 'templates/register.html',
        controller: 'RegisterController'
    });
});
