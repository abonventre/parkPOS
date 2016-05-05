'use strict';

/* Controllers */

  // main controller
app.controller('mainCtrl', ['$scope', 'dataRobot', function ($scope, dataRobot) {
    var vm = this;

    vm.tickets = {
      'Today': 0,
      'Tomorrow': 0,
      '3 Days': 0,
      '4 Days' : 0,
      '5 Days' : 0,

    }

    dataRobot.getPrices().then(function (response) {
                //  console.log(response.data.prices);
                 vm.prices = response.data.prices;
             }, function (error) {
                 vm.status = 'Unable to load posts: ' + error.message;
             });

    vm.changeTicket = function(operation, type){
      if(operation == "add"){
        vm.tickets[type]++;
      }else{
        if(vm.tickets[type] >= 1){
          vm.tickets[type]--;
        }
      };

    };

    vm.test = "testing1234";
}]);
