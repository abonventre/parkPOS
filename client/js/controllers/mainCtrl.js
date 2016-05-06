'use strict';

/* Controllers */

  // main controller
app.controller('mainCtrl', ['$scope', 'dataRobot', 'moment', function ($scope, dataRobot, moment) {

    var vm = this;
    vm.selected = 1;
    vm.tickets = 1;

    vm.dayName = function(days){
      if(days == 30){
        return "Monthly";
      }else if (days == 7){
        return "Weekly";
      }else if(days == 1){
        return "Today";
      }else if(days == 2){
        return "Tomorrow";
      }else{
        var today = moment().format();
        var duration = moment.duration({'days' : days-1});
        return moment(today).add(duration).format('dddd');
      }

    }

    dataRobot.getPrices().then(function (response) {
                //  console.log(response.data.prices);
                 vm.prices = response.data.prices;
                 vm.dayTable = response.data.dayTable;
             }, function (error) {
                 vm.status = 'Unable to load posts: ' + error.message;
             });

    vm.increment = function(){
      vm.tickets++;
    }

    vm.decrement = function(){
      if(vm.tickets > 0){
        vm.tickets--;
      }

    }

    vm.test = "testing1234";
}]);
