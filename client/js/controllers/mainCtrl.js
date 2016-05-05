'use strict';

/* Controllers */

  // main controller
app.controller('mainCtrl', ['$scope', 'dataRobot', function ($scope, dataRobot) {
    var vm = this;

    dataRobot.getPrices().then(function (response) {
                //  console.log(response.data.prices);
                 vm.prices = response.data.prices;
             }, function (error) {
                 vm.status = 'Unable to load posts: ' + error.message;
             });

    vm.test = "testing1234";
}]);
