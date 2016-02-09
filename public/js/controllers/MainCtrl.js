myApp = angular.module('MainCtrl', [])
	

myApp.controller('MainController', ['$scope', 'Todos', '$http', 'priorityService', 'notificationService',
	function($scope, Todos, $http, priorityService, notificationService) {
		
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
            //console.log($scope.formData);
            if ($scope.formData.title !== undefined && $scope.formData.date !== undefined ) {
                if ($scope.formData.title !== "") {
                    
                    Todos.create($scope.formData)
                        .success(function(data) {
                            $scope.formData = {}; 
                            $scope.getTodos();
                            //$scope.todos = data;
                        });
                }
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

        setInterval(function(){
            $scope.timeNow = Date.now();
            $scope.apply;
        }, 1000);

        $scope.notify = function(ms, timeNow) {
            return   notificationService.notification(ms, timeNow);
        };

        $scope.timeLeft = function(ms, timeNow) {
            return   notificationService.timeLeft(ms, timeNow);
        };

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
