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

		factory.setPrinter = function(data) {
				return $http.post(urlBase+'printers/set', {printer: data});
		}

		factory.getPrinters = function() {
				return $http.get(urlBase+'printers/list');
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

		factory.lastReport = function() {
        return $http.get(urlBase+'shifts/last/');
    }

		factory.openShifts = function() {
				return $http.get(urlBase+'shifts/open');
		}

		factory.closedShifts = function() {
				return $http.get(urlBase+'shifts/closed');
		}

		factory.reprint = function(id) {
				return $http.get(urlBase+'shifts/past/'+id);
		}

		return factory;
  }]);
