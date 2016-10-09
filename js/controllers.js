/**
 * Weather App using  http://openweathermap.org/current public api
 * Olusegun Mustapha
 * afeez2010@yahoo.com
 */
angular.module('WeatherApp', [])
    
 
.factory('Weather', function($http, $q, $timeout){
    var BASE_URL = "http://api.openweathermap.org/data/2.5/weather?";
    var data = [];
    var deferred = $q.defer();
      
      return {
          GetWeatherByLoc: function(lat, lon){
             return $http.get( BASE_URL+'lat='+lat+'&lon='+lon+'&appid=c1e22f089268215def68bef4f8bad027',{ timeout: deferred.promise })
             .then(function(response){
              data = response.data;
              return data;
             },function(error){
                alert("Can not connect to the server.");
                
             });
             $timeout(function() {
             deferred.resolve(); // this aborts the request!
             }, 30000);
          },

         GetWeatherByZip: function(code){
         	return $http.get(BASE_URL+'zip='+code+'&appid=c1e22f089268215def68bef4f8bad027',{ timeout: deferred.promise })
             .then(function(response){
             	data = response.data;
             	return data;
             }, function(error){
                    alert("Can not connect to the server.");
                });
             $timeout(function() {
             deferred.resolve(); // this aborts the request!
             }, 30000);
         }    
      }    
  })

  .controller('WeatherController', function ($scope, $window, Weather, $http) {
  	
  	  $scope.data = [];
      $scope.Form = {};
      angular.element(document).ready(function () {	

            if ($window.confirm("application needs permission to read your current location")) {
                   getposition(); //get user location

                } else { //show and load form If the user denies to share the location
                   $http.get("countries.json").success(function(response) {$scope.Country = response;});
               		
                }
            
        	
      });

    //get user geolocation
    var getposition = function(){

    	if (navigator.geolocation) {// geolocation is supported by browser
    		navigator.geolocation.getCurrentPosition(CurrentWeather);
    		
    	}else { //show and load form if Geolocation is not supported by this browser.
        	$http.get("resources/countries.json").success(function(data) {$scope.Country = data;});
    	}
    
    }

    // Get current weather update  
    var CurrentWeather = function(position){
    	    var lat = position.coords.latitude;
	        var lon = position.coords.longitude;
	         $scope.loading = true;
	         Weather.GetWeatherByLoc(lat,lon).then(function(data){
	          $scope.weatherdata = data;
	          $scope.today = new Date();
	           $scope.loading = false;
	           });
    }

    //Get current weather from user input form
    $scope.FormSubmit = function(){
    	
    	var zip = $scope.Form.zip;
    	var country = $scope.Form.country;
    	var code;

    	if (zip){//if zip is not null
    	 code = zip;
    	}else{
    		code = country;
    	}
    	
    	$scope.loading = true;
    	Weather.GetWeatherByZip(code).then(function(data){
    		  $scope.weatherdata = data;
	          $scope.today = new Date();
	    $scope.loading = false; 
    	});
    }

});