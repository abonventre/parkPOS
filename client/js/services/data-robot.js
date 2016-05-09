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

		factory.printTicket = function(data) {
        return $http.post(urlBase+'tickets/', data);
    }

    factory.startShift = function(data) {
        return $http.post(urlBase+'shifts/', data);
    }
    factory.endShift = function(id, data) {
        return $http.put(urlBase+'shifts/close/'+id, {'deposit': data});
    }

		return factory;
  }]);
