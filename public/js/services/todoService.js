
var myApp = angular.module('TodoService', [])
	
	myApp.factory('Todos', ['$http', function($http) {
		
        return {        
            get : function() {
                return $http.get('/api/todos')
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


    myApp.factory('priorityService', ['$filter', function($filter) {

        var service = {};
        
        service.dataPriority = {availableOptions: [
                                  {id: '1', name: 'high'},
                                  {id: '2', name: 'normal'},
                                  {id: '3', name: 'low'}],
                            selectedOption: {id: '2', name: 'normal'}
        };

        service.options = { m1: null,
                    opts : [
                        {name: "by priority", val: 'priority.id'}, 
                        {name: "by date", val: 'date'},
                        {name: "first completed", val: '-done'},
                        {name: "first active", val: 'done'}]
                };

        service.sortTasks = function(arr, field) {
            
            arr = $filter('orderBy')(arr, field);
            return arr;
        };

        service.decreasePriority = function(priority) {
            priority.id = (priority.id < 3 ) ? ++priority.id : 1;
            if (priority.name === "high") {
                priority.name = "normal"
                } else if (priority.name === "normal") {
                    priority.name = "low" 
                    } else {
                        priority.name = "high"
                    };
            return priority;
        }

        return service;

    }]);

    myApp.factory('notificationService', function() {
        var service = {};

        service.notification = function(ms, timeNow) {
            ms = Date.parse(ms);
            var difference = ms - timeNow;
            var t1 = (difference > -5000 && difference < 0) ? " It's time to start!" : "" ;
            var t2 = (difference > 0 && difference < 10000) ? Math.ceil(difference/1000) + " seconds left" : "" ;
            return t1+t2;
        };

        service.timeLeft = function(ms, timeNow) {
            ms = Date.parse(ms);
            var difference = ms - timeNow;
            var t0 = (difference < 0 ) ? " time expired" : "" ;
            var t1 = (difference > 0 && difference < 60000) ? Math.ceil(difference/1000) + " seconds" : "" ;
            var t2 = (difference > 60000 && difference < 60*60000) ? Math.ceil(difference/1000/60) + " minutes" : "" ;
            var t3 = (difference > 60*60000 && difference < 24*60*60000) ? Math.ceil(difference/1000/60/60) + " hours" : "" ;
            var t4 = (difference > 24*60*60000 && difference <365*24*60*60000) ? Math.ceil(difference/1000/24/60/60) + " days" : "" ;
            var t5 = (difference > 365*24*60*60000) ? "not soon" : "";
            return t0+t1+t2+t3+t4+t5;
        }

        return service;
    })