const BACKEND_URL = 'https://morning-castle-91468.herokuapp.com/';

angular.module('UserService', [])
    .factory('UserAPIService', function($http, store) {
        UserAPIService = {
            register: function(username, password) {
                var data = {username: username, password: password};
                var url = BACKEND_URL + 'accounts/register/';
                return $http.post(url, data);
            },
            login: function(username, password) {
                var data = {username: username, password: password};
                var url = BACKEND_URL + 'accounts/api-token-auth/';
                return $http.post(url, data);
            },
        };
        return UserAPIService;
    });

angular.module('TodoService', [])
    .factory('TodoAPIService', function($http) {
        TodoAPIService = {
            getTodos: function(username, token) {
                var header = 'Authorization: JWT ' + token;
                var data = {params: {username: username}};
                return $http.get(BACKEND_URL + 'todo/', data, header);
            },
            createTodo: function(username, todo, token) {
                var header = 'Authorization: JWT ' + token;
                var data = {
                    username: username,
                    title: todo.title,
                    description: todo.description,
                    status: todo.status,
                };
                return $http.post(BACKEND_URL + 'todo/', data, header);
            },
            editTodo: function(id, username, todo, token) {
                var header = 'Authorization: JWT ' + token;
                var data = {
                    username: username,
                    title: todo.title,
                    description: todo.description,
                    status: todo.status,
                };
                return $http.put(BACKEND_URL + 'todo/' + id, data, header);
            },
            deleteTodo: function(id, username, token) {
                var header = 'Authorization: JWT ' + token;
                var data = {username: username};
                return $http.delete(BACKEND_URL + 'todo/' + id, data, header);
            }
        };
        return TodoAPIService;
    });