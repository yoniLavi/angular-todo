angular.module('RouteControllers', [])
    .controller('HomeController', function($scope, store) {
        $scope.title = 'Welcome To Angular Todo!';
        $scope.username = store.get('username');
    })
    .controller('RegisterController', function($scope, $q, $location, UserAPIService, store) {
        $scope.submitForm = function() {
            if (!$scope.registrationForm.$valid) {
                return;
            }
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
        };
    })
    .controller('LoginController', function($scope, $location, UserAPIService, store) {
        $scope.submitForm = function() {
            if (!$scope.loginForm.$valid) {
                return;
            }
            UserAPIService.login($scope.user.username, $scope.user.password
            ).then(function(results) {
                store.set('username', $scope.user.username);
                store.set('authToken', results.data.token);
                console.log('Successfully logged in with the token', results.data.token);
                $location.path("/todo");
            }).catch(function(err) {
                console.log('Login failed:', err);
            });
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

        // Initialize with an empty array to avoid race conditions.
        $scope.todos = $scope.todos || [];

        var findLocalTodo = function(id) {
            return $scope.todos.find(todo => todo.id == id);
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


        $scope.clickCreate = function() {
            $scope.editedId = null;
            $scope.todo = {
                status: "Todo",
            };
            $('#todo-modal').modal('show');
        };
 
        $scope.clickEdit = function(id) {
            $scope.editedId = id;
            var existingTodo = findLocalTodo(id) || {};
            // Make copy, to allow cancelling the changes
            $scope.todo = $.extend({}, existingTodo);
            $('#todo-modal').modal('show');
        };

        $scope.submitModal = function() {
            if (!$scope.todoForm.$valid) {
                return;
            }
            if ($scope.editedId) {
                TodoAPIService.editTodo($scope.editedId, $scope.username, $scope.todo, $scope.authToken
                ).then(function(results) {
                    refreshTodos();
                    console.log('Todo saved:', results);
                    $('#todo-modal').modal('hide');
                }).catch(function(err) {
                    console.log('Failed editing todo:', err);
                });
            } else {
            TodoAPIService.createTodo($scope.username, $scope.todo, $scope.authToken
                ).then(function(results) {
                    refreshTodos();
                    console.log('Todo created:', results);
                    $('#todo-modal').modal('hide');
                }).catch(function(err) {
                    console.log('Failed creating new todo:', err);
                });
            }
        };
 
        $scope.clickDelete = function(id) {
            TodoAPIService.deleteTodo(id, $scope.username, $scope.authToken
            ).then(function(results) {
                refreshTodos();
                console.log('Todo deleted:', results);
            }).catch(function(err) {
                console.log('Failed deleting todo:', err);
            });
        };
    });
