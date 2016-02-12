
angular.module('TodoFilters', [])    

    .filter('sorting', ['$filter', function($filter){

        return function(arr, field) {

            if (field !== 'date')
                return $filter('orderBy')(arr, field);

            arr.sort(function(a, b){
                return Date.parse(a.date) - Date.parse(b.date);
            });

            return arr;
        }

    }]);