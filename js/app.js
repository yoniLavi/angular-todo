angular.module('TodoApp', ['ngRoute', 'angular-storage', 'RouteControllers', 'UserService',  'TodoService']);

angular.module('TodoApp').config(function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'templates/home.html',
        controller: 'HomeController'
    })
    .when('/accounts/register', {
        templateUrl: 'templates/register.html',
        controller: 'RegisterController'
    })
    .when('/todo', {
        templateUrl: 'templates/todo.html',
        controller: 'TodoController'
    });
});
