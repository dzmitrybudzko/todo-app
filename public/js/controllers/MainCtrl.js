myApp = angular.module('MainCtrl', [])
	
myApp.controller('MainController', ['$scope', 'Todos', '$http', '$interval', 'priorityService', 'notificationService',
	function($scope, Todos, $http, $interval, priorityService, notificationService) {
		
		$scope.formData = {};

        AnyTime.picker( "datePicker",
           { format: "%e %b %z %H:%i",
             hideInput: false,
             placement: "popup" } );
        
        $scope.getTodos = function() {
            Todos.get()
                .success(function(data){
                    $scope.todos = data;
                    initFunctionsDependingOnTodos();
                })
        };

        $scope.createTodo = function() {
            if ($scope.formData.title !== undefined) {
                if ($scope.formData.date !== undefined) {
                    if ($scope.formData.title !== "") {
                    
                        Todos.create($scope.formData)
                            .success(function(data) {
                                markInputs("gray-border", 0);
                                markInputs("gray-border", 1);
                                $scope.formData = {}; 
                                $scope.getTodos();
                            });
                    } else {
                        markInputs("red-border", 0)
                    };    
                } else {
                    markInputs("red-border", 1)
                }
            } else {
                markInputs("red-border", 0);
            }
           
    };

        $scope.deleteTodo = function(id) {
            Todos.delete(id)
                .success(function(data) {
                    //$scope.todos = data;
                   //console.log('todo deleted'); 
                   $scope.getTodos();
                });
        };

        $scope.updateTodo = function(id, task) {
            Todos.update(id, task)
                .success(function(data) {
                   //console.log('todo updated'); 
                    //$scope.todos = data;
                    $scope.getTodos();
                });      
        }

        $scope.getTodos();

        $scope.selectedOpt = priorityService.dataPriority.selectedOption;
        $scope.availOptions = priorityService.dataPriority.availableOptions;
        $scope.m1 = priorityService.options.m1;
        $scope.opts = priorityService.options.opts;
        
        $scope.decreasePriority = function(prior) {
            return priorityService.decreasePriority(prior);
        };

        $scope.sortTasks = function(todos, m1) {
            return priorityService.sortTasks(todos, m1);
        };

        $interval(function(){
            $scope.timeNow = Date.now();
            angular.forEach($scope.todos, function(task, key) { 
                task.description = task.date + ". Left: " + notificationService.timeLeft(task.date, $scope.timeNow);
                task.notification =  notificationService.notification(task.date, $scope.timeNow);
            })
        }, 1000);

        function initFunctionsDependingOnTodos() {
            
            $scope.leftItems = function() {
                return   $scope.todos.length;
            };

            $scope.remainingItems = function() {
                var count = 0;
                angular.forEach($scope.todos, function(task) {
                    count += task.done ? 0 : 1;
                    });
                return count;
            };
        };

        function markInputs(classcolor, i) {
            var elem = document.getElementById("form-data").getElementsByTagName("input");
            //console.log(elem);
            elem[i].className = classcolor;
        }

}]);


myApp.controller('updateTitle', ['$scope', function($scope) {
    upT = this;
    
    upT.changeTitle = function(task,id) {
        var elem = document.getElementById("mainul").childNodes[2*id + 2];

        var editTodo = elem.getElementsByTagName("div")[2];
        editTodo.className = "inline, mult-line, showtask";

        var labelTodo = elem.getElementsByTagName("div")[1];
        labelTodo.className = "done-{{task.done}}, inline, mult-line, hidetask";
    };

    upT.stopEditing = function(task, id) {
        var elem = document.getElementById("mainul").childNodes[2*id + 2];

        var editTodo = elem.getElementsByTagName("div")[2];
        editTodo.className = "inline, mult-line, hidetask";
        
        var labelTodo = elem.getElementsByTagName("div")[1];
        labelTodo.className = "done-{{task.done}}, inline, mult-line, showtask";            
    }

}]);
