'use strict';

angular.module('data.robot', [])
	.factory('dataRobot', ['$document', '$http', '$q', '$timeout', function ($document, $http, $q, $timeout) {
		var factory = {};
		var urlBase = '/';

		factory.getPrices = function () {
        return $http.get(urlBase+'prices');
    };

    factory.getDatePrice = function(date) {
        return $http.get(urlBase+'prices/date/'+date);
    }

		return factory;
  }]);
