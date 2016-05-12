'use strict';

angular.module('auth.robot', [])
	.factory('AuthRobot', ['$document', '$http', '$q', '$timeout', '$localStorage', function ($document, $http, $q, $timeout, $localStorage) {
		var factory = {};

		factory.isActiveShift = function() {
			console.log($localStorage.hasOwnProperty("shift"));
			if($localStorage.hasOwnProperty("shift")){
				return $localStorage.shift;
			}else{
				return false;
			}
		}

		return factory;
  }]);
