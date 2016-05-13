'use strict';

angular.module('data.robot', [])
	.factory('DataRobot', ['$document', '$http', '$q', '$timeout', function ($document, $http, $q, $timeout) {
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
    factory.endShift = function(shift, data) {
        return $http.put(urlBase+'shifts/close/'+shift.shiftID, {'shift':shift, 'deposit': data});
    }

		factory.makeDrop = function(data) {
        return $http.post(urlBase+'drops/', data);
    }

		return factory;
  }]);
