angular.module('RouteControllers', [])
    .controller('HomeController', function($scope) {
        $scope.title = "Welcome To Angular Todo!";
    }).controller('RegisterController', function($scope, UserAPIService, store) {
 
        $scope.registrationUser = {};
        var url = "https://morning-castle-91468.herokuapp.com/";

        $scope.login = function() {
            UserAPIService.callAPI(url + "accounts/api-token-auth/", $scope.data).then(function(results) {
                $scope.token = results.data.token;
                store.set('username', $scope.registrationUser.username);
                store.set('authToken', $scope.token);
            }).catch(function(err) {
                console.log(err.data);
            });
        }

        $scope.submitForm = function() {
            if ($scope.registrationForm.$valid) {
                $scope.registrationUser.username = $scope.user.username;
                $scope.registrationUser.password = $scope.user.password;
 
                UserAPIService.callAPI(url + "accounts/register/", $scope.registrationUser).then(function(results) {
                    $scope.data = results.data;
                    if ($scope.data.username == $scope.registrationUser.username &&
                        $scope.data.password == $scope.registrationUser.password){
                        alert("You have successfully registered to Angular Todo");
 
                        $scope.login();
                    }
                }).catch(function(err) {
                    console.log(err);
                });
            }
        }
    }).controller('TodoController', function($scope, TodoAPIService, store) {
        var url = "https://morning-castle-91468.herokuapp.com/";
 
        $scope.authToken = store.get('authToken');
        $scope.username = store.get('username');
        $scope.todos = {};

        TodoAPIService.getTodos(url + "todo/", $scope.username, $scope.authToken).then(function(results) {
            $scope.todos = results.data;
            console.log($scope.todos);
        }).catch(function(err) {
            console.log(err);
        });

        $scope.todo = [];
 
        $scope.submitForm = function() {
            if ($scope.todoForm.$valid) {
                var todoData = {
                    title: $scope.todo.title,
                    description: $scope.todo.description,
                    status: $scope.todo.status,
                    username: $scope.username
                };
                $scope.todos.push(todoData);
 
                TodoAPIService.createTodo(url + "todo/", todoData, $scope.authToken).then(function(results) {
                    console.log(results);
                }).catch(function(err) {
                    console.log(err);
                });
            }
        }
    });