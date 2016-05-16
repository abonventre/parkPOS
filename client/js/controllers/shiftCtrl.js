'use strict';

/* Controllers */

  // shift controller
app.controller('shiftCtrl', ['$scope', 'DataRobot', 'moment', '$state', '$localStorage', 'toastr', function ($scope, DataRobot, moment, $state, $localStorage, toastr) {

    var vm = this;
    console.log($state.current.data);

    vm.user = {
      firstName: '',
      lastName: ''
    };

    vm.deposit = 0;

    vm.startShift = function() {
      DataRobot.startShift(vm.user).then(function (response) {
                  console.log(response.data);
                  toastr.success('Shift started successfully!', 'Shift Started!');
                  $localStorage.shift = response.data;
                  $state.go('app.printTickets');
               }, function (error) {
                   toastr.error(error.data.message, 'Failed to Start Shift!');
               });
    }

    vm.endShift = function() {
      var shift = $localStorage.shift;
      DataRobot.endShift(shift, vm.deposit).then(function (response) {
                  console.log(response.data);
                  toastr.success('Shift ended successfully!', 'Shift Ended!');
                  delete $localStorage.shift;
                  $state.go('app.startShift');
               }, function (error) {
                   toastr.error(error.data.message, 'Failed to End Shift!');
               });
    }


}]);
