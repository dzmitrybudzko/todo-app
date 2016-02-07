
var myApp = angular.module('TodoService', [])
	
	myApp.factory('Todos', ['$http', '$q', function($http, $q) {
		
        //var deferred = $q.defer();
        return {
            get : function() {
                return $http.get('/api/todos')
                            /*.success(function(data) {
                                      deferred.resolve(data);
                                    })*/
            },
            create : function(todoData) {
                return $http.post('/api/todos', todoData);
            },
            delete : function(id) {
                return $http.delete('/api/todos/' + id);
            },
            update : function(id, todo) {
                return $http.put('/api/todos/' + id, todo);
            }
        }
	

	}]);