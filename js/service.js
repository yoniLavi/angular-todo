const BACKEND_URL = 'https://morning-castle-91468.herokuapp.com/';

angular.module('UserService', [])
    .factory('UserAPIService', function($http, store) {
        UserAPIService = {
            register: function(username, password) {
                var data = {username: username, password: password};
                return $http.post(BACKEND_URL + 'accounts/register/', data);
            },
            login: function(username, password) {
                var data = {username: username, password: password};
                return $http.post(BACKEND_URL + 'accounts/api-token-auth/', data);
            },
        };
        return UserAPIService;
    });

angular.module('TodoService', [])
    .factory('TodoAPIService', function($http) {
        TodoAPIService = {
            getTodos: function(username, token) {
                var header = 'Authorization: JWT ' + token;
                return $http.get(BACKEND_URL + 'todo/', {params:{'username': username}}, header);
            },
            createTodo: function(username, token) {
                header = 'Authorization: JWT ' + token;
                return $http.post(BACKEND_URL + 'todo/', {'username': username}, header);
            },
            editTodo: function(id, data, token) {
                header = 'Authorization: JWT ' + token;
                return $http.put(BACKEND_URL + 'todo/' + id, data, header);
            },
            deleteTodo: function(id, username, token) {
                header = 'Authorization: JWT ' + token;
                return $http.delete(BACKEND_URL + 'todo/' + id, {'username': username}, header);
            }
        };
        return TodoAPIService;
    });