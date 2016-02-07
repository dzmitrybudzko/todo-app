myApp = angular.module('MainCtrl', [])
	

myApp.controller('MainController', ['$scope', 'Todos', '$http',
	function($scope, Todos, $http) {
		
		$scope.formData = {};

        Todos.get()
            .success(function(data) {
                $scope.todos = data;
                //console.log("loaded successfully")
            });

        AnyTime.picker( "datePicker",
           { format: "%e %b %z %H:%i",
             hideInput: false,
             placement: "popup" } );
        
        $scope.createTodo = function() {

            if (!$.isEmptyObject($scope.formData)) {
            
                Todos.create($scope.formData)
                    .success(function(data) {
                        $scope.formData = {}; 
                        $scope.todos = data;
                    });
            }
        };

        $scope.deleteTodo = function(id) {
            Todos.delete(id)
                .success(function(data) {
                    $scope.todos = data;
                    
                });
        };

        $scope.updateTodo = function(id, task) {
            //console.log("start updating");
            Todos.update(id, task)
                .success(function(data) {
                    $scope.todos = data;
                });      
        }


}]);


myApp.controller('helpfulTimeController', ['$scope', '$timeout', 'Todos', function($scope, $timeout, Todos) {
    var htCtrl = this;
        
        setInterval(function(){
            htCtrl.timeNow = Date.now();
            $scope.apply;
        }, 1000);

        htCtrl.notification = function(ms) {
            ms = Date.parse(ms);
            var difference = ms - htCtrl.timeNow;
            var t1 = (difference > -5000 && difference < 0) ? " It's time to start!" : "" ;
            var t2 = (difference > 0 && difference < 10000) ? Math.ceil(difference/1000) + " seconds left" : "" ;
            return t1+t2;
        };

        htCtrl.timeLeft = function(ms) {
            ms = Date.parse(ms);
            var difference = ms - htCtrl.timeNow;
            var t0 = (difference < 0 ) ? " time expired" : "" ;
            var t1 = (difference > 0 && difference < 60000) ? Math.ceil(difference/1000) + " seconds" : "" ;
            var t2 = (difference > 60000 && difference < 60*60000) ? Math.ceil(difference/1000/60) + " minutes" : "" ;
            var t3 = (difference > 60*60000 && difference < 24*60*60000) ? Math.ceil(difference/1000/60/60) + " hours" : "" ;
            var t4 = (difference > 24*60*60000 && difference <365*24*60*60000) ? Math.ceil(difference/1000/24/60/60) + " days" : "" ;
            var t5 = (difference > 365*24*60*60000) ? "not soon" : "";
            return t0+t1+t2+t3+t4+t5;
        }
    
       Todos.get()
            .success(function(data) {
                $scope.todos = data;
                $scope.apply;

                htCtrl.remainingItems = function() {
                    var count = 0;
                    angular.forEach($scope.todos, function(task) {
                        count += task.done ? 0 : 1;
                    });
                    return count;
                };

                htCtrl.leftItems = function() {
                    return $scope.todos.length
                };

        });

}]);


myApp.controller('priorityController', ['$scope', '$filter',
    function($scope, $filter){
        var prCtrl = this;
        this.dataPriority = {availableOptions: [
                                  {id: '1', name: 'high'},
                                  {id: '2', name: 'normal'},
                                  {id: '3', name: 'low'}],
                            selectedOption: {id: '2', name: 'normal'}
        };

        this.options = { m1: null,
                    opts : [
                        {name: "by priority", val: 'priority.id'}, 
                        {name: "by date", val: 'date'},
                        {name: "first completed", val: '-done'},
                        {name: "first active", val: 'done'}]
                };

        this.sortTasks = function(field) {
            console.log('inside');
            $scope.todos = $filter('orderBy')($scope.todos, field);
            $scope.apply;
        };

        this.increasePriority = function(priority) {
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

}]);


myApp.controller('updateTitle', ['$scope', function($scope) {
    upT = this;
    
    upT.changeTitle = function(task) {
        upT.id = task._id;    
        //console.log("changing!");
        $(".hidewhenedit").css("display","none");
        $(".showwhenedit").css("display","inline-block");
    };

    upT.stopEditing = function() {
        //console.log("stop changing!");
        $(".showwhenedit").css("display","none");
        $(".hidewhenedit").css("display","inline-block");  
    }


}]);
