'use strict';

/* Controllers */

  // shift controller
app.controller('shiftCtrl', ['$scope', 'DataRobot', 'moment', '$state', '$localStorage', 'toastr', function ($scope, DataRobot, moment, $state, $localStorage, toastr) {

    var vm = this;
    console.log($state.current.data);

    DataRobot.openShifts().then(function (response) {
                console.log(response.data);
                vm.openShifts = response.data.shifts;
                console.log(vm.openShifts);
             }, function (error) {
                 toastr.error(error.data.message, 'Failed to get shifts!');
             });

    if($state.current.data.task == "reprint"){
      DataRobot.closedShifts().then(function (response) {
                  console.log(response.data);
                  vm.closedShifts = response.data.shifts;
                  console.log(vm.closedShifts);
               }, function (error) {
                   toastr.error(error.data.message, 'Failed to get shifts!');
               });
    }

    vm.user = {
      firstName: '',
      lastName: ''
    };

    vm.deposit = null;

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

    vm.resumeShift = function(openShift) {
      var shift = {
        'user': openShift.user,
        'shiftID' : openShift.rowid,
        'startDate' : openShift.start_date
      }
      $localStorage.shift = shift;

      $state.go('app.printTickets');
    }

    vm.reprint = function(closedShift) {
      DataRobot.reprint(closedShift.rowid).then(function (response) {
                  console.log(response.data);
                  toastr.success('Shift report reprinted!', 'Shift Reprinted!');
               }, function (error) {
                   toastr.error(error.data.message, 'Failed to Reprint Shift!');
               });
    }


}]);
