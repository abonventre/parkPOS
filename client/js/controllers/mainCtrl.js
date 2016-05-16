'use strict';

/* Controllers */

  // main controller
app.controller('mainCtrl', ['$scope', 'DataRobot', 'moment', '$localStorage', function ($scope, DataRobot, moment, $localStorage) {

    var vm = this;

    vm.activeShift = false;

    if($localStorage.shift != undefined){
      vm.activeShift = true;
    }

    $scope.$watch(function () { return $localStorage.shift; },function(newVal,oldVal){
      console.log("trigger");
      console.log(newVal);
      if(newVal === undefined){
        console.log('No Shift');
        vm.activeShift = false;
      }else{
        console.log("Active Shift");
        vm.activeShift = true;
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

}]);
