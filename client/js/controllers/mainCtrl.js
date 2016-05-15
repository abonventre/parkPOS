'use strict';

/* Controllers */

  // main controller
app.controller('mainCtrl', ['$scope', 'DataRobot', 'moment', '$localStorage', function ($scope, DataRobot, moment, $localStorage) {

    var vm = this;
    vm.activeShift = false;
    if($localStorage.shift){
      vm.activeShift = true;
    }

}]);
