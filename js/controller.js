angular.module('RouteControllers', [])
    .controller('HomeController', function($scope, store) {
        $scope.title = 'Welcome To Angular Todo!';
        $scope.username = store.get('username');
    })
    .controller('RegisterController', function($scope, $q, $location, UserAPIService, store) {
        $scope.submitForm = function() {
            if ($scope.registrationForm.$valid) { 
                UserAPIService.register($scope.user.username, $scope.user.password
                ).then(function(results) {
                    console.log('Successfully registered the user', results.data.username);
                    store.set('username', results.data.username);
                    return UserAPIService.login($scope.user.username, $scope.user.password);
                }).catch(function(err) {
                    console.log('Registration failed:', err);
                    return $q.reject(err);
                }).then(function(results) {
                    store.set('authToken', results.data.token);
                    console.log('Successfully logged in with the token', results.data.token);
                    $location.path("/todo");
                }).catch(function(err) {
                    console.log('Login failed:', err);
                });
            }
        };
    })
    .controller('LoginController', function($scope, $location, UserAPIService, store) {
        $scope.submitForm = function() {
            if ($scope.loginForm.$valid) {
                UserAPIService.login($scope.user.username, $scope.user.password
                ).then(function(results) {
                    store.set('username', $scope.user.username);
                    store.set('authToken', results.data.token);
                    console.log('Successfully logged in with the token', results.data.token);
                    $location.path("todo");
                }).catch(function(err) {
                    console.log('Login failed:', err);
                });
            }
        };
    })
    .controller('LogoutController', function(store) {
        store.remove('username');
        store.remove('authToken');
    })
    .controller('TodoController', function($scope, $location, TodoAPIService, store) {
        $scope.authToken = store.get('authToken');
        $scope.username = store.get('username');
        if (!$scope.authToken) {
            $location.path("/accounts/login");
        }

        var refreshTodos = function() {
            TodoAPIService.getTodos($scope.username, $scope.authToken
            ).then(function(results) {
                $scope.todos = results.data || [];
                console.log('Todos retrieved:', $scope.todos);
            }).catch(function(err) {
                console.log('Failed getting todos:', err);
            });
        }

        refreshTodos();
 
        $scope.submitForm = function() {
            if ($scope.todoForm.$valid) {
                TodoAPIService.createTodo($scope.username, $scope.todo, $scope.authToken).then(function(results) {
                    refreshTodos();
                    console.log('Todo created:', results);
                }).catch(function(err) {
                    console.log('Failed creating todo:', err);
                });
            }
        };

        $scope.clickEdit = function(id) {
            $location.path('/todo/edit/' + id);
        };
 
        $scope.clickDelete = function(id) {
            TodoAPIService.deleteTodo(id, $scope.username, $scope.authToken).then(function(results) {
                refreshTodos();
                console.log('Todo deleted:', results);
            }).catch(function(err) {
                console.log('Failed deleting todo:', err);
            });
        };
    })
    .controller('EditTodoController', function($scope, $routeParams, TodoAPIService, store) {
        $scope.submitForm = function() {
            if ($scope.todoForm.$valid) {
                TodoAPIService.editTodo($routeParams.id, $scope.username, $scope.todo, $scope.authToken).then(function(results) {
                    console.log('Todo edited:', results);
                }).catch(function(err) {
                    console.log('Failed editing todo:', err);
                });
            }
        };
    });
