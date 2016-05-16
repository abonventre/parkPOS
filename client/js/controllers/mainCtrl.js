'use strict';

/* Controllers */

  // main controller
app.controller('mainCtrl', ['$scope', 'DataRobot', 'moment', '$localStorage', 'toastr', function ($scope, DataRobot, moment, $localStorage, toastr) {

    var vm = this;

    vm.activeShift = false;
    vm.shift = {};

    if($localStorage.shift != undefined){
      vm.activeShift = true;
      vm.shift = $localStorage.shift;
    }else{
      vm.shift = {};
    }

    $scope.$watch(function () { return $localStorage.shift; },function(newVal,oldVal){
      console.log("trigger");
      console.log(newVal);
      if(newVal === undefined){
        console.log('No Shift');
        vm.activeShift = false;
        vm.shift = {};
      }else{
        console.log("Active Shift");
        vm.activeShift = true;
        vm.shift = $localStorage.shift;
      }
    });

    vm.status = {
      isopen: false
    };

    vm.toggled = function(open) {
      console.log('Dropdown is now: ', open);
    };

    vm.toggleDropdown = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      vm.status.isopen = !vm.status.isopen;
    };

    vm.printLastReport = function(){
      DataRobot.lastReport().then(function (response) {
                  console.log(response.data);
                  toastr.success('Last report was sent to the printer!', 'Last Report Printed!');
               }, function (error) {
                  console.log(error);
                   toastr.error(error.data.message, 'Last Report Error!');
               });
    }

}]);
