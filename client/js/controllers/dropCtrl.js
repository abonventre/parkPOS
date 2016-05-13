'use strict';

/* Controllers */

  // shift controller
app.controller('dropCtrl', ['$scope', 'DataRobot', 'moment', '$state', '$localStorage', 'toastr', function ($scope, DataRobot, moment, $state, $localStorage, toastr) {

    var vm = this;

    vm.drop = {
      shiftID: $localStorage.shift.shiftID,
      name: '',
      amount: 0
    };

    vm.makeDrop = function() {
      DataRobot.makeDrop(vm.drop).then(function (response) {
                  console.log(response.data);
                  toastr.success('Drop made successfully!', 'Drop Made!');
                  $state.go('app.printTickets');
               }, function (error) {
                   vm.status = 'Unable to make drop: ' + error.message;
               });
    }


}]);
