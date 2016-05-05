'use strict';

angular.module('data.robot', [])
	.factory('dataRobot', ['$document', '$http', '$q', '$timeout', function ($document, $http, $q, $timeout) {
		var factory = {};
		var urlBase = 'http://localhost:3333/';

		factory.getPrices = function () {
        return $http.get(urlBase+'prices');
    };

		return factory;
  }]);
