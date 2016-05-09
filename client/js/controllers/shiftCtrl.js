'use strict';

/* Controllers */

  // shift controller
app.controller('shiftCtrl', ['$scope', 'dataRobot', 'moment', '$state', '$localStorage', 'toastr', function ($scope, dataRobot, moment, $state, $localStorage, toastr) {

    var vm = this;
    console.log($state.current.data);

    vm.user = {
      firstName: '',
      lastName: ''
    };

    vm.deposit = 0;

    vm.startShift = function() {
      dataRobot.startShift(vm.user).then(function (response) {
                  console.log(response.data);
                  toastr.success('Shift started successfully!', 'Shift Started!');
                  $localStorage.shift = response.data;
                  $state.go('app.printTickets');
               }, function (error) {
                   vm.status = 'Unable to start shift: ' + error.message;
               });
    }

    vm.endShift = function() {
      var id = $localStorage.shift.shiftID;
      dataRobot.endShift(id, vm.deposit).then(function (response) {
                  console.log(response.data);
                  toastr.success('Shift ended successfully!', 'Shift Ended!');
                  delete $localStorage.shift;
                  $state.go('app.startShift');
               }, function (error) {
                   vm.status = 'Unable to end shift: ' + error.message;
               });
    }


}]);
