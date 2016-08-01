'use strict';

/* Controllers */

  // shift controller
app.controller('printerCtrl', ['$scope', 'DataRobot', 'moment', '$state', '$localStorage', 'toastr', function ($scope, DataRobot, moment, $state, $localStorage, toastr) {

    var vm = this;
    console.log($state.current.data);

    DataRobot.getPrinters().then(function (response) {
                console.log('list:',response.data);
                vm.list = response.data;
             }, function (error) {
                 toastr.error(error.data.message, 'Failed to get a list of printers!');
             });

    vm.setPrinter = function(printer){
      console.log(printer);
      DataRobot.setPrinter(printer).then(function (response) {
                  console.log(response.data);
                  toastr.success('Printer set successfully as '+response.data+'!', 'Set Printer!');
                  $state.go('app.printTickets');
               }, function (error) {
                   toastr.error(error.data.message, 'Failed to get set the printer!');
               });
    }

}]);
