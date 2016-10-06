angular.module('TodoDirective',[])
    .directive('todoTable', function() {
      return {
        restrict: 'E',    // E -> element
        templateUrl: 'templates/directives/todo-table.html'
      };
    })
    .directive('todoNavbar', function() {
      return {
        restrict: 'E',    // E -> element
        templateUrl: 'templates/directives/todo-navbar.html'
      };
    });