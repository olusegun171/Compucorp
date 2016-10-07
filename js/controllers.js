angular.module('MyApp', [])
    
 
.factory('Weather', function($http, $q, $timeout){
    var BASE_URL = "http://api.openweathermap.org/data/2.5/weather?";
    var data = [];
    var deferred = $q.defer();
      
      return {
          GetWeather: function(lat, lon){
             return $http.get( BASE_URL+'lat='+lat+'&lon='+lon+'&appid=c1e22f089268215def68bef4f8bad027',{ timeout: deferred.promise })
             .then(function(response){
              data = response.data;
              return data;
             },function(error){
               if(error.status === 0) {
                // $http timeout
                alert("Can not connect to the server. check your network and try again");
                } else {
                // response error status from server 
                
                alert("Request is taking time from the server try again");
                }
             });
             $timeout(function() {
             deferred.resolve(); // this aborts the request!
             }, 30000);
          },       

      }    
  })

  .controller('MyController', function ($scope, $window, Weather, $http) {
      $scope.data = [];
            angular.element(document).ready(function () {	
            if ($window.confirm("application needs permission to read your current location")) {
                   getposition();

                } else {
                   $http.get("countries.json").success(function(data) {$scope.Country = data;});
               		
                }
            
        	
    			});


    var getposition = function(){

    	if (navigator.geolocation) {
    		navigator.geolocation.getCurrentPosition(showPosition);
    		
    	} else {
        // Geolocation is not supported by this browser.
        $http.get("resources/countries.json").success(function(data) {$scope.Country = data;});
    	}
    
    }
    var showPosition = function(position){
    	    var lat = position.coords.latitude;
	        var lon = position.coords.longitude;
	         Weather.GetWeather(lat,lon).then(function(data){
	          $scope.data = data;
	          
	           });
    }

});